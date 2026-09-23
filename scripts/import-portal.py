"""Import public Tilda records into structured, traceable portal content.
Run with SOURCE_CACHE pointing at cached public HTML downloaded from the sitemap.
No runtime dependence on the source portal or Tilda scripts.
"""
import os,re,json,hashlib
from pathlib import Path
from lxml import html
ROOT=Path(__file__).resolve().parents[1]
CACHE=Path(os.environ.get('SOURCE_CACHE', ROOT.parent/'source-crawl'))
OUT=ROOT/'src/content';OUT.mkdir(exist_ok=True)
REGIONS=['primkrai','khabkrai','kamchatka','buryatia','yakutia','chukot','zabaikal','amurskaya','sakhalin','eao','magadan']
CITY_SLUGS={'Владивосток':'vladivostok','Артем':'artem','Артём':'artem','Большой Камень':'bolshoy-kamen','Находка':'nakhodka','Уссурийск':'ussuriysk','Арсеньев':'arsenyev','Хабаровск':'khabarovsk','Комсомольск-на-Амуре':'komsomolsk','Петропавловск-Камчатский':'petropavlovsk-kamchatsky','Улан-Удэ':'ulan-ude','Северобайкальск':'severobaykalsk','Якутск':'yakutsk','Нерюнгри':'neryungri','Анадырская агломерация':'anadyr','Чита':'chita','Краснокаменск':'krasnokamensk','Благовещенск':'blagoveshchensk','Белогорск':'belogorsk','Свободный':'svobodny','Тында':'tynda','Южно-Сахалинская агломерация':'yuzhno-sakhalinsk','Биробиджан':'birobidzhan','Магадан':'magadan-city'}
def doc(name):return html.fromstring((CACHE/(name+'.html')).read_text(),parser=html.HTMLParser(huge_tree=True))
def norm(s):return re.sub(r'\s+',' ',s.replace('\u200e','').replace('\xa0',' ')).strip()
def tx(e):return norm(' '.join(e.xpath('.//text()[not(ancestor::script or ancestor::style)]')))
def uniq(xs):return list(dict.fromkeys(x for x in xs if x))
def field(e,name):
 a=e.xpath('.//*[@field=$name]',name=name);return tx(a[0]) if a else ''
def images(e):
 return uniq(x for x in e.xpath('.//@data-original|.//@data-content-cover-bg|.//@data-img-zoom-url') if x.startswith('http') and not re.search(r'\.(svg|gif)(\?|$)',x))
def block(e):
 tp=e.get('data-record-type');fields={n.get('field'):tx(n) for n in e.xpath('.//*[@field]') if n.tag not in ('img','script','style')}
 b={'id':e.get('id'),'type':tp,'title':fields.get('title') or fields.get('btitle',''),'subtitle':fields.get('subtitle',''),'texts':uniq([fields.get(k,'') for k in ['text','descr','bdescr']]),'images':images(e),'items':[],'stats':[],'links':[]}
 groups={}
 for n in e.xpath('.//*[@field]'):
  f=n.get('field');m=re.match(r'li_(\w+)__(.+)',f)
  if m:groups.setdefault(m[2],{})[m[1]]=tx(n)
 for id,vals in groups.items():
  ns=e.xpath('.//*[@field=$f]',f='li_title__'+id)
  if tp=='1050':b['stats'].append({'value':vals.get('title',''),'label':vals.get('descr','')});continue
  if not vals.get('title') and not vals.get('text'):continue
  ims=[]
  if ns:
   ancestors=ns[0].xpath('ancestor::*[contains(concat(" ",normalize-space(@class)," ")," t-item ") or contains(@class,"t513__row")][1]')
   if ancestors:ims=images(ancestors[0])
  b['items'].append({'id':id,'title':vals.get('title',''),'text':vals.get('descr') or vals.get('text',''),'images':ims})
 if tp=='396':
  b['texts']=uniq(v for k,v in fields.items() if k.startswith('tn_text_') and v)
 if tp=='859' and b['items']:
  b['title']=b['items'][0]['title'];b['texts']=uniq(b['texts']+[it['text'] for it in b['items']])
 if not b['images']:
  # Gallery backgrounds stored in inline styles; full images only, never low-res thumbnails.
  b['images']=uniq(re.findall(r'https://static\.tildacdn\.com/[^\s\"\'<>\)]+\.(?:jpg|png|webp|jpeg)',html.tostring(e,encoding='unicode')))
 for a in e.xpath('.//a[@href]'):
  href=a.get('href');label=tx(a)
  if href and href!='#' and not href.startswith('javascript:') and (label or re.search(r'\.(pdf|pptx?)(\?|$)',href)):
   b['links'].append({'title':label or 'Скачать документ','url':href})
 return b

def compact(bs):
 out=[];seen=set()
 for b in bs:
  if b['type'] in ['215','363','270','131','890','450','360','886','395']:continue
  if not any([b['title'],b['texts'],b['images'],b['items'],b['stats']]):continue
  sig=b['id']  # Repeated place/status headings carry context; only duplicate record IDs are redundant.
  if sig in seen:continue
  seen.add(sig);out.append(b)
 return out

def projects_from(bs,region,city='',program='masterplan'):
 out=[];current=None;place='';category='';status='';section=''
 for b in bs:
  tp=b['type']
  if tp=='255':section=b['title'];current=None
  if tp=='859':
   if re.match(r'^(г\.|с\.|п\.|пгт\.|пгт |пос\.|р\.п\.)',b['title']):place=b['title']
   elif 'реализ' in b['title'].lower():status=b['title']
   else:category=b['title']
   current=None
  if tp=='489':
   current={'id':b['id'].replace('rec',''),'title':b['title'],'texts':b['texts'][:],'images':b['images'][:],'stats':[],'region':region,'city':city,'place':place,'category':category,'status':status,'program':program,'section':section,'sourceRecord':b['id']}
   out.append(current)
  elif tp=='1050' and current:current['stats'].extend(b['stats'])
  elif tp=='1050' and program!='masterplan' and place:
   current={'id':b['id'].replace('rec',''),'title':category or 'Благоустройство территории','texts':[],'images':[],'stats':list(b['stats']),'region':region,'city':city,'place':place,'category':category,'status':status,'program':program,'section':section,'sourceRecord':b['id']};out.append(current)
  elif tp=='513':
   current=None
   for it in b['items']:
    out.append({'id':b['id'].replace('rec','')+'-'+it['id'],'title':it['title'],'texts':[it['text']] if it['text'] else [],'images':it['images'],'stats':[],'region':region,'city':city,'place':place,'category':category,'status':status,'program':program,'section':section,'sourceRecord':b['id']})
  elif tp in ['772','774'] and program=='masterplan' and ('Другие' in section):
   current=None
   for it in b['items']:out.append({'id':b['id'].replace('rec','')+'-'+it['id'],'title':it['title'],'texts':[it['text']] if it['text'] else [],'images':it['images'],'stats':[],'region':region,'city':city,'place':place,'category':category,'status':status,'program':program,'section':section,'sourceRecord':b['id']})
  elif current and tp in ['410','667','670','3','396','106']:
   if tp!='396' or not b['texts']:current['images']=uniq(current['images']+b['images'])
   if tp=='106':current['texts'].extend(b['texts'])
 # Drop identical titles within each program; merge source images and metrics.
 dedup={}
 for p in out:
  key=(p['title'],p['place'])
  if not p['title']:continue
  if key in dedup:
   dedup[key]['images']=uniq(dedup[key]['images']+p['images']);dedup[key]['texts']=uniq(dedup[key]['texts']+p['texts']);dedup[key]['stats']=[dict(v) for v in {json.dumps(v,ensure_ascii=False):v for v in dedup[key]['stats']+p['stats']}.values()];continue
  dedup[key]=p
 return list(dedup.values())

regions=[];cities=[];projects=[]
for idx,rid in enumerate(REGIONS):
 d=doc(rid);els=d.xpath('//*[@data-record-type]');by={e.get('id'):e for e in els};allblocks=[block(e) for e in els]
 hero=next(b for b in allblocks if b['type']=='18');stats=next(b['stats'] for b in allblocks if b['type']=='1050')
 region={'id':rid,'name':hero['title'],'image':hero['images'][0] if hero['images'] else '', 'stats':stats,'cities':[],'programs':{},'source':'https://xn--25-flcdf3dabp.xn--p1ai/'+rid,'index':idx+1}
 for tab in d.xpath('//*[@data-tab-rec-ids]'):
  name=norm(tab.xpath('string(.//button)'));ids=['rec'+x for x in tab.get('data-tab-rec-ids').split(',')];bs=compact([block(by[i]) for i in ids if i in by])
  if name in CITY_SLUGS:
   cid=CITY_SLUGS[name];cover=next((b for b in bs if b['type']=='995'),None);mission=next((b['title'] for b in bs if b['type']=='484'),'');about=uniq(t for b in bs if b['type']=='223' for t in b['texts']);citystats=next((b['stats'] for b in bs if b['type']=='1050'),[])
   ps=projects_from(bs,rid,cid);projects.extend(ps)
   cities.append({'id':cid,'name':name,'region':rid,'image':cover['images'][0] if cover and cover['images'] else region['image'],'mission':mission,'about':about,'stats':citystats,'blocks':bs,'projects':[p['id'] for p in ps],'sourceRecord':ids[0]})
   region['cities'].append(cid)
  elif 'субсид' in name or 'благоустрой' in name:
   pid='subsidy' if 'субсид' in name else 'improvement';ps=projects_from(bs,rid,program=pid);projects.extend(ps)
   region['programs'][pid]={'name':name,'blocks':bs,'projects':[p['id'] for p in ps]}
 # Single-city pages may use the first city cover without a second tablist.
 if not region['cities']:
  cover=next((b for b in allblocks if b['type']=='995'),None)
  if cover:
   cid=CITY_SLUGS[cover['title']];start=next(i for i,b in enumerate(allblocks) if b['id']==cover['id']);end=next((i for i in range(start+1,len(allblocks)) if allblocks[i]['type']=='30' and ('субсид' in allblocks[i]['title'] or 'благоустрой' in allblocks[i]['title'])),len(allblocks)-4);bs=compact(allblocks[start:end]);ps=projects_from(bs,rid,cid);projects.extend(ps)
   cities.append({'id':cid,'name':cover['title'],'region':rid,'image':cover['images'][0] if cover['images'] else region['image'],'mission':next((b['title'] for b in bs if b['type']=='484'),''),'about':uniq(t for b in bs if b['type']=='223' for t in b['texts']),'stats':next((b['stats'] for b in bs if b['type']=='1050'),[]),'blocks':bs,'projects':[p['id'] for p in ps],'sourceRecord':cover['id']});region['cities'].append(cid)
 regions.append(region)

# Housing programme: original zero-block fields retain all investment and infrastructure values.
d=doc('dvkvartal');els=d.xpath('//*[@data-record-type]');blocks=[block(e) for e in els]
quarter={'title':'Дальневосточный квартал','stats':next(b['stats'] for b in blocks if b['type']=='1050'),'features':[it for b in blocks if b['type']=='774' for it in b['items']],'projects':[]}
for i,e in enumerate(els):
 name=field(e,'tn_text_1678722868530')
 if not name:continue
 nxt=els[i+1];f=lambda k:field(nxt,'tn_text_'+k);fs={n.get('field'):tx(n) for n in e.xpath('.//*[@field]')}
 status=next((v for v in fs.values() if 'строитель' in v or 'стоитель' in v or v=='проектирование'),'')
 q={'id':e.get('id').replace('rec',''),'region':name,'name':f('1678722589028'),'image':images(e)[0] if images(e) else '', 'images':images(e)+images(nxt),'investment':field(e,'tn_text_1705596442588')+' млрд ₽','year':field(e,'tn_text_1705647466446'),'status':status.replace('стоительство','строительство'),'stats':[{'label':'Жители, обеспеченные жильём','value':f('1678792650470')+' тыс. человек'},{'label':'Жилая площадь','value':f('1706010935134')+' тыс. м²'},{'label':'Социальное жильё','value':f('1706010968693')+' тыс. м²'},{'label':'Школы','value':f('1705591962857')+' · '+f('1705594219839')+' мест'},{'label':'Детские сады','value':f('1705591962861')+' · '+f('1705594460588')+' мест'},{'label':'Парковочные места','value':f('1706011030846')+' тыс.'},{'label':'Первый ввод в эксплуатацию','value':f('1706011189534')+' '+f('1705662464271')},{'label':'Площадь ввода','value':f('1706011228044')+' тыс. м²'}]}
 quarter['projects'].append(q)

# Public experimental pages: preserve unique materials in an archive, alias duplicate shells.
extras=[]
for f in sorted(CACHE.glob('*.html')):
 name=f.stem
 if name in REGIONS+['index','news','map','dvkvartal']:continue
 d=doc(name);bs=compact([block(e) for e in d.xpath('//*[@data-record-type]')]);bs=[b for b in bs if not any('Корпорация развития' in t for t in b['texts']) and b['type'] not in ['450','886'] and (b['title'] or b['texts'] or b['items'])]
 extras.append({'id':name,'title':d.xpath('string(//title)'),'blocks':bs})

result={'snapshotDate':'2026-09-23','regions':regions,'cities':cities,'projects':projects,'quarter':quarter,'extras':extras}
(OUT/'portal.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')))
print('Regions',len(regions),'cities',len(cities),'projects',len(projects),'housing',len(quarter['projects']))
for r in regions:print(r['id'],r['cities'],{k:len(v['projects']) for k,v in r['programs'].items()})

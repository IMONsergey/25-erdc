"""Import all news URLs from the public source sitemap into a static archive."""
from pathlib import Path
from lxml import html,etree
import re,json,os
ROOT=Path(__file__).resolve().parents[1];CACHE=Path(os.environ.get('SOURCE_CACHE',ROOT.parent/'source-crawl'))
posts=[]
for f in (CACHE/'news').glob('*.html'):
 d=html.fromstring(f.read_text(),parser=html.HTMLParser(huge_tree=True))
 title=d.xpath('string(//h1)');body=d.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," js-feed-post-text ")]')
 if not title or not body:raise ValueError('Missing article '+f.name)
 el=body[0]
 for e in list(el.iter()):
  if e.tag in ('script','style','iframe','object','embed','form'):
   e.drop_tree();continue
  for key in list(e.attrib):
   if key not in ['href','src','alt','data-original']:del e.attrib[key]
  if e.get('href','').startswith(('javascript:','data:')):del e.attrib['href']
  if e.tag=='a':e.set('rel','noreferrer noopener');e.set('target','_blank')
  if e.tag=='img':e.set('src',e.get('data-original') or e.get('src',''));e.attrib.pop('data-original',None);e.set('loading','lazy')
 image=d.xpath('string(//meta[@property="og:image"]/@content)');date=d.xpath('string(//meta[@itemprop="datePublished"]/@content)')[:10]
 tags=[re.sub(r'\s+',' ',e.text_content()).strip() for e in d.xpath('//*[contains(@class,"t-feed__post-popup__tag")]')]
 text=re.sub(r'\s+',' ',el.text_content()).strip()
 posts.append({'id':f.stem,'title':re.sub(r'\s+',' ',title).strip(),'date':date,'image':image,'tags':tags,'excerpt':text[:220].rsplit(' ',1)[0]+'…','body':''.join(html.tostring(x,encoding='unicode') for x in el),'source':'https://xn--25-flcdf3dabp.xn--p1ai/news/tpost/'+f.stem})
posts.sort(key=lambda p:p['date'],reverse=True)
expected=len(re.findall(r'<loc>',(CACHE/'sitemap-news.xml').read_text()))
if len(posts)!=expected:raise ValueError(f'Only {len(posts)}/{expected} news downloaded')
(ROOT/'src/content/news.json').write_text(json.dumps(posts,ensure_ascii=False,separators=(',',':')))
print('Imported',len(posts),'articles',posts[0]['date'],posts[-1]['date'])

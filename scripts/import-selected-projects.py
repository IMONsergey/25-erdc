"""Import the client-approved ВЫБРАНО sheet; no geocoding or invented metrics."""
import json, pathlib, sys
import openpyxl
source = pathlib.Path(sys.argv[1])
sheet = openpyxl.load_workbook(source, data_only=True)['ВЫБРАНО']
categories = [
 ('housing','Жильё и деловая застройка','Жильё и бизнес','icon-category-housing.svg','#7de0fb'),
 ('social','Социальная инфраструктура','Социальная среда','icon-category-social.svg','#9ad6ff'),
 ('transport','Транспорт и мобильность','Транспорт','icon-category-transport.svg','#ffc894'),
 ('engineering','Инженерная инфраструктура','Инфраструктура','icon-category-engineering.svg','#9fc1ff'),
 ('ecology','Рекреация и экология','Парки и экология','icon-category-ecology.svg','#abebbe'),
 ('tourism','Туризм','Туризм','icon-category-tourism.svg','#ecdfa9'),
 ('economy','Экономика и логистика','Экономика','icon-mission-industry.svg','#bcbcff'),
]
# Art direction anchors in the illustrated scene, NOT longitude/latitude.
# Distributed programs and unlocated projects intentionally have no point.
anchors={1:[56,23],2:[61,16],3:[63,65],4:[66,59],5:[53,31],11:[65,18],18:[54,25],19:[72,24],20:[57,31],21:[67,30],23:[53,29]}
short={1:'Мыс Кунгасного',2:'Мыс Фирсова',3:'ИНТЦ «Русский»',4:'Вторая очередь ДВФУ',5:'Дом доходный Демби',6:'Керлинг-центр',7:'Городская спортивная инфраструктура',8:'9 новых поликлиник',9:'Обновление троллейбусного парка',10:'Пирс на острове Попова',11:'Рудневский мост',12:'Развитие улично-дорожной сети',13:'Веломаршрут на острове Русский',14:'Электроснабжение',15:'Теплоснабжение',16:'Водоснабжение',17:'Водоотведение',18:'Набережная Амурского залива',19:'Парк Минного городка',20:'Площадь Борцов Революции',21:'Река Объяснения',22:'Утилизация органической фракции',23:'Дворы Миллионки',24:'Владивостокская крепость',25:'Пляжи острова Русский',26:'Культурно-познавательные маршруты',27:'Агрологистический комплекс и рыбная биржа'}
areas={3:'Остров Русский',4:'Остров Русский',10:'Остров Попова',13:'Остров Русский',25:'Остров Русский'}
citywide={7,8,9,12,14,15,16,17,24,26}
rows=[];category=None;group=''
for i,row in enumerate(sheet.iter_rows(values_only=True),1):
 n,b,title,*rest=row
 if b and str(b).strip() in [c[1] for c in categories]:
  category=next(c[0] for c in categories if c[1]==str(b).strip());group=''
 if isinstance(n,(int,float)) and title:
  if b and str(b).strip() not in [c[1] for c in categories]: group=str(b).strip()
  no=int(n)
  rows.append({'id':f'project-{no:02}','number':no,'category':category,'title':str(title).strip(),'shortTitle':short[no],'group':group or 'Развитие экономики и логистики','area':areas.get(no,'Владивосток'),'scope':'program' if no in citywide else 'area' if no in {13,18,25} else 'project','anchor':anchors.get(no),'image':{1:'project-kungasny.webp',2:'project-firsova.webp'}.get(no),'sourceRow':i})
assert len(rows)==27 and len({p['id'] for p in rows})==27
out=pathlib.Path(__file__).resolve().parents[1]/'src/selectedProjects.js'
out.write_text('// Generated from the client workbook, sheet ВЫБРАНО.\n// Anchors are illustrative composition coordinates, never cadastral locations.\nexport const projectCategories = '+json.dumps([dict(zip(['id','label','shortLabel','icon','color'],c)) for c in categories],ensure_ascii=False,indent=2)+';\n\nexport const selectedProjects = '+json.dumps(rows,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Imported',len(rows),'projects:',{c[0]:sum(p['category']==c[0] for p in rows) for c in categories})

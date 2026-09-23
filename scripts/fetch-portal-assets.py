"""Preserve and optimise only source media referenced by the portal. Build-time job."""
import json,urllib.request,concurrent.futures,io,os,time
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'src/content/media.json').read_text());failed=[]
def fetch(item):
 url,name=item;p=ROOT/'assets'/name
 if p.exists() and p.stat().st_size>50:return
 p.parent.mkdir(parents=True,exist_ok=True)
 for attempt in range(3):
  try:
   raw=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35).read()
   im=Image.open(io.BytesIO(raw));im=ImageOps.exif_transpose(im)
   # Keep full detail in text-heavy source plans, fit photographs for retina cards.
   im.thumbnail((1920,1920),Image.Resampling.LANCZOS)
   if im.mode not in ('RGB','RGBA'):im=im.convert('RGBA' if 'transparency' in im.info else 'RGB')
   im.save(p,'WEBP',quality=84,method=4);return
  except Exception as e:
   if attempt==2:return {'url':url,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
 for i,result in enumerate(ex.map(fetch,manifest.items())):
  if result:failed.append(result)
  if i%100==0:print(f'{i+1}/{len(manifest)} media',flush=True)
(ROOT/'output').mkdir(exist_ok=True)
(ROOT/'output/media-failures.json').write_text(json.dumps(failed,ensure_ascii=False,indent=2))
print('Media complete; unavailable:',len(failed),flush=True)
if failed:
 for f in failed:print(f)
 raise SystemExit(1)

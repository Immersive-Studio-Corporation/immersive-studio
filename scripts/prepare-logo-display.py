"""Frame the original transparent masters in SVG, without resampling their pixels."""
from pathlib import Path
from PIL import Image
import base64, json, shutil, io

SITE = Path(__file__).resolve().parents[1]
ROOT = SITE.parent
OUT = SITE/'public/images/logos-hd-20260921'
OUT.mkdir(exist_ok=True)
sources = {
 'heritage': Path('C:/Users/Derek/Desktop/HÉRITAGE DE POUDLARD/boostercards/art_sources/heritage_logo_original.png'),
 'licaris': ROOT/'VISUELS MARKETING/13 - Univers et musiques/2026-09-14/Licaris/Originaux/licaris-logo.png',
 'onepiece': ROOT/'UPDATE 20-09-2026/LOGO/ONE PIECE.png',
 'teen': SITE/'public/images/teen-wordmark.png',
 'percy': SITE/'public/images/percy-emblem.png',
 'avengers': SITE/'public/images/avengers-wordmark.png',
 'narnia': SITE/'public/images/narnia-logo.png',
}
report = {}
for name, path in sources.items():
    im = Image.open(path)
    assert im.mode == 'RGBA', (name, im.mode)
    x,y,r,b = im.getchannel('A').getbbox()
    w,h = im.size
    encoded = io.BytesIO()
    im.save(encoded, format='WEBP', lossless=True, method=6, exact=True)
    # Lossless delivery encoding; no upscaling or generated lettering.
    data = base64.b64encode(encoded.getvalue()).decode()
    # A viewBox crops transparent padding only; the original PNG remains intact.
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{r-x}" height="{b-y}" viewBox="{x} {y} {r-x} {b-y}"><image width="{w}" height="{h}" href="data:image/webp;base64,{data}"/></svg>\n'
    (OUT/f'{name}.svg').write_text(svg,encoding='utf8')
    report[name] = {'source':str(path),'native_size':[w,h],'visible_bounds':[x,y,r,b],'output':f'/images/logos-hd-20260921/{name}.svg'}
for name, file in [('nations','avatar-nations-lockup.svg'),('walkingdead','walkingdead-wordmark.svg')]:
    shutil.copyfile(SITE/'public/images'/file,OUT/f'{name}.svg')
    report[name] = {'source':file,'output':f'/images/logos-hd-20260921/{name}.svg','vector_lettering':True}
(SITE/'assets/logo-masters-20260921.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
catalog = SITE/'app/journey-catalog.ts'
text = catalog.read_text(encoding='utf8')
import re
for name, data in report.items():
    text = re.sub(r"(id: '"+name+r"',[\s\S]*?image: ')[^']+",lambda m:m[1]+data['output'],text,count=1)
catalog.write_text(text,encoding='utf8')
print(json.dumps({name:entry.get('visible_bounds','vector') for name,entry in report.items()}))

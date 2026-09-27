"""Distinct still photographs/illustrations; retain native pixels and source attribution."""
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps, ImageDraw
import json, re, html

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT.parent / 'ARCHIVES TECHNIQUES/Update-20260921'
OUT = ROOT / 'public/images/snapshots-20260921'
OUT.mkdir(parents=True, exist_ok=True)
old = {r['name']: r for r in json.loads((ROOT/'assets/journey-sources.json').read_text(encoding='utf8'))}
records = []
for world, names in {
    'heritage': ['hogwarts-phoenix', 'hogwarts-night', 'hogwarts-great-hall'],
    'percy': ['percy-lightning', 'percy-monsters', 'percy-storm'],
    'avengers': ['avengers-newyork', 'avengers-ultron', 'avengers-endgame'],
    'teen': ['teen-wolf-movie', 'teen-wolf-pack', 'teen-wolf-transformation'],
}.items():
    for n, name in enumerate(names, 1):
        records.append(dict(old[name], id=f'{world}-{n}', project=world,
            local=str(ROOT.parent/'ARCHIVES TECHNIQUES/Update-20260920/retired-media/images/journey-4k'/f'{name}.webp')))

pages = {'onepiece': 'one-piece', 'licaris': 'pokemon-anime', 'narnia': 'the-chronicles-of-narnia'}
choices = {'onepiece': ['33422-', '126937-', '5828318.'], 'licaris': ['139890-', '139979-', '5828418-'], 'narnia': ['364514-', '364553-']}
for world, prefix in pages.items():
    page = (ARCHIVE/(world+'.html')).read_text(encoding='utf8')
    rows = re.findall(r'data-fullimg="([^"]+)"[^>]*data-or="([^"]+)"[^>]*>(.*?)(?=<div id=|$)', page, re.S)
    for n, fragment in enumerate(choices[world], 1):
        url, dims, tail = next(row for row in rows if fragment in row[0])
        desc = re.search(r'itemprop="name" content="([^"]+)', tail).group(1)
        records.append(dict(id=f'{world}-{n}', project=world, description=html.unescape(desc), source_page=f'https://wallpapercat.com/{prefix}-wallpapers', image_url='https://wallpapercat.com'+url))
for n, (slug, number) in enumerate([('rick-grimes-andrew',15655),('the-walking-dead-tv',15766),('the-walking-dead',15671)],1):
    records.append(dict(id=f'walkingdead-{n}', project='walkingdead', description=['Rick Grimes','Les survivants','The Walking Dead'][n-1], source_page=f'https://4kwallpapers.com/movies/{slug}-{number}.html', image_url=f'https://4kwallpapers.com/images/wallpapers/{slug}-3840x2160-{number}.jpg'))

def prepare(record):
    source = Path(record.pop('local')) if 'local' in record else ARCHIVE/(record['id']+'-source.jpg')
    if not source.exists():
        source.write_bytes(urlopen(Request(record['image_url'], headers={'User-Agent':'Mozilla/5.0'}), timeout=45).read())
    im = Image.open(source).convert('RGB')
    record['source_dimensions'] = list(im.size)
    record['local_upscaling'] = False
    record['outputs'] = []
    for width, suffix, quality in [(min(3840,im.width),'',90),(640,'-thumb',83)]:
        result = im.resize((width, round(im.height*width/im.width)), Image.Resampling.LANCZOS)
        target = OUT/(record['id']+suffix+'.webp')
        result.save(target, quality=quality, method=6)
        record['outputs'].append(dict(path='/images/snapshots-20260921/'+target.name, width=result.width, height=result.height, bytes=target.stat().st_size))
    print(record['id'], im.size, flush=True)
    return record

with ThreadPoolExecutor(max_workers=4) as pool:
    result = list(pool.map(prepare, records))
(ROOT/'assets/snapshot-sources.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
sheet = Image.new('RGB',(1200,((len(result)+3)//4)*196),'#20162c')
draw = ImageDraw.Draw(sheet)
for i, r in enumerate(result):
    im = Image.open(OUT/(r['id']+'-thumb.webp'))
    tile=ImageOps.contain(im,(292,164))
    x,y=(i%4)*300,(i//4)*196
    sheet.paste(tile,(x,y))
    draw.text((x+6,y+168),r['id'],fill='white')
sheet.save(ARCHIVE/'snapshots-contact.jpg')

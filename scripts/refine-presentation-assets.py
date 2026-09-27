"""Selected still replacements and the outlined Avatar identity; originals stay archived."""
from pathlib import Path
from PIL import Image
import json, sys, base64, shutil

ROOT = Path(__file__).resolve().parents[1]
QA = ROOT.parent/'ARCHIVES TECHNIQUES/Update-20260921/refinement'
sys.path.insert(0, str(QA/'python-deps'))
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

records = json.loads((ROOT/'assets/snapshot-sources.json').read_text(encoding='utf8'))
candidates = {r['id']: r for r in json.loads((QA/'candidates.json').read_text(encoding='utf8'))}
changes = {'licaris-1':'lucario0', 'licaris-2':'lugia0', 'licaris-3':'lucario5',
           'onepiece-3':'onepiece-new1', 
           'walkingdead-2':'walkingdead-new', 'narnia-2':'narnia-new2', 'narnia-3':'narnia-new0'}
dest = ROOT/'public/images/snapshots-20260921'
for name, candidate in changes.items():
    record = dict(candidates[candidate], id=name, project=name.rsplit('-',1)[0], local_upscaling=False, outputs=[])
    source = Image.open(QA/(candidate+'.jpg')).convert('RGB')
    for suffix, max_size, quality in [('',3840,92),('-thumb',640,85)]:
        path = dest/(name+suffix+'.webp')
        if path.exists(): shutil.copyfile(path, QA/('previous-'+path.name))
        result = source.copy(); result.thumbnail((max_size,max_size),Image.Resampling.LANCZOS)
        result.save(path,quality=quality,method=6)
        record['outputs'].append(dict(path='/images/snapshots-20260921/'+path.name,width=result.width,height=result.height,bytes=path.stat().st_size))
    records = [r for r in records if r['id'] != name] + [record]
(ROOT/'assets/snapshot-sources.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf8')

# Text is converted to vector outlines so the same typography works in <img>, at every size.
font = TTFont(ROOT/'public/fonts/CaesarDressing-Regular.ttf'); glyphs=font.getGlyphSet(); cmap=font.getBestCmap()
def lettering(text, width, baseline):
    advance=sum(font['hmtx'][cmap[ord(c)]][0] for c in text)
    scale=width/advance; x=0; shapes=[]
    for char in text:
        name=cmap[ord(char)]; pen=SVGPathPen(glyphs); glyphs[name].draw(pen)
        shapes.append(f'<path d="{pen.getCommands()}" transform="translate({x},0)"/>')
        x+=font['hmtx'][name][0]
    return f'<g transform="translate({(760-width)/2},{baseline}) scale({scale}, {-scale})">'+''.join(shapes)+'</g>'
print('9 still changes; 27 final stills; outlined Avatar logo exported')

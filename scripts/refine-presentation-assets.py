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
           'onepiece-3':'onepiece-new1', 'nations-2':'nations-new', 'nations-3':'nations-team',
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
encoded=base64.b64encode((ROOT/'public/images/nations-emblem.webp').read_bytes()).decode()
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 760" role="img" aria-label="Avatar - Les quatre nations">
<defs><linearGradient id="ink" x2="0" y2="1"><stop stop-color="#fff5ce"/><stop offset="1" stop-color="#dbb767"/></linearGradient>
<filter id="shadow" x="-20%" y="-40%" width="140%" height="190%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#0a101b" flood-opacity=".9"/></filter></defs>
<image href="data:image/webp;base64,{encoded}" x="72" y="0" width="616" height="616"/>
<path d="M63 459 Q380 420 697 459 L684 650 Q380 704 76 650Z" fill="#111c27" fill-opacity=".92" stroke="#c3a365" stroke-width="3"/>
<g fill="url(#ink)" stroke="#142126" stroke-width="20" paint-order="stroke" stroke-linejoin="round" filter="url(#shadow)">{lettering('AVATAR',650,566)}{lettering('LES QUATRE NATIONS',602,644)}</g></svg>'''
(ROOT/'public/images/avatar-nations-lockup.svg').write_text(svg,encoding='utf8')
print('9 still changes; 27 final stills; outlined Avatar logo exported')

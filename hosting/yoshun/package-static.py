"""Package the built main site; standalone marketing previews remain separate."""
from pathlib import Path
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib, io, json, sys, tarfile

SITE = Path(__file__).resolve().parents[2]
ROOT = SITE / 'dist/client'
release = datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S') + '-journey-sound'
output = SITE.parent / 'ARCHIVES TECHNIQUES/Deploiements' / release
assert len(sys.argv) == 2 and len(sys.argv[1]) == 64
files = sorted(p for p in ROOT.rglob('*') if p.is_file()
               and not any(part.startswith('.') for part in p.relative_to(ROOT).parts)
               and p.relative_to(ROOT).parts[0] != 'apercus'
               and not p.relative_to(ROOT).as_posix().startswith('audio/journey/'))
manifest = {'release':release, 'previous_html_sha256':sys.argv[1], 'files':{}}
retired = SITE.parent/'ARCHIVES TECHNIQUES/Update-20260920/retired-media'
manifest['retired_files'] = sorted(p.relative_to(retired).as_posix() for p in retired.rglob('*') if p.is_file())
for path in files:
    assert not path.is_symlink()
    manifest['files'][path.relative_to(ROOT).as_posix()] = {
        'size':path.stat().st_size, 'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}

class Assets(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        values = []
        if tag in ('script','img','source') and attrs.get('src'): values.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') in ('stylesheet','icon','apple-touch-icon','preload','modulepreload'):
            values.append(attrs.get('href',''))
        if tag in ('img','source') and attrs.get('srcset'):
            values += [v.strip().split()[0] for v in attrs['srcset'].split(',')]
        for value in values:
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or not parsed.path: continue
            relative = unquote(parsed.path).lstrip('/')
            assert relative in manifest['files'], f'Missing local asset: {relative}'

html = (ROOT/'index.html').read_text(encoding='utf-8')
assert 'music-trigger' in html and 'immersive-studio.fr' in html
Assets().feed(html)
assert 'audio/update-20260920/intro.mp3' in manifest['files']
assert 'images/minecraft-logo.png' in manifest['files']
for project in ('intro','heritage','licaris','onepiece','teen','nations','percy','avengers','walkingdead','narnia'):
    assert f'audio/balanced-20260921/{project}.mp3' in manifest['files']
    if project != 'intro':
        assert f'images/logos-hd-20260921/{project}.svg' in manifest['files']
for project in ('heritage','percy','teen','nations'):
    assert f'audio/licensed/{project}.mp3' in manifest['files']
for project in ('avengers','licaris','onepiece','walkingdead','narnia'):
    assert f'audio/update-20260920/{project}.mp3' in manifest['files']
for project in ('heritage','onepiece','teen','nations','percy','avengers','walkingdead','narnia'):
    for shot in (1,2,3):
        for height in (1080,720):
            assert f'videos/worlds-20260920/{project}-{shot}-{height}.mp4' in manifest['files']
assert not set(manifest['retired_files']).intersection(manifest['files'])
assert 'Newgen' not in html and 'The Last of Us' not in html
for name in ('latios', 'bulbasaur', 'lucario'):
    for height in (1080, 720):
        assert f'videos/licaris/licaris-{name}-{height}.mp4' in manifest['files']
output.mkdir(parents=True, exist_ok=False)
data = (json.dumps(manifest, ensure_ascii=False, indent=2)+'\n').encode('utf-8')
(output/'manifest.json').write_bytes(data)
archive = output / (release+'.tar.gz')
with tarfile.open(archive,'w:gz',compresslevel=4) as package:
    info = tarfile.TarInfo('_deployment.json')
    info.size = len(data)
    info.mode = 0o644
    package.addfile(info, io.BytesIO(data))
    for path in files:
        package.add(path,arcname=path.relative_to(ROOT).as_posix(),recursive=False)
result = {'release':release,'archive':str(archive),'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),
          'bytes':archive.stat().st_size,'files':len(files),'html_sha256':manifest['files']['index.html']['sha256']}
(output/'package.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result))

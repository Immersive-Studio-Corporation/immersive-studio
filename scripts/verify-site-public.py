"""Verify the deployed manifest, HTML identity and media range requests over HTTPS."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
import hashlib, json, sys

folder = Path(sys.argv[1])
manifest = json.loads((folder/'manifest.json').read_text(encoding='utf8'))
origin = 'https://immersive-studio.fr/'
def check(item):
    name, info = item
    url = origin+quote(name)
    with urlopen(Request(url,method='HEAD'),timeout=30) as r:
        assert r.status == 200, name
        assert int(r.headers['Content-Length']) == info['size'], name
    ranged = name.endswith(('.mp3','.mp4'))
    if ranged:
        with urlopen(Request(url,headers={'Range':'bytes=0-31'}),timeout=30) as r:
            assert r.status == 206 and len(r.read()) == 32, name
    return {'asset':name,'head':200,'range':206 if ranged else None}

with urlopen(origin+'?release='+manifest['release'],timeout=30) as response:
    sha = hashlib.sha256(response.read()).hexdigest()
assert sha == manifest['files']['index.html']['sha256']
with ThreadPoolExecutor(max_workers=8) as pool:
    checks = list(pool.map(check,manifest['files'].items()))
report={'release':manifest['release'],'html_sha256':sha,'assets':len(checks),'media_ranges':sum(c['range']==206 for c in checks),'checks':checks}
(folder/'public-verification.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
print(json.dumps({k:v for k,v in report.items() if k!='checks'}))

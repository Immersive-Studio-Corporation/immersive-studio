"""Check the published manifest through the real HTTPS endpoint, including ranges."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, sys, urllib.request, hashlib

manifest_path=Path(sys.argv[1]).resolve()
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
origin='https://immersive-studio.fr/'
def check(item):
    relative, info=item
    url=origin+relative
    with urllib.request.urlopen(urllib.request.Request(url,method='HEAD'),timeout=30) as response:
        assert response.status==200,(relative,response.status)
        assert int(response.headers['Content-Length'])==info['size'],relative
    ranged=False
    if relative.endswith(('.mp4','.mp3')):
        with urllib.request.urlopen(urllib.request.Request(url,headers={'Range':'bytes=0-1023'}),timeout=30) as response:
            assert response.status==206,(relative,'range',response.status)
            assert response.headers['Content-Range'].startswith('bytes 0-1023/'),relative
            assert len(response.read())==1024,relative
            ranged=True
    return {'path':relative,'status':200,'range_206':ranged}

with ThreadPoolExecutor(max_workers=5) as pool:
    results=list(pool.map(check,manifest['files'].items()))
with urllib.request.urlopen(origin,timeout=30) as response:
    html=response.read()
    assert hashlib.sha256(html).hexdigest()==manifest['files']['index.html']['sha256']
    assert b'Newgen' not in html and b'The Last of Us' not in html
summary={'release':manifest['release'],'https_assets':len(results),'media_range_206':sum(r['range_206'] for r in results),'html_sha256':hashlib.sha256(html).hexdigest(),'results':results}
(manifest_path.parent/'public-verification.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in summary.items() if k!='results'}))

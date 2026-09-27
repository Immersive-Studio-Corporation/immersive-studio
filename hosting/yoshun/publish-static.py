"""Run on OG-YOSHUN: verified static assets first, HTML last, with rollback."""
from pathlib import Path, PurePosixPath
import fcntl, hashlib, json, os, re, shutil, sys, tarfile, urllib.request

BASE = Path('/home/hdpbots/immersive-studio/staging/20260906-domain')
LIVE = BASE/'public'
assert len(sys.argv) == 3
release_id, expected_hash = sys.argv[1:]
assert re.fullmatch(r'\d{8}-\d{6}-journey-sound',release_id)
assert re.fullmatch(r'[a-f0-9]{64}',expected_hash)
assert BASE.resolve() == BASE and LIVE.is_dir() and not LIVE.is_symlink()
archive = BASE/(release_id+'.tar.gz')
release = BASE/'releases'/release_id
backup = BASE/'backups'/('before-'+release_id+'.tar.gz')

def digest(path):
    with path.open('rb') as file:
        return hashlib.file_digest(file,'sha256').hexdigest()

def safe_target(relative):
    parts = PurePosixPath(relative)
    assert not parts.is_absolute() and '..' not in parts.parts
    target = LIVE.joinpath(*parts.parts)
    assert target.resolve().is_relative_to(LIVE.resolve())
    assert not any(p.is_symlink() for p in (target,*target.parents) if p != BASE.parent)
    return target

def replace(source, target):
    target.parent.mkdir(parents=True,exist_ok=True,mode=0o755)
    temporary = target.with_name(target.name+'.publishing-'+release_id)
    shutil.copyfile(source,temporary)
    temporary.chmod(0o644)
    os.replace(temporary,target)

with (BASE/'.publication.lock').open('a') as lock:
    fcntl.flock(lock,fcntl.LOCK_EX | fcntl.LOCK_NB)
    assert digest(archive) == expected_hash, 'Archive checksum mismatch'
    assert not backup.exists()
    assert not release.exists() or (release.is_dir() and not release.is_symlink() and not any(release.iterdir()))
    with tarfile.open(archive,'r:gz') as package:
        members = package.getmembers()
        names = [member.name for member in members]
        assert len(names) == len(set(names))
        for member in members:
            name = PurePosixPath(member.name)
            assert not name.is_absolute() and '..' not in name.parts
            assert member.isfile(), 'Only regular files are accepted'
        manifest = json.load(package.extractfile('_deployment.json'))
        assert manifest['release'] == release_id
        assert set(names) == set(manifest['files']) | {'_deployment.json'}
        assert digest(LIVE/'index.html') == manifest['previous_html_sha256'], 'Live site changed since inspection'
        release.mkdir(parents=True,mode=0o755,exist_ok=True)
        options = {'filter':'data'} if hasattr(tarfile,'data_filter') else {}
        # All members were already checked above: regular files, unique names,
        # relative paths only, with no parent traversal or links.
        package.extractall(release,**options)
    for relative, info in manifest['files'].items():
        source = release/relative
        assert source.stat().st_size == info['size'] and digest(source) == info['sha256']
        safe_target(relative)
    retired = manifest.get('retired_files', [])
    assert not set(retired).intersection(manifest['files'])
    for relative in retired:
        assert relative.startswith(('images/', 'audio/')), 'Only retired media may be archived'
        safe_target(relative)
    assert 'index.html' in manifest['files']
    backup.parent.mkdir(exist_ok=True)
    with tarfile.open(backup,'w:gz',compresslevel=3) as package:
        package.add(LIVE,arcname='public')
    print(json.dumps({'stage':'backup_complete','backup':str(backup)}),flush=True)
    files = sorted(manifest['files'],key=lambda p:(p=='index.html',p.endswith(('.html','.rsc')),p))
    published = 0
    try:
        for relative in files:
            target = safe_target(relative)
            if target.is_file() and digest(target) == manifest['files'][relative]['sha256']: continue
            replace(release/relative,target)
            published += 1
        for relative, info in manifest['files'].items():
            assert digest(safe_target(relative)) == info['sha256'], 'Live asset checksum mismatch'
        # A complete backup already exists. Preserve retired files outside the
        # public root rather than deleting them, after the new HTML is live.
        for relative in retired:
            old = safe_target(relative)
            if old.is_file():
                destination = release/'retired-public'/relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                os.replace(old, destination)
        with urllib.request.urlopen('http://127.0.0.1:8088/',timeout=10) as response:
            assert response.status == 200
            assert hashlib.sha256(response.read()).hexdigest() == manifest['files']['index.html']['sha256']
    except BaseException:
        # Restore the previous files, keeping new hashed assets harmlessly in place.
        with tarfile.open(backup,'r:gz') as package:
            members = sorted((m for m in package.getmembers() if m.isfile()),key=lambda m:m.name=='public/index.html')
            for member in members:
                relative = str(PurePosixPath(member.name).relative_to('public'))
                target = safe_target(relative)
                temporary = target.with_name(target.name+'.rollback-'+release_id)
                with package.extractfile(member) as source, temporary.open('wb') as destination:
                    shutil.copyfileobj(source,destination)
                temporary.chmod(0o644)
                os.replace(temporary,target)
        print(json.dumps({'stage':'rolled_back','backup':str(backup)}),flush=True)
        raise
    result = {'stage':'published','release':release_id,'backup':str(backup),'files_published':published,
              'files_verified':len(files),'retired_files':len(retired),'html_sha256':manifest['files']['index.html']['sha256']}
    (release/'publication.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result),flush=True)

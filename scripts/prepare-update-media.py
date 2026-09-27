"""Reproducible web delivery of the owner's 20 September media; originals untouched."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, subprocess, shutil, hashlib, re, sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT/'UPDATE 20-09-2026'
PUBLIC = ROOT/'site/public'
QA = ROOT/'ARCHIVES TECHNIQUES/Update-20260920'
BIN = Path('C:/Users/Derek/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin')
MAPPING = {'HARRY POTTER':'heritage','ONE PIECE':'onepiece','TEEN WOLF':'teen','PERCY JACKSON':'percy','AVENGERS':'avengers','THE WALKING DEAD':'walkingdead','NARNIA':'narnia'}
VIDEO = PUBLIC/'videos/worlds-20260920'
POSTER = PUBLIC/'images/worlds-20260920'
AUDIO = PUBLIC/'audio/update-20260920'
for path in [VIDEO, POSTER, AUDIO]: path.mkdir(parents=True,exist_ok=True)

def run(args):
    result=subprocess.run([str(BIN/'ffmpeg.exe'),'-hide_banner','-loglevel','error','-y',*args],capture_output=True,text=True)
    if result.returncode: raise RuntimeError(result.stderr)

def prepare(src):
    match=re.fullmatch(r'(.+?)\s+(\d)',src.stem)
    key=f'{MAPPING[match[1]]}-{match[2]}'
    data=json.loads(subprocess.check_output([str(BIN/'ffprobe.exe'),'-v','error','-show_streams','-show_format','-of','json',str(src)]))
    stream=data['streams'][0]
    a,b=map(int,stream['avg_frame_rate'].split('/'))
    duration=float(data['format']['duration'])
    # Native pacing restored. Interpolation adds frames without slowing time.
    slowdown = 1
    trim_start, trim_end = (.13, 4.75) if key == 'onepiece-2' else (0, duration)
    output_duration = (trim_end-trim_start) * slowdown
    desktop=VIDEO/f'{key}-1080.mp4'
    mobile=VIDEO/f'{key}-720.mp4'
    refresh = any(arg in sys.argv for arg in ['--refine-gifs', '--normal-gifs']) and src.suffix == '.gif'
    if refresh or not desktop.exists():
        # Interpolate at source resolution before upscaling. Scene detection
        # avoids blending unrelated shots. Supplied MP4 pacing is preserved.
        filters=[f'trim=start={trim_start}:end={trim_end}', f'setpts={slowdown}*(PTS-STARTPTS)']
        if src.suffix == '.gif':
            filters += ['hqdn3d=2:1.5:3:3', 'deband=1thr=0.018:2thr=0.018:3thr=0.018:range=12']
        if a/b < 59:
            filters += [f'tpad=stop_mode=clone:stop_duration={max(.3,2*slowdown/(a/b))}', 'minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:search_param=32:vsbmc=1:scd=fdiff:scd_threshold=8']
        else: filters += ['fps=60']
        filters += ['scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos','crop=1920:1080','setsar=1','unsharp=5:5:0.25:3:3:0','format=yuv420p']
        run(['-threads','2','-i',str(src),'-an','-vf',','.join(filters),'-t',str(output_duration),'-c:v','libx264','-preset','medium','-crf','19' if slowdown > 1 else '20','-threads','3','-filter_threads','2','-profile:v','high','-level:v','4.2','-movflags','+faststart','-map_metadata','-1',str(desktop)])
    if refresh or not mobile.exists():
        run(['-i',str(desktop),'-an','-vf','scale=1280:720:flags=lanczos','-c:v','libx264','-preset','medium','-crf','22','-threads','2','-filter_threads','1','-movflags','+faststart','-map_metadata','-1',str(mobile)])
    # A frame inside the clip avoids black first frames in supplied GIFs.
    for width in [1920,960]:
        poster=POSTER/f'{key}{"-960" if width==960 else ""}.webp'
        if refresh or not poster.exists():
            run(['-ss',str(min(duration*.4,1.2)*slowdown),'-i',str(desktop),'-frames:v','1','-vf',f'scale={width}:-2','-c:v','libwebp','-quality','88',str(poster)])
    output=json.loads(subprocess.check_output([str(BIN/'ffprobe.exe'),'-v','error','-show_streams','-show_format','-of','json',str(desktop)]))
    record={'id':key,'source':src.relative_to(ROOT).as_posix(),'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'source_width':stream['width'],'source_height':stream['height'],'source_fps':a/b,'width':1920,'height':1080,'fps':output['streams'][0]['avg_frame_rate'],'duration':output['format']['duration'],'interpolated':a/b<59,'desktop_bytes':desktop.stat().st_size,'mobile_bytes':mobile.stat().st_size}
    record.update(source_duration=duration, slowdown=slowdown, play_count=None, trim_start=trim_start, trim_end=trim_end)
    print(f'{key}: 1920x1080 / {record["fps"]} / {desktop.stat().st_size//1024} KiB',flush=True)
    return record

for src in SOURCE.rglob('*.mp3'):
    if 'GIF' in src.relative_to(SOURCE).parts: continue
    key='intro' if src.parent==SOURCE else {'AVENGERS':'avengers','LICARIS':'licaris','NARNIA':'narnia','ONE PIECE':'onepiece','THE WALKING DEAD':'walkingdead'}[src.stem]
    shutil.copyfile(src,AUDIO/f'{key}.mp3')
# Format conversion and transparent-bounds crop only; supplied pixels preserved.
logo=Image.open(SOURCE/'LOGO/ONE PIECE.png').convert('RGBA')
logo=logo.crop(logo.getchannel('A').getbbox())
logo.thumbnail((1600,700),Image.Resampling.LANCZOS)
logo.save(PUBLIC/'images/onepiece-logo.webp',quality=95)
with ThreadPoolExecutor(max_workers=2) as pool:
    records=list(pool.map(prepare,sorted(p for p in (SOURCE/'GIF').iterdir() if p.suffix.lower() in ('.gif','.mp4'))))
(ROOT/'site/assets/update-20260920.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('ALL MEDIA COMPLETE',flush=True)

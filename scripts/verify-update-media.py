"""Inspect the actual encodes, including native pacing and silent video streams."""
from pathlib import Path
import json, subprocess
from concurrent.futures import ThreadPoolExecutor

site = Path(__file__).resolve().parents[1]
probe = Path('C:/Users/Derek/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffprobe.exe')
manifest = json.loads((site/'assets/update-20260920.json').read_text(encoding='utf-8'))

def verify(item):
    clip, height = item
    path = site/f'public/videos/worlds-20260920/{clip["id"]}-{height}.mp4'
    data = json.loads(subprocess.check_output([str(probe), '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)]))
    assert len(data['streams']) == 1, path
    stream = data['streams'][0]
    assert stream['codec_name'] == 'h264' and stream['codec_type'] == 'video', path
    assert stream['height'] == height and stream['width'] == height*16//9, path
    assert stream['avg_frame_rate'] == '60/1', path
    duration = float(data['format']['duration'])
    assert abs(duration - float(clip['duration'])) < .04, path
    if clip['source'].endswith('.gif'):
        assert abs(duration - (clip.get('trim_end',clip['source_duration'])-clip.get('trim_start',0))*clip['slowdown']) < .04, path
    return {'path':path.relative_to(site).as_posix(), 'duration':duration, 'fps':60, 'width':stream['width'], 'height':height}

with ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(verify, [(clip,height) for clip in manifest for height in [1080,720]]))
output = site.parent/'ARCHIVES TECHNIQUES/Update-20260921/natural-media-verification.json'
output.write_text(json.dumps(results, indent=2)+'\n', encoding='utf-8')
print(f'PASS: {len(results)} H.264 videos, 60 fps, correct dimensions/durations, no competing audio stream.')

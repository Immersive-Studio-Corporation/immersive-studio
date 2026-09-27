"""Measure, normalize and re-measure every soundtrack. Original files stay intact."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, re, subprocess

SITE = Path(__file__).resolve().parents[1]
FF = Path('C:/Users/Derek/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe')
OUT = SITE/'public/audio/balanced-20260921'
REPORT = SITE/'assets/audio-loudness-20260921.json'
OUT.mkdir(parents=True, exist_ok=True)
sources = {name: SITE/'public/audio'/('licensed' if name in ('heritage','teen','nations','percy') else 'update-20260920')/f'{name}.mp3'
           for name in ('intro','heritage','licaris','onepiece','teen','nations','percy','avengers','walkingdead','narnia')}
# Keep each recording's dynamics; the perceived average level is what must match.
target = 'loudnorm=I=-20:TP=-2:LRA=50'

def measure(path):
    r = subprocess.run([str(FF),'-hide_banner','-nostdin','-i',str(path),'-af',target+':print_format=json','-f','null','NUL'],capture_output=True,text=True,check=True)
    return json.loads(re.findall(r'\{\s*"input_i".*?\}',r.stderr,re.S)[-1])

def process(item):
    name, source = item
    before = measure(source)
    filter_ = target + ':linear=true:print_format=json' + ''.join(f':{key}={before[value]}' for key,value in
        [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])
    output = OUT/f'{name}.mp3'
    subprocess.run([str(FF),'-hide_banner','-loglevel','error','-nostdin','-y','-i',str(source),'-map','0:a:0','-af',filter_,'-ar','44100','-c:a','libmp3lame','-b:a','192k',str(output)],check=True)
    after = measure(output)
    # Peak-limited recordings can miss the first loudness target. Correct from
    # the original again, with a transparent limiter, and validate the encoded MP3.
    correction = 0
    for _ in range(2):
        if abs(float(after['input_i'])+20)<0.5: break
        correction += -20-float(after['input_i'])
        adjusted = filter_+f',volume={correction}dB,alimiter=limit=0.794328:level=false:latency=true'
        subprocess.run([str(FF),'-hide_banner','-loglevel','error','-nostdin','-y','-i',str(source),'-map','0:a:0','-af',adjusted,'-ar','44100','-c:a','libmp3lame','-b:a','192k',str(output)],check=True)
        after = measure(output)
    assert abs(float(after['input_i'])+20)<0.5, (name,after)
    assert float(after['input_tp']) < -1, (name,after)
    print(f"{name}: {before['input_i']} -> {after['input_i']} LUFS",flush=True)
    return name, {'source':str(source.relative_to(SITE)), 'output':str(output.relative_to(SITE)), 'before':before, 'after':after}

with ThreadPoolExecutor(max_workers=2) as pool:
    results = dict(pool.map(process,sources.items()))
REPORT.write_text(json.dumps({'target_lufs':-20,'true_peak_limit_dbtp':-2,'default_volume':0.15,'tracks':results},indent=2)+'\n',encoding='utf8')

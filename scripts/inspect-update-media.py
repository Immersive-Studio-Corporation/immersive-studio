from pathlib import Path
import json, subprocess, tarfile
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[2]
QA = ROOT / 'ARCHIVES TECHNIQUES/Update-20260920'
QA.mkdir(parents=True, exist_ok=True)
BIN = Path('C:/Users/Derek/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin')
backup = QA / 'sources-before.tar.gz'
if not backup.exists():
    with tarfile.open(backup, 'w:gz') as tar:
        for folder in ['app', 'scripts', 'assets', 'hosting']:
            tar.add(ROOT/'site'/folder, arcname=folder)
        for file in ['public/credits-visuels.txt', 'public/credits-musiques.html', 'README.md']:
            tar.add(ROOT/'site'/file, arcname=file)
files = sorted((ROOT/'UPDATE 20-09-2026/GIF').iterdir())
canvas = Image.new('RGB', (1280, 4*210), '#15111d')
draw = ImageDraw.Draw(canvas)
report = []
for i, src in enumerate(files):
    data = json.loads(subprocess.check_output([str(BIN/'ffprobe.exe'), '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(src)]))
    stream = data['streams'][0]
    report.append({'file':src.name, 'width':stream['width'], 'height':stream['height'], 'fps':stream['avg_frame_rate'], 'duration':data['format'].get('duration'), 'frames':stream.get('nb_frames')})
    out = QA/(src.stem+'.jpg')
    subprocess.run([str(BIN/'ffmpeg.exe'), '-v', 'error', '-y', '-i', str(src), '-frames:v', '1', '-q:v', '3', str(out)], check=True)
    thumb = ImageOps.contain(Image.open(out), (310, 174))
    x,y=(i%4)*320,(i//4)*210
    if y+210 > canvas.height:
        larger=Image.new('RGB',(1280,y+210),'#15111d'); larger.paste(canvas); canvas=larger; draw=ImageDraw.Draw(canvas)
    canvas.paste(thumb,(x+(310-thumb.width)//2,y+(174-thumb.height)//2))
    draw.text((x+6,y+177),src.name,fill='white')
    draw.text((x+6,y+192),f"{stream['width']}x{stream['height']} - {stream['avg_frame_rate']} fps",fill='#baadc8')
canvas.save(QA/'sources-contact.jpg')
(QA/'sources-probe.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
for item in report: print(item)
for src in sorted((ROOT/'UPDATE 20-09-2026').rglob('*.mp3')):
    data=json.loads(subprocess.check_output([str(BIN/'ffprobe.exe'),'-v','error','-show_format','-of','json',str(src)]))
    print(src.name, data['format'].get('duration'), data['format'].get('tags',{}))

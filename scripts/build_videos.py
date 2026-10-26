#!/usr/bin/env python3
"""Make the AI-narrated lesson videos: learn/video/<id>.mp4 + .vtt captions + .jpg poster + .json.

    python3 scripts/build_videos.py              # every lesson that has no video yet
    python3 scripts/build_videos.py ts-1.1 scn-2 # just these (rebuilds them)
    python3 scripts/build_videos.py --all        # rebuild everything

Pipeline: scripts/render_slides.js screenshots each slide of learn/deck.html (the same deck the site
shows) and dumps each slide's speaker note; Kokoro-82M (open-weights TTS, Apache-2.0, run locally via
the kokoro-onnx package) reads the notes; ffmpeg pairs each slide with its narration, H.264 still-image
video + AAC mono audio. Captions are the notes, timed per sentence. Afterwards run
scripts/build_learn.py so lessons.js picks up the new videos.

Setup (once):
    pip install kokoro-onnx soundfile
    curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
    curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
and point KOKORO_DIR at the folder holding the two files (default: ~/.cache/kokoro).
"""
import json, os, re, subprocess, sys, tempfile, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'learn', 'video')
VOICE = os.environ.get('KOKORO_VOICE', 'af_heart')
KDIR = os.environ.get('KOKORO_DIR', os.path.expanduser('~/.cache/kokoro'))
GAP_BEFORE, GAP_AFTER = 0.5, 0.9   # seconds of silence around each slide's narration

# words the voice tends to mangle, spelled the way they are said
SAY = [
    (r'\bCLAUDE\.md\b', 'Claude dot M D'), (r'\bSKILL\.md\b', 'skill dot M D'), (r'\bMCP\b', 'M C P'),
    (r'\bSDK\b', 'S D K'), (r'\bAPI\b', 'A P I'), (r'\bJSON\b', 'Jason'), (r'\bCI/CD\b', 'C I C D'),
    (r'\bCI\b', 'C I'), (r'\bPR\b', 'P R'), (r'\bPRs\b', 'P Rs'), (r'\bCLI\b', 'C L I'), (r'\bURL\b', 'U R L'),
    (r'\bPII\b', 'P I I'), (r'\bID\b', 'I D'), (r'\bIDs\b', 'I Ds'), (r'\bSLA\b', 'S L A'),
    (r'\bCCA-F\b', 'C C A F'), (r'\bOnVUE\b', 'On View'), (r'\bVUE\b', 'View'), (r'\bYAML\b', 'yammel'),
    (r'\bstop_reason\b', 'stop reason'), (r'\btool_use\b', 'tool use'), (r'\bend_turn\b', 'end turn'),
    (r'_', ' '),
]


def spoken(text):
    for pat, rep in SAY:
        text = re.sub(pat, rep, text)
    return text


def serve():
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = partial(Quiet, directory=ROOT)
    srv = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f'http://127.0.0.1:{srv.server_address[1]}'


def lesson_ids():
    src = open(os.path.join(ROOT, 'learn', 'lessons.js'), encoding='utf-8').read()
    return re.findall(r'^  "id": "([^"]+)"', src, re.M)


def vtt_time(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f'{int(h):02d}:{int(m):02d}:{s:06.3f}'


def captions(note, start, dur):
    """Split a slide's note into sentence cues, timed in proportion to their length."""
    parts = [p.strip() for p in re.split(r'(?<=[.!?])\s+', note) if p.strip()]
    total = sum(len(p) for p in parts) or 1
    cues, t = [], start
    for p in parts:
        d = dur * len(p) / total
        cues.append((t, t + d, p))
        t += d
    return cues


def build(kokoro, sf, base, ids, work):
    subprocess.run(['node', os.path.join(ROOT, 'scripts', 'render_slides.js'), work, base, *ids], check=True)
    os.makedirs(OUT, exist_ok=True)
    for lid in ids:
        d = os.path.join(work, lid)
        notes = json.load(open(os.path.join(d, 'notes.json')))
        segs, cues, t = [], [], 0.0
        for i, note in enumerate(notes):
            samples, rate = kokoro.create(spoken(note), voice=VOICE, speed=1.0, lang='en-us')
            wav = os.path.join(d, f'n-{i:02d}.wav')
            sf.write(wav, samples, rate)
            talk = len(samples) / rate
            dur = GAP_BEFORE + talk + GAP_AFTER
            seg = os.path.join(d, f'seg-{i:02d}.mp4')
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-loop', '1', '-framerate', '2', '-i', os.path.join(d, f'slide-{i:02d}.png'),
                            '-i', wav, '-filter_complex', f'[1:a]adelay={int(GAP_BEFORE * 1000)}:all=1,apad=pad_dur={GAP_AFTER},aresample=44100[a]',
                            '-map', '0:v', '-map', '[a]', '-t', f'{dur:.3f}',
                            '-c:v', 'libx264', '-tune', 'stillimage', '-preset', 'veryslow', '-crf', '32', '-pix_fmt', 'yuv420p', '-r', '2',
                            '-c:a', 'aac', '-b:a', '32k', '-ac', '1', seg], check=True)
            segs.append(seg)
            cues += captions(note, t + GAP_BEFORE, talk)
            t += dur
        lst = os.path.join(d, 'list.txt')
        open(lst, 'w').write(''.join(f"file '{s}'\n" for s in segs))
        mp4 = os.path.join(OUT, lid + '.mp4')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', mp4], check=True)
        with open(os.path.join(OUT, lid + '.vtt'), 'w', encoding='utf-8') as f:
            f.write('WEBVTT\n\n')
            for k, (a, b, txt) in enumerate(cues, 1):
                f.write(f'{k}\n{vtt_time(a)} --> {vtt_time(b)}\n{txt}\n\n')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(d, 'slide-00.png'), '-vf', 'scale=960:-1', '-q:v', '5',
                        os.path.join(OUT, lid + '.jpg')], check=True)
        json.dump({'seconds': round(t, 1), 'slides': len(notes), 'voice': VOICE, 'tts': 'Kokoro-82M (kokoro-onnx, int8)'},
                  open(os.path.join(OUT, lid + '.json'), 'w'))
        print(f'{lid}: {t / 60:.1f} min, {os.path.getsize(mp4) / 1e6:.1f} MB', flush=True)


def main():
    import soundfile as sf
    from kokoro_onnx import Kokoro
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    ids = args or [i for i in lesson_ids() if '--all' in sys.argv or not os.path.exists(os.path.join(OUT, i + '.mp4'))]
    if not ids:
        print('nothing to build')
        return
    kokoro = Kokoro(os.path.join(KDIR, 'kokoro-v1.0.int8.onnx'), os.path.join(KDIR, 'voices-v1.0.bin'))
    srv, base = serve()
    with tempfile.TemporaryDirectory() as work:
        for k in range(0, len(ids), 4):    # small batches, so progress lands on disk as it goes
            build(kokoro, sf, base, ids[k:k + 4], work)
    srv.shutdown()


if __name__ == '__main__':
    main()

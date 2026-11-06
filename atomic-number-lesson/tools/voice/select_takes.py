"""Render several takes of every line and keep the one Whisper transcribes best.

Usage: python3 select_takes.py <piper_model_dir> <whisper_small_dir> <out_dir>
Writes the chosen WAVs and timing.json into out_dir (copy them to public/voice and
src/voice-timing.json, then run tools/voice/normalize.sh).
"""
import itertools
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

import numpy as np
import sherpa_onnx
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
piper_dir, whisper_dir, out = sys.argv[1], sys.argv[2], sys.argv[3]
lines_path = os.path.join(HERE, 'lines.json')
lines = dict(json.load(open(lines_path)))

rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=f'{whisper_dir}/small-encoder.int8.onnx',
    decoder=f'{whisper_dir}/small-decoder.int8.onnx',
    tokens=f'{whisper_dir}/small-tokens.txt',
    language='ar', task='transcribe', num_threads=4)


def norm(t):
    t = re.sub(r'[ً-ْـ]', '', t)
    for a in ('اثنا عشر', 'اثني عشر', 'إثنا عشر'):
        t = t.replace(a, '12')
    t = re.sub(r'\bستة\b|\bسته\b', '6', t)
    for a, b in [('أ', 'ا'), ('إ', 'ا'), ('آ', 'ا'), ('ة', 'ه'), ('ى', 'ي')]:
        t = t.replace(a, b)
    return re.sub(r'[^\w ]', '', t).split()


def wer(ref, hyp):
    r, h = norm(ref), norm(hyp)
    d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(h) + 1):
            cur = min(d[j] + 1, d[j - 1] + 1, prev + (r[i - 1] != h[j - 1]))
            prev, d[j] = d[j], cur
    return d[len(h)] / len(r)


def transcribe(path):
    a, sr = sf.read(path, dtype='float32')
    a = np.concatenate([np.zeros(sr // 2, np.float32), a, np.zeros(int(sr * 1.5), np.float32)])
    s = rec.create_stream()
    s.accept_waveform(sr, a)
    rec.decode_stream(s)
    return s.result.text.strip()


best = {}
tmp = tempfile.mkdtemp()
for n, (length, noise) in enumerate(itertools.product([0.62, 0.66], [0.4, 0.55, 0.7])):
    take = os.path.join(tmp, f'take{n}')
    subprocess.run([sys.executable, os.path.join(HERE, 'synth.py'), piper_dir, lines_path, take, str(length), '0.2'],
                   check=True, capture_output=True, env={**os.environ, 'NOISE': str(noise)})
    timing = json.load(open(os.path.join(take, 'timing.json')))
    for key, ref in lines.items():
        hyp = transcribe(os.path.join(take, f'{key}.wav'))
        score = (wer(ref, hyp), timing[key]['duration'])
        if key not in best or score < best[key][0]:
            best[key] = (score, take, hyp, timing[key])

os.makedirs(out, exist_ok=True)
chosen = {}
for key, (score, take, hyp, t) in best.items():
    shutil.copy(os.path.join(take, f'{key}.wav'), os.path.join(out, f'{key}.wav'))
    chosen[key] = t
    print(f'{key} WER={score[0]:.2f} dur={score[1]}s → {hyp}')
json.dump(chosen, open(os.path.join(out, 'timing.json'), 'w'), ensure_ascii=False, indent=1)

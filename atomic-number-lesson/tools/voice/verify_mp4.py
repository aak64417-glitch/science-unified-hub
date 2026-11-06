"""Transcribe each narration line straight from the final MP4 (voice + music mix).

Usage: python3 verify_mp4.py <video.mp4> <whisper_small_dir> <lines_start_json>
lines_start_json: [[id, start_sec, end_sec], ...] (printed by scripts/test-video.mjs)
"""
import json
import subprocess
import sys

import numpy as np
import sherpa_onnx

video, whisper_dir, spans = sys.argv[1], sys.argv[2], json.loads(open(sys.argv[3]).read())
rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=f'{whisper_dir}/small-encoder.int8.onnx', decoder=f'{whisper_dir}/small-decoder.int8.onnx',
    tokens=f'{whisper_dir}/small-tokens.txt', language='ar', task='transcribe', num_threads=4)
SR = 16000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     check=True, capture_output=True).stdout
audio = np.frombuffer(raw, dtype=np.float32)
for key, t0, t1 in spans:
    seg = audio[int((t0 - 0.3) * SR):int((t1 + 0.3) * SR)]
    seg = np.concatenate([seg, np.zeros(int(1.5 * SR), np.float32)])
    s = rec.create_stream()
    s.accept_waveform(SR, seg)
    rec.decode_stream(s)
    print(f'{key} [{t0:5.2f}s → {t1:5.2f}s]  {s.result.text.strip()}')

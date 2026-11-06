"""Soft ambient pad (procedural, royalty-free) for the background music track."""
import sys
import numpy as np
import soundfile as sf

SR = 44100
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 58.0
out = sys.argv[1]
t = np.arange(int(SR * DUR)) / SR

def note(f):
    return 440.0 * 2 ** ((f - 69) / 12)

# Am9 – Fmaj7 – Cmaj7 – G6, 7 s each, looping
chords = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 69], [48, 55, 59, 64, 67], [55, 59, 62, 64, 71]]
seg = 7.0
mix = np.zeros_like(t)
rng = np.random.default_rng(7)
for i in range(int(np.ceil(DUR / seg)) + 1):
    start = i * seg - 1.5  # overlap for smooth crossfades
    ch = chords[i % len(chords)]
    idx = (t >= start) & (t < start + seg + 3.0)
    tt = t[idx] - start
    env = np.clip(tt / 2.5, 0, 1) * np.clip((seg + 3.0 - tt) / 2.5, 0, 1)
    env = env ** 1.5
    for m in ch:
        f = note(m)
        for det in (-0.12, 0.12):
            ph = rng.uniform(0, 2 * np.pi)
            fd = f * 2 ** (det / 12)
            mix[idx] += env * (np.sin(2 * np.pi * fd * tt + ph) + 0.18 * np.sin(4 * np.pi * fd * tt + ph))
    # soft bass
    mix[idx] += 0.8 * env * np.sin(2 * np.pi * note(ch[0] - 12) * tt)

# gentle shimmer + slow tremolo
mix += 0.12 * np.sin(2 * np.pi * note(88) * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t)) * np.sin(2 * np.pi * 0.37 * t) ** 2

# simple feedback-delay "reverb"
wet = mix.copy()
for d, g in [(0.113, 0.45), (0.271, 0.35), (0.397, 0.28), (0.541, 0.2)]:
    n = int(d * SR)
    wet[n:] += g * mix[:-n]
mix = 0.6 * mix + 0.4 * wet

# one-pole low-pass for warmth
a = np.exp(-2 * np.pi * 1800 / SR)
y = np.empty_like(mix)
acc = 0.0
for i, x in enumerate(mix):
    acc = (1 - a) * x + a * acc
    y[i] = acc

fade = int(2.5 * SR)
y[:fade] *= np.linspace(0, 1, fade)
y[-fade:] *= np.linspace(1, 0, fade)
y = y / np.max(np.abs(y)) * 0.5  # peak −6 dBFS; final level set in the video mix
sf.write(out, np.stack([y, y], axis=1).astype(np.float32), SR)
print('wrote', out, DUR, 's')

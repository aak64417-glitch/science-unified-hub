"""Arabic male narration with Piper (voice: ar_JO-kareem-medium) + per-word timings.

Usage: python3 synth.py <model_dir> <lines.json> <out_dir> [length_scale] [max_pause]
Noise scale can be set with the NOISE environment variable (default 0.55).

Fixes applied on top of the raw espeak-ng phonemes:
  * our own full diacritics are kept (Piper's automatic tashkeel is disabled);
  * hamzat al-wasl: the glottal stop espeak adds before mid-sentence "ال"/"ا" is dropped;
  * tripled consonants (shadda + sun-letter assimilation) are collapsed to a double.
Long pauses are capped to keep the pace natural; word start times follow those edits.
"""
import itertools
import json
import os
import re
import sys

import numpy as np
import soundfile as sf
from piper import PiperVoice, SynthesisConfig
from piper.phoneme_ids import BOS, EOS, PAD

model_dir, lines_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
length = float(sys.argv[4]) if len(sys.argv) > 4 else 0.62
cap = float(sys.argv[5]) if len(sys.argv) > 5 else 0.2
noise = float(os.environ.get('NOISE', '0.55'))

voice = PiperVoice.load(os.path.join(model_dir, 'ar_JO-kareem-medium.onnx'), include_alignments=True)
voice.use_tashkeel = False
cfg = SynthesisConfig(length_scale=length, noise_scale=noise, noise_w_scale=0.7)
idmap = voice.config.phoneme_id_map
sr = voice.config.sample_rate
WIN = 0.02


def fix_phonemes(sentences, words):
    wi = 0
    fixed = []
    for ph in sentences:
        pw = [[]]
        for p in ph:
            if p == ' ':
                pw.append([])
            else:
                pw[-1].append(p)
        for wp in pw:
            tw = words[wi] if wi < len(words) else ''
            prev = words[wi - 1] if wi > 0 else '.'
            bare = re.sub(r'[ً-ْ]', '', tw)
            if bare.startswith('ا') and wi > 0 and not re.search(r'[،,.:؛]$', prev):
                while wp and wp[0] in ('ʔ', 'ˈ', 'ˌ'):
                    wp.pop(0)
                if wp and wp[0] in ('a', 'i', 'u'):
                    wp.pop(0)
            wi += 1
        flat = list(itertools.chain.from_iterable(w + [' '] for w in pw))[:-1]
        clean = []
        for p in flat:
            if len(clean) >= 2 and p == clean[-1] == clean[-2] and p not in 'aiuː ':
                continue
            clean.append(p)
        fixed.append(clean)
    return fixed


def synth_line(text):
    words = text.split()
    chunks, word_times, t0 = [], [], 0.0
    for ph in fix_phonemes(voice.phonemize(text), words):
        ids = list(idmap[BOS]) + list(idmap[PAD])
        owner = [None] * len(ids)
        for i, p in enumerate(ph):
            if p not in idmap:
                continue
            add = list(idmap[p]) + list(idmap[PAD])
            ids += add
            owner += [i] * len(add)
        ids += list(idmap[EOS])
        owner += [None] * len(idmap[EOS])
        audio, samples = voice.phoneme_ids_to_audio(ids, cfg, include_alignments=True)
        cum = np.concatenate([[0], np.cumsum(samples)])
        for s in [0] + [i + 1 for i, p in enumerate(ph) if p == ' ']:
            j = owner.index(s) if s in owner else 0
            word_times.append(t0 + cum[j] / sr)
        chunks.append(audio)
        t0 += len(audio) / sr
    return words, np.concatenate(chunks).astype(np.float32), word_times


def tighten(a, word_times):
    """Trim edges and cap silent runs; return audio and remapped word times."""
    win = int(sr * WIN)
    n = len(a) // win
    rms = np.sqrt(np.mean(a[: n * win].reshape(n, win) ** 2, axis=1))
    loud = rms > 10 ** (-38 / 20)
    idx = np.where(loud)[0]
    keep, run = [], 0
    for i in range(idx[0], idx[-1] + 1):
        run = 0 if loud[i] else run + 1
        if run <= int(cap / WIN):
            keep.append(i)
    keepset = set(keep)
    new_t, c = [], 0
    for i in range(n + 1):
        new_t.append(c * WIN)
        c += i in keepset
    o = np.concatenate([a[i * win:(i + 1) * win] for i in keep])
    f = int(sr * 0.01)
    o[:f] *= np.linspace(0, 1, f)
    o[-f:] *= np.linspace(1, 0, f)
    return o, [round(new_t[min(int(t / WIN), n)], 2) for t in word_times]


os.makedirs(out, exist_ok=True)
timing = {}
for key, text in json.load(open(lines_path)):
    words, audio, wt = synth_line(text)
    audio, wt = tighten(audio, wt)
    sf.write(os.path.join(out, f'{key}.wav'), audio, sr)
    timing[key] = {'duration': round(len(audio) / sr, 2), 'words': [[w, t] for w, t in zip(words, wt)]}
json.dump(timing, open(os.path.join(out, 'timing.json'), 'w'), ensure_ascii=False, indent=1)
print({k: v['duration'] for k, v in timing.items()})

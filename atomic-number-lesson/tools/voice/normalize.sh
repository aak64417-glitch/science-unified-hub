#!/usr/bin/env bash
# توحيد مستوى صوت مقاطع التعليق (−16 LUFS) دون تغيير مددها
set -euo pipefail
cd "$(dirname "$0")/../../public/voice"
for f in s*.wav; do
  ffmpeg -loglevel error -y -i "$f" -af "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=7,aresample=44100" -ar 44100 "n_$f"
  mv "n_$f" "$f"
done

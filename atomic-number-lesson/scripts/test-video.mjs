// اختبار الفيديو النهائي: الجدول الزمني، صيغة MP4، وجود الصوت AAC وسماعه، وثبات النصوص
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';

const VIDEO = path.resolve(process.argv[2] ?? 'out/atomic-number-lesson.mp4');
const remotion = path.resolve('node_modules/.bin/remotion');
// ffmpeg النظام إن وُجد (نسخة Remotion المضمّنة لا تدعم المخرجات الخام)
const SYSTEM_FFMPEG = ['/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/opt/homebrew/bin/ffmpeg'].find(existsSync);
const ff = (args) =>
  SYSTEM_FFMPEG
    ? execFileSync(SYSTEM_FFMPEG, args, {maxBuffer: 1 << 28})
    : execFileSync(remotion, ['ffmpeg', ...args], {maxBuffer: 1 << 28});
const probe = (args) => execFileSync(remotion, ['ffprobe', ...args]).toString();

let passed = 0;
const ok = async (name, fn) => {
  await fn();
  passed++;
  console.log('✔', name);
};

// تحميل الجدول الزمني من الكود المصدري نفسه
const bundled = await build({
  entryPoints: ['src/timeline.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  external: ['remotion'],
});
const tl = await import(
  'data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64')
);
const {SCENES, LINES, FPS, DURATION_IN_FRAMES} = tl;

// ---------- 1) الجدول الزمني ----------
await ok('المدة بين 45 و55 ثانية', () => {
  const s = DURATION_IN_FRAMES / FPS;
  assert.ok(s >= 45 && s <= 55, `duration ${s}`);
});
await ok('خمسة مشاهد متتالية بلا فجوات', () => {
  assert.equal(SCENES.length, 5);
  for (let i = 1; i < SCENES.length; i++) assert.equal(SCENES[i].start, SCENES[i - 1].end);
  assert.equal(SCENES.at(-1).end, DURATION_IN_FRAMES);
});
await ok('كل جملة صوتية داخل مشهدها ولا تتداخل الجمل', () => {
  const owner = {s1: 'intro', s2: 'atomic', s3: 'mass', s4: 'neutrons', s5: 'summary'};
  for (const l of LINES) {
    const sc = SCENES.find((s) => s.id === owner[l.id.slice(0, 2)]);
    assert.ok(l.start >= sc.start && l.start + l.durationInFrames <= sc.end, l.id);
  }
  for (let i = 1; i < LINES.length; i++) {
    assert.ok(LINES[i].start >= LINES[i - 1].start + LINES[i - 1].durationInFrames, LINES[i].id);
  }
});

// ---------- 2) ملف MP4 ----------
assert.ok(existsSync(VIDEO), `missing ${VIDEO} — run npm run render first`);
const info = JSON.parse(probe(['-v', 'error', '-show_streams', '-show_format', '-of', 'json', VIDEO]));
const v = info.streams.find((s) => s.codec_type === 'video');
const a = info.streams.find((s) => s.codec_type === 'audio');

await ok('فيديو H.264 بدقة 1920×1080 (16:9) و30 إطاراً/ث', () => {
  assert.equal(v.codec_name, 'h264');
  assert.equal(v.width, 1920);
  assert.equal(v.height, 1080);
  assert.equal(v.r_frame_rate, '30/1');
});
await ok('مسار صوتي AAC موجود', () => {
  assert.ok(a, 'no audio stream');
  assert.equal(a.codec_name, 'aac');
});
await ok('مدة الملف تطابق الجدول الزمني', () => {
  const d = Number(info.format.duration);
  assert.ok(Math.abs(d - DURATION_IN_FRAMES / FPS) < 0.2, `file ${d}s`);
});

// ---------- 3) الصوت مسموع فعلاً في كل جملة ----------
const SR = 8000;
const pcm = ff(['-v', 'error', '-i', VIDEO, '-ac', '1', '-ar', String(SR), '-f', 's16le', '-']);
const samples = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length / 2);
const rmsDb = (t0, t1) => {
  let sum = 0;
  const i0 = Math.floor(t0 * SR);
  const i1 = Math.min(samples.length, Math.floor(t1 * SR));
  for (let i = i0; i < i1; i++) sum += (samples[i] / 32768) ** 2;
  return 10 * Math.log10(sum / Math.max(1, i1 - i0) + 1e-12);
};
const levels = LINES.map((l) => ({
  id: l.id,
  db: rmsDb(l.start / FPS, (l.start + l.durationInFrames) / FPS),
}));
const musicOnly = rmsDb(DURATION_IN_FRAMES / FPS - 1.9, DURATION_IN_FRAMES / FPS - 1.2);
console.log('   مستوى الصوت (dBFS):', levels.map((l) => `${l.id}=${l.db.toFixed(1)}`).join(' '),
  `| موسيقى فقط=${musicOnly.toFixed(1)}`);

await ok('التعليق الصوتي مسموع في جميع الجمل العشر', () => {
  for (const l of levels) assert.ok(l.db > -30, `${l.id} too quiet: ${l.db}`);
});
await ok('الموسيقى موجودة لكنها منخفضة جداً (أقل من الصوت بـ 15 dB على الأقل)', () => {
  const voice = Math.min(...levels.map((l) => l.db));
  assert.ok(musicOnly > -75, `music missing: ${musicOnly}`);
  assert.ok(voice - musicOnly >= 15, `music too loud: ${musicOnly} vs ${voice}`);
});

// ---------- 4) ثبات النصوص أثناء الشرح ----------
// إطاران من المشهد الأخير بعد ظهور كل النصوص: منطقة بطاقة النتائج يجب أن تبقى كما هي
const grab = (sec) =>
  ff(['-v', 'error', '-ss', String(sec), '-i', VIDEO, '-frames:v', '1',
    '-vf', 'crop=760:740:1100:50,format=gray', '-f', 'rawvideo', '-']);
const summary = SCENES.at(-1);
const tA = (summary.end - 50) / FPS;
const tB = (summary.end - 26) / FPS;
const fa = grab(tA);
const fb = grab(tB);
let diff = 0;
for (let i = 0; i < fa.length; i++) diff += Math.abs(fa[i] - fb[i]) > 24 ? 1 : 0;
await ok('نصوص بطاقة النتائج ثابتة لا تتغير', () => {
  assert.ok(diff / fa.length < 0.003, `changed ${(100 * diff / fa.length).toFixed(2)}%`);
});

// الحركة مستمرة: منطقة الذرة تتغير بين الإطارين نفسيهما
const atom = (sec) =>
  ff(['-v', 'error', '-ss', String(sec), '-i', VIDEO, '-frames:v', '1',
    '-vf', 'crop=900:800:60:100,format=gray', '-f', 'rawvideo', '-']);
const xa = atom(tA);
const xb = atom(tB);
let moved = 0;
for (let i = 0; i < xa.length; i++) moved += Math.abs(xa[i] - xb[i]) > 24 ? 1 : 0;
await ok('الذرة ثلاثية الأبعاد تتحرك', () => assert.ok(moved > 2000, `moved ${moved}`));

writeFileSync('out/line-spans.json', JSON.stringify(LINES.map((l) => [l.id, l.start / FPS, (l.start + l.durationInFrames) / FPS])));
console.log(`\nنجحت جميع الاختبارات (${passed})`);

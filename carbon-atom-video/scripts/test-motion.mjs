// اختبار الحركة: (1) فحص رياضي للدوال  (2) تصيير إطارات ومقارنة البكسلات
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {
  DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT, SHELLS, electronPosition, nucleonsAt,
} from '../src/motion.ts';

const require = createRequire(import.meta.url);
let passed = 0;
const ok = (name, fn) => { fn(); passed++; console.log('✔', name); };

// ---------- 1) فحوص رياضية ----------
ok('المدة 10 ثوانٍ بدقة 1920×1080', () => {
  assert.equal(DURATION_IN_FRAMES / FPS, 10);
  assert.equal(WIDTH, 1920);
  assert.equal(HEIGHT, 1080);
});
ok('6 إلكترونات موزعة 2 ثم 4', () => {
  assert.deepEqual(SHELLS.map((s) => s.electrons), [2, 4]);
});
ok('الإلكترونات تتحرك بين الإطارات', () => {
  for (const s of SHELLS) for (let i = 0; i < s.electrons; i++) {
    const a = electronPosition(s, i, 0), b = electronPosition(s, i, 10);
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y) > 5);
  }
});
ok('الحركة دائرية متصلة (الإطار الأخير يلتقي بالأول)', () => {
  for (const s of SHELLS) {
    const a = electronPosition(s, 0, 0), b = electronPosition(s, 0, DURATION_IN_FRAMES);
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 1e-6);
  }
});
ok('النواة تحوي 12 جسيماً (6 بروتونات + 6 نيوترونات) وتدور', () => {
  const n0 = nucleonsAt(0), n1 = nucleonsAt(15);
  assert.equal(n0.length, 12);
  assert.equal(n0.filter((n) => n.kind === 'proton').length, 6);
  const sig = (l) => l.map((n) => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).sort().join('|');
  assert.notEqual(sig(n0), sig(n1));
});

// ---------- 2) فحص بصري بتصيير إطارات فعلية ----------
const LOCAL_SHELL = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable =
  process.env.REMOTION_BROWSER ?? (existsSync(LOCAL_SHELL) ? LOCAL_SHELL : null);
console.log('… تجميع المشروع وتصيير إطارات الاختبار');
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'CarbonAtom', browserExecutable});
const frames = [45, 90, 200];
const files = [];
for (const f of frames) {
  const output = path.resolve(`out/test-frame-${f}.png`);
  await renderStill({composition, serveUrl, frame: f, output, imageFormat: 'png', browserExecutable});
  files.push(readFileSync(output).toString('base64'));
}

// فك ترميز PNG ومقارنة المناطق داخل المتصفح
const {chromium} = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
const diff = await page.evaluate(async (imgs) => {
  const load = (b64) => new Promise((res) => {
    const im = new Image(); im.onload = () => res(im); im.src = 'data:image/png;base64,' + b64;
  });
  const data = [];
  for (const b of imgs) {
    const im = await load(b);
    const c = document.createElement('canvas'); c.width = 1920; c.height = 1080;
    const ctx = c.getContext('2d'); ctx.drawImage(im, 0, 0);
    data.push(ctx.getImageData(0, 0, 1920, 1080).data);
  }
  const region = (a, b, x0, y0, x1, y1) => {
    let changed = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (y * 1920 + x) * 4;
      if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 30) changed++;
    }
    return changed;
  };
  // منطقة الذرة: x 240..1120 ، منطقة النصوص: x 1180..1840 (اللوحة والعنوان)
  return {
    atom01: region(data[0], data[1], 240, 300, 1120, 820),
    atom12: region(data[1], data[2], 240, 300, 1120, 820),
    text01: region(data[0], data[1], 1180, 60, 1840, 1050),
    text12: region(data[1], data[2], 1180, 60, 1840, 1050),
    // عرض العنوان: بكسلات بيضاء في سطر العنوان تؤكد تحميل الخط
    titleInk: (() => { let n = 0; const d = data[0];
      for (let y = 90; y < 200; y++) for (let x = 1100; x < 1840; x++) {
        const i = (y * 1920 + x) * 4; if (d[i] > 230 && d[i + 1] > 230 && d[i + 2] > 230) n++; }
      return n; })(),
  };
}, files);
await browser.close();
console.log('   نتائج المقارنة:', diff);

ok('الذرة تتحرك فعلياً في الفيديو المصيَّر', () => {
  assert.ok(diff.atom01 > 2000 && diff.atom12 > 2000);
});
ok('النصوص (العدد الذري والكتلي) ثابتة تماماً', () => {
  assert.equal(diff.text01, 0);
  assert.equal(diff.text12, 0);
});
ok('العنوان العربي مرسوم', () => assert.ok(diff.titleInk > 5000));

console.log(`\nنجحت جميع الاختبارات (${passed})`);

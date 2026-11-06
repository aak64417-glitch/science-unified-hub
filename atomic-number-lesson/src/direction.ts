// «الإخراج»: مسار الكاميرا وحالة الذرة في كل إطار (دوال نقية)
import {Easing, interpolate} from 'remotion';
import {Euler, PerspectiveCamera, Vector3} from 'three';
import {CUES, FPS, HEIGHT, WIDTH, scene} from './timeline';

export const FOV = 40;

type Vec = [number, number, number];
type Key = {f: number; pos: Vec; look: Vec};

const s1 = scene('intro');
const s2 = scene('atomic');
const s3 = scene('mass');
const s4 = scene('neutrons');
const s5 = scene('summary');

// لقطات الكاميرا: النواة في المركز (0,0,0)
const KEYS: Key[] = [
  {f: s1.start, pos: [0, 2.6, 23], look: [0, 2.3, 0]},
  {f: s1.end - 6, pos: [0.4, 2.2, 21], look: [0, 2.0, 0]},
  // المشهد 2: اقتراب سينمائي من النواة (النواة يسار الشاشة، النصوص يمينها)
  {f: s2.start + 70, pos: [1.75, 0.4, 7.2], look: [1.75, 0.2, 0]},
  {f: s2.end - 6, pos: [1.65, 0.3, 6.9], look: [1.7, 0.15, 0]},
  // المشهد 3: لقطة متوسطة للنواة
  {f: s3.start + 40, pos: [2.25, 0.9, 8.6], look: [2.25, 0.55, 0]},
  {f: s3.end - 6, pos: [2.1, 0.8, 8.3], look: [2.2, 0.5, 0]},
  // المشهد 4: ابتعاد لإظهار مستويات الطاقة (نموذج بور)
  {f: s4.start + 45, pos: [5.0, 2.0, 18.5], look: [5.0, -0.2, 0]},
  {f: s4.end - 6, pos: [4.9, 1.8, 18], look: [4.95, -0.2, 0]},
  // المشهد 5: الملخص
  {f: s5.start + 40, pos: [5.2, 1.8, 19.5], look: [5.0, -1.3, 0]},
  {f: s5.end, pos: [4.8, 1.4, 18.6], look: [4.9, -1.3, 0]},
];

const ease = Easing.bezier(0.45, 0, 0.25, 1);

const lerpVec = (a: Vec, b: Vec, t: number): Vec => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export const cameraAt = (frame: number): {pos: Vec; look: Vec} => {
  if (frame <= KEYS[0].f) return KEYS[0];
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (frame <= b.f) {
      const t = ease((frame - a.f) / Math.max(1, b.f - a.f));
      return {pos: lerpVec(a.pos, b.pos, t), look: lerpVec(a.look, b.look, t)};
    }
  }
  return KEYS[KEYS.length - 1];
};

// إسقاط نقطة ثلاثية الأبعاد على الشاشة (لربط الرسوم ثنائية الأبعاد بالنواة)
const projCam = new PerspectiveCamera(FOV, WIDTH / HEIGHT, 0.1, 300);
export const project = (frame: number, p: Vec): {x: number; y: number} => {
  const c = cameraAt(frame);
  projCam.position.set(...c.pos);
  projCam.lookAt(new Vector3(...c.look));
  projCam.updateMatrixWorld();
  projCam.updateProjectionMatrix();
  const v = new Vector3(...p).project(projCam);
  return {x: ((v.x + 1) / 2) * WIDTH, y: ((1 - v.y) / 2) * HEIGHT};
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ramp = (frame: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(frame, [from, to], [a, b], {...clamp, easing: ease});

// ---------------- تركيب الذرة: الكربون-12 ----------------
export const PROTONS = 6;
export const NEUTRONS = 6;
export const SHELLS = [
  {radius: 2.7, electrons: 2, speed: 0.55},
  {radius: 4.7, electrons: 4, speed: 0.32},
];
export const ORBIT_TILT = 1.12; // ميل مستوى المدارات (راديان)

export const NUCLEON_RADIUS = 0.42;

// مواقع 12 جسيماً في عنقود متراص؛ البروتونات والنيوترونات متناوبة
export const NUCLEONS: {kind: 'p' | 'n'; pos: Vec}[] = (() => {
  const n = PROTONS + NEUTRONS;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: {kind: 'p' | 'n'; pos: Vec}[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    out.push({
      kind: i % 2 === 0 ? 'p' : 'n',
      pos: [Math.cos(th) * r * 0.62, y * 0.62, Math.sin(th) * r * 0.62],
    });
  }
  return out;
})();

export type AtomState = {
  spread: number; // تباعد جسيمات النواة
  spin: number; // زاوية دوران النواة
  neutronOpacity: number;
  protonLabels: number; // عدد البروتونات المرقّمة (0..6)
  orbitOpacity: number;
  electronsVisible: number; // عدد الإلكترونات الظاهرة (0..6)
  electronScale: (index: number) => number;
  nucleusGlow: number;
};

// لحظات ظهور كل إلكترون في المشهد 4 (اثنان في المستوى الأول ثم أربعة)
export const ELECTRON_POP = [
  CUES.electronsShell1,
  CUES.electronsShell1 + 7,
  CUES.electronsShell2,
  CUES.electronsShell2 + 6,
  CUES.electronsShell2 + 12,
  CUES.electronsShell2 + 18,
];

// سرعة دوران النواة (راديان/ثانية): أبطأ أثناء ترقيم البروتونات
const spinSpeedAt = (frame: number) => {
  const slow = ramp(frame, s2.start + 40, s2.start + 80) - ramp(frame, s3.start, s3.start + 30);
  return 0.35 - 0.29 * slow;
};

// زاوية الدوران = تكامل السرعة، فلا قفزات عند تغيّرها
const SPIN_TABLE: number[] = [0];
export const spinAt = (frame: number): number => {
  const f = Math.max(0, Math.floor(frame));
  for (let i = SPIN_TABLE.length; i <= f; i++) {
    SPIN_TABLE[i] = SPIN_TABLE[i - 1] + spinSpeedAt(i - 1) / FPS;
  }
  return SPIN_TABLE[f];
};

export const atomState = (frame: number): AtomState => {
  const spinAngle = spinAt(frame);

  const spread =
    1 +
    0.1 * (ramp(frame, s2.start + 30, s2.start + 75) - ramp(frame, s3.start, s3.start + 40)) +
    0.2 * (ramp(frame, s3.start, s3.start + 40) - ramp(frame, s4.start, s4.start + 40));

  const neutronOpacity =
    1 - 0.78 * (ramp(frame, CUES.atomicRule - 6, CUES.atomicRule + 12) - ramp(frame, s3.start, s3.start + 25));

  // ترقيم البروتونات 1..6 كل 0.4 ثانية تقريباً
  const labelStep = 11;
  const protonLabels =
    frame < s2.start || frame >= s3.start + 15
      ? 0
      : Math.max(0, Math.min(PROTONS, Math.floor((frame - CUES.protonCountStart) / labelStep) + 1));

  // المدارات: ظاهرة في المقدمة، تختفي عند الاقتراب، تعود في المشهد 4
  const orbitOpacity =
    1 - ramp(frame, s2.start, s2.start + 35) + ramp(frame, CUES.electronsStart - 10, CUES.electronsStart + 15);

  const electronsVisible =
    frame < s2.start + 35 ? PROTONS : frame < s4.start ? 0 : ELECTRON_POP.filter((f) => frame >= f).length;

  const electronScale = (i: number) => {
    if (frame < s2.start + 40) return 1 - ramp(frame, s2.start + 5, s2.start + 35);
    if (frame < s4.start) return 0;
    return interpolate(frame, [ELECTRON_POP[i], ELECTRON_POP[i] + 8], [0, 1], {
      ...clamp,
      easing: Easing.out(Easing.back(2.2)),
    });
  };

  const nucleusGlow = 0.55 + 0.15 * Math.sin((frame / FPS) * Math.PI * 0.9);

  return {
    spread,
    spin: spinAngle,
    neutronOpacity,
    protonLabels,
    orbitOpacity,
    electronsVisible,
    electronScale,
    nucleusGlow,
  };
};

// موضع الإلكترون i في الإطار frame (في مستوى المدارات قبل الميل)
export const electronLocal = (frame: number, i: number): Vec => {
  const shellIndex = i < 2 ? 0 : 1;
  const shell = SHELLS[shellIndex];
  const k = shellIndex === 0 ? i : i - 2;
  const a = (k / shell.electrons) * Math.PI * 2 + (frame / FPS) * shell.speed * Math.PI;
  return [Math.cos(a) * shell.radius, 0, Math.sin(a) * shell.radius];
};

// ميل النواة الثابت حول المحور X حتى يظهر عمقها
const NUCLEUS_TILT = 0.35;
export const ORBIT_ROTATION: Vec = [ORBIT_TILT, 0, -0.18];

// ترتيب «العرض المفكك» في المشهد 2: البروتونات على حلقة أمام الكاميرا والنيوترونات خلفها
const displayPos = (frame: number, i: number): Vec => {
  const isP = NUCLEONS[i].kind === 'p';
  const k = Math.floor(i / 2);
  const sway = Math.sin((frame / FPS) * 0.8) * 0.12;
  const a = (k / 6) * Math.PI * 2 + (isP ? 0 : Math.PI / 6) + Math.PI / 2 + sway;
  const r = isP ? 1.05 : 0.72;
  return [Math.cos(a) * r, Math.sin(a) * r, isP ? 0.35 : -0.5];
};

export const displayAmount = (frame: number) =>
  ramp(frame, s2.start + 25, s2.start + 75) - ramp(frame, s3.start, s3.start + 40);

// موضع الجسيم i من النواة في فضاء المشهد
export const nucleonWorld = (frame: number, i: number): Vec => {
  const {spread, spin} = atomState(frame);
  const [x, y, z] = NUCLEONS[i].pos.map((c) => c * spread) as Vec;
  const x1 = x * Math.cos(spin) + z * Math.sin(spin);
  const z1 = -x * Math.sin(spin) + z * Math.cos(spin);
  const y2 = y * Math.cos(NUCLEUS_TILT) - z1 * Math.sin(NUCLEUS_TILT);
  const z2 = y * Math.sin(NUCLEUS_TILT) + z1 * Math.cos(NUCLEUS_TILT);
  const d = displayAmount(frame);
  if (d <= 0) return [x1, y2, z2];
  const q = displayPos(frame, i);
  return [x1 + (q[0] - x1) * d, y2 + (q[1] - y2) * d, z2 + (q[2] - z2) * d];
};

// تحويل نقطة من مستوى المدارات إلى فضاء المشهد (نفس دوران مجموعة المدارات)
const orbitEuler = new Euler(...ORBIT_ROTATION);
export const orbitWorld = (p: Vec): Vec => {
  const v = new Vector3(...p).applyEuler(orbitEuler);
  return [v.x, v.y, v.z];
};

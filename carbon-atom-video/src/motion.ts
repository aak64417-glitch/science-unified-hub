// حسابات الحركة (دوال نقية بلا React حتى يمكن اختبارها مباشرة بـ Node)

export const FPS = 30;
export const DURATION_IN_FRAMES = 300; // 10 ثوانٍ
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const ATOM_CENTER = {x: 680, y: 560};

// ذرة الكربون: 6 بروتونات + 6 نيوترونات، والإلكترونات 2 في K و4 في L
export const PROTONS = 6;
export const NEUTRONS = 6;

export type Shell = {
  name: string;
  electrons: number;
  rx: number;
  ry: number;
  tilt: number; // بالدرجات
  turnsPerVideo: number; // عدد الدورات الكاملة خلال الفيديو
};

export const SHELLS: Shell[] = [
  {name: 'K', electrons: 2, rx: 215, ry: 80, tilt: -28, turnsPerVideo: 5},
  {name: 'L', electrons: 4, rx: 390, ry: 150, tilt: 22, turnsPerVideo: 3},
];

export type Point = {x: number; y: number; depth: number};

// موضع الإلكترون رقم index في المدار shell عند الإطار frame (نسبةً لمركز الذرة)
export const electronPosition = (
  shell: Shell,
  index: number,
  frame: number,
): Point => {
  const progress = frame / DURATION_IN_FRAMES;
  const angle =
    (index / shell.electrons) * Math.PI * 2 +
    progress * shell.turnsPerVideo * Math.PI * 2;
  const ex = shell.rx * Math.cos(angle);
  const ey = shell.ry * Math.sin(angle);
  const t = (shell.tilt * Math.PI) / 180;
  return {
    x: ex * Math.cos(t) - ey * Math.sin(t),
    y: ex * Math.sin(t) + ey * Math.cos(t),
    // النصف السفلي من الإهليلج "أمام" النواة، والعلوي خلفها
    depth: Math.sin(angle),
  };
};

export type Nucleon = {
  kind: 'proton' | 'neutron';
  x: number;
  y: number;
  z: number;
};

// 12 نقطة موزعة على كرة (توزيع فيبوناتشي) تتناوب بين بروتون ونيوترون
const BASE_NUCLEONS: Nucleon[] = (() => {
  const n = PROTONS + NEUTRONS;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const list: Nucleon[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    list.push({
      kind: i % 2 === 0 ? 'proton' : 'neutron',
      x: Math.cos(th) * r,
      y,
      z: Math.sin(th) * r,
    });
  }
  return list;
})();

export const NUCLEUS_RADIUS = 52;

// النواة تدور ببطء حول محورين وتنبض نبضاً خفيفاً؛ النتيجة مرتبة من الخلف للأمام
export const nucleonsAt = (frame: number) => {
  const time = frame / FPS;
  const a = time * 0.9; // حول المحور الرأسي
  const b = 0.35 + Math.sin(time * 0.6) * 0.25; // ميل متذبذب
  const pulse = 1 + Math.sin(time * Math.PI * 1.2) * 0.05;
  return BASE_NUCLEONS.map((p, i) => {
    const x1 = p.x * Math.cos(a) + p.z * Math.sin(a);
    const z1 = -p.x * Math.sin(a) + p.z * Math.cos(a);
    const y2 = p.y * Math.cos(b) - z1 * Math.sin(b);
    const z2 = p.y * Math.sin(b) + z1 * Math.cos(b);
    const jitter = Math.sin(time * 6 + i * 1.7) * 2;
    return {
      kind: p.kind,
      x: x1 * NUCLEUS_RADIUS * pulse + jitter,
      y: y2 * NUCLEUS_RADIUS * pulse - jitter * 0.6,
      z: z2,
    };
  }).sort((m, n) => m.z - n.z);
};

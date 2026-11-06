// الجدول الزمني: يُبنى من مدد مقاطع التعليق الصوتي وتوقيت كل كلمة فيها
// (voice-timing.json يُولَّد من أداة التعليق الصوتي tools/voice/synth.py)
import timing from './voice-timing.json';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type LineId = keyof typeof timing;

type ScenePlan = {
  id: 'intro' | 'atomic' | 'mass' | 'neutrons' | 'summary';
  lead: number; // ثوانٍ قبل أول جملة
  lines: LineId[];
  gaps: number[]; // فواصل بين الجمل
  tail: number; // ثوانٍ بعد آخر جملة
};

const PLAN: ScenePlan[] = [
  {id: 'intro', lead: 0.8, lines: ['s1a'], gaps: [], tail: 0.5},
  {id: 'atomic', lead: 0.7, lines: ['s2a', 's2b'], gaps: [0.4], tail: 0.6},
  {id: 'mass', lead: 0.6, lines: ['s3a', 's3b', 's3c'], gaps: [0.35, 0.35], tail: 0.5},
  {id: 'neutrons', lead: 0.6, lines: ['s4a', 's4b', 's4c'], gaps: [0.4, 0.45], tail: 0.5},
  {id: 'summary', lead: 0.6, lines: ['s5a'], gaps: [], tail: 2.0},
];

export type SceneId = ScenePlan['id'];

export type Scene = {id: SceneId; start: number; end: number}; // بالإطارات
export type LinePlacement = {id: LineId; start: number; durationInFrames: number};

const sec = (s: number) => Math.round(s * FPS);

const build = () => {
  const scenes: Scene[] = [];
  const lines: LinePlacement[] = [];
  let t = 0;
  for (const p of PLAN) {
    const sceneStart = t;
    t += p.lead;
    p.lines.forEach((id, i) => {
      const d = timing[id].duration;
      lines.push({id, start: sec(t), durationInFrames: Math.ceil(d * FPS) + 1});
      t += d + (p.gaps[i] ?? 0);
    });
    t += p.tail;
    scenes.push({id: p.id, start: sec(sceneStart), end: sec(t)});
  }
  return {scenes, lines, total: sec(t)};
};

const built = build();
export const SCENES = built.scenes;
export const LINES = built.lines;
export const DURATION_IN_FRAMES = built.total;

export const scene = (id: SceneId): Scene => SCENES.find((s) => s.id === id)!;

// إطار بداية الكلمة رقم wordIndex في الجملة line (مطابق لنطق التعليق الصوتي)
export const wordAt = (line: LineId, wordIndex: number): number => {
  const placement = LINES.find((l) => l.id === line)!;
  const words = timing[line].words as [string, number][];
  const w = words[Math.min(wordIndex, words.length - 1)];
  return placement.start + sec(w[1]);
};

export const lineStart = (line: LineId) => LINES.find((l) => l.id === line)!.start;
export const lineEnd = (line: LineId) => {
  const l = LINES.find((x) => x.id === line)!;
  return l.start + l.durationInFrames;
};

// لحظات التزامن الرئيسية (كل الرسوم والنصوص تعتمد عليها)
export const CUES = {
  title: scene('intro').start + 8,

  atomicRule: wordAt('s2a', 0), // «العدد الذري يساوي عدد البروتونات»
  protonCountStart: wordAt('s2a', 4), // «البروتونات» → ترقيم البروتونات
  atomicValue: wordAt('s2b', 11), // «يساوي ستة»

  massRule: wordAt('s3a', 0), // «لحساب العدد الكتلي»
  protonsFly: wordAt('s3b', 0), // «ستة بروتونات»
  neutronsFly: wordAt('s3b', 3), // «ستة نيوترونات»
  massEquals: wordAt('s3b', 5), // «يساوي اثني عشر»
  massResult: wordAt('s3c', 0), // «إذن العدد الكتلي...»

  neutronRule: wordAt('s4a', 0), // «ولحساب النيوترونات»
  subtract12: wordAt('s4b', 0), // «اثنا عشر»
  subtract6: wordAt('s4b', 2), // «ناقص ستة»
  subtractEquals: wordAt('s4b', 4), // «يساوي ستة»
  electronsStart: wordAt('s4c', 0), // «أما الإلكترونات»
  electronsShell1: wordAt('s4c', 1),
  electronsShell2: wordAt('s4c', 4), // «المتعادلة»
  electronsValue: wordAt('s4c', 9), // «أي ستة إلكترونات»

  summaryCard: scene('summary').start + 6,
  rule1: wordAt('s5a', 2), // «العدد الذري يساوي...»
  rule2: wordAt('s5a', 7), // «والعدد الكتلي يساوي...»
};

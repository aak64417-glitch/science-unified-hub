// النصوص العربية والرسوم ثنائية الأبعاد فوق المشهد ثلاثي الأبعاد.
// كل نص يظهر بتلاشٍ هادئ عند لحظته في التعليق الصوتي ثم يبقى ثابتاً دون أي تغيير.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {
  NUCLEONS,
  SHELLS,
  nucleonWorld,
  orbitWorld,
  project,
} from './direction';
import {COLORS, FONT} from './theme';
import {CUES, SceneId, scene} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FADE = 10;

// طبقة المشهد: تظهر وتختفي بهدوء عند حدود المشهد
const SceneLayer: React.FC<{id: SceneId; children: React.ReactNode}> = ({id, children}) => {
  const frame = useCurrentFrame();
  const s = scene(id);
  if (frame < s.start || frame >= s.end) return null;
  const opacity = interpolate(frame, [s.start, s.start + 12, s.end - 14, s.end], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity, fontFamily: FONT, direction: 'rtl'}}>{children}</AbsoluteFill>;
};

// يظهر عند الإطار at بتلاشٍ فقط (بلا حركة ولا تغيير في الكتابة)
const Show: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  at,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at, at + FADE], [0, 1], clamp);
  if (opacity <= 0) return null;
  return <div style={{opacity, ...style}}>{children}</div>;
};

const textShadow = '0 4px 18px rgba(0,0,0,0.55)';

const Panel: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div
    style={{
      background: COLORS.panel,
      backdropFilter: 'blur(6px)',
      border: `2px solid ${COLORS.panelBorder}`,
      borderRadius: 30,
      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      ...style,
    }}
  >
    {children}
  </div>
);

// رمز الطرح: شريط مرسوم بدل محرف قد لا يتوفر في الخط
const Minus: React.FC<{size: number; color?: string}> = ({size, color = COLORS.text}) => (
  <div style={{width: size * 0.5, height: size * 0.11, background: color, borderRadius: 6, flex: 'none'}} />
);

const Ball: React.FC<{kind: 'p' | 'n' | 'e'; size: number}> = ({kind, size}) => {
  const c = kind === 'p' ? COLORS.proton : kind === 'n' ? COLORS.neutron : COLORS.electron;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${c} 38%, rgba(0,0,0,0.55) 120%)`,
        boxShadow: `0 0 ${size * 0.4}px ${c}88`,
        flex: 'none',
      }}
    />
  );
};

// ================= المشهد 1: المقدمة =================
const IntroText: React.FC = () => (
  <SceneLayer id="intro">
    <Show at={CUES.title} style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center'}}>
      <div style={{fontSize: 40, fontWeight: 700, color: COLORS.accent, textShadow}}>
        العلوم — الصف الأول المتوسط
      </div>
      <div style={{fontSize: 92, fontWeight: 900, color: COLORS.text, textShadow, lineHeight: 1.35}}>
        كيف نحسب العدد الذري والعدد الكتلي؟
      </div>
    </Show>
    <Show
      at={CUES.title + 20}
      style={{position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center'}}
    >
      <span style={{fontSize: 48, fontWeight: 900, color: COLORS.soft, textShadow}}>ذرة الكربون</span>
    </Show>
  </SceneLayer>
);

// ================= المشهد 2: العدد الذري =================
const AtomicText: React.FC = () => (
  <SceneLayer id="atomic">
    <div style={{position: 'absolute', top: 130, right: 80, width: 900}}>
      <Show at={CUES.atomicRule}>
        <Panel style={{padding: '34px 44px'}}>
          <div style={{fontSize: 40, fontWeight: 700, color: COLORS.accent}}>القاعدة</div>
          <div style={{fontSize: 58, fontWeight: 900, color: COLORS.text, lineHeight: 1.5, whiteSpace: 'nowrap'}}>
            العدد الذري = عدد <span style={{color: COLORS.proton}}>البروتونات</span>
          </div>
        </Panel>
      </Show>
      <Show at={CUES.atomicValue} style={{marginTop: 46}}>
        <Panel
          style={{
            padding: '30px 44px',
            border: `3px solid ${COLORS.proton}`,
            display: 'flex',
            alignItems: 'center',
            gap: 34,
          }}
        >
          <span style={{fontSize: 84, fontWeight: 900, color: COLORS.text}}>العدد الذري =</span>
          <span style={{fontSize: 150, fontWeight: 900, color: COLORS.proton, lineHeight: 1}}>6</span>
        </Panel>
      </Show>
    </div>
    <Show at={CUES.protonCountStart} style={{position: 'absolute', bottom: 70, left: 120}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <Ball kind="p" size={44} />
        <span style={{fontSize: 44, fontWeight: 900, color: COLORS.text, textShadow}}>بروتون (+)</span>
        <span style={{width: 30}} />
        <Ball kind="n" size={44} />
        <span style={{fontSize: 44, fontWeight: 900, color: COLORS.soft, textShadow}}>نيوترون</span>
      </div>
    </Show>
  </SceneLayer>
);

// ================= المشهد 3: العدد الكتلي =================
// مواضع عناصر المعادلة (بالبكسل، من اليمين لليسار)
const EQ = {
  protonBox: {x: 1660, y: 520},
  plus: {x: 1490},
  neutronBox: {x: 1320, y: 520},
  equals: {x: 1160},
  result: {x: 1040},
  numbersY: 680,
};
const BOX_W = 230;
const BALL = 54;
const slot = (box: {x: number; y: number}, k: number) => ({
  x: box.x + ((k % 3) - 1) * 68,
  y: box.y + (Math.floor(k / 3) - 0.5) * 66,
});

const FlyingTokens: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene('mass');
  if (frame < CUES.protonsFly || frame >= s.end) return null;
  const tokens: React.ReactNode[] = [];
  let pi = 0;
  let ni = 0;
  NUCLEONS.forEach((n, i) => {
    const isP = n.kind === 'p';
    const k = isP ? pi++ : ni++;
    const start = (isP ? CUES.protonsFly : CUES.neutronsFly) + k * 3;
    if (frame < start) return;
    const from = project(start, nucleonWorld(start, i));
    const to = slot(isP ? EQ.protonBox : EQ.neutronBox, k);
    const t = interpolate(frame, [start, start + 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * 140; // مسار قوسي
    const size = BALL * (0.8 + 0.2 * t);
    tokens.push(
      <div key={i} style={{position: 'absolute', left: x - size / 2, top: y - size / 2}}>
        <Ball kind={isP ? 'p' : 'n'} size={size} />
      </div>,
    );
  });
  return <AbsoluteFill>{tokens}</AbsoluteFill>;
};

const centered = (x: number, y: number): React.CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  transform: 'translate(-50%, -50%)',
});

const MassText: React.FC = () => {
  const landP = CUES.protonsFly + 5 * 3 + 22;
  const landN = CUES.neutronsFly + 5 * 3 + 22;
  const box = (x: number, y: number, color: string, label: string, at: number) => (
    <Show at={at} style={{...centered(x, y - 8)}}>
      <div
        style={{
          width: BOX_W,
          height: 170,
          borderRadius: 26,
          border: `3px dashed ${color}`,
          background: 'rgba(10,20,45,0.55)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -62,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 900,
            color,
          }}
        >
          {label}
        </div>
      </div>
    </Show>
  );
  const big = (x: number, at: number, node: React.ReactNode) => (
    <Show at={at} style={{...centered(x, EQ.numbersY)}}>
      <div style={{fontSize: 120, fontWeight: 900, color: COLORS.text, lineHeight: 1, textShadow}}>{node}</div>
    </Show>
  );
  return (
    <SceneLayer id="mass">
      <Show at={CUES.massRule} style={{position: 'absolute', top: 70, right: 80, width: 1000}}>
        <Panel style={{padding: '26px 40px'}}>
          <div style={{fontSize: 56, fontWeight: 900, color: COLORS.text, lineHeight: 1.5, whiteSpace: 'nowrap'}}>
            العدد الكتلي = <span style={{color: COLORS.proton}}>البروتونات</span> +{' '}
            <span style={{color: COLORS.neutron}}>النيوترونات</span>
          </div>
        </Panel>
      </Show>

      {box(EQ.protonBox.x, EQ.protonBox.y, COLORS.proton, 'البروتونات', CUES.massRule + 8)}
      {box(EQ.neutronBox.x, EQ.neutronBox.y, COLORS.neutron, 'النيوترونات', CUES.massRule + 14)}

      {big(EQ.protonBox.x, landP, <span style={{color: COLORS.proton}}>6</span>)}
      {big(EQ.plus.x, CUES.neutronsFly - 6, '+')}
      {big(EQ.neutronBox.x, landN, <span style={{color: COLORS.neutron}}>6</span>)}
      {big(EQ.equals.x, CUES.massEquals, '=')}
      {big(EQ.result.x, CUES.massEquals + 8, <span style={{color: COLORS.accent}}>12</span>)}

      <Show at={CUES.massResult} style={{position: 'absolute', bottom: 70, right: 80, width: 1000}}>
        <Panel
          style={{
            padding: '20px 40px',
            border: `3px solid ${COLORS.accent}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <span style={{fontSize: 64, fontWeight: 900, color: COLORS.text}}>العدد الكتلي للكربون =</span>
          <span style={{fontSize: 96, fontWeight: 900, color: COLORS.accent, lineHeight: 1}}>12</span>
        </Panel>
      </Show>

      <Show at={CUES.massRule} style={{position: 'absolute', bottom: 80, left: 110}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Ball kind="p" size={40} />
            <span style={{fontSize: 40, fontWeight: 900, color: COLORS.text, textShadow}}>بروتون</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Ball kind="n" size={40} />
            <span style={{fontSize: 40, fontWeight: 900, color: COLORS.soft, textShadow}}>نيوترون</span>
          </div>
        </div>
      </Show>
      <FlyingTokens />
    </SceneLayer>
  );
};

// ================= المشهد 4: النيوترونات والإلكترونات =================
const ShellLabel: React.FC<{shell: 0 | 1; at: number; text: string}> = ({shell, at, text}) => {
  const frame = useCurrentFrame();
  const r = SHELLS[shell].radius;
  // أعلى نقطة في المدار (البعيدة عن الكاميرا)
  const p = project(frame, orbitWorld([0, 0, -r]));
  return (
    <Show at={at} style={{position: 'absolute', left: p.x, top: p.y}}>
      <div
        style={{
          transform: 'translate(-50%, -50%)',
          padding: '8px 22px',
          borderRadius: 999,
          background: 'rgba(8,30,50,0.8)',
          border: `2px solid ${COLORS.electron}`,
          fontSize: 34,
          fontWeight: 900,
          color: COLORS.text,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </Show>
  );
};

const NeutronText: React.FC = () => {
  const Y = 360;
  const item = (x: number, at: number, node: React.ReactNode) => (
    <Show at={at} style={{...centered(x, Y)}}>
      <div style={{fontSize: 120, fontWeight: 900, lineHeight: 1, color: COLORS.text, textShadow}}>{node}</div>
    </Show>
  );
  return (
    <SceneLayer id="neutrons">
      <Show at={CUES.neutronRule} style={{position: 'absolute', top: 70, right: 70, width: 960}}>
        <Panel style={{padding: '22px 34px'}}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: COLORS.text,
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{color: COLORS.neutron}}>النيوترونات</span>
            <span>=</span>
            <span>العدد الكتلي</span>
            <Minus size={50} />
            <span>العدد الذري</span>
          </div>
        </Panel>
      </Show>

      {/* 12 − 6 = 6 (تُقرأ من اليمين) */}
      {item(1700, CUES.subtract12, <span style={{color: COLORS.accent}}>12</span>)}
      <Show at={CUES.subtract6} style={{...centered(1560, Y + 6)}}>
        <Minus size={120} />
      </Show>
      {item(1440, CUES.subtract6, <span style={{color: COLORS.proton}}>6</span>)}
      {item(1310, CUES.subtractEquals, '=')}
      {item(1180, CUES.subtractEquals + 6, <span style={{color: COLORS.neutron}}>6</span>)}

      <Show at={CUES.electronsStart} style={{position: 'absolute', top: 500, right: 70, width: 960}}>
        <Panel style={{padding: '24px 38px'}}>
          <div style={{fontSize: 40, fontWeight: 700, color: COLORS.accent}}>في الذرة المتعادلة</div>
          <div style={{fontSize: 56, fontWeight: 900, color: COLORS.text, lineHeight: 1.5}}>
            عدد <span style={{color: COLORS.electron}}>الإلكترونات</span> = عدد{' '}
            <span style={{color: COLORS.proton}}>البروتونات</span>
          </div>
        </Panel>
      </Show>
      <Show at={CUES.electronsValue} style={{position: 'absolute', top: 760, right: 70, width: 960}}>
        <Panel style={{padding: '14px 38px 18px', border: `3px solid ${COLORS.electron}`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <span style={{fontSize: 64, fontWeight: 900, color: COLORS.text}}>الإلكترونات =</span>
            <span style={{fontSize: 100, fontWeight: 900, color: COLORS.electron, lineHeight: 1.1}}>6</span>
          </div>
          <div style={{fontSize: 38, fontWeight: 700, color: COLORS.soft}}>
            2 في المستوى الأول + 4 في المستوى الثاني
          </div>
        </Panel>
      </Show>

      <ShellLabel shell={0} at={CUES.electronsShell1} text="المستوى الأول: 2" />
      <ShellLabel shell={1} at={CUES.electronsShell2} text="المستوى الثاني: 4" />
    </SceneLayer>
  );
};

// ================= المشهد 5: الملخص =================
const Row: React.FC<{label: string; value: string; color: string; at: number; dot?: 'p' | 'n' | 'e'}> = ({
  label,
  value,
  color,
  at,
  dot,
}) => (
  <Show at={at}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 6px',
        borderBottom: '2px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        {dot ? <Ball kind={dot} size={34} /> : <div style={{width: 34}} />}
        <span style={{fontSize: 50, fontWeight: 900, color: COLORS.text}}>{label}</span>
      </div>
      <span style={{fontSize: 72, fontWeight: 900, color, lineHeight: 1.1}}>{value}</span>
    </div>
  </Show>
);

const SummaryText: React.FC = () => {
  const a = CUES.summaryCard;
  return (
    <SceneLayer id="summary">
      <Show at={a - 4} style={{position: 'absolute', top: 60, right: 90, width: 720}}>
        <Panel style={{padding: '26px 40px 18px'}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span style={{fontSize: 60, fontWeight: 900, color: COLORS.accent}}>ذرة الكربون-12</span>
            {/* الرمز الكيميائي مع العدد الكتلي والعدد الذري */}
            <div style={{direction: 'ltr', display: 'flex', alignItems: 'center', fontWeight: 900}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1}}>
                <span style={{fontSize: 34, color: COLORS.accent}}>12</span>
                <span style={{fontSize: 34, color: COLORS.proton, marginTop: 6}}>6</span>
              </div>
              <span style={{fontSize: 92, color: COLORS.text, lineHeight: 1, marginLeft: 4}}>C</span>
            </div>
          </div>
          <Row label="العدد الذري" value="6" color={COLORS.proton} at={a + 4} />
          <Row label="العدد الكتلي" value="12" color={COLORS.accent} at={a + 9} />
          <Row label="البروتونات" value="6" color={COLORS.proton} at={a + 14} dot="p" />
          <Row label="النيوترونات" value="6" color={COLORS.neutron} at={a + 19} dot="n" />
          <Row label="الإلكترونات" value="6" color={COLORS.electron} at={a + 24} dot="e" />
        </Panel>
      </Show>

      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 80,
          right: 80,
          display: 'flex',
          gap: 30,
          justifyContent: 'center',
        }}
      >
        <Show at={CUES.rule1 - 10}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: COLORS.accent,
              alignSelf: 'center',
              padding: '0 6px',
            }}
          >
            تذكّر:
          </div>
        </Show>
        <Show at={CUES.rule1}>
          <Panel style={{padding: '16px 30px', border: `2px solid ${COLORS.proton}`}}>
            <span style={{fontSize: 44, fontWeight: 900, color: COLORS.text}}>العدد الذري = البروتونات</span>
          </Panel>
        </Show>
        <Show at={CUES.rule2}>
          <Panel style={{padding: '16px 30px', border: `2px solid ${COLORS.accent}`}}>
            <span style={{fontSize: 44, fontWeight: 900, color: COLORS.text}}>
              العدد الكتلي = البروتونات + النيوترونات
            </span>
          </Panel>
        </Show>
      </div>
    </SceneLayer>
  );
};

export const Overlays: React.FC = () => (
  <>
    <IntroText />
    <AtomicText />
    <MassText />
    <NeutronText />
    <SummaryText />
  </>
);

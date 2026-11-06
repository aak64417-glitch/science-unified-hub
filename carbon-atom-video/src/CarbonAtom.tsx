import '@fontsource/cairo/arabic-900.css';
import '@fontsource/cairo/latin-900.css';
import '@fontsource/cairo/arabic-700.css';
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  ATOM_CENTER,
  SHELLS,
  electronPosition,
  nucleonsAt,
} from './motion';

const FONT = "'Cairo', sans-serif";

const COLORS = {
  bg1: '#0b1530',
  bg2: '#050914',
  proton: '#ff5a5f',
  protonDark: '#b3202a',
  neutron: '#9aa7bd',
  neutronDark: '#4b566b',
  electron: '#4fd6ff',
  orbit: 'rgba(120, 200, 255, 0.45)',
  text: '#ffffff',
  accent: '#ffd166',
  panel: 'rgba(255,255,255,0.06)',
  panelBorder: 'rgba(255,255,255,0.14)',
};

// انتظار تحميل الخط العربي قبل تصوير أي إطار
const useCairoFont = () => {
  const [handle] = useState(() => delayRender('تحميل خط Cairo'));
  useEffect(() => {
    Promise.all([
      document.fonts.load(`900 64px Cairo`, 'العدد الذري'),
      document.fonts.load(`700 32px Cairo`, 'بروتون'),
      document.fonts.load(`900 64px Cairo`, '12C'),
    ])
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

const Electron: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={30} fill={COLORS.electron} opacity={0.18} />
    <circle r={17} fill="url(#electronGrad)" />
    <text
      y={7}
      textAnchor="middle"
      fontFamily={FONT}
      fontWeight={900}
      fontSize={22}
      fill="#03263a"
    >
      −
    </text>
  </g>
);

const Atom: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 14, mass: 0.9}});
  const orbitDraw = interpolate(frame, [5, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const electrons = SHELLS.flatMap((shell) =>
    Array.from({length: shell.electrons}, (_, i) => ({
      key: `${shell.name}-${i}`,
      ...electronPosition(shell, i, frame),
    })),
  );
  const behind = electrons.filter((e) => e.depth < 0);
  const front = electrons.filter((e) => e.depth >= 0);
  const nucleons = nucleonsAt(frame);
  const glow = 0.55 + Math.sin((frame / fps) * Math.PI * 1.2) * 0.15;

  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', inset: 0}}
      viewBox="0 0 1920 1080"
    >
      <defs>
        <radialGradient id="protonGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffd0d2" />
          <stop offset="45%" stopColor={COLORS.proton} />
          <stop offset="100%" stopColor={COLORS.protonDark} />
        </radialGradient>
        <radialGradient id="neutronGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f1f4fa" />
          <stop offset="45%" stopColor={COLORS.neutron} />
          <stop offset="100%" stopColor={COLORS.neutronDark} />
        </radialGradient>
        <radialGradient id="electronGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#e6fbff" />
          <stop offset="60%" stopColor={COLORS.electron} />
          <stop offset="100%" stopColor="#0f7ea8" />
        </radialGradient>
        <radialGradient id="nucleusGlow">
          <stop offset="0%" stopColor="#ff8a5c" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#ff8a5c" stopOpacity={0} />
        </radialGradient>
      </defs>

      <g
        transform={`translate(${ATOM_CENTER.x} ${ATOM_CENTER.y}) scale(${enter})`}
      >
        <circle r={170} fill="url(#nucleusGlow)" opacity={glow} />

        {SHELLS.map((s) => {
          // محيط تقريبي للإهليلج لرسم المدار تدريجياً
          const len =
            Math.PI * (3 * (s.rx + s.ry) - Math.sqrt((3 * s.rx + s.ry) * (s.rx + 3 * s.ry)));
          return (
            <ellipse
              key={s.name}
              rx={s.rx}
              ry={s.ry}
              transform={`rotate(${s.tilt})`}
              fill="none"
              stroke={COLORS.orbit}
              strokeWidth={3}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - orbitDraw)}
            />
          );
        })}

        {behind.map((e) => (
          <Electron key={e.key} x={e.x} y={e.y} />
        ))}

        {nucleons.map((n, i) => {
          const r = 30 + n.z * 4; // الأقرب يبدو أكبر قليلاً
          return (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={r}
              fill={n.kind === 'proton' ? 'url(#protonGrad)' : 'url(#neutronGrad)'}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth={1.5}
            />
          );
        })}

        {front.map((e) => (
          <Electron key={e.key} x={e.x} y={e.y} />
        ))}
      </g>
    </svg>
  );
};

// ---------- النصوص الثابتة (لا تتحرك طوال الفيديو) ----------

const InfoCard: React.FC<{label: string; value: string; color: string}> = ({
  label,
  value,
  color,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: COLORS.panel,
      border: `2px solid ${COLORS.panelBorder}`,
      borderRadius: 28,
      padding: '18px 40px',
      height: 150,
    }}
  >
    <span style={{fontSize: 60, fontWeight: 900, color: COLORS.text}}>{label}</span>
    <span
      style={{
        fontSize: 110,
        fontWeight: 900,
        color,
        lineHeight: 1,
      }}
    >
      {value}
    </span>
  </div>
);

const LegendItem: React.FC<{color: string; label: string}> = ({color, label}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: color,
        boxShadow: '0 0 12px rgba(255,255,255,0.25)',
      }}
    />
    <span style={{fontSize: 34, fontWeight: 700, color: '#dfe7f5'}}>{label}</span>
  </div>
);

const StaticText: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONT, direction: 'rtl'}}>
    <div
      style={{
        position: 'absolute',
        top: 60,
        right: 90,
        fontSize: 84,
        fontWeight: 900,
        color: COLORS.text,
      }}
    >
      تركيب ذرة الكربون
      <span style={{color: COLORS.accent, marginRight: 24}}>(C)</span>
    </div>

    <div
      style={{
        position: 'absolute',
        top: 250,
        right: 90,
        width: 640,
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
      }}
    >
      <InfoCard label="العدد الذري" value="٦" color={COLORS.proton} />
      <InfoCard label="العدد الكتلي" value="١٢" color={COLORS.accent} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          padding: '26px 40px',
          background: COLORS.panel,
          border: `2px solid ${COLORS.panelBorder}`,
          borderRadius: 28,
        }}
      >
        <LegendItem color={COLORS.proton} label="بروتونات: ٦ (موجبة)" />
        <LegendItem color={COLORS.neutron} label="نيوترونات: ٦ (متعادلة)" />
        <LegendItem color={COLORS.electron} label="إلكترونات: ٦ (سالبة) — ٢ ، ٤" />
      </div>
    </div>

    <div
      style={{
        position: 'absolute',
        bottom: 50,
        right: 90,
        fontSize: 36,
        fontWeight: 700,
        color: '#aebbd2',
      }}
    >
      العدد الكتلي = عدد البروتونات + عدد النيوترونات = ٦ + ٦ = ١٢
    </div>
  </AbsoluteFill>
);

export const CarbonAtom: React.FC = () => {
  useCairoFont();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 35% 50%, ${COLORS.bg1} 0%, ${COLORS.bg2} 75%)`,
      }}
    >
      <Atom />
      <StaticText />
    </AbsoluteFill>
  );
};

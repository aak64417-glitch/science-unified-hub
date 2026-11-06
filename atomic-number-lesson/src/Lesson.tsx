import '@fontsource/cairo/arabic-700.css';
import '@fontsource/cairo/arabic-900.css';
import '@fontsource/cairo/latin-700.css';
import '@fontsource/cairo/latin-900.css';
import {ThreeCanvas} from '@remotion/three';
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Atom3D} from './Atom3D';
import {FOV} from './direction';
import {Overlays} from './Overlays';
import {DURATION_IN_FRAMES, LINES, SCENES} from './timeline';

// انتظار الخط العربي قبل رسم أي إطار (يُستخدم أيضاً في أرقام البروتونات)
const useFonts = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('Loading Cairo font'));
  useEffect(() => {
    Promise.all([
      document.fonts.load("900 80px 'Cairo'", 'العدد الذري 0123456789'),
      document.fonts.load("700 40px 'Cairo'", 'العدد الذري'),
    ])
      .catch(() => undefined)
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return ready;
};

// انتقال سينمائي هادئ: إعتام ناعم قصير عند حدود المشاهد
const SceneDips: React.FC = () => {
  const frame = useCurrentFrame();
  let dip = 0;
  for (const s of SCENES.slice(1)) {
    dip = Math.max(dip, interpolate(frame, [s.start - 12, s.start, s.start + 14], [0, 0.55, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }));
  }
  const fadeIn = interpolate(frame, [0, 20], [1, 0], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [DURATION_IN_FRAMES - 25, DURATION_IN_FRAMES - 1], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  return <AbsoluteFill style={{background: '#02040c', opacity: Math.max(dip, fadeIn, fadeOut)}} />;
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);

// الموسيقى منخفضة جداً، وتنخفض أكثر أثناء الكلام
const musicVolume = (f: number) => {
  const speaking = LINES.some((l) => f >= l.start - 6 && f <= l.start + l.durationInFrames + 6);
  const base = speaking ? 0.06 : 0.1;
  const fade = Math.min(
    interpolate(f, [0, 45], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(f, [DURATION_IN_FRAMES - 60, DURATION_IN_FRAMES], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  return base * fade;
};

export const Lesson: React.FC = () => {
  const ready = useFonts();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#050b1d'}}>
      {ready ? (
        <>
          <ThreeCanvas
            width={width}
            height={height}
            camera={{fov: FOV, near: 0.1, far: 300, position: [0, 2, 19]}}
            gl={{antialias: true}}
            dpr={1}
          >
            <Atom3D />
          </ThreeCanvas>
          <Vignette />
          <Overlays />
          <SceneDips />
        </>
      ) : null}

      <Audio src={staticFile('music/ambient-pad.mp3')} volume={musicVolume} />
      {LINES.map((l) => (
        <Sequence key={l.id} from={l.start} durationInFrames={l.durationInFrames} layout="none">
          <Audio src={staticFile(`voice/${l.id}.wav`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};


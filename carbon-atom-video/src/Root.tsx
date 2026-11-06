import React from 'react';
import {Composition} from 'remotion';
import {CarbonAtom} from './CarbonAtom';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './motion';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CarbonAtom"
    component={CarbonAtom}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);

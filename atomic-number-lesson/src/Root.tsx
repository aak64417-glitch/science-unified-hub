import React from 'react';
import {Composition} from 'remotion';
import {Lesson} from './Lesson';
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Lesson"
    component={Lesson}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);

// المشهد ثلاثي الأبعاد: ذرة الكربون-12 بنموذج بور المبسط
import {useThree} from '@react-three/fiber';
import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {AdditiveBlending, CanvasTexture, SRGBColorSpace, Vector3} from 'three';
import {
  ELECTRON_POP,
  NUCLEONS,
  NUCLEON_RADIUS,
  ORBIT_ROTATION,
  SHELLS,
  atomState,
  cameraAt,
  electronLocal,
  nucleonWorld,
} from './direction';
import {COLORS} from './theme';

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);
  const {pos, look} = cameraAt(frame);
  camera.position.set(...pos);
  camera.lookAt(new Vector3(...look));
  camera.updateMatrixWorld();
  return null;
};

const makeGlowTexture = (color: string) => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color.replace('1)', '0.35)'));
  grad.addColorStop(1, color.replace('1)', '0)'));
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
};

// رقم البروتون مرسوماً على قرص صغير
const makeLabelTexture = (n: number) => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.beginPath();
  g.arc(128, 128, 104, 0, Math.PI * 2);
  g.fillStyle = 'rgba(255,255,255,0.96)';
  g.fill();
  g.lineWidth = 12;
  g.strokeStyle = COLORS.proton;
  g.stroke();
  g.fillStyle = '#7a0d1a';
  g.font = "900 150px 'Cairo'";
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(String(n), 128, 140);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
};

// نجوم خلفية ثابتة الموضع (تعطي عمقاً عند حركة الكاميرا)
const Stars: React.FC = () => {
  const positions = useMemo(() => {
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const arr = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      const r = 35 + rnd() * 50;
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.cos(ph);
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 20;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.16} color="#9cc7ff" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
};

export const Atom3D: React.FC = () => {
  const frame = useCurrentFrame();
  const st = atomState(frame);

  const textures = useMemo(
    () => ({
      nucleusGlow: makeGlowTexture('rgba(255,120,90,1)'),
      electronGlow: makeGlowTexture('rgba(80,220,255,1)'),
      labels: [1, 2, 3, 4, 5, 6].map(makeLabelTexture),
    }),
    [],
  );

  let protonNo = 0;

  return (
    <>
      <CameraRig />
      <color attach="background" args={[COLORS.bgDeep]} />
      <fog attach="fog" args={[COLORS.bgDeep, 30, 95]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#bcd7ff', '#1a0f2e', 0.6]} />
      <directionalLight position={[6, 8, 10]} intensity={2.4} />
      <directionalLight position={[-8, -2, -6]} intensity={1.4} color="#5fb8ff" />
      <pointLight position={[0, 0, 0]} intensity={6} distance={9} color="#ff9a6b" />

      <Stars />

      {/* توهج النواة */}
      <sprite scale={[4.6 * st.spread, 4.6 * st.spread, 1]}>
        <spriteMaterial
          map={textures.nucleusGlow}
          transparent
          opacity={st.nucleusGlow}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </sprite>

      {/* النواة: 6 بروتونات + 6 نيوترونات */}
      {NUCLEONS.map((n, i) => {
        const p = nucleonWorld(frame, i);
        const isProton = n.kind === 'p';
        const label = isProton ? protonNo++ : -1;
        return (
          <group key={i} position={p}>
            <mesh>
              <sphereGeometry args={[NUCLEON_RADIUS, 48, 48]} />
              <meshPhysicalMaterial
                color={isProton ? COLORS.proton : COLORS.neutron}
                emissive={isProton ? '#5a0610' : '#0d1a2c'}
                emissiveIntensity={0.35}
                roughness={0.28}
                metalness={0.05}
                clearcoat={1}
                clearcoatRoughness={0.15}
                transparent={!isProton}
                opacity={isProton ? 1 : st.neutronOpacity}
                depthWrite={isProton || st.neutronOpacity > 0.95}
              />
            </mesh>
            {isProton && label < st.protonLabels ? (
              <sprite scale={[0.5, 0.5, 1]} renderOrder={10}>
                <spriteMaterial map={textures.labels[label]} depthTest={false} transparent />
              </sprite>
            ) : null}
          </group>
        );
      })}

      {/* مستويات الطاقة والإلكترونات (نموذج بور) */}
      <group rotation={ORBIT_ROTATION}>
        {SHELLS.map((s) => (
          <mesh key={s.radius} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[s.radius, 0.022, 12, 220]} />
            <meshBasicMaterial
              color={COLORS.orbit}
              transparent
              opacity={0.75 * st.orbitOpacity}
              depthWrite={false}
            />
          </mesh>
        ))}
        {ELECTRON_POP.map((_, i) => {
          const scale = st.electronScale(i);
          if (scale <= 0.001) return null;
          return (
            <group key={i} position={electronLocal(frame, i)} scale={scale}>
              <mesh>
                <sphereGeometry args={[0.24, 32, 32]} />
                <meshStandardMaterial
                  color={COLORS.electron}
                  emissive={COLORS.electron}
                  emissiveIntensity={0.9}
                  roughness={0.3}
                />
              </mesh>
              <sprite scale={[1.5, 1.5, 1]}>
                <spriteMaterial
                  map={textures.electronGlow}
                  transparent
                  opacity={0.8}
                  depthWrite={false}
                  blending={AdditiveBlending}
                />
              </sprite>
            </group>
          );
        })}
      </group>
    </>
  );
};

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  isMobile: boolean;
}

export default function Scene3D({ isMobile }: Scene3DProps) {
  return (
    <>
      <ambientLight intensity={0.34} />
      <directionalLight position={[5, 5, 5]} intensity={1.25} color="#ff0a88" />
      <pointLight position={[-4, -2, 4]} intensity={1.05} color="#0677e8" />
      <pointLight position={[1, 4, -2]} intensity={0.55} color="#ffffff" />

      <Float speed={1.35} rotationIntensity={0.4} floatIntensity={0.7}>
        <SilkRibbon isMobile={isMobile} position={isMobile ? [0, 0, 0] : [2.1, 0.1, 0]} color="#ff0a88" scale={isMobile ? 0.95 : 1.42} />
      </Float>

      {!isMobile && (
        <>
          <Float speed={1.8} rotationIntensity={0.32} floatIntensity={0.58}>
            <SilkRibbon position={[-2.15, -0.45, -1.15]} color="#0677e8" scale={0.72} />
          </Float>
          <Float speed={2.1} rotationIntensity={0.2} floatIntensity={0.45}>
            <FloatingRing position={[3.2, 1.45, -1.4]} scale={0.56} color="#ff56b1" />
          </Float>
          <Float speed={1.7} rotationIntensity={0.28} floatIntensity={0.6}>
            <FloatingRing position={[-3, 1.15, -1.7]} scale={0.36} color="#38a4ff" />
          </Float>
        </>
      )}

      <hemisphereLight args={['#ff6fbd', '#050507', 0.48]} />
    </>
  );
}

function SilkRibbon({
  isMobile = false,
  position,
  color,
  scale,
}: {
  isMobile?: boolean;
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * (isMobile ? 0.075 : 0.1);
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.24) * 0.11;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.16) * 0.07;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusKnotGeometry args={[1, 0.27, isMobile ? 72 : 128, 16, 2, 3]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.18}
        metalness={0.82}
        distort={isMobile ? 0.18 : 0.28}
        speed={1.65}
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

function FloatingRing({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.28;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.18;
  });

  return (
    <Torus ref={meshRef} args={[1, 0.045, 16, 48]} position={position} scale={scale}>
      <meshStandardMaterial color={color} metalness={0.92} roughness={0.08} transparent opacity={0.68} />
    </Torus>
  );
}

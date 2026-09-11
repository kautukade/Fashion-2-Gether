import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Torus, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  isMobile: boolean;
}

export default function Scene3D({ isMobile }: Scene3DProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#c9a96e" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#722f37" />

      {/* Main floating silk form */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <SilkRibbon isMobile={isMobile} />
      </Float>

      {/* Secondary floating elements */}
      {!isMobile && (
        <>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <FloatingRing position={[3, 1, -2]} scale={0.5} />
          </Float>
          <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
            <FloatingRing position={[-3, -1, -1]} scale={0.3} />
          </Float>
        </>
      )}

      {/* Environment lighting */}
      <hemisphereLight args={['#c9a96e', '#1a1a1a', 0.5]} />
    </>
  );
}

function SilkRibbon({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[isMobile ? 0 : 2, 0, 0]} scale={isMobile ? 1 : 1.5}>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
      <MeshDistortMaterial
        color="#c9a96e"
        roughness={0.2}
        metalness={0.8}
        distort={0.3}
        speed={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function FloatingRing({ position, scale }: { position: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Torus ref={meshRef} args={[1, 0.05, 16, 32]} position={position} scale={scale}>
      <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
    </Torus>
  );
}

import { Suspense, useRef, useState, useEffect, lazy } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Lazy load the 3D scene for performance
const Scene3D = lazy(() => import('./Scene3D'));

interface Fashion3DSectionProps {
  className?: string;
}

export default function Fashion3DSection({ className = '' }: Fashion3DSectionProps) {
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setSupportsWebGL(false);
    } catch {
      setSupportsWebGL(false);
    }
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Respect prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsWebGL || prefersReducedMotion) {
    return <FallbackSection className={className} />;
  }

  return (
    <section className={`relative py-24 sm:py-32 overflow-hidden bg-charcoal ${className}`}>
      {/* 3D Canvas */}
      <div className="absolute inset-0 opacity-60">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            gl={{ antialias: !isMobile, alpha: true }}
          >
            <Scene3D isMobile={isMobile} />
          </Canvas>
        </Suspense>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[400px]">
          <div className="text-center lg:text-left">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">The Experience</p>
            <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
              FASHION<br />
              <span className="text-gradient-gold">THAT MOVES</span><br />
              WITH YOU
            </h2>
            <p className="text-white/60 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8">
              Every piece in our collection is designed to move with you — through seasons, celebrations, and everyday moments.
            </p>
            <a href="/shop" className="btn-primary bg-gold text-white hover:bg-gold-light inline-block">
              DISCOVER MORE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FallbackSection({ className }: { className: string }) {
  return (
    <section className={`relative py-24 sm:py-32 overflow-hidden bg-charcoal ${className}`}>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-burgundy/10 rounded-full blur-[80px]" />
      </div>
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">The Experience</p>
        <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
          FASHION<br />
          <span className="text-gradient-gold">THAT MOVES</span><br />
          WITH YOU
        </h2>
        <p className="text-white/60 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8">
          Every piece in our collection is designed to move with you.
        </p>
        <a href="/shop" className="btn-primary bg-gold text-white hover:bg-gold-light inline-block">
          DISCOVER MORE
        </a>
      </div>
    </section>
  );
}

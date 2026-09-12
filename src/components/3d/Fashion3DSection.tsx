import { Suspense, useEffect, useState, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ArrowUpRight } from 'lucide-react';

const Scene3D = lazy(() => import('./Scene3D'));

interface Fashion3DSectionProps {
  className?: string;
}

export default function Fashion3DSection({ className = '' }: Fashion3DSectionProps) {
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setSupportsWebGL(false);
    } catch {
      setSupportsWebGL(false);
    }

    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className={`brand-3d-section relative overflow-hidden py-24 sm:py-32 lg:py-40 ${className}`}>
      {supportsWebGL && !prefersReducedMotion && (
        <div className="absolute inset-0 opacity-80 pointer-events-none">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={isMobile ? [1, 1.35] : [1, 1.75]}
              gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
            >
              <Scene3D isMobile={isMobile} />
            </Canvas>
          </Suspense>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-[#06060a] via-[#06060a]/72 to-transparent pointer-events-none" />
      <div className="hero-mesh opacity-20" />

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[470px]">
          <div className="text-center lg:text-left max-w-2xl">
            <p className="brand-section-eyebrow text-[9px] sm:text-[10px] uppercase mb-5">Interactive / 3D Fashion</p>
            <h2 className="font-display text-white text-[clamp(3rem,6.2vw,7.2rem)] leading-[0.88] tracking-[-.04em] mb-7">
              FASHION<br />
              <span className="brand-gradient-text">THAT MOVES</span><br />
              WITH YOU
            </h2>
            <p className="text-white/52 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-9">
              A digital showroom built with depth, motion and real-time 3D — designed to make every scroll feel like a fashion film.
            </p>
            <Link to="/shop" className="btn-primary group">
              DISCOVER THE COLLECTION <ArrowUpRight size={15} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          <div className="hidden lg:flex justify-end items-end self-stretch pb-8">
            <div className="grid grid-cols-2 gap-3 w-[360px]">
              {[
                ['01', 'Real-time', '3D motion'],
                ['02', 'Responsive', 'Mobile first'],
                ['03', 'Curated', 'New drops'],
                ['04', 'Direct', 'WhatsApp'],
              ].map(([n, a, b]) => (
                <div key={n} className="brand-glass-chip !rounded-2xl p-5 text-left">
                  <span className="text-[9px] text-white/30 tracking-[.2em]">{n}</span>
                  <p className="text-white text-sm font-semibold mt-5">{a}</p>
                  <p className="text-white/42 text-xs mt-1">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

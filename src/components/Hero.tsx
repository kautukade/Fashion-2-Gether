import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Instagram } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const onMove = (event: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMouse({
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={heroRef} className="f2g-noorvi-hero" aria-label="Fashion 2 Gether new season">
      <div className="hero-film" aria-hidden>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=2000&h=1400&fit=crop&q=90"
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          <source media="(max-width: 767px)" src="/videos/hero-mobile.mp4" type="video/mp4" />
          <source src="/videos/hero-desktop.mp4" type="video/mp4" />
        </video>
        <motion.img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=2000&h=1400&fit=crop&q=90"
          alt=""
          animate={{ scale: 1.055, x: mouse.x * -14, y: mouse.y * -9 }}
          transition={{ type: 'spring', stiffness: 34, damping: 24 }}
          style={{ opacity: videoReady ? 0.16 : 1 }}
        />
      </div>

      <motion.div
        className="f2g-float-card one hidden lg:block"
        animate={{ x: mouse.x * -42, y: mouse.y * -28 }}
        transition={{ type: 'spring', stiffness: 42, damping: 20 }}
        aria-hidden
      >
        <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&h=950&fit=crop&q=88" alt="" />
        <div className="f2g-float-label">NEW SEASON • F2G EDIT</div>
      </motion.div>

      <motion.div
        className="f2g-float-card two hidden xl:block"
        animate={{ x: mouse.x * 34, y: mouse.y * 24 }}
        transition={{ type: 'spring', stiffness: 40, damping: 21 }}
        aria-hidden
      >
        <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=650&h=900&fit=crop&q=88" alt="" />
        <div className="f2g-float-label">TRENDING • SHOP THE LOOK</div>
      </motion.div>

      <div className="f2g-orbit-badge hidden xl:block" aria-hidden>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <path id="f2g-circle" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
          </defs>
          <text>
            <textPath href="#f2g-circle">FASHION 2 GETHER • YAVATMAL • NEW SEASON • </textPath>
          </text>
        </svg>
        <div className="center">✦</div>
      </div>

      <div className="hero-content">
        <div className="hero-copy">
          <motion.p
            className="f2g-hero-location"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            Yavatmal • All India Shipping
          </motion.p>

          <h1 className="f2g-hero-title" aria-label="Fashion 2 Gether">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Fashion
            </motion.span>
            <motion.span
              className="line2"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              2
            </motion.span>
            <motion.span
              className="line3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Gether
            </motion.span>
          </h1>

          <motion.p
            className="f2g-hero-tagline"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
          >
            Wear better. Look better.
          </motion.p>

          <motion.p
            className="f2g-hero-support"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Fresh drops, statement looks and trend-led fashion in a cinematic digital flagship built for discovery.
          </motion.p>

          <motion.div
            className="f2g-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.03, duration: 0.7 }}
          >
            <Link to="/shop" className="f2g-hero-primary">Shop New Arrivals <ArrowUpRight size={14} /></Link>
            <a href="#new-drop" className="f2g-hero-secondary">Explore The Edit</a>
          </motion.div>

          <motion.div
            className="f2g-hero-logo-chip"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.18, duration: 0.7 }}
          >
            <BrandLogo link={false} imageClassName="h-[50px] w-auto" priority />
          </motion.div>

          <motion.a
            href="https://instagram.com/fashion2gether_"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[.2em] uppercase text-white/55 hover:text-white transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.7 }}
          >
            <Instagram size={14} className="text-brand-pink" /> @fashion2gether_
          </motion.a>
        </div>
      </div>

      <motion.a
        href="#new-drop"
        className="absolute left-1/2 -translate-x-1/2 bottom-5 z-20 hidden sm:flex flex-col items-center gap-1.5 text-white/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        aria-label="Scroll to new arrivals"
      >
        <span className="text-[8px] tracking-[.3em] uppercase">Scroll</span>
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.7, repeat: Infinity }}>
          <ChevronDown size={14} />
        </motion.span>
      </motion.a>
    </section>
  );
}

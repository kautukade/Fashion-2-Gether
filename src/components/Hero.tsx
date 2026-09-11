import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Play } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 70, rotateX: 12 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { delay, duration: 0.95, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section ref={heroRef} className="brand-hero relative w-full overflow-hidden pt-[100px]">
      <div className="absolute inset-0">
        <video
          className="hero-background-media absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=2000&h=1300&fit=crop&q=88"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoLoaded(false)}
          style={{ opacity: videoLoaded ? 0.72 : 0 }}
        >
          <source media="(max-width: 767px)" src="/videos/hero-mobile.mp4" type="video/mp4" />
          <source src="/videos/hero-desktop.mp4" type="video/mp4" />
        </video>

        <motion.div
          className="hero-background-media absolute inset-0 bg-cover bg-center"
          animate={{ scale: 1.055, x: mousePos.x * -10, y: mousePos.y * -7 }}
          transition={{ type: 'spring', stiffness: 35, damping: 28 }}
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=2000&h=1300&fit=crop&q=88)',
            opacity: videoLoaded ? 0.2 : 0.86,
          }}
        />
      </div>

      <div className="hero-mesh" />
      <div className="hero-orb hero-orb-pink z-[3]" />
      <div className="hero-orb hero-orb-blue z-[3]" />

      <div className="absolute z-[4] left-[8%] top-[22%] hidden xl:block w-px h-[150px] bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      <div className="absolute z-[4] right-[7%] bottom-[20%] hidden xl:block w-px h-[130px] bg-gradient-to-b from-transparent via-white/25 to-transparent" />

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100svh-100px)] flex items-center py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.04fr_.96fr] gap-10 lg:gap-12 xl:gap-20 items-center w-full">
          <div className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0">
            <motion.div
              className="hero-kicker mb-5 sm:mb-7"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7 }}
            >
              <span className="hero-kicker-dot" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.24em] uppercase">Yavatmal • All India Shipping</span>
            </motion.div>

            <div className="perspective-[1200px]">
              <motion.h1
                className="font-display text-white text-[clamp(3.35rem,8vw,8.6rem)] leading-[0.78] tracking-[-0.045em]"
                custom={0.32}
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                FASHION
              </motion.h1>
              <motion.h2
                className="font-display brand-gradient-text text-[clamp(3.2rem,7.7vw,8.2rem)] leading-[0.88] tracking-[-0.035em] mt-1"
                custom={0.46}
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                2 GETHER
              </motion.h2>
            </div>

            <motion.div
              className="mt-7 sm:mt-9 flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.8 }}
            >
              <p className="font-elegant italic text-white/90 text-2xl sm:text-3xl leading-none">Wear better. Look better.</p>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
                A cinematic digital flagship for new drops, statement looks and the styles everyone is talking about.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 mt-8 sm:mt-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.75 }}
            >
              <Link to="/shop" className="btn-primary min-w-[190px] group">
                SHOP THE DROP <ArrowUpRight size={15} className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <a href="#new-drop" className="btn-outline min-w-[190px] border-white/28 text-white hover:bg-white hover:text-charcoal">
                <Play size={13} className="mr-2" /> EXPLORE
              </a>
            </motion.div>

            <motion.div
              className="mt-9 sm:mt-12 flex flex-wrap justify-center lg:justify-start gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.8 }}
            >
              {['New Season', 'Trending Now', 'Shop The Reel'].map((label) => (
                <span key={label} className="brand-glass-chip px-4 py-2 text-[9px] tracking-[0.18em] uppercase text-white/55">{label}</span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative max-w-[560px] w-full mx-auto lg:mr-0"
            initial={{ opacity: 0, x: 50, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.52, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="hero-logo-card rounded-[28px] sm:rounded-[38px] p-3 sm:p-4"
              animate={{
                rotateY: mousePos.x * 7,
                rotateX: mousePos.y * -6,
                y: [0, -8, 0],
              }}
              transition={{ rotateX: { type: 'spring', stiffness: 45, damping: 22 }, rotateY: { type: 'spring', stiffness: 45, damping: 22 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <BrandLogo link={false} className="w-full rounded-[22px] sm:rounded-[30px]" imageClassName="w-full h-auto" priority />
              <div className="absolute -bottom-4 left-5 right-5 sm:left-8 sm:right-8 h-8 bg-black/45 blur-2xl rounded-full" />
            </motion.div>

            <motion.div
              className="absolute -left-4 sm:-left-8 top-[16%] brand-glass-chip px-4 py-3 text-white shadow-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-[9px] uppercase tracking-[.2em] text-white/45">Style signal</p>
              <p className="text-xs sm:text-sm font-semibold mt-1">Most Trending Store</p>
            </motion.div>

            <motion.div
              className="absolute -right-2 sm:-right-6 bottom-[14%] brand-glass-chip px-4 py-3 text-white shadow-2xl"
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-[9px] uppercase tracking-[.2em] text-white/45">Shipping</p>
              <p className="text-xs sm:text-sm font-semibold mt-1">Across India</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#new-drop"
        className="absolute z-20 bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/35 hover:text-white/70 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        aria-label="Scroll to new drop"
      >
        <span className="text-[8px] tracking-[.26em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown size={15} />
        </motion.div>
      </motion.a>
    </section>
  );
}

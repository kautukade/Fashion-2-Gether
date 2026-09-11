import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] ease-out"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop&q=80)`,
            transform: `scale(1.1) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
          }}
        />
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 video-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full border border-gold/20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-[30%] right-[15%] w-20 h-20 rounded-full border border-white/10"
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[40%] right-[25%] w-2 h-2 bg-gold/40 rounded-full"
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Pre-title */}
        <motion.p
          className="text-gold/90 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 sm:mb-6 font-body"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          ✦ New Season Collection ✦
        </motion.p>

        {/* Main Title */}
        <div className="overflow-hidden mb-2">
          <motion.h2
            className="font-display text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.05em] leading-[0.9]"
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            FASHION
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-2">
          <motion.h2
            className="font-display text-gold text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.05em] leading-[0.9]"
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            2 GETHER
          </motion.h2>
        </div>

        {/* Tagline */}
        <motion.p
          className="font-elegant text-white/80 text-lg sm:text-xl md:text-2xl tracking-wider mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Yavatmal's Most Trending Store
        </motion.p>

        {/* Sub tagline */}
        <motion.div
          className="mt-4 sm:mt-6 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="text-white/60 text-sm sm:text-base tracking-widest uppercase">New Season. New Energy. New You.</p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <a
            href="/shop"
            className="btn-primary bg-white text-charcoal hover:bg-gold hover:text-white"
          >
            SHOP NEW DROP
          </a>
          <a
            href="/shop"
            className="btn-outline border-white/60 text-white hover:bg-white hover:text-charcoal"
          >
            EXPLORE COLLECTION
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-white/50 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={16} className="text-white/50" />
        </motion.div>
      </motion.div>

      {/* Side decorative elements */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-gold/50" />
        <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase rotate-[-90deg] whitespace-nowrap">
          SS 2025
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-gold/50 to-transparent" />
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-gold/50" />
        <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase rotate-[90deg] whitespace-nowrap">
          All India Shipping
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-gold/50 to-transparent" />
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'letters' | 'progress' | 'exit'>('letters');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('progress'), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === 'progress') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setPhase('exit');
              setTimeout(onComplete, 600);
            }, 300);
            return 100;
          }
          return prev + 4;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase, onComplete]);

  const brandName = 'FASHION 2 GETHER';

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-soft-black"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[100px]" />
          </div>

          {/* Brand Letters */}
          <div className="relative flex items-center justify-center mb-12">
            <div className="flex overflow-hidden">
              {brandName.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-display text-white text-3xl sm:text-5xl md:text-6xl tracking-[0.15em]"
                  initial={{ opacity: 0, y: 40, rotateX: 90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </div>
            {/* Light sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeInOut' }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            className="font-elegant text-gold/80 text-lg sm:text-xl tracking-widest mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Yavatmal's Most Trending Store
          </motion.p>

          {/* Progress Bar */}
          {phase === 'progress' && (
            <motion.div
              className="w-48 h-[1px] bg-white/10 relative overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold to-gold-light"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          )}

          {/* Decorative corners */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/30" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-gold/30" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-gold/30" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/30" />
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-[9999] bg-soft-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </AnimatePresence>
  );
}

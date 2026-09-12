import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from './BrandLogo';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + (current < 70 ? 7 : 4));
        if (next >= 100) window.clearInterval(interval);
        return next;
      });
    }, 55);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const exitTimer = window.setTimeout(() => setExiting(true), 180);
    const doneTimer = window.setTimeout(onComplete, 760);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          className="brand-loading fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.025, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute w-[55vw] max-w-[720px] aspect-square rounded-full border border-white/5"
            animate={{ rotate: 360, scale: [1, 1.04, 1] }}
            transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity } }}
          />
          <motion.div
            className="absolute w-[38vw] max-w-[500px] aspect-square rounded-full border border-gold/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative z-10 w-full max-w-[560px] px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <BrandLogo link={false} className="w-full max-w-[430px] mx-auto shadow-[0_30px_90px_rgba(0,0,0,.45)]" imageClassName="w-full h-auto" priority />
            </motion.div>

            <motion.p
              className="font-elegant italic text-xl sm:text-2xl text-white/72 mt-7"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.65 }}
            >
              Wear better. Look better.
            </motion.p>

            <div className="mt-9 max-w-[310px] mx-auto">
              <div className="flex items-center justify-between text-[9px] tracking-[.24em] uppercase text-white/35 mb-2.5">
                <span>Digital flagship</span>
                <span>{progress}%</span>
              </div>
              <div className="h-[2px] bg-white/10 overflow-hidden rounded-full">
                <motion.div
                  className="brand-loading-line h-full rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';

export default function BrandStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const left = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const right = useTransform(scrollYProgress, [0, 1], ['-14%', '0%']);

  return (
    <section ref={ref} className="relative overflow-hidden bg-soft-black text-white py-14 sm:py-20 border-y border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute right-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold/10 blur-[90px]" />
        <div className="absolute -right-20 top-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14">
        <div className="grid md:grid-cols-[1fr_auto] gap-5 items-end">
          <div>
            <p className="brand-section-eyebrow text-[9px] sm:text-[10px] uppercase mb-3">Fashion 2 Gether / Digital Flagship</p>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[.95] max-w-4xl">
              Fashion should feel like a <span className="brand-gradient-text">moment.</span>
            </h2>
          </div>
          <div className="md:text-right max-w-xs">
            <ArrowDownRight className="text-gold md:ml-auto mb-3" size={22} />
            <p className="text-white/48 text-xs sm:text-sm leading-relaxed">
              Bold drops, sharp edits and a storefront designed to move at the speed of culture.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 select-none">
        <motion.div style={{ x: left }} className="whitespace-nowrap font-display text-[clamp(3.1rem,8vw,8.3rem)] leading-none tracking-[-.045em] text-white/94">
          TRENDING / STREET / FESTIVE / NIGHT / TRENDING / STREET / FESTIVE / NIGHT /
        </motion.div>
        <motion.div style={{ x: right }} className="whitespace-nowrap font-display text-[clamp(3.1rem,8vw,8.3rem)] leading-none tracking-[-.045em] brand-gradient-text opacity-95">
          WEAR BETTER / LOOK BETTER / WEAR BETTER / LOOK BETTER / WEAR BETTER /
        </motion.div>
      </div>
    </section>
  );
}

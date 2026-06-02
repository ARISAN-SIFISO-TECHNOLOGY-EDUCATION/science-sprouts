// HomeLanding — the Home tab's landing screen.
//   Hero banner  →  The Vision  →  "Start exploring" CTA.
// The learning content (topic list) lives one tap away, behind the CTA, so the
// landing leads with the mission, not a specific age band.

import React from 'react';
import { motion } from 'motion/react';
import { Settings, ArrowRight, WifiOff, Ban, ShieldCheck } from 'lucide-react';

interface HomeLandingProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

export default function HomeLanding({ onStart, onOpenSettings }: HomeLandingProps) {
  return (
    <motion.div
      key="home-landing"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="relative px-5 pt-5 pb-nav flex flex-col"
    >
      {/* Parent settings — kept reachable from the landing */}
      <button
        onClick={onOpenSettings}
        className="absolute top-5 right-5 z-10 p-2.5 bg-white/85 backdrop-blur rounded-xl
                   shadow-sm border border-gray-100 text-gray-500 hover:text-green-600 transition-colors"
        aria-label="Parent settings"
      >
        <Settings size={18} />
      </button>

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <motion.img
        src="/hero-banner.png"
        alt="Science Sprouts — Learn. Explore. Grow. The world is your classroom."
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full rounded-3xl shadow-lg border-2 border-white"
      />

      {/* ── The Vision ──────────────────────────────────────────────────── */}
      <section className="mt-6 bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6">
        <p className="text-[11px] font-black text-green-600 uppercase tracking-[0.2em] mb-3">
          🌱 Our Vision
        </p>
        <p className="text-[15px] leading-relaxed text-gray-700 font-medium">
          Every child is born a scientist — curious, fearless, and full of questions.
          <span className="text-gray-900 font-bold"> Science Sprouts exists to protect that spark</span> and
          turn the whole world into a classroom. From age 3 to the edge of high school, children
          predict, test, and discover for themselves — with no ads chasing their attention, no
          paywalls gating their curiosity, and no data taken from their play.
        </p>

        <p className="mt-5 font-display font-black text-xl leading-snug text-gray-900">
          Plant curiosity.{' '}
          <span className="text-green-600">Grow knowledge.</span>{' '}
          <span className="text-emerald-500">Change the future.</span>
        </p>
      </section>

      {/* ── Start CTA ───────────────────────────────────────────────────── */}
      <button
        onClick={onStart}
        className="mt-6 w-full py-5 bg-green-500 shadow-[0_6px_0_#16A34A] text-white
                   font-display font-black text-xl rounded-3xl btn-press
                   flex items-center justify-center gap-2"
      >
        Start Exploring <ArrowRight size={22} strokeWidth={3} />
      </button>

      {/* ── Trust strip ─────────────────────────────────────────────────── */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <TrustChip Icon={WifiOff}     label="100% offline" />
        <TrustChip Icon={Ban}         label="No ads" />
        <TrustChip Icon={ShieldCheck} label="No sign-up" />
      </div>

      <p className="mt-5 text-center text-[10px] text-gray-300 font-medium tracking-wide">
        Ages 3–12 · 100+ CAPS science topics · Free
      </p>
    </motion.div>
  );
}

function TrustChip({ Icon, label }: { Icon: typeof WifiOff; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-green-50 rounded-2xl py-3 px-1">
      <Icon size={18} className="text-green-600" />
      <span className="text-[10px] font-black text-green-700 text-center leading-tight">{label}</span>
    </div>
  );
}

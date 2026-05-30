// Activity: Floating & Sinking — Band A (Ages 3–5)
// 5E: engage + explore    Kind: sensory_play    Generator: caregiverPrompt
//
// DESIGN PRINCIPLE: "The app is a caregiver coach, not a player."
// Screen time for this age group is ~30 seconds. The app shows one thing,
// then sends the child + caregiver to do the real thing with water.
// No reading, no quiz, no rounds — just a hook, a big physical prompt, and a timer.
//
// The three screens:
//   1. Hook  — animated visual + caregiver reads aloud (big, simple)
//   2. Go!   — the real-world activity card with a gentle timer
//   3. Done  — celebration, one star earned

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'hook' | 'go' | 'done';

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

// ── Caregiver script (what the grown-up reads to the child) ───────────────────
// Written at a level a caregiver with any literacy level can read aloud.
// In a future content pass this maps to audioByLang["zu"] pre-recorded files.

const CAREGIVER_SCRIPT = {
  hook: "Look! What do you think will happen if we drop this stone into water? And the leaf?",
  go:   "Go and try it! Find a bowl or basin with water. Drop in a stone and a leaf. Watch what happens!",
  done: "Wonderful! You tried something like a real scientist! 🌟",
};

// ── Simple countdown timer hook ───────────────────────────────────────────────

function useCountdown(seconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps
  return remaining;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FloatSinkBandA({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('hook');

  // Clean up any audio on unmount
  useEffect(() => () => stopAudio(), []);

  function speakScript(key: keyof typeof CAREGIVER_SCRIPT) {
    speak(CAREGIVER_SCRIPT[key]);
  }

  return (
    <div className="fixed inset-0 bg-sky-50 z-40 flex flex-col max-w-lg mx-auto">
      <AnimatePresence mode="wait">

        {/* ── Phase 1: Hook ───────────────────────────────────────────── */}
        {phase === 'hook' && (
          <motion.div
            key="hook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6"
          >
            {/* Exit button */}
            <button
              onClick={onExit}
              className="self-start text-sky-300 text-sm font-bold mb-4 hover:text-sky-500"
            >
              ← Back
            </button>

            {/* Caregiver badge */}
            <div className="bg-sky-100 border-2 border-sky-200 rounded-2xl px-4 py-2
                            flex items-center gap-2 mb-6 self-start">
              <span className="text-lg">👨‍👩‍👧</span>
              <span className="text-xs font-black text-sky-600 uppercase tracking-widest">
                Grown-up reads this aloud
              </span>
            </div>

            {/* Main visual — big and simple for a 3–5 year old */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {/* Animated water scene */}
              <div className="relative w-64 h-40 bg-blue-200 rounded-3xl overflow-hidden
                              border-4 border-blue-300 shadow-inner">
                {/* Water ripple */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-300/30 rounded-3xl"
                />
                {/* Leaf floating */}
                <motion.span
                  animate={{ y: [0, -4, 0], x: [0, 4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute top-5 left-12 text-5xl"
                >
                  🍃
                </motion.span>
                {/* Stone sinking */}
                <motion.span
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-5 right-12 text-5xl"
                >
                  🪨
                </motion.span>
              </div>

              {/* Script text — large, clear */}
              <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-sky-100
                              text-center max-w-xs">
                <p className="text-gray-700 text-lg font-bold leading-snug">
                  {CAREGIVER_SCRIPT.hook}
                </p>
                <button
                  onClick={() => speakScript('hook')}
                  className="mt-3 flex items-center gap-2 mx-auto text-sky-400
                             font-bold text-sm hover:text-sky-600 transition-colors"
                >
                  <Volume2 size={16} /> Read it again
                </button>
              </div>
            </div>

            {/* Big GO button */}
            <button
              onClick={() => { speakScript('go'); setPhase('go'); }}
              className="mt-6 w-full py-5 bg-sky-400 shadow-[0_6px_0_#0EA5E9]
                         text-white font-display font-black text-2xl rounded-3xl
                         btn-press flex items-center justify-center gap-3"
            >
              🛁 Now go try it!
            </button>
          </motion.div>
        )}

        {/* ── Phase 2: Real-world activity ────────────────────────────── */}
        {phase === 'go' && (
          <GoCard
            onDone={() => setPhase('done')}
            script={CAREGIVER_SCRIPT.go}
          />
        )}

        {/* ── Phase 3: Celebration ────────────────────────────────────── */}
        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full items-center justify-center p-8 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: 3 }}
              className="text-8xl mb-6"
            >
              🌟
            </motion.div>
            <h2 className="font-display font-black text-4xl text-sky-700 mb-3">
              Amazing!
            </h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              {CAREGIVER_SCRIPT.done}
            </p>
            <button
              onClick={onComplete}
              className="px-12 py-5 bg-sky-400 shadow-[0_6px_0_#0EA5E9]
                         text-white font-display font-black text-2xl rounded-3xl btn-press"
            >
              🌱 Get my star!
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// ── GoCard — the physical activity prompt with a gentle timer ─────────────────

function GoCard({ onDone, script }: { onDone: () => void; script: string }) {
  // 3-minute timer — gentle, not punishing. Auto-advances when done.
  const remaining = useCountdown(180, onDone);
  const mins = Math.floor(remaining / 60);
  const secs = String(remaining % 60).padStart(2, '0');
  const pct = (remaining / 180) * 100;

  return (
    <motion.div
      key="go"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full p-6 items-center justify-center"
    >
      {/* Activity card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-sky-200
                      max-w-xs w-full text-center mb-8">
        <p className="text-6xl mb-4">🛁💧</p>
        <h3 className="font-display font-black text-2xl text-sky-700 mb-3">
          Go try it now!
        </h3>
        <p className="text-gray-600 font-bold text-base leading-snug">{script}</p>
      </div>

      {/* Things to find */}
      <div className="flex gap-4 mb-8">
        {[
          { emoji: '🪨', label: 'Stone' },
          { emoji: '🍃', label: 'Leaf' },
          { emoji: '🪙', label: 'Coin' },
          { emoji: '🧴', label: 'Bottle' },
        ].map(obj => (
          <div key={obj.label} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center
                            justify-center text-3xl border-2 border-sky-200">
              {obj.emoji}
            </div>
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-wide">
              {obj.label}
            </span>
          </div>
        ))}
      </div>

      {/* Circular timer */}
      <div className="relative w-24 h-24 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke="#E0F2FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke="#38BDF8" strokeWidth="3"
                  strokeDasharray="100"
                  strokeDashoffset={100 - pct}
                  strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-black text-sky-600 text-sm">
            {mins}:{secs}
          </span>
        </div>
      </div>

      {/* Done early button */}
      <button
        onClick={onDone}
        className="px-8 py-4 bg-sky-400 shadow-[0_4px_0_#0EA5E9]
                   text-white font-display font-black text-xl rounded-2xl btn-press"
      >
        We're done! ✓
      </button>
    </motion.div>
  );
}

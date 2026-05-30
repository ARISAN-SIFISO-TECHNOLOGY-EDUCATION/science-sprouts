// Activity: Solids, Liquids & Gases — Band A (Ages 3–5)
// 5E: engage + explore    Kind: sensory_play    Generator: caregiverPrompt
//
// Design principle: "The app is a caregiver coach, not a player."
// At ages 3–5 we focus on SOLID vs LIQUID only (gas is too abstract).
// Anchor: "Some things are HARD and keep their shape. Some things FLOW and pour."

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'hook' | 'go' | 'done';

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

const CAREGIVER_SCRIPT = {
  hook: "Pick up a stone — it's HARD! It keeps its shape. Now pour water into your hand — it FLOWS! Hard things are called SOLIDS. Things that flow are called LIQUIDS.",
  go:   "Go on a hunt together! Find 3 SOLID things that are hard and keep their shape. Then find a LIQUID — something that pours or flows. Water is perfect! Feel the difference.",
  done: "You found solids and liquids just like a real scientist! 🌟",
};

function useCountdown(seconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps
  return remaining;
}

export default function SolidsLiquidsGasesBandA({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('hook');

  useEffect(() => () => stopAudio(), []);

  return (
    <div className="fixed inset-0 bg-sky-50 z-40 flex flex-col max-w-lg mx-auto">
      <AnimatePresence mode="wait">

        {/* ── Phase 1: Hook ──────────────────────────────────────────────── */}
        {phase === 'hook' && (
          <motion.div
            key="hook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6"
          >
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-4 hover:text-sky-500">
              ← Back
            </button>

            <div className="bg-sky-100 border-2 border-sky-200 rounded-2xl px-4 py-2
                            flex items-center gap-2 mb-6 self-start">
              <span className="text-lg">👨‍👩‍👧</span>
              <span className="text-xs font-black text-sky-600 uppercase tracking-widest">
                Grown-up reads this aloud
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {/* Animated scene — solid vs liquid */}
              <div className="flex gap-6 items-end">
                {/* Solid */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-sky-100 rounded-2xl p-4 border-2 border-sky-200 w-28 h-28
                                  flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: [0, 3, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-5xl"
                    >
                      🪨
                    </motion.span>
                  </div>
                  <span className="text-xs font-black text-sky-600 uppercase tracking-wide">SOLID</span>
                  <span className="text-[10px] text-gray-400 font-semibold">keeps its shape</span>
                </div>

                {/* Liquid */}
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-blue-100 rounded-2xl p-4 border-2 border-blue-200 w-28 h-28
                                  flex items-center justify-center overflow-hidden relative">
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-5xl"
                    >
                      💧
                    </motion.div>
                  </div>
                  <span className="text-xs font-black text-blue-600 uppercase tracking-wide">LIQUID</span>
                  <span className="text-[10px] text-gray-400 font-semibold">flows & pours</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-sky-100 text-center max-w-xs">
                <p className="text-gray-700 text-lg font-bold leading-snug">
                  {CAREGIVER_SCRIPT.hook}
                </p>
                <button
                  onClick={() => speak(CAREGIVER_SCRIPT.hook)}
                  className="mt-3 flex items-center gap-2 mx-auto text-sky-400 font-bold text-sm hover:text-sky-600"
                >
                  <Volume2 size={16} /> Read it again
                </button>
              </div>
            </div>

            <button
              onClick={() => { speak(CAREGIVER_SCRIPT.go); setPhase('go'); }}
              className="mt-6 w-full py-5 bg-sky-500 shadow-[0_6px_0_#0284C7]
                         text-white font-display font-black text-2xl rounded-3xl btn-press
                         flex items-center justify-center gap-3"
            >
              🔍 Now go on a hunt!
            </button>
          </motion.div>
        )}

        {/* ── Phase 2: Real-world activity ───────────────────────────────── */}
        {phase === 'go' && <GoCard onDone={() => setPhase('done')} script={CAREGIVER_SCRIPT.go} />}

        {/* ── Phase 3: Celebration ────────────────────────────────────────── */}
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
            <h2 className="font-display font-black text-4xl text-sky-700 mb-3">Brilliant!</h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">{CAREGIVER_SCRIPT.done}</p>
            <button
              onClick={onComplete}
              className="px-12 py-5 bg-sky-500 shadow-[0_6px_0_#0284C7]
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

function GoCard({ onDone, script }: { onDone: () => void; script: string }) {
  const remaining = useCountdown(180, onDone);
  const mins = Math.floor(remaining / 60);
  const secs = String(remaining % 60).padStart(2, '0');
  const pct  = (remaining / 180) * 100;

  return (
    <motion.div
      key="go"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full p-6 items-center justify-center"
    >
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-sky-200
                      max-w-xs w-full text-center mb-6">
        <p className="text-6xl mb-4">🔍🪨💧</p>
        <h3 className="font-display font-black text-2xl text-sky-700 mb-3">Go on a hunt!</h3>
        <p className="text-gray-600 font-bold text-base leading-snug">{script}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-xs">
        <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 text-center">
          <p className="text-[9px] font-black text-sky-600 uppercase mb-2">🧊 SOLIDS</p>
          <div className="flex justify-center gap-1">
            {['🪨','📚','🪵','🍫'].map(e => <span key={e} className="text-xl">{e}</span>)}
          </div>
          <p className="text-[9px] text-sky-500 font-bold mt-1">hard, keeps shape</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 text-center">
          <p className="text-[9px] font-black text-blue-600 uppercase mb-2">💧 LIQUIDS</p>
          <div className="flex justify-center gap-1">
            {['💧','🥛','🧃','🍵'].map(e => <span key={e} className="text-xl">{e}</span>)}
          </div>
          <p className="text-[9px] text-blue-500 font-bold mt-1">flows & pours</p>
        </div>
      </div>

      <div className="relative w-24 h-24 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0F2FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0EA5E9" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-black text-sky-600 text-sm">{mins}:{secs}</span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="px-8 py-4 bg-sky-500 shadow-[0_4px_0_#0284C7]
                   text-white font-display font-black text-xl rounded-2xl btn-press"
      >
        We're done! ✓
      </button>
    </motion.div>
  );
}

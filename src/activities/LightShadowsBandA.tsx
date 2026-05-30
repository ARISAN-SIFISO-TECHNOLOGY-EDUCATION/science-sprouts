// Activity: Light & Shadows — Band A (Ages 3–5)
// 5E: engage    Kind: sensory_play    Caregiver-led outdoor shadow play.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'hook' | 'go' | 'done';
interface Props { onComplete: () => void; onExit: () => void; }

const SCRIPT = {
  hook: "Stand in the sunshine and look at your shadow! Your body blocks the sunlight and makes a dark shape on the ground. That shape is your shadow!",
  go:   "Go outside on a sunny day together! Make big shadows, small shadows, funny shadows. Try waving your arms — does your shadow wave too? At midday shadows are short. In the morning or afternoon they are long!",
  done: "You played with light and shadows like a real scientist! 🌟",
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

export default function LightShadowsBandA({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('hook');
  useEffect(() => () => stopAudio(), []);

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {phase === 'hook' && (
          <motion.div key="hook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-4">← Back</button>
            <div className="bg-amber-100 border-2 border-amber-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-5 self-start">
              <span className="text-lg">👨‍👩‍👧</span>
              <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Grown-up reads this aloud</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-5">
              {/* Animated shadow scene */}
              <div className="relative w-64 h-44 bg-amber-100 rounded-3xl border-4 border-amber-200 overflow-hidden flex items-end justify-center pb-4">
                <motion.div animate={{ x: [-40, 40, -40] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 text-4xl">☀️</motion.div>
                <div className="flex flex-col items-center">
                  <span className="text-5xl">🧒</span>
                  <motion.div
                    animate={{ scaleX: [1.5, 0.8, 1.5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-12 h-3 bg-amber-400/50 rounded-full -mt-1"
                    style={{ transformOrigin: 'left center' }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-amber-100 text-center max-w-xs">
                <p className="text-gray-700 text-base font-bold leading-snug">{SCRIPT.hook}</p>
                <button onClick={() => speak(SCRIPT.hook)} className="mt-2 flex items-center gap-2 mx-auto text-amber-400 font-bold text-sm">
                  <Volume2 size={16} /> Read again
                </button>
              </div>
            </div>
            <button onClick={() => { speak(SCRIPT.go); setPhase('go'); }}
              className="mt-4 w-full py-5 bg-amber-400 shadow-[0_6px_0_#D97706] text-white font-display font-black text-2xl rounded-3xl btn-press flex items-center justify-center gap-3">
              ☀️ Go make shadows!
            </button>
          </motion.div>
        )}
        {phase === 'go' && <GoCard onDone={() => setPhase('done')} script={SCRIPT.go} />}
        {phase === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full items-center justify-center p-8 text-center">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: 3 }} className="text-8xl mb-6">🌟</motion.div>
            <h2 className="font-display font-black text-4xl text-amber-600 mb-3">Brilliant!</h2>
            <p className="text-gray-600 text-lg mb-10">{SCRIPT.done}</p>
            <button onClick={onComplete} className="px-12 py-5 bg-amber-400 shadow-[0_6px_0_#D97706] text-white font-display font-black text-2xl rounded-3xl btn-press">🌱 Get my star!</button>
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
    <motion.div key="go" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center">
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 max-w-xs w-full text-center mb-6">
        <p className="text-5xl mb-3">☀️🧒</p>
        <h3 className="font-display font-black text-2xl text-amber-600 mb-3">Go outside!</h3>
        <p className="text-gray-600 font-bold text-sm leading-snug">{script}</p>
      </div>
      <div className="flex gap-4 mb-6">
        {[{ emoji: '🙌', label: 'Wave arms' }, { emoji: '🏃', label: 'Run fast' }, { emoji: '📏', label: 'Measure it' }, { emoji: '🎨', label: 'Trace it' }].map(a => (
          <div key={a.label} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl border-2 border-amber-200">{a.emoji}</div>
            <span className="text-[10px] font-black text-amber-500 uppercase text-center leading-tight">{a.label}</span>
          </div>
        ))}
      </div>
      <div className="relative w-24 h-24 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-black text-amber-600 text-sm">{mins}:{secs}</span>
        </div>
      </div>
      <button onClick={onDone} className="px-8 py-4 bg-amber-400 shadow-[0_4px_0_#D97706] text-white font-display font-black text-xl rounded-2xl btn-press">We're done! ✓</button>
    </motion.div>
  );
}

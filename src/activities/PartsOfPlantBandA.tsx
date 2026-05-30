// Activity: Parts of a Plant — Band A (Ages 3–5)
// 5E: engage    Kind: sensory_play    Generator: caregiverPrompt
// Caregiver-led: point to and name each part on a real plant.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'hook' | 'go' | 'done';
interface Props { onComplete: () => void; onExit: () => void; }

const SCRIPT = {
  hook: "Look at this plant! It has roots at the bottom that drink water from the soil. It has a stem that carries water up. It has leaves that catch sunlight. And a beautiful flower at the top!",
  go:   "Find a plant — in a pot, in the garden, or even a vegetable from the kitchen! Together, point to the roots, the stem, the leaves, and the flower. Name each part out loud!",
  done: "You know all the parts of a plant now! You are a brilliant plant scientist! 🌟",
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

export default function PartsOfPlantBandA({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('hook');
  useEffect(() => () => stopAudio(), []);

  return (
    <div className="fixed inset-0 bg-emerald-50 z-40 flex flex-col max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {phase === 'hook' && (
          <motion.div key="hook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6">
            <button onClick={onExit} className="self-start text-emerald-300 text-sm font-bold mb-4">← Back</button>
            <div className="bg-emerald-100 border-2 border-emerald-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-5 self-start">
              <span className="text-lg">👨‍👩‍👧</span>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Grown-up reads this aloud</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-5">
              {/* Simple plant diagram */}
              <div className="flex flex-col items-center gap-0">
                <div className="text-5xl">🌸</div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🍃</div>
                  <div className="w-3 h-20 bg-green-500 rounded-full" />
                  <div className="text-4xl">🍃</div>
                </div>
                <div className="w-full h-0.5 bg-amber-300 my-1" />
                <div className="flex gap-1 text-3xl">🌱🌱🌱</div>
              </div>
              {/* Labels */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                {[
                  { emoji: '🌸', name: 'Flower', desc: 'makes seeds' },
                  { emoji: '🍃', name: 'Leaves', desc: 'catch sunlight' },
                  { emoji: '🟢', name: 'Stem', desc: 'carries water up' },
                  { emoji: '🌱', name: 'Roots', desc: 'drink water' },
                ].map(p => (
                  <div key={p.name} className="bg-white rounded-2xl p-2 text-center border border-emerald-100">
                    <span className="text-2xl">{p.emoji}</span>
                    <p className="font-black text-xs text-emerald-700">{p.name}</p>
                    <p className="text-[9px] text-gray-400">{p.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-emerald-100 text-center max-w-xs">
                <p className="text-gray-700 text-base font-bold leading-snug">{SCRIPT.hook}</p>
                <button onClick={() => speak(SCRIPT.hook)} className="mt-2 flex items-center gap-2 mx-auto text-emerald-400 font-bold text-sm">
                  <Volume2 size={16} /> Read again
                </button>
              </div>
            </div>
            <button onClick={() => { speak(SCRIPT.go); setPhase('go'); }}
              className="mt-4 w-full py-5 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-2xl rounded-3xl btn-press flex items-center justify-center gap-3">
              🌿 Find a plant!
            </button>
          </motion.div>
        )}
        {phase === 'go' && <GoCard onDone={() => setPhase('done')} script={SCRIPT.go} />}
        {phase === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full items-center justify-center p-8 text-center">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: 3 }} className="text-8xl mb-6">🌟</motion.div>
            <h2 className="font-display font-black text-4xl text-emerald-700 mb-3">Amazing!</h2>
            <p className="text-gray-600 text-lg mb-10">{SCRIPT.done}</p>
            <button onClick={onComplete} className="px-12 py-5 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-2xl rounded-3xl btn-press">🌱 Get my star!</button>
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
    <motion.div key="go" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex flex-col h-full p-6 items-center justify-center">
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-emerald-200 max-w-xs w-full text-center mb-6">
        <p className="text-5xl mb-3">🪴</p>
        <h3 className="font-display font-black text-2xl text-emerald-700 mb-3">Find a plant!</h3>
        <p className="text-gray-600 font-bold text-sm leading-snug">{script}</p>
      </div>
      <div className="flex gap-4 mb-6">
        {[{ emoji: '🌸', label: 'Flower' }, { emoji: '🍃', label: 'Leaves' }, { emoji: '🟢', label: 'Stem' }, { emoji: '🌱', label: 'Roots' }].map(p => (
          <div key={p.label} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl border-2 border-emerald-200">{p.emoji}</div>
            <span className="text-[10px] font-black text-emerald-500 uppercase">{p.label}</span>
          </div>
        ))}
      </div>
      <div className="relative w-24 h-24 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D1FAE5" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-black text-emerald-600 text-sm">{mins}:{secs}</span>
        </div>
      </div>
      <button onClick={onDone} className="px-8 py-4 bg-emerald-500 shadow-[0_4px_0_#059669] text-white font-display font-black text-xl rounded-2xl btn-press">We're done! ✓</button>
    </motion.div>
  );
}

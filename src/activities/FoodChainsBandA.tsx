// Activity: Food Chains — Band A (Ages 3–5)
// 5E: engage    Kind: sensory_play    Caregiver-led "who eats who" story game.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'hook' | 'go' | 'done';
interface Props { onComplete: () => void; onExit: () => void; }

const SCRIPT = {
  hook: "The grass grows in the sun. The rabbit eats the grass. The fox eats the rabbit. This is a food chain — every living thing needs to eat something else to survive!",
  go:   "Tell a food chain story together using toys, pictures, or real food! Start with the sun, then a plant, then a small animal, then a bigger animal. Each one eats the one before it!",
  done: "You built a food chain just like a real ecologist! 🌟",
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

export default function FoodChainsBandA({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('hook');
  useEffect(() => () => stopAudio(), []);

  return (
    <div className="fixed inset-0 bg-green-50 z-40 flex flex-col max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {phase === 'hook' && (
          <motion.div key="hook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-4">← Back</button>
            <div className="bg-green-100 border-2 border-green-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-5 self-start">
              <span className="text-lg">👨‍👩‍👧</span>
              <span className="text-xs font-black text-green-600 uppercase tracking-widest">Grown-up reads this aloud</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-5">
              {/* Chain visual */}
              <div className="flex items-center gap-1">
                {[
                  { emoji: '☀️', label: 'Sun' },
                  { emoji: '🌿', label: 'Grass' },
                  { emoji: '🐇', label: 'Rabbit' },
                  { emoji: '🦊', label: 'Fox' },
                ].map((item, i) => (
                  <React.Fragment key={item.label}>
                    {i > 0 && (
                      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="text-xl text-green-400 font-black">→</motion.span>
                    )}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.3, type: 'spring' }} className="flex flex-col items-center gap-1">
                      <span className="text-4xl">{item.emoji}</span>
                      <span className="text-[9px] font-black text-green-700 uppercase">{item.label}</span>
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>
              <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-green-100 text-center max-w-xs">
                <p className="text-gray-700 text-base font-bold leading-snug">{SCRIPT.hook}</p>
                <button onClick={() => speak(SCRIPT.hook)} className="mt-2 flex items-center gap-2 mx-auto text-green-400 font-bold text-sm">
                  <Volume2 size={16} /> Read again
                </button>
              </div>
            </div>
            <button onClick={() => { speak(SCRIPT.go); setPhase('go'); }}
              className="mt-4 w-full py-5 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-2xl rounded-3xl btn-press flex items-center justify-center gap-3">
              🌿 Build a chain!
            </button>
          </motion.div>
        )}
        {phase === 'go' && <GoCard onDone={() => setPhase('done')} script={SCRIPT.go} />}
        {phase === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full items-center justify-center p-8 text-center">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: 3 }} className="text-8xl mb-6">🌟</motion.div>
            <h2 className="font-display font-black text-4xl text-green-700 mb-3">Brilliant!</h2>
            <p className="text-gray-600 text-lg mb-10">{SCRIPT.done}</p>
            <button onClick={onComplete} className="px-12 py-5 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-2xl rounded-3xl btn-press">🌱 Get my star!</button>
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
      <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-green-200 max-w-xs w-full text-center mb-6">
        <div className="text-4xl mb-3">☀️→🌿→🐇→🦊</div>
        <h3 className="font-display font-black text-2xl text-green-700 mb-3">Tell the story!</h3>
        <p className="text-gray-600 font-bold text-sm leading-snug">{script}</p>
      </div>
      <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-3 mb-6 w-full max-w-xs text-center">
        <p className="text-[9px] font-black text-green-600 uppercase mb-2">Try these chains:</p>
        <div className="space-y-1 text-sm font-bold text-gray-600">
          <p>☀️ → 🌿 Grass → 🐛 Caterpillar → 🐦 Bird</p>
          <p>☀️ → 🌽 Corn → 🐭 Mouse → 🦉 Owl</p>
          <p>☀️ → 🍎 Apple → 🐛 Worm → 🐟 Fish</p>
        </div>
      </div>
      <div className="relative w-24 h-24 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DCFCE7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-black text-green-600 text-sm">{mins}:{secs}</span>
        </div>
      </div>
      <button onClick={onDone} className="px-8 py-4 bg-green-500 shadow-[0_4px_0_#16A34A] text-white font-display font-black text-xl rounded-2xl btn-press">We're done! ✓</button>
    </motion.div>
  );
}

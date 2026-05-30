// Activity: Hard vs Soft — Ages 3–4 (Band A3 + A4)
// 3S Pattern: See → Do → Caregiver Card
//
// See  (5s):  "The spoon is HARD! The pillow is SOFT!"
// Do   (30s): Tap 4 items — auto-sort to correct box, always positive feedback
// Card (60s): "Find 1 hard + 1 soft thing in your room"
//
// NO WRONG ANSWERS — every tap plays a positive voice line and
// the item always goes to the correct box regardless of what the
// child intended. The goal is exploration, not assessment.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'do' | 'card';
type Hardness = 'hard' | 'soft';

interface SortItem {
  id: string;
  emoji: string;
  label: string;
  type: Hardness;
  voice: string;
}

const ITEMS: SortItem[] = [
  { id: 'spoon',   emoji: '🥄', label: 'Spoon',   type: 'hard', voice: 'Spoon is HARD! Great noticing!' },
  { id: 'pillow',  emoji: '🛏️', label: 'Pillow',  type: 'soft', voice: 'Pillow is SOFT! Great noticing!' },
  { id: 'rock',    emoji: '🪨', label: 'Rock',    type: 'hard', voice: 'Rock is HARD! Great noticing!' },
  { id: 'teddy',   emoji: '🧸', label: 'Teddy',   type: 'soft', voice: 'Teddy bear is SOFT! Great noticing!' },
];

const SEE_VOICE = "Look! The spoon is HARD. Tap it! The pillow is SOFT. Tap it! Hard things keep their shape. Soft things feel squashy!";
const CARD_VOICE = "Now try at home! Find one hard thing and one soft thing. Let your child touch both and say the words: hard and soft!";

function useCountdown(seconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps
  return remaining;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function HardSoftActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('see');
  const [sorted, setSorted] = useState<Record<string, Hardness>>({}); // id → type
  const [animating, setAnimating] = useState<string | null>(null);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('do'), 5000);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  function tapItem(item: SortItem) {
    if (item.id in sorted) return;
    const isLast = Object.keys(sorted).length + 1 >= ITEMS.length;
    speak(item.voice, 0.85, isLast ? () => setPhase('card') : undefined);
    setAnimating(item.id);
    setSorted(prev => ({ ...prev, [item.id]: item.type }));
    setTimeout(() => setAnimating(null), 700);
  }

  const hardItems = ITEMS.filter(i => sorted[i.id] === 'hard');
  const softItems = ITEMS.filter(i => sorted[i.id] === 'soft');
  const remaining = ITEMS.filter(i => !(i.id in sorted));

  return (
    <div className="fixed inset-0 bg-orange-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE phase ──────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 text-center gap-5">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>

            <div className="flex gap-8 items-center">
              {/* Hard example */}
              <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 bg-orange-200 rounded-3xl flex items-center justify-center text-5xl border-4 border-orange-300">🥄</div>
                <span className="font-black text-orange-700 text-sm uppercase">HARD</span>
              </motion.div>
              <span className="text-4xl text-orange-300 font-black">vs</span>
              {/* Soft example */}
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center text-5xl border-4 border-amber-200">🧸</div>
                <span className="font-black text-amber-700 text-sm uppercase">SOFT</span>
              </motion.div>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-orange-100 max-w-xs">
              <p className="text-orange-700 text-base font-black leading-snug">{SEE_VOICE}</p>
            </div>
          </motion.div>
        )}

        {/* ── DO phase ───────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-3">← Back</button>

            {/* Items to tap */}
            {remaining.length > 0 && (
              <>
                <p className="text-center text-orange-500 font-black text-sm uppercase tracking-widest mb-3">
                  Tap each thing!
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {remaining.map(item => (
                    <motion.button
                      key={item.id}
                      animate={animating === item.id ? { scale: [1, 1.2, 0.9, 1] } : {}}
                      transition={{ duration: 0.4 }}
                      onClick={() => tapItem(item)}
                      className="flex flex-col items-center gap-1 bg-white rounded-3xl p-4 border-3
                                 shadow-md active:scale-95 transition-all min-w-[80px]"
                      style={{ border: '3px solid #FED7AA' }}
                    >
                      <span className="text-5xl">{item.emoji}</span>
                      <span className="text-xs font-black text-orange-400 uppercase tracking-wide">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {/* Two sorting zones */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {/* HARD zone */}
              <div className="bg-orange-100 rounded-3xl border-3 p-3 flex flex-col" style={{ border: '3px solid #FDBA74' }}>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest text-center mb-2">
                  🪨 HARD
                </p>
                <div className="flex flex-wrap gap-2 justify-center flex-1">
                  {hardItems.map(i => (
                    <motion.span key={i.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }} className="text-3xl">
                      {i.emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
              {/* SOFT zone */}
              <div className="bg-amber-50 rounded-3xl border-3 p-3 flex flex-col" style={{ border: '3px solid #FDE68A' }}>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest text-center mb-2">
                  🧸 SOFT
                </p>
                <div className="flex flex-wrap gap-2 justify-center flex-1">
                  {softItems.map(i => (
                    <motion.span key={i.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }} className="text-3xl">
                      {i.emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => speak(SEE_VOICE)} className="flex items-center gap-2 mx-auto mt-3 text-orange-400 text-sm font-bold">
              <Volume2 size={16} /> Hear it again
            </button>
          </motion.div>
        )}

        {/* ── CAREGIVER CARD ─────────────────────────────────────────────── */}
        {phase === 'card' && (
          <CaregiverCard onComplete={onComplete} onExit={onExit} />
        )}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({ onComplete, onExit }: { onComplete: () => void; onExit: () => void }) {
  const remaining = useCountdown(90, onComplete);
  const pct = (remaining / 90) * 100;
  useEffect(() => {
    const t = setTimeout(() => speak(CARD_VOICE), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-4">← Back</button>

      <div className="bg-orange-100 border-2 border-orange-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span className="text-lg">👨‍👩‍👧</span>
        <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Now try at home!</span>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🪨🧸</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Walk around the room together. Find 1 HARD thing. Find 1 SOFT thing. Let your child touch both and say the words!
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-5">
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 text-center">
          <p className="text-[10px] font-black text-orange-600 uppercase mb-2">🪨 HARD things</p>
          <div className="flex justify-center gap-2 text-2xl">🥄🪵📱🍫</div>
        </div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
          <p className="text-[10px] font-black text-amber-600 uppercase mb-2">🧸 SOFT things</p>
          <div className="flex justify-center gap-2 text-2xl">🧸🧤👕🛏️</div>
        </div>
      </div>

      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FED7AA" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FB923C" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-orange-500 text-sm">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span>
        </div>
      </div>

      <button onClick={onComplete}
        className="px-10 py-4 bg-orange-400 shadow-[0_6px_0_#FB923C] text-white font-display font-black text-xl rounded-3xl btn-press">
        🌱 All done!
      </button>
    </motion.div>
  );
}

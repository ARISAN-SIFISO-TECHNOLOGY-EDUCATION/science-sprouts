// Activity: Animal Needs — Age 6 (Band B6)
// Foundation Phase Gr 1 — animals need food, water and shelter to live.
// Pattern: Care (give 3 needs) → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'care' | 'why' | 'card';

interface Need { id: string; emoji: string; name: string; voice: string; }

const NEEDS: Need[] = [
  { id: 'food',    emoji: '🍖', name: 'Food',    voice: 'FOOD! Animals eat food to grow strong!' },
  { id: 'water',   emoji: '💧', name: 'Water',   voice: 'WATER! Animals drink water every day!' },
  { id: 'shelter', emoji: '🏠', name: 'Shelter', voice: 'SHELTER! Animals need a safe home to rest!' },
];

const OBJECTIVE_ID = 'll.animal_needs_b6';
const BADGE = 'Animal Carer Badge 🐾';

const CARE_VOICE = "This puppy needs your help! Give it food, water, and a home!";
const WHY_VOICE  = "Do animals need water to live?";
const CARD_VOICE = "You earned the Animal Carer Badge! Talk about a pet you know. What 3 things does it need?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => {
    if (r <= 0) { onDone(); return; }
    const id = setTimeout(() => setR(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function AnimalNeedsRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('care');
  const [given, setGiven]   = useState<Set<string>>(new Set());
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(CARE_VOICE); return () => stopAudio(); }, []);

  function give(need: Need) {
    if (given.has(need.id)) return;
    const isLast = given.size + 1 >= NEEDS.length;
    speak(need.voice, 0.85, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 800) : undefined);
    setGiven(prev => new Set([...prev, need.id]));
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! All animals need water to live! You are a great animal carer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  const happiness = given.size / NEEDS.length;

  return (
    <div className="fixed inset-0 bg-teal-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'care' && (
          <motion.div key="care" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-teal-600 text-sm uppercase tracking-widest mb-1">Help the puppy!</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">Give it everything it needs 🐾</p>

            {/* The animal */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div animate={{ scale: [1, 1 + happiness * 0.15, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                className="text-8xl mb-2">{happiness >= 1 ? '🐕😄' : happiness > 0 ? '🐕' : '🐶'}</motion.div>
              <div className="flex gap-2">
                {NEEDS.map(n => (
                  <div key={n.id} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all
                    ${given.has(n.id) ? 'bg-teal-200 border-teal-400' : 'bg-gray-100 border-gray-200 opacity-40'}`}>
                    {given.has(n.id) ? '✓' : n.emoji}
                  </div>
                ))}
              </div>
              {happiness >= 1 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 font-display font-black text-teal-600">
                  Happy and healthy! 🎉
                </motion.p>
              )}
            </div>

            {/* Give buttons */}
            <div className="grid grid-cols-3 gap-3">
              {NEEDS.map(n => {
                const done = given.has(n.id);
                return (
                  <motion.button key={n.id} whileTap={{ scale: 0.92 }} onClick={() => give(n)} disabled={done}
                    className={`py-4 rounded-3xl flex flex-col items-center gap-1 active:scale-95 transition-all border-2
                      ${done ? 'bg-teal-100 border-teal-300 opacity-70' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <span className="text-4xl">{n.emoji}</span>
                    <span className={`text-[10px] font-black uppercase ${done ? 'text-teal-700' : 'text-gray-500'}`}>{done ? '✓' : `Give ${n.name}`}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🐕💧</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Do animals need water to live?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-teal-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-teal-50 border-2 border-teal-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">✅</span><span className="font-black text-teal-700 text-xs uppercase">Yes</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">❌</span><span className="font-black text-gray-500 text-xs uppercase">No</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🐕😄</motion.div>
            )}
          </motion.div>
        )}

        {phase === 'card' && <CaregiverCard onComplete={onComplete} onExit={onExit} />}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({ onComplete, onExit }: { onComplete: () => void; onExit: () => void }) {
  const r = useCountdown(120, onComplete);
  const pct = (r / 120) * 100;
  useEffect(() => { const t = setTimeout(() => speak(CARD_VOICE), 400); return () => clearTimeout(t); }, []);
  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🐾</div>
        <p className="font-display font-black text-teal-700 text-sm">Animal Carer Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-teal-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🐕🐈🐠</p>
        <p className="font-black text-gray-700 text-base leading-snug">Talk about a pet you know. What 3 things does it need? Food, water, and a safe home!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CCFBF1" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#14B8A6" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-teal-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-teal-500 shadow-[0_6px_0_#0D9488] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

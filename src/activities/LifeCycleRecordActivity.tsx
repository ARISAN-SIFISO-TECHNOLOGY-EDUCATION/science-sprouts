// Activity: Life Cycle (Chicken) — Age 6 (Band B6)
// Foundation Phase Gr 1 — living things change as they grow.
// Pattern: Order the stages → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'order' | 'why' | 'card';

interface Stage { id: string; emoji: string; name: string; }

const STAGES: Stage[] = [
  { id: 'egg',     emoji: '🥚', name: 'Egg'      },
  { id: 'hatch',   emoji: '🐣', name: 'Hatching' },
  { id: 'chick',   emoji: '🐤', name: 'Chick'    },
  { id: 'chicken', emoji: '🐔', name: 'Chicken'  },
];

// Shuffled display order (fixed, not the correct sequence)
const SHUFFLED = [STAGES[2], STAGES[0], STAGES[3], STAGES[1]];

const OBJECTIVE_ID = 'll.life_cycle';
const BADGE = 'Life Cycle Badge 🐣';

const ORDER_VOICE = "A chicken grows in steps! Tap them in order. What comes first?";
const WHY_VOICE   = "What comes FIRST — the egg or the chicken?";
const CARD_VOICE  = "You earned the Life Cycle Badge! Find pictures of a baby, a child, and a grown-up. People grow in steps too!";

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

export default function LifeCycleRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('order');
  const [placed, setPlaced] = useState<Stage[]>([]);
  const [wrong, setWrong]   = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(ORDER_VOICE); return () => stopAudio(); }, []);

  const remaining = SHUFFLED.filter(s => !placed.find(p => p.id === s.id));

  function tapStage(stage: Stage) {
    const correctNext = STAGES[placed.length];
    if (stage.id !== correctNext.id) {
      // gentle: no fail, just nudge
      setWrong(stage.id);
      speak("Try the one that comes before that!");
      setTimeout(() => setWrong(null), 800);
      return;
    }
    const newPlaced = [...placed, stage];
    setPlaced(newPlaced);
    const isLast = newPlaced.length >= STAGES.length;
    speak(`${stage.name}!`, 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 700) : undefined);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! The egg comes first. Then it hatches into a chick, and grows into a chicken!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 bg-yellow-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'order' && (
          <motion.div key="order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-yellow-600 text-sm uppercase tracking-widest mb-1">Put them in order!</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">What comes first? 🥚</p>

            {/* Sequence being built */}
            <div className="bg-white rounded-2xl border-2 border-yellow-100 p-3 mb-4 min-h-[5rem] flex items-center">
              <div className="flex items-center gap-1 flex-wrap w-full justify-center">
                {placed.map((s, i) => (
                  <React.Fragment key={s.id}>
                    {i > 0 && <span className="text-yellow-400 font-black text-xl">→</span>}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 11 }} className="flex flex-col items-center">
                      <span className="text-3xl">{s.emoji}</span>
                      <span className="text-[8px] font-black text-yellow-700 uppercase">{s.name}</span>
                    </motion.div>
                  </React.Fragment>
                ))}
                {placed.length === 0 && <p className="text-gray-300 text-sm font-bold">Tap the first stage!</p>}
              </div>
            </div>

            {/* Stage choices */}
            <div className="grid grid-cols-4 gap-2 flex-1 content-start">
              {remaining.map(s => (
                <motion.button key={s.id} animate={wrong === s.id ? { x: [0, -6, 6, 0] } : {}} transition={{ duration: 0.3 }}
                  whileTap={{ scale: 0.9 }} onClick={() => tapStage(s)}
                  className="flex flex-col items-center gap-1 p-3 bg-white rounded-2xl shadow-md border-2 border-gray-100 active:scale-95">
                  <span className="text-4xl">{s.emoji}</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase">{s.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-yellow-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🥚🐔</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">What comes FIRST?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-yellow-500 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🥚</span><span className="font-black text-yellow-700 text-xs uppercase">The egg</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-orange-50 border-2 border-orange-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🐔</span><span className="font-black text-orange-700 text-xs uppercase">The chicken</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🥚🐣🐔</motion.div>
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
      <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🐣</div>
        <p className="font-display font-black text-yellow-600 text-sm">Life Cycle Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-yellow-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">👶🧒🧓</p>
        <p className="font-black text-gray-700 text-base leading-snug">Find pictures of a baby, a child, and a grown-up. People grow in steps, just like a chicken!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF9C3" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EAB308" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-yellow-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-yellow-400 shadow-[0_6px_0_#CA8A04] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

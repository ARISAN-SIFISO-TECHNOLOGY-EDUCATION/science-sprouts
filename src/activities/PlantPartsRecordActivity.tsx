// Activity: Plant Parts — Age 6 (Band B6)
// Foundation Phase Gr 1 — parts + their jobs.
// Pattern: Label (tap part → name + job) → Why? question → Badge + Caregiver Card
//
// Reading level 3–5 words. Earns the "Botanist Badge".

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'label' | 'why' | 'card';

interface Part {
  id: string; emoji: string; name: string; job: string; voice: string;
  color: string; bg: string; border: string;
}

const PARTS: Part[] = [
  { id: 'flower', emoji: '🌸', name: 'Flower', job: 'makes seeds',   voice: 'The FLOWER makes seeds. New plants grow from seeds!', color: 'text-pink-700',   bg: 'bg-pink-50',   border: 'border-pink-200'   },
  { id: 'leaf',   emoji: '🍃', name: 'Leaf',   job: 'makes food',    voice: 'The LEAF makes food from sunlight!',                  color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200'  },
  { id: 'stem',   emoji: '🌿', name: 'Stem',   job: 'carries water', voice: 'The STEM carries water up to the leaves!',            color: 'text-lime-700',   bg: 'bg-lime-50',   border: 'border-lime-200'   },
  { id: 'root',   emoji: '🌱', name: 'Root',   job: 'drinks water',  voice: 'The ROOT drinks water from the soil!',                color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
];

const OBJECTIVE_ID = 'll.plant_parts_record';
const BADGE = 'Botanist Badge 🌿';

const LABEL_VOICE = "Tap each part of the plant. Find out what it does!";
const WHY_VOICE   = "Why does a plant need roots?";
const CARD_VOICE  = "You earned the Botanist Badge! Now draw your own plant. Can you label two parts?";

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

export default function PlantPartsRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('label');
  const [tapped, setTapped] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Part | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    speak(LABEL_VOICE);
    return () => stopAudio();
  }, []);

  function tapPart(part: Part) {
    if (tapped.has(part.id)) return;
    const isLast = tapped.size + 1 >= PARTS.length;
    setActive(part);
    speak(part.voice, 0.85, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 600) : undefined);
    setTapped(prev => new Set([...prev, part.id]));
    setTimeout(() => setActive(null), 1800);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! Roots drink water so the plant can live and grow! You are a botanist!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 bg-green-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── LABEL ─────────────────────────────────────────────────────── */}
        {phase === 'label' && (
          <motion.div key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-green-600 text-sm uppercase tracking-widest mb-1">
              Tap each plant part!
            </p>
            <p className="text-center text-xs text-gray-400 font-bold mb-2">Learn its job 🌱</p>

            {/* Active part fact */}
            <div className="h-14 flex items-center justify-center mb-1">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div key={active.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                    className={`px-4 py-2 rounded-2xl font-display font-black text-lg ${active.bg} ${active.color}`}>
                    {active.emoji} {active.name} — {active.job}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Plant diagram (vertical) */}
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              {PARTS.map((part, i) => {
                const done = tapped.has(part.id);
                return (
                  <React.Fragment key={part.id}>
                    {i === 3 && <div className="w-full max-w-[200px] border-t-2 border-dashed border-amber-300 my-1" />}
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => tapPart(part)}
                      className={`w-full max-w-xs p-2 rounded-2xl border-2 flex items-center gap-3 transition-all
                        ${done ? `${part.bg} ${part.border}` : 'bg-white border-gray-200 shadow-sm'}`}>
                      <span className="text-4xl">{part.emoji}</span>
                      <div className="flex-1 text-left">
                        {done ? (
                          <>
                            <p className={`font-display font-black ${part.color}`}>{part.name}</p>
                            <p className="text-xs text-gray-500 font-bold">{part.job}</p>
                          </>
                        ) : (
                          <p className="font-black text-gray-300">Tap to learn ✨</p>
                        )}
                      </div>
                      {done && <span className={`text-lg font-black ${part.color}`}>✓</span>}
                    </motion.button>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── WHY question ──────────────────────────────────────────────── */}
        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-green-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌱❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Why does a plant need roots?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-green-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">💧</span>
                  <span className="font-black text-amber-700 text-xs uppercase">To drink water</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">✈️</span>
                  <span className="font-black text-sky-700 text-xs uppercase">To fly away</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🌱💧</motion.div>
            )}
          </motion.div>
        )}

        {/* ── CARD ──────────────────────────────────────────────────────── */}
        {phase === 'card' && <CaregiverCard onComplete={onComplete} onExit={onExit} />}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({ onComplete, onExit }: { onComplete: () => void; onExit: () => void }) {
  const r = useCountdown(120, onComplete);
  const pct = (r / 120) * 100;
  useEffect(() => {
    const t = setTimeout(() => speak(CARD_VOICE), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-3">← Back</button>
      {/* Badge */}
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }}
        className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌿</div>
        <p className="font-display font-black text-green-700 text-sm">Botanist Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-green-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🎨🌻</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Draw your own plant together! Can your child label two parts — like the root and the leaf?
        </p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DCFCE7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22C55E" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-green-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

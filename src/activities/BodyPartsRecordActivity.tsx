// Activity: Body Parts & Functions — Age 6 (Band B6)
// Foundation Phase Gr 1 — each body part has a job.
// Pattern: Label (tap part → job) → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'label' | 'why' | 'card';

interface Part { id: string; emoji: string; name: string; job: string; voice: string; }

const PARTS: Part[] = [
  { id: 'eyes',  emoji: '👀', name: 'Eyes',  job: 'to SEE',   voice: 'We use our EYES to SEE!' },
  { id: 'ears',  emoji: '👂', name: 'Ears',  job: 'to HEAR',  voice: 'We use our EARS to HEAR!' },
  { id: 'nose',  emoji: '👃', name: 'Nose',  job: 'to SMELL', voice: 'We use our NOSE to SMELL!' },
  { id: 'hands', emoji: '🤲', name: 'Hands', job: 'to HOLD',  voice: 'We use our HANDS to HOLD things!' },
  { id: 'legs',  emoji: '🦵', name: 'Legs',  job: 'to WALK',  voice: 'We use our LEGS to WALK and run!' },
  { id: 'mouth', emoji: '👄', name: 'Mouth', job: 'to EAT',   voice: 'We use our MOUTH to EAT and talk!' },
];

const OBJECTIVE_ID = 'll.body_parts';
const BADGE = 'Body Explorer Badge 🧍';

const LABEL_VOICE = "Tap each body part. Find out its job!";
const WHY_VOICE   = "What do we use to SEE?";
const CARD_VOICE  = "You earned the Body Explorer Badge! Now point to body parts together. What does each one do?";

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

export default function BodyPartsRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('label');
  const [tapped, setTapped] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Part | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(LABEL_VOICE); return () => stopAudio(); }, []);

  function tapPart(part: Part) {
    if (tapped.has(part.id)) return;
    const isLast = tapped.size + 1 >= PARTS.length;
    setActive(part);
    speak(part.voice, 0.85, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 600) : undefined);
    setTapped(prev => new Set([...prev, part.id]));
    setTimeout(() => setActive(null), 1600);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! We use our eyes to see! You are a body explorer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 bg-rose-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'label' && (
          <motion.div key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-rose-600 text-sm uppercase tracking-widest mb-1">Tap each body part!</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-2">Learn its job 🧍</p>

            <div className="h-14 flex items-center justify-center mb-2">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div key={active.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                    className="px-4 py-2 rounded-2xl font-display font-black text-lg bg-rose-100 text-rose-700">
                    {active.emoji} {active.name} — {active.job}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 gap-3 flex-1 content-center">
              {PARTS.map(part => {
                const done = tapped.has(part.id);
                return (
                  <motion.button key={part.id} whileTap={{ scale: 0.92 }} onClick={() => tapPart(part)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-3xl min-h-[88px] border-2 transition-all active:scale-95
                      ${done ? 'bg-rose-100 border-rose-300' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <span className="text-4xl">{part.emoji}</span>
                    <span className={`text-[10px] font-black uppercase ${done ? 'text-rose-700' : 'text-gray-300'}`}>
                      {done ? part.job : part.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-rose-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">👀❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">What do we use to SEE?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-rose-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-rose-50 border-2 border-rose-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">👀</span><span className="font-black text-rose-700 text-xs uppercase">Eyes</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🦵</span><span className="font-black text-amber-700 text-xs uppercase">Legs</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">👀</motion.div>
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
      <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🧍</div>
        <p className="font-display font-black text-rose-700 text-sm">Body Explorer Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-rose-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🧒👆</p>
        <p className="font-black text-gray-700 text-base leading-snug">Point to body parts together. Ask: "What do your eyes do? What do your legs do?"</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFE4E6" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FB7185" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-rose-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-rose-400 shadow-[0_6px_0_#FB7185] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

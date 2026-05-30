// Activity: Sources of Light — Age 6 (Band B6)
// Foundation Phase Gr 1 — some things make light, some do not.
// Pattern: Sort (gives light / no light) → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { cn, speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'sort' | 'why' | 'card';

interface Thing { id: string; emoji: string; name: string; givesLight: boolean; voice: string; }

const THINGS: Thing[] = [
  { id: 'sun',    emoji: '☀️', name: 'Sun',    givesLight: true,  voice: 'The SUN gives light! It is the biggest light of all!' },
  { id: 'lamp',   emoji: '💡', name: 'Lamp',   givesLight: true,  voice: 'A LAMP gives light when you switch it on!' },
  { id: 'candle', emoji: '🕯️', name: 'Candle', givesLight: true,  voice: 'A CANDLE gives a small light from its flame!' },
  { id: 'rock',   emoji: '🪨', name: 'Rock',   givesLight: false, voice: 'A rock gives NO light. It just sits in the dark.' },
  { id: 'book',   emoji: '📚', name: 'Book',   givesLight: false, voice: 'A book gives NO light. We need a light to read it!' },
  { id: 'spoon',  emoji: '🥄', name: 'Spoon',  givesLight: false, voice: 'A spoon gives NO light. It is just shiny metal.' },
];

const OBJECTIVE_ID = 'ec.sources_of_light';
const BADGE = 'Light Detective Badge 💡';

const SORT_VOICE = "Some things make light. Some do not! Tap each one to find out.";
const WHY_VOICE  = "Which one gives us light?";
const CARD_VOICE = "You earned the Light Detective Badge! At night, find 2 things that give light in your home.";

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

export default function LightSortRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('sort');
  const [sorted, setSorted] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Thing | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(SORT_VOICE); return () => stopAudio(); }, []);

  const remaining = THINGS.filter(t => !(t.id in sorted));

  function tapThing(t: Thing) {
    if (t.id in sorted) return;
    const isLast = Object.keys(sorted).length + 1 >= THINGS.length;
    setFeedback(t);
    speak(t.voice, 0.85, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 700) : undefined);
    setSorted(prev => ({ ...prev, [t.id]: t.givesLight }));
    setTimeout(() => setFeedback(null), 1700);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! The lamp gives us light! You are a light detective!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  const lightItems = THINGS.filter(t => sorted[t.id] === true);
  const darkItems  = THINGS.filter(t => sorted[t.id] === false);

  return (
    <div className="fixed inset-0 bg-yellow-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'sort' && (
          <motion.div key="sort" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-yellow-600 text-sm uppercase tracking-widest mb-1">Does it make light?</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">Tap each thing 💡</p>

            {remaining.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {remaining.map(t => (
                  <motion.button key={t.id} whileTap={{ scale: 0.88 }} onClick={() => tapThing(t)}
                    className="flex flex-col items-center gap-0.5 p-2 bg-white rounded-2xl shadow-md border-2 border-gray-100 active:scale-95">
                    <span className="text-3xl">{t.emoji}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase">{t.name}</span>
                  </motion.button>
                ))}
              </div>
            )}

            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn('mb-3 p-2 rounded-2xl text-center text-sm font-bold', feedback.givesLight ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600')}>
                  {feedback.emoji} {feedback.givesLight ? 'Gives light! ✨' : 'No light.'}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-yellow-100 rounded-2xl p-2 border-2 border-yellow-300">
                <p className="text-[9px] font-black text-yellow-700 uppercase tracking-wide text-center mb-2">✨ GIVES LIGHT</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {lightItems.map(t => <motion.span key={t.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-2xl">{t.emoji}</motion.span>)}
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-2 border-2 border-gray-300">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-wide text-center mb-2">🌑 NO LIGHT</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {darkItems.map(t => <motion.span key={t.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-2xl">{t.emoji}</motion.span>)}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-yellow-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">💡❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Which one gives us light?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-yellow-500 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">💡</span><span className="font-black text-yellow-700 text-xs uppercase">Lamp</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🪨</span><span className="font-black text-gray-500 text-xs uppercase">Rock</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">💡✨</motion.div>
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
        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">💡</div>
        <p className="font-display font-black text-yellow-600 text-sm">Light Detective Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-yellow-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌙🔦</p>
        <p className="font-black text-gray-700 text-base leading-snug">When it gets dark, find 2 things in your home that give light. A lamp? A phone? A candle?</p>
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

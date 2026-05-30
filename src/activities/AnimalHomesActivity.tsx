// Activity: Animal Homes — Age 7 (Band B7)
// Foundation Phase Gr 2 — match each animal to where it lives.
// Pattern: Match (animal → home) → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'match' | 'why' | 'card';

interface Round { id: string; animal: string; name: string; correct: string; options: { home: string; label: string }[]; voice: string; }

const ROUNDS: Round[] = [
  { id: 'fish', animal: '🐟', name: 'Fish', correct: 'water', options: [{ home: '🌊', label: 'Water' }, { home: '🌳', label: 'Tree' }], voice: 'A fish lives in the WATER! It swims with its fins.' },
  { id: 'bird', animal: '🐦', name: 'Bird', correct: 'nest', options: [{ home: '🪺', label: 'Nest' }, { home: '🕳️', label: 'Hole' }], voice: 'A bird lives in a NEST up in a tree!' },
  { id: 'bee',  animal: '🐝', name: 'Bee',  correct: 'hive', options: [{ home: '🍯', label: 'Hive' }, { home: '🌊', label: 'Water' }], voice: 'A bee lives in a HIVE with thousands of other bees!' },
  { id: 'ant',  animal: '🐜', name: 'Ant',  correct: 'hill', options: [{ home: '⛰️', label: 'Ant hill' }, { home: '🪺', label: 'Nest' }], voice: 'An ant lives in an ANT HILL under the ground!' },
];

const OBJECTIVE_ID = 'll.animal_homes';
const BADGE = 'Habitat Helper Badge 🏡';

const MATCH_VOICE = "Every animal has a home. Where does each one live? Tap the right home!";
const WHY_VOICE   = "Why does a fish live in water?";
const CARD_VOICE  = "You earned the Habitat Helper Badge! Go outside and find where ants or birds live near your home.";

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

export default function AnimalHomesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('match');
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(MATCH_VOICE); return () => stopAudio(); }, []);

  const r = ROUNDS[round];

  function pick(home: string) {
    if (picked) return;
    setPicked(home);
    const correctHome = r.options.find(o => (o.home === '🌊' && r.correct === 'water') || o.label.toLowerCase().includes(r.correct))?.home;
    // Always positive: speak the fact regardless
    const isLast = round + 1 >= ROUNDS.length;
    speak(r.voice, 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 700) : undefined);
    setTimeout(() => {
      setPicked(null);
      if (!isLast) setRound(n => n + 1);
    }, 1900);
    void correctHome;
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! A fish needs water to breathe and swim. Every animal lives where it can find food and stay safe!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 bg-teal-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'match' && (
          <motion.div key={`m-${round}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <div className="flex justify-center gap-2">
              {ROUNDS.map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i <= round ? 'bg-teal-400' : 'bg-teal-100'}`} />)}
            </div>
            <div className="bg-white rounded-3xl p-6 border-2 border-teal-100 shadow-md text-center w-full max-w-xs">
              <motion.span key={r.id} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-7xl block mb-2">{r.animal}</motion.span>
              <p className="font-display font-black text-lg text-gray-800">Where does the {r.name} live?</p>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              {r.options.map(o => (
                <motion.button key={o.home} whileTap={{ scale: 0.92 }} onClick={() => pick(o.home)} disabled={!!picked}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-white border-2 border-teal-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">{o.home}</span>
                  <span className="font-black text-teal-700 text-xs uppercase">{o.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🐟🌊</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Why does a fish live in water?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-teal-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-teal-50 border-2 border-teal-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">💧🐟</span><span className="font-black text-teal-700 text-[11px] uppercase">To breathe &amp; swim</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🌳😴</span><span className="font-black text-amber-700 text-[11px] uppercase">To climb trees</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ x: [0, 12, 0] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🐟</motion.div>}
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
        <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🏡</div>
        <p className="font-display font-black text-teal-700 text-sm">Habitat Helper Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-teal-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🐜🐦🕸️</p>
        <p className="font-black text-gray-700 text-base leading-snug">Go outside together. Can you find where ants live? Where a bird builds its nest? Look carefully!</p>
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

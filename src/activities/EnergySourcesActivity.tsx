// Activity: Energy from Food & Sun — Age 7 (Band B7)
// Foundation Phase Gr 2 — plants get energy from the sun, animals from food.
// Pattern: Match (living thing → energy source) → Why? → Badge + Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'match' | 'why' | 'card';

interface Round { id: string; thing: string; name: string; source: 'sun' | 'food'; voice: string; }

const ROUNDS: Round[] = [
  { id: 'plant', thing: '🌻', name: 'Sunflower', source: 'sun',  voice: 'A plant gets its energy from the SUN! It makes food from sunlight.' },
  { id: 'child', thing: '🧒', name: 'Child',     source: 'food', voice: 'You get your energy from FOOD! Healthy food makes you strong.' },
  { id: 'dog',   thing: '🐕', name: 'Dog',       source: 'food', voice: 'A dog gets energy from FOOD too, just like you!' },
];

const OBJECTIVE_ID = 'ec.energy_sources';
const BADGE = 'Energy Badge ⚡';

const MATCH_VOICE = "Every living thing needs energy. Where does each one get it from?";
const WHY_VOICE   = "Where do YOU get your energy from?";
const CARD_VOICE  = "You earned the Energy Badge! Talk about the food you ate that gave you energy to run and play today.";

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

export default function EnergySourcesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('match');
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(MATCH_VOICE); return () => stopAudio(); }, []);

  const r = ROUNDS[round];

  function pick() {
    if (picked) return;
    setPicked(true);
    const isLast = round + 1 >= ROUNDS.length;
    speak(r.voice, 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 800) : undefined);
    setTimeout(() => { setPicked(false); if (!isLast) setRound(n => n + 1); }, 2100);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! You get energy from food! Plants get energy from the sun. Now you know about energy!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  // left/right source options, deterministic order
  const sunLeft = round % 2 === 0;

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'match' && (
          <motion.div key={`m-${round}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="flex justify-center gap-2">
              {ROUNDS.map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i <= round ? 'bg-amber-400' : 'bg-amber-100'}`} />)}
            </div>
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <motion.span key={r.id} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-7xl block mb-2">{r.thing}</motion.span>
              <p className="font-display font-black text-lg text-gray-800">Where does the {r.name} get energy?</p>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              {(sunLeft ? ['sun', 'food'] : ['food', 'sun']).map(src => (
                <motion.button key={src} whileTap={{ scale: 0.92 }} onClick={pick} disabled={picked}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">{src === 'sun' ? '☀️' : '🍎'}</span>
                  <span className="font-black text-amber-700 text-xs uppercase">{src === 'sun' ? 'The Sun' : 'Food'}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🧒⚡</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Where do YOU get energy?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🍎</span><span className="font-black text-amber-700 text-xs uppercase">Food</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">☀️</span><span className="font-black text-sky-700 text-xs uppercase">Sunlight</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🍎⚡</motion.div>}
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
      <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">⚡</div>
        <p className="font-display font-black text-amber-600 text-sm">Energy Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🍎🏃☀️</p>
        <p className="font-black text-gray-700 text-base leading-snug">What food gave you energy to play today? Plants soak up the sun — and we eat plants and food to get our energy!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-amber-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-amber-500 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

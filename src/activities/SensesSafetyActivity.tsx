// Activity: Senses & Safety — Age 7 (Band B7)
// Foundation Phase Gr 2 — protect your senses; make safe choices.
// Pattern: Safety choices (3 scenarios) → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'choose' | 'why' | 'card';

interface Scenario {
  id: string; situation: string; emoji: string; sense: string;
  safe: { emoji: string; label: string };
  unsafe: { emoji: string; label: string };
  safeVoice: string; unsafeVoice: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'loud', situation: 'The music is VERY loud!', emoji: '🔊', sense: 'ears',
    safe:   { emoji: '🙉', label: 'Cover ears' },
    unsafe: { emoji: '🔊', label: 'Move closer' },
    safeVoice: 'Good choice! Loud sounds can hurt your ears. Cover them or move away!',
    unsafeVoice: 'Careful! Loud sounds hurt your ears. The safe way is to cover them or move away.',
  },
  {
    id: 'sun', situation: 'The sun is very bright!', emoji: '☀️', sense: 'eyes',
    safe:   { emoji: '🕶️', label: 'Wear shades' },
    unsafe: { emoji: '👀', label: 'Stare at sun' },
    safeVoice: 'Good choice! The bright sun can hurt your eyes. Wear sunglasses and a hat!',
    unsafeVoice: 'Careful! Never look at the sun — it hurts your eyes. Wear sunglasses instead!',
  },
  {
    id: 'hot', situation: 'The stove is hot!', emoji: '🔥', sense: 'skin',
    safe:   { emoji: '🚫✋', label: 'Do not touch' },
    unsafe: { emoji: '🤚', label: 'Touch it' },
    safeVoice: 'Good choice! A hot stove can burn your skin. Never touch it!',
    unsafeVoice: 'Careful! A hot stove burns your skin. Never touch it — stay away!',
  },
];

const OBJECTIVE_ID = 'll.senses_safety';
const BADGE = 'Safety Star Badge 🛡️';

const CHOOSE_VOICE = "Our senses keep us safe. Pick the safe choice each time!";
const WHY_VOICE    = "What protects your eyes from the bright sun?";
const CARD_VOICE   = "You earned the Safety Star Badge! Talk about when you wear a hat or sunglasses. How do you keep your ears safe?";

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

export default function SensesSafetyActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('choose');
  const [round, setRound] = useState(0);
  const [chosen, setChosen] = useState<'safe' | 'unsafe' | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(CHOOSE_VOICE); return () => stopAudio(); }, []);

  const s = SCENARIOS[round];

  function choose(which: 'safe' | 'unsafe') {
    if (chosen) return;
    setChosen(which);
    const isLast = round + 1 >= SCENARIOS.length;
    speak(which === 'safe' ? s.safeVoice : s.unsafeVoice, 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 800) : undefined);
    setTimeout(() => {
      setChosen(null);
      if (!isLast) setRound(n => n + 1);
    }, 2400);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! Sunglasses and a hat protect your eyes from the bright sun. You are a safety star!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  // Randomise which side shows safe vs unsafe per round (deterministic by round index)
  const safeLeft = round % 2 === 0;
  const left  = safeLeft ? { which: 'safe' as const, opt: s.safe }   : { which: 'unsafe' as const, opt: s.unsafe };
  const right = safeLeft ? { which: 'unsafe' as const, opt: s.unsafe } : { which: 'safe' as const, opt: s.safe };

  return (
    <div className="fixed inset-0 bg-rose-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'choose' && (
          <motion.div key={`c-${round}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold">← Back</button>
            <div className="flex justify-center gap-2">
              {SCENARIOS.map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i <= round ? 'bg-rose-400' : 'bg-rose-100'}`} />)}
            </div>
            <div className="bg-white rounded-3xl p-6 border-2 border-rose-100 shadow-md text-center w-full max-w-xs">
              <motion.span key={s.id} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="text-7xl block mb-2">{s.emoji}</motion.span>
              <p className="font-display font-black text-lg text-gray-800">{s.situation}</p>
              <p className="text-xs text-gray-400 font-bold mt-1">What is the safe choice?</p>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              {[left, right].map((side, i) => (
                <motion.button key={i} whileTap={{ scale: 0.92 }} onClick={() => choose(side.which)} disabled={!!chosen}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl border-2 active:scale-95
                    ${chosen ? (side.which === 'safe' ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200 opacity-50') : 'bg-white border-rose-200'}`}>
                  <span className="text-5xl">{side.opt.emoji}</span>
                  <span className="font-black text-gray-700 text-[11px] uppercase text-center leading-tight">{side.opt.label}</span>
                  {chosen && side.which === 'safe' && <span className="text-green-600 text-lg">✓ Safe</span>}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-rose-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-rose-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">☀️👀</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">What protects your eyes from the bright sun?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-rose-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-rose-50 border-2 border-rose-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🕶️🧢</span><span className="font-black text-rose-700 text-xs uppercase">Shades &amp; hat</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">👀</span><span className="font-black text-gray-500 text-xs uppercase">Stare harder</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🕶️</motion.div>}
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
        <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🛡️</div>
        <p className="font-display font-black text-rose-700 text-sm">Safety Star Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-rose-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🕶️🧢🙉</p>
        <p className="font-black text-gray-700 text-base leading-snug">Talk together: When do you wear a hat or sunglasses? How do you keep your ears safe from loud sounds?</p>
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

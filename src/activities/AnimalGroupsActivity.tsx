// Activity: Animal Groups — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  bird flies, fish swims, dog walks — with movement words
// Predict (30s): "How does a fish move?" — 2 choices (SWIM vs FLY)
// Do      (60s): tap 6 animals → each shows its movement + word label
// Card   (120s): "Move like an animal — hop like a frog!"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';
type Move = 'FLY' | 'SWIM' | 'WALK';

interface Animal {
  id: string; emoji: string; name: string; move: Move; voice: string;
}

const ANIMALS: Animal[] = [
  { id: 'bird',     emoji: '🐦', name: 'Bird',     move: 'FLY',  voice: 'A bird FLIES through the sky with its wings!' },
  { id: 'fish',     emoji: '🐟', name: 'Fish',     move: 'SWIM', voice: 'A fish SWIMS in the water with its fins!' },
  { id: 'dog',      emoji: '🐕', name: 'Dog',      move: 'WALK', voice: 'A dog WALKS and runs on its four legs!' },
  { id: 'butterfly',emoji: '🦋', name: 'Butterfly',move: 'FLY',  voice: 'A butterfly FLIES with its colourful wings!' },
  { id: 'duck',     emoji: '🦆', name: 'Duck',     move: 'SWIM', voice: 'A duck SWIMS on top of the water!' },
  { id: 'cat',      emoji: '🐈', name: 'Cat',      move: 'WALK', voice: 'A cat WALKS softly on its paws!' },
];

const MOVE_META: Record<Move, { emoji: string; color: string; bg: string }> = {
  FLY:  { emoji: '🌤️', color: 'text-sky-700',    bg: 'bg-sky-100'    },
  SWIM: { emoji: '🌊', color: 'text-blue-700',   bg: 'bg-blue-100'   },
  WALK: { emoji: '🌳', color: 'text-green-700',  bg: 'bg-green-100'  },
};

const SEE_VOICE  = "Animals move in different ways! Birds FLY in the sky. Fish SWIM in the water. Dogs WALK on the ground. Let us find out how each animal moves!";
const CARD_VOICE = "Now move like an animal! Can you hop like a frog? Can you flap your arms like a bird? Can you swim like a fish?";

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

export default function AnimalGroupsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [predicted, setPredicted] = useState(false);
  const [tapped, setTapped]   = useState<Set<string>>(new Set());
  const [glowing, setGlowing] = useState<string | null>(null);
  const [wordFlash, setWordFlash] = useState<Move | null>(null);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('predict'), 8000);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  function predict(move: Move) {
    setPredicted(true);
    const correct = move === 'SWIM';
    speak(correct ? "Yes! A fish SWIMS in the water! Great thinking!" : "Let's find out! A fish SWIMS in the water!",
      0.85, () => setPhase('do'));
  }

  function tapAnimal(a: Animal) {
    if (tapped.has(a.id)) return;
    const isLast = tapped.size + 1 >= ANIMALS.length;
    speak(a.voice, 0.85, isLast ? () => setPhase('card') : undefined);
    setGlowing(a.id);
    setWordFlash(a.move);
    setTapped(prev => new Set([...prev, a.id]));
    setTimeout(() => { setGlowing(null); setWordFlash(null); }, 1500);
  }

  return (
    <div className="fixed inset-0 bg-teal-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <div className="flex gap-4">
              {[
                { e: '🐦', w: 'FLY',  a: { y: [0, -10, 0] } },
                { e: '🐟', w: 'SWIM', a: { x: [0, 8, 0] } },
                { e: '🐕', w: 'WALK', a: { y: [0, -4, 0] } },
              ].map((x, i) => (
                <div key={x.w} className="flex flex-col items-center gap-2">
                  <motion.span animate={x.a} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} className="text-5xl">{x.e}</motion.span>
                  <span className="font-black text-teal-700 text-xs uppercase">{x.w}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-teal-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-teal-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🐟❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">How does a FISH move?</p>
              <button onClick={() => speak("How does a fish move?")} className="mt-2 flex items-center gap-1 mx-auto text-teal-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict('SWIM')}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-3xl active:scale-95">
                <span className="text-5xl">🌊</span>
                <span className="font-black text-blue-700 text-sm uppercase">SWIM</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict('FLY')}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                <span className="text-5xl">🌤️</span>
                <span className="font-black text-sky-700 text-sm uppercase">FLY</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-center">
            <motion.div animate={{ x: [0, 12, 0] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">🐟</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-teal-600 text-sm uppercase tracking-widest mb-3">
              Tap an animal — how does it move?
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {ANIMALS.map(a => (
                <div key={a.id} className={`w-3 h-3 rounded-full ${tapped.has(a.id) ? 'bg-teal-400' : 'bg-teal-100'}`} />
              ))}
            </div>

            {/* Word flash */}
            <AnimatePresence>
              {wordFlash && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.3, opacity: 0 }}
                  className={`absolute inset-x-8 top-24 z-20 rounded-3xl p-4 text-center shadow-xl ${MOVE_META[wordFlash].bg}`}>
                  <p className="text-5xl">{MOVE_META[wordFlash].emoji}</p>
                  <p className={`font-display font-black text-4xl ${MOVE_META[wordFlash].color}`}>{wordFlash}!</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-3 flex-1 content-center">
              {ANIMALS.map(a => {
                const done = tapped.has(a.id);
                const glow = glowing === a.id;
                return (
                  <motion.button key={a.id} animate={glow ? { scale: [1, 1.18, 0.95, 1] } : {}} transition={{ duration: 0.4 }}
                    onClick={() => tapAnimal(a)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-3xl min-h-[88px] border-2 transition-all active:scale-95
                      ${done ? `${MOVE_META[a.move].bg} border-transparent` : 'bg-white border-gray-100 shadow-sm'}`}>
                    <span className="text-4xl">{a.emoji}</span>
                    <span className={`text-[10px] font-black uppercase ${done ? MOVE_META[a.move].color : 'text-gray-300'}`}>
                      {done ? a.move : a.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
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
      <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-teal-100 border-2 border-teal-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-teal-600 uppercase tracking-widest">Move Like Animals!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-teal-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🐸🦅🐟</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Play the moving game together! Hop like a frog. Flap your arms like a bird. Wiggle like a fish. What other animals can you be?
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs mb-5">
        {[{ e: '🐸', t: 'Hop' }, { e: '🦅', t: 'Flap' }, { e: '🐍', t: 'Slither' }].map(x => (
          <div key={x.t} className="bg-teal-50 border-2 border-teal-100 rounded-2xl p-3 text-center">
            <span className="text-3xl">{x.e}</span><p className="text-[10px] font-black text-teal-700 uppercase mt-1">{x.t}</p>
          </div>
        ))}
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CCFBF1" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#14B8A6" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-teal-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-teal-500 shadow-[0_6px_0_#0D9488] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

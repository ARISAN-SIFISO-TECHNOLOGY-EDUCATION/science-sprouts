// Activity: Push & Pull — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  child pushes box away, pulls wagon closer — with word labels
// Predict (30s): "To bring the wagon CLOSER, do you push or pull?" — 2 choices
// Do      (60s): tap PUSH or PULL on objects → see them move + word label
// Card   (120s): "Push your toy car. Now pull it back!"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';
type Force = 'PUSH' | 'PULL';

interface Thing { id: string; emoji: string; name: string; }

const THINGS: Thing[] = [
  { id: 'box',    emoji: '📦', name: 'Box'    },
  { id: 'wagon',  emoji: '🛒', name: 'Wagon'  },
  { id: 'ball',   emoji: '⚽', name: 'Ball'   },
  { id: 'door',   emoji: '🚪', name: 'Door'   },
];

const SEE_VOICE  = "We can move things with our muscles! When we PUSH, we move things away from us. When we PULL, we bring things closer to us. Push and pull!";
const CARD_VOICE = "Now play with a toy together! PUSH your toy car away from you. Then PULL it back. Say the words push and pull as you move it!";

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

export default function PushPullActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [predicted, setPredicted] = useState(false);
  const [thingIdx, setThingIdx] = useState(0);
  const [doneForces, setDoneForces] = useState<Set<string>>(new Set()); // "box-PUSH" keys
  const [moveDir, setMoveDir] = useState<Force | null>(null);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('predict'), 8000);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  function predict(force: Force) {
    setPredicted(true);
    speak(force === 'PULL' ? "Yes! We PULL to bring things closer! Great thinking!" : "Let's find out! We PULL things to bring them closer to us!",
      0.85, () => setPhase('do'));
  }

  const thing = THINGS[thingIdx];

  function applyForce(force: Force) {
    const key = `${thing.id}-${force}`;
    if (doneForces.has(key)) return;
    setMoveDir(force);
    const next = new Set([...doneForces, key]);
    setDoneForces(next);

    // Each thing needs both PUSH and PULL done; advance when both done
    const bothDone = next.has(`${thing.id}-PUSH`) && next.has(`${thing.id}-PULL`);
    const isLastThing = thingIdx >= THINGS.length - 1;
    const allComplete = bothDone && isLastThing;

    speak(
      force === 'PUSH' ? `PUSH! The ${thing.name} moves away!` : `PULL! The ${thing.name} comes closer!`,
      0.85,
      allComplete ? () => setTimeout(() => setPhase('card'), 600) : undefined
    );

    setTimeout(() => {
      setMoveDir(null);
      if (bothDone && !isLastThing) setThingIdx(i => i + 1);
    }, 1400);
  }

  const pushDone = doneForces.has(`${thing.id}-PUSH`);
  const pullDone = doneForces.has(`${thing.id}-PULL`);

  return (
    <div className="fixed inset-0 bg-violet-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-4xl">🧒</span>
                  <motion.span animate={{ x: [0, 12, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="text-3xl">📦</motion.span>
                </div>
                <span className="font-black text-violet-700 text-sm uppercase">PUSH →</span>
                <span className="text-[10px] text-gray-400 font-bold">moves away</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <motion.span animate={{ x: [0, -12, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="text-3xl">🛒</motion.span>
                  <span className="text-4xl">🧒</span>
                </div>
                <span className="font-black text-violet-700 text-sm uppercase">← PULL</span>
                <span className="text-[10px] text-gray-400 font-bold">comes closer</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-violet-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-violet-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🛒⬅️</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">To bring the wagon CLOSER, do you push or pull?</p>
              <button onClick={() => speak("To bring the wagon closer, do you push or pull?")} className="mt-2 flex items-center gap-1 mx-auto text-violet-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict('PULL')}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-violet-50 border-2 border-violet-200 rounded-3xl active:scale-95">
                <span className="text-5xl">🤏</span>
                <span className="font-black text-violet-700 text-sm uppercase">PULL</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict('PUSH')}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-pink-50 border-2 border-pink-200 rounded-3xl active:scale-95">
                <span className="text-5xl">✋</span>
                <span className="font-black text-pink-700 text-sm uppercase">PUSH</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-center">
            <motion.div animate={{ x: [0, -12, 0] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">🛒</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-violet-600 text-sm uppercase tracking-widest mb-3">
              Push it AND pull it!
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {THINGS.map((t, i) => (
                <div key={t.id} className={`w-3 h-3 rounded-full ${i < thingIdx ? 'bg-violet-400' : i === thingIdx ? 'bg-violet-300' : 'bg-violet-100'}`} />
              ))}
            </div>

            {/* Stage: the thing moving */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full h-40 bg-white rounded-3xl border-2 border-violet-100 flex items-center justify-center overflow-hidden">
                <span className="absolute left-6 text-4xl">🧒</span>
                <motion.span
                  animate={moveDir === 'PUSH' ? { x: [0, 80] } : moveDir === 'PULL' ? { x: [0, -60] } : { x: 0 }}
                  transition={{ duration: 1.2 }}
                  className="text-5xl">{thing.emoji}</motion.span>
                {moveDir && (
                  <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute bottom-3 font-display font-black text-2xl text-violet-600">
                    {moveDir}! {moveDir === 'PUSH' ? '→' : '←'}
                  </motion.p>
                )}
              </div>
            </div>

            <p className="text-center font-black text-gray-500 text-sm mb-2">The {thing.name}</p>

            {/* Force buttons */}
            <div className="flex gap-4">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => applyForce('PUSH')} disabled={pushDone}
                className={`flex-1 py-5 rounded-3xl flex flex-col items-center gap-1 active:scale-95 transition-all
                  ${pushDone ? 'bg-pink-100 border-2 border-pink-200 opacity-60' : 'bg-pink-400 shadow-[0_5px_0_#DB2777] text-white'}`}>
                <span className="text-3xl">✋</span>
                <span className="font-black text-sm uppercase">{pushDone ? 'Pushed ✓' : 'PUSH →'}</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => applyForce('PULL')} disabled={pullDone}
                className={`flex-1 py-5 rounded-3xl flex flex-col items-center gap-1 active:scale-95 transition-all
                  ${pullDone ? 'bg-violet-100 border-2 border-violet-200 opacity-60' : 'bg-violet-400 shadow-[0_5px_0_#7C3AED] text-white'}`}>
                <span className="text-3xl">🤏</span>
                <span className="font-black text-sm uppercase">{pullDone ? 'Pulled ✓' : '← PULL'}</span>
              </motion.button>
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
      <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-violet-100 border-2 border-violet-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-violet-600 uppercase tracking-widest">Push & Pull Play!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-violet-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🚗👐</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Find a toy car or a box together. PUSH it away from you. Then PULL it back. Say "push" and "pull" each time you move it!
        </p>
      </div>
      <div className="flex gap-3 w-full max-w-xs mb-5">
        <div className="flex-1 bg-pink-50 border-2 border-pink-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">✋</span><p className="text-[10px] font-black text-pink-700 uppercase mt-1">PUSH = away</p>
        </div>
        <div className="flex-1 bg-violet-50 border-2 border-violet-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">🤏</span><p className="text-[10px] font-black text-violet-700 uppercase mt-1">PULL = closer</p>
        </div>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EDE9FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8B5CF6" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-violet-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-violet-500 shadow-[0_6px_0_#7C3AED] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

// Activity: Sedimentary Rocks & Fossils — Age 10 (Band C · CAPS Gr 5)
//   Plan (predict) → Find the oldest fossil in the rock layers → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

// Each round: fossils listed TOP (newest) → BOTTOM (oldest). Oldest = last.
const ROUNDS: { id: string; emoji: string }[][] = [
  [{ id: 'shell', emoji: '🐚' }, { id: 'fish', emoji: '🐟' }, { id: 'dino', emoji: '🦕' }],
  [{ id: 'leaf', emoji: '🍃' }, { id: 'snail', emoji: '🐌' }, { id: 'bone', emoji: '🦴' }, { id: 'trilo', emoji: '🦂' }],
  [{ id: 'fern', emoji: '🌿' }, { id: 'amber', emoji: '🟠' }, { id: 'skull', emoji: '💀' }],
];

const OBJECTIVE_ID = 'eb.fossils';
const BADGE = 'Fossil Hunter Badge 🦕';

const PLAN_VOICE = "Sedimentary rock is made of layers of sand and mud that pile up over millions of years. New layers settle on top of old ones. So which fossil is the oldest — the one at the top, or the one at the bottom? Predict!";
const TEST_VOICE = "Each rock has layers. The bottom layer settled first, long ago. Tap the OLDEST fossil — the one deepest down.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Fossil Hunter Badge! Look at a cliff, a road cutting, or even a layered cake. The bottom layer was made first. Fossils in the deepest layers are the oldest of all!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function FossilsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [round, setRound] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const layers = ROUNDS[round] ?? ROUNDS[0];
  const oldestIdx = layers.length - 1;

  function predict() { setPredicted(true); speak("Let's dig for the oldest fossils!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function tap(i: number) {
    if (i === oldestIdx) {
      speak("Correct! The deepest layer is the oldest.", 0.95);
      if (round + 1 >= ROUNDS.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 900);
      else setTimeout(() => setRound(r => r + 1), 900);
    } else {
      setShakeId(layers[i].id); speak("That layer is higher up, so it is younger. Go deeper!", 0.9);
      setTimeout(() => setShakeId(null), 500);
    }
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'layers' && blank2 === 'bottom') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Sedimentary rock forms in layers over many years. The bottom layer settled first, so it is the oldest. That is how scientists know which fossils are most ancient. You are a Fossil Hunter!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Sedimentary rock forms in layers, and the bottom layer is oldest. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🪨🦕🐚</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Which fossil is oldest — top layer or bottom layer?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-600 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">⬆️</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">Top</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">⬇️</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">Bottom</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⛏️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-4">
            <button onClick={onExit} className="self-start text-amber-400 text-sm font-bold">← Back</button>
            <p className="text-center text-xs text-amber-500 font-black uppercase">Rock {round + 1} of {ROUNDS.length}</p>
            <p className="font-display font-black text-amber-700 text-base">Tap the OLDEST fossil ⬇️</p>
            <div className="w-full max-w-xs flex flex-col gap-1">
              <p className="text-[10px] font-black text-amber-400 uppercase text-center">surface — newest</p>
              {layers.map((l, i) => (
                <motion.button key={l.id} whileTap={{ scale: 0.97 }} onClick={() => tap(i)}
                  animate={shakeId === l.id ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
                  className="w-full py-4 rounded-xl border-2 border-amber-300 flex items-center justify-center gap-3 active:scale-95"
                  style={{ background: `hsl(35, 50%, ${82 - i * 11}%)` }}>
                  <span className="text-3xl">{l.emoji}</span>
                  <span className="font-black text-amber-900 text-xs uppercase">Layer {i + 1}</span>
                </motion.button>
              ))}
              <p className="text-[10px] font-black text-amber-700 uppercase text-center">deep down — oldest</p>
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-amber-400 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Sedimentary rock forms in{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank1 ?? '____'}</span>{' '}
                over many years. The{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank2 ?? '____'}</span>{' '}
                layer is the oldest.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — rock forms in…</p>
              <div className="flex gap-2">{['layers', 'bubbles'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — oldest layer is the…</p>
              <div className="flex gap-2">{['bottom', 'top'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-amber-500 shadow-[0_5px_0_#D97706]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-amber-400 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🦕</div>
        <p className="font-display font-black text-amber-700 text-sm">Fossil Hunter Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🪨🦴🦕</p>
        <p className="font-black text-gray-700 text-base leading-snug">Look at a cliff, a road cutting, or a layered cake. The bottom layer was made first. The deepest fossils are the oldest!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D97706" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-amber-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-amber-600 shadow-[0_6px_0_#B45309] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

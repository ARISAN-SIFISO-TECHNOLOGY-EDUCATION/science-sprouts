// Activity: Tides — Age 12 (Band C12 · CAPS Gr 7)
//   Plan (predict) → Investigate: move the Moon, watch the sea bulge → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const OBJECTIVE_ID = 'eb.tides';
const BADGE = 'Tide Watcher Badge 🌊';

const PLAN_VOICE = "Twice a day the sea rises and falls — these are the tides. The Moon's gravity pulls on Earth's oceans. The water nearest the Moon bulges toward it, making a high tide. What pulls the sea up into a high tide — the Sun's heat, or the Moon's gravity? Predict!";
const TEST_VOICE = "Drag the slider to move the Moon around the Earth. Watch the ocean bulge toward the Moon. When the bulge lines up under the Moon, that coast has a high tide — then record your result.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Tide Watcher Badge! If you ever visit the sea, notice the wet sand the tide left behind. Tide tables, printed in newspapers and online, predict high and low tide for every day — all worked out from the position of the Moon.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function TidesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [angle, setAngle] = useState(0);     // Moon angle around Earth, 0…360°
  const [seen, setSeen] = useState(false);   // gate Record on having lined up a high tide
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const rad = (angle * Math.PI) / 180;
  const moonX = 50 + 38 * Math.cos(rad);
  const moonY = 50 + 38 * Math.sin(rad);
  // Coast marker sits on the right of Earth (angle 0). High tide when Moon is near it.
  const highTide = angle <= 25 || angle >= 335;

  function predict() { setPredicted(true); speak("Let's see how the Moon pulls the sea!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function onAngle(v: number) {
    setAngle(v);
    if ((v <= 25 || v >= 335) && !seen) { setSeen(true); speak("High tide! The sea bulges toward the Moon.", 0.92); }
  }

  function record() { setPhase('conclude'); speak(CONCLUDE_VOICE); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'Moon' && blank2 === 'gravity') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The Moon's gravity pulls the oceans, making the water bulge toward it into a high tide. As Earth spins, every coast passes through high and low tide twice a day. You are a Tide Watcher!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("It is the Moon's gravity that pulls the sea. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-blue-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌙🌍🌊</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">What pulls the sea up into a high tide?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-blue-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-blue-200 rounded-3xl active:scale-95"><span className="text-3xl">☀️</span><p className="font-black text-blue-700 text-[11px] uppercase mt-1">Sun's heat</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-blue-200 rounded-3xl active:scale-95"><span className="text-3xl">🌙</span><p className="font-black text-blue-700 text-[11px] uppercase mt-1">Moon's pull</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌊</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-blue-700 text-base">🌊 Tide Model</p>
            {/* Earth + ocean bulge + Moon */}
            <div className="relative w-60 h-60">
              {/* ocean bulge stretches toward the Moon */}
              <motion.div animate={{ rotate: angle }} style={{ transformOrigin: '50% 50%' }} className="absolute inset-0 flex items-center">
                <div className="w-full h-[58%] mx-auto my-auto bg-blue-300/60 rounded-[50%]" style={{ width: '100%', height: '64%', margin: 'auto' }} />
              </motion.div>
              {/* Earth */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-4xl shadow-inner">🌍</div>
              {/* coast marker (fixed on the right) */}
              <div className={`absolute top-1/2 right-[18%] -translate-y-1/2 text-xl transition-transform ${highTide ? 'scale-125' : ''}`}>📍</div>
              {/* Moon */}
              <div className="absolute text-3xl -translate-x-1/2 -translate-y-1/2" style={{ left: `${moonX}%`, top: `${moonY}%` }}>🌙</div>
            </div>
            <div className={`px-5 py-2 rounded-2xl font-display font-black text-lg ${highTide ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              {highTide ? '📍 High tide! 🌊' : '📍 Low tide'}
            </div>
            <div className="w-full max-w-xs">
              <p className="text-xs text-blue-600 font-bold text-center mb-1">Move the Moon around Earth</p>
              <input type="range" min={0} max={360} value={angle} onChange={e => onAngle(Number(e.target.value))} className="w-full accent-blue-600 h-3" />
            </div>
            <button onClick={record} disabled={!seen} className={`px-8 py-4 rounded-3xl font-display font-black text-lg text-white btn-press ${seen ? 'bg-blue-600 shadow-[0_5px_0_#1D4ED8]' : 'bg-gray-300'}`}>
              {seen ? 'Record result →' : 'Line the Moon up with 📍…'}
            </button>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-blue-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A high tide happens where the sea bulges toward the{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-blue-200 text-blue-300'}`}>{blank1 ?? '____'}</span>.
                The sea is pulled by the Moon's{' '}
                <span className={`inline-block min-w-[64px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-blue-200 text-blue-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — sea bulges toward the…</p>
              <div className="flex gap-2">{['Moon', 'Sun'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank1 === w ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — pulled by the Moon's…</p>
              <div className="flex gap-2">{['gravity', 'heat'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-blue-600 shadow-[0_5px_0_#1D4ED8]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌊</div>
        <p className="font-display font-black text-blue-700 text-sm">Tide Watcher Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-blue-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌙🌍🏖️</p>
        <p className="font-black text-gray-700 text-base leading-snug">At the sea, notice the wet sand the tide left behind. Tide tables predict high and low tide every day — all worked out from the Moon's position!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DBEAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1D4ED8" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-blue-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-blue-600 shadow-[0_6px_0_#1E40AF] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

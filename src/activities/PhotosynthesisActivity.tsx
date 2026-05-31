// Activity: Photosynthesis — Age 9 (Band B · CAPS Gr 4)
// First "why does it work" topic. Light slider sim → measure → conclude.
//   Plan (predict) → Light slider + measure height at 3 levels → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Level { id: string; name: string; light: number; cm: number; }
const LEVELS: Level[] = [
  { id: 'low',  name: 'Low',  light: 10,  cm: 2 },
  { id: 'med',  name: 'Med',  light: 50,  cm: 10 },
  { id: 'high', name: 'High', light: 100, cm: 20 },
];
const MAX_CM = 20;

const OBJECTIVE_ID = 'll.photosynthesis';
const BADGE = 'Plant Power Badge 🌿';

const PLAN_VOICE = "Plants make their own food using sunlight. Will a plant grow TALLER with more light, or less light? Predict!";
const TEST_VOICE = "Slide the sun to change the light. Then tap Low, Medium and High to measure the plant's height.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Plant Power Badge! At home: grow two bean seeds. Put one on a sunny windowsill and one in a dark cupboard. Measure them after a week.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function PhotosynthesisActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [light, setLight] = useState(50);
  const [measured, setMeasured] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const all = measured.size >= LEVELS.length;
  const plantCm = Math.round(light / 5);          // 0–20 cm
  const bubbles = Math.round(light / 20);          // 0–5 O2 bubbles

  function predict() { setPredicted(true); speak("Let's test different light levels and measure!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function measure(l: Level) {
    if (measured.has(l.id)) return;
    setLight(l.light);
    speak(`${l.name} light: the plant grew to ${l.cm} centimetres.`, 0.95);
    setMeasured(prev => new Set([...prev, l.id]));
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'taller' && blank2 === 'food') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A plant grows taller with more light because light helps it make food. That is photosynthesis! You earned Plant Power!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Look at your graph — more light made the plant do what? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-green-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-green-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">☀️🌱</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Plants make their own food from sunlight. Does more light grow a taller plant?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-green-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-green-200 rounded-3xl active:scale-95"><span className="text-3xl">🔼</span><p className="font-black text-green-700 text-[11px] uppercase mt-1">Taller</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-green-200 rounded-3xl active:scale-95"><span className="text-3xl">🔽</span><p className="font-black text-green-700 text-[11px] uppercase mt-1">Shorter</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌿</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-1">← Back</button>
            <p className="text-center font-display font-black text-green-700 text-base">Photosynthesis Lab ☀️</p>
            <p className="text-center text-[10px] text-gray-400 font-bold mb-2">CO₂ + 💧 water + ☀️ light → 🍬 glucose + O₂</p>

            {/* live plant scene */}
            <div className="bg-gradient-to-b from-sky-100 to-green-100 rounded-2xl border-2 border-green-100 p-3 flex items-end justify-center gap-4 h-40 relative overflow-hidden">
              <span className="text-3xl absolute top-2 left-3" style={{ opacity: 0.3 + light / 140 }}>☀️</span>
              {/* O2 bubbles */}
              <div className="absolute top-2 right-4 flex flex-col gap-0.5">
                {Array.from({ length: bubbles }).map((_, i) => (
                  <motion.span key={i} animate={{ y: [-2, -10, -2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="text-xs">🫧</motion.span>
                ))}
              </div>
              <div className="flex flex-col items-center justify-end h-full">
                <motion.div animate={{ height: 20 + plantCm * 6 }} className="w-2 bg-green-500 rounded-t-full relative" style={{ minHeight: 12 }}>
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">{plantCm < 3 ? '🥀' : '🌿'}</span>
                </motion.div>
                <div className="w-12 h-3 bg-amber-700 rounded-b-md" />
              </div>
            </div>

            {/* sun slider */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase"><span>🌑 Dark</span><span>Light: {light}%</span><span>☀️ Bright</span></div>
              <input type="range" min={0} max={100} value={light} onChange={e => setLight(Number(e.target.value))} className="w-full accent-green-500" />
            </div>

            {/* bar chart */}
            <p className="text-center text-[10px] font-black text-gray-400 uppercase mt-2 mb-1">Plant height (cm) by light level</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-green-100 p-3 min-h-[110px]">
              {LEVELS.map(l => {
                const done = measured.has(l.id);
                const top = l.id === 'high';
                return (
                  <div key={l.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-green-700 mb-0.5">{l.cm}cm</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(l.cm / MAX_CM) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (top ? 'bg-green-600' : 'bg-green-400') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-1">{l.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {LEVELS.map(l => (
                  <button key={l.id} onClick={() => measure(l)} disabled={measured.has(l.id)} className={`py-3 rounded-2xl border-2 font-black text-xs active:scale-95 ${measured.has(l.id) ? 'bg-green-100 border-green-200 text-green-400' : 'bg-white border-green-200 text-green-700'}`}>{measured.has(l.id) ? '✓' : `${l.name} light`}</button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-green-500 shadow-[0_5px_0_#16A34A] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-green-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-green-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A plant grows{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-green-100 border-green-400 text-green-700' : 'border-green-200 text-green-300'}`}>{blank1 ?? '____'}</span>{' '}
                with more light because light helps it make{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-green-100 border-green-400 text-green-700' : 'border-green-200 text-green-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['taller', 'shorter'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-700 border-green-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['food', 'water'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-700 border-green-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-green-500 shadow-[0_5px_0_#16A34A]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌿</div>
        <p className="font-display font-black text-green-700 text-sm">Plant Power Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-green-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🪴☀️ vs 🪴🌑</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: grow two bean seeds. Put one in sunlight and one in a dark cupboard. Measure both after a week — which grew taller?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DCFCE7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#16A34A" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-green-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-green-600 shadow-[0_6px_0_#15803D] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

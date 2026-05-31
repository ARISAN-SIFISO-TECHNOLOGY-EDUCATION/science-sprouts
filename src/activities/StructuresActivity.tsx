// Activity: Strong Structures — Age 9 (Band B · CAPS Gr 4)
//   Plan (predict) → Load-test 3 shapes (max kg) → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Shape { id: string; emoji: string; name: string; load: number; }
const SHAPES: Shape[] = [
  { id: 'square',   emoji: '⬛', name: 'Square',   load: 20 },
  { id: 'arch',     emoji: '🌉', name: 'Arch',     load: 35 },
  { id: 'triangle', emoji: '🔺', name: 'Triangle', load: 50 },
];
const MAX_LOAD = 50;

const OBJECTIVE_ID = 'mm.structures';
const BADGE = 'Engineer Badge 🏗️';

const PLAN_VOICE = "Engineers choose strong shapes. Which shape do you think is strongest — a square or a triangle? Predict!";
const TEST_VOICE = "Tap each shape to load it with weights until it bends. Record how many kilograms it can hold.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Engineer Badge! At home: fold paper into a square tube and a triangle tube. Stack books on each. Which holds more?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function StructuresActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const all = tested.size >= SHAPES.length;
  const strongest = SHAPES.reduce((a, b) => (b.load > a.load ? b : a));

  function predict() { setPredicted(true); speak("Let's load-test each shape and record the weight!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function test(s: Shape) { if (tested.has(s.id)) return; speak(`${s.name}: held ${s.load} kilograms before bending.`, 0.92); setTested(p => new Set([...p, s.id])); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'triangle' && blank2 === 'bend') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The triangle is the strongest shape because it does not bend easily. That is why bridges and towers use triangles. You are an Engineer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Look at your graph — which shape held the most weight? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-stone-100 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-stone-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">⬛ 🔺</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Which shape is the strongest?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-stone-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-stone-200 rounded-3xl active:scale-95"><span className="text-3xl">⬛</span><p className="font-black text-stone-700 text-[11px] uppercase mt-1">Square</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-stone-200 rounded-3xl active:scale-95"><span className="text-3xl">🔺</span><p className="font-black text-stone-700 text-[11px] uppercase mt-1">Triangle</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🏗️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-stone-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-stone-700 text-base mb-1">Structure Lab 🏗️</p>
            <p className="text-center text-xs text-stone-500 font-bold mb-3">Tap each shape · record weight held (kg)</p>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-1">Weight held (kg)</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-stone-200 p-3 min-h-[150px]">
              {SHAPES.map(s => {
                const done = tested.has(s.id);
                const top = s.id === strongest.id;
                return (
                  <div key={s.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-stone-700 mb-0.5">{s.load}kg</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(s.load / MAX_LOAD) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (top ? 'bg-stone-700' : 'bg-stone-400') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-xl mt-1">{s.emoji}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase">{s.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {SHAPES.map(s => (
                  <button key={s.id} onClick={() => test(s)} disabled={tested.has(s.id)} className={`py-3 rounded-2xl border-2 font-black text-[11px] active:scale-95 flex flex-col items-center gap-0.5 ${tested.has(s.id) ? 'bg-stone-200 border-stone-300 text-stone-400' : 'bg-white border-stone-200 text-stone-700'}`}>
                    <span className="text-xl">{s.emoji}</span>{tested.has(s.id) ? '✓' : s.name}
                  </button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-stone-600 shadow-[0_5px_0_#57534E] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-stone-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-stone-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                The{' '}
                <span className={`inline-block min-w-[68px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-stone-200 border-stone-400 text-stone-700' : 'border-stone-200 text-stone-300'}`}>{blank1 ?? '______'}</span>{' '}
                is the strongest shape because it does not{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-stone-200 border-stone-400 text-stone-700' : 'border-stone-200 text-stone-300'}`}>{blank2 ?? '____'}</span>{' '}
                easily.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['square', 'arch', 'triangle'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-[11px] border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-stone-600 text-white border-stone-600' : 'bg-white text-stone-700 border-stone-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['bend', 'shine'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-stone-600 text-white border-stone-600' : 'bg-white text-stone-700 border-stone-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-stone-600 shadow-[0_5px_0_#57534E]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-stone-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-stone-600 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🏗️</div>
        <p className="font-display font-black text-stone-700 text-sm">Engineer Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-stone-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">📄🔺📚</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: fold paper into a square tube and a triangle tube. Stack books on each. Which shape holds more before it bends?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E7E5E4" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#57534E" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-stone-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-stone-700 shadow-[0_6px_0_#44403C] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

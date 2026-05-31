// Activity: Plant Reproduction — Age 9 (Band B · CAPS Gr 4)
//   Plan (predict) → Observe pollination (bee vs none) + count seeds → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Trial { id: string; emoji: string; name: string; seeds: number; }
const TRIALS: Trial[] = [
  { id: 'nobee', emoji: '🌸', name: 'No bee',   seeds: 0 },
  { id: 'bee',   emoji: '🐝', name: 'Bee visits', seeds: 6 },
];
const MAX_SEEDS = 6;

const OBJECTIVE_ID = 'll.plant_reproduction';
const BADGE = 'Pollinator Badge 🐝';

const PLAN_VOICE = "Flowers make seeds to grow new plants. Does a flower need a bee to make seeds? Predict yes or no.";
const TEST_VOICE = "Tap each flower to watch. Count how many seeds form with and without a bee.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Pollinator Badge! Outside: find a flower. Look for yellow pollen inside, and watch for bees or insects visiting.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function PlantReproductionActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [observed, setObserved] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const all = observed.size >= TRIALS.length;

  function predict() { setPredicted(true); speak("Let's watch two flowers and count the seeds!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function observe(t: Trial) { if (observed.has(t.id)) return; speak(t.seeds === 0 ? "No bee, no pollen moved — so no seeds formed." : "The bee carried pollen between flowers — six seeds formed!", 0.92); setObserved(p => new Set([...p, t.id])); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'pollen' && blank2 === 'bee') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A flower needs pollen to make seeds, and the bee carries it from flower to flower. You are a Pollinator scientist!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Which flower made seeds — the one the bee visited? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-pink-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-pink-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-pink-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌸🐝</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Does a flower need a bee to make seeds?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-pink-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-pink-200 rounded-3xl active:scale-95"><span className="text-3xl">✅</span><p className="font-black text-pink-700 text-[11px] uppercase mt-1">Yes</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-pink-200 rounded-3xl active:scale-95"><span className="text-3xl">🚫</span><p className="font-black text-pink-700 text-[11px] uppercase mt-1">No</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🐝</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-pink-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-pink-700 text-base mb-1">Pollination Lab 🌸</p>
            <p className="text-center text-xs text-pink-500 font-bold mb-3">Tap each flower · count the seeds</p>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-1">Seeds formed</p>
            <div className="flex-1 flex items-end justify-around gap-6 bg-white rounded-2xl border-2 border-pink-100 p-3 min-h-[150px]">
              {TRIALS.map(t => {
                const done = observed.has(t.id);
                const win = t.id === 'bee';
                return (
                  <div key={t.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-pink-700 mb-0.5">{t.seeds} 🌰</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(t.seeds / MAX_SEEDS) * 100}%` : 6 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (win ? 'bg-pink-600' : 'bg-pink-200') : 'bg-gray-100'}`} style={{ minHeight: 6 }} />
                    <span className="text-xl mt-1">{t.emoji}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase">{t.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-2 gap-3 mt-3">
                {TRIALS.map(t => (
                  <button key={t.id} onClick={() => observe(t)} disabled={observed.has(t.id)} className={`py-3 rounded-2xl border-2 font-black text-xs active:scale-95 ${observed.has(t.id) ? 'bg-pink-100 border-pink-200 text-pink-400' : 'bg-white border-pink-200 text-pink-700'}`}>{observed.has(t.id) ? '✓ Watched' : `${t.emoji} ${t.name}`}</button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-pink-500 shadow-[0_5px_0_#DB2777] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-pink-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-pink-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-pink-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A flower needs{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-pink-100 border-pink-400 text-pink-700' : 'border-pink-200 text-pink-300'}`}>{blank1 ?? '____'}</span>{' '}
                to make seeds. The{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-pink-100 border-pink-400 text-pink-700' : 'border-pink-200 text-pink-300'}`}>{blank2 ?? '____'}</span>{' '}
                carries it between flowers.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['pollen', 'water'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-700 border-pink-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['bee', 'rock'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-pink-700 border-pink-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-pink-500 shadow-[0_5px_0_#DB2777]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-pink-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🐝</div>
        <p className="font-display font-black text-pink-700 text-sm">Pollinator Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌷🔍🐝</p>
        <p className="font-black text-gray-700 text-base leading-snug">Outside: find a flower. Look for the yellow pollen inside, and watch for bees or insects visiting to carry it.</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FCE7F3" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DB2777" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-pink-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-pink-600 shadow-[0_6px_0_#BE185D] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

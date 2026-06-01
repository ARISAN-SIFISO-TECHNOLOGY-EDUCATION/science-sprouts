// Activity: Solutions & Dissolving — Age 11 (Band C11 · CAPS Gr 6)
//   Plan (predict) → Investigate: water temperature vs dissolving time → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const OBJECTIVE_ID = 'mm.dissolving';
const BADGE = 'Dissolving Detective Badge 🥤';

const PLAN_VOICE = "When sugar disappears into water, it dissolves — it makes a solution. The sugar is the solute and the water is the solvent. Does sugar dissolve faster in hot water, or in cold water? Predict!";
const TEST_VOICE = "Drag the slider to change the water temperature. Watch how long the sugar takes to dissolve. When you have tested it, record your result.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Dissolving Detective Badge! Help stir sugar into a cold drink and a warm one. Which dissolves faster? Heat makes the water particles move faster, so they break the sugar apart more quickly.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function DissolvingActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [temp, setTemp] = useState(10);
  const [seen, setSeen] = useState(false);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  // Dissolving time falls as temperature rises: 10°C→60s … 90°C→8s
  const dissolveTime = Math.round(60 - (temp - 10) * 0.65);

  function predict() { setPredicted(true); speak("Let's test how temperature changes dissolving!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function onTemp(v: number) {
    setTemp(v);
    if (v >= 80 && !seen) { setSeen(true); const t = Math.round(60 - (v - 10) * 0.65); speak(`Very hot water! The sugar dissolved in only ${t} seconds.`, 0.92); }
  }

  function record() { setPhase('conclude'); speak(CONCLUDE_VOICE); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'faster' && blank2 === 'solvent') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Sugar dissolves faster in hot water. The sugar is the solute, and the water it dissolves into is the solvent. Together they make a solution. You are a Dissolving Detective!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Hot water dissolves faster. The water is the solvent. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-sky-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🍬🥤🌡️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Does sugar dissolve faster in hot or cold water?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-sky-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-sky-200 rounded-3xl active:scale-95"><span className="text-3xl">🔥</span><p className="font-black text-sky-700 text-[11px] uppercase mt-1">Hot</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-sky-200 rounded-3xl active:scale-95"><span className="text-3xl">🧊</span><p className="font-black text-sky-700 text-[11px] uppercase mt-1">Cold</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🥤</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-sky-700 text-base">🥤 Dissolving Test</p>
            {/* Glass */}
            <div className="w-28 h-32 rounded-b-3xl rounded-t-lg border-4 border-sky-200 flex items-end justify-center overflow-hidden relative" style={{ background: `linear-gradient(to top, rgba(56,189,248,${0.25 + temp / 300}), rgba(186,230,253,0.4))` }}>
              <span className="text-4xl mb-2">{temp >= 60 ? '♨️' : '🍬'}</span>
              <span className="absolute top-1 right-1 text-lg">{temp >= 60 ? '🔥' : temp >= 35 ? '🌤️' : '🧊'}</span>
            </div>
            <div className="px-5 py-2 rounded-2xl bg-sky-100 font-display font-black text-sky-700 text-lg">Dissolves in {dissolveTime}s</div>
            <div className="w-full max-w-xs">
              <p className="text-xs text-sky-600 font-bold text-center mb-1">Water temperature: {temp}°C</p>
              <input type="range" min={10} max={90} value={temp} onChange={e => onTemp(Number(e.target.value))} className="w-full accent-sky-500 h-3" />
              <div className="flex justify-between text-[10px] font-black text-sky-400 mt-1"><span>🧊 cold</span><span>🔥 hot</span></div>
            </div>
            <button onClick={record} disabled={!seen} className={`px-8 py-4 rounded-3xl font-display font-black text-lg text-white btn-press ${seen ? 'bg-sky-500 shadow-[0_5px_0_#0284C7]' : 'bg-gray-300'}`}>
              {seen ? 'Record result →' : 'Heat the water up…'}
            </button>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-sky-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Sugar dissolves{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-sky-100 border-sky-400 text-sky-700' : 'border-sky-200 text-sky-300'}`}>{blank1 ?? '____'}</span>{' '}
                in hot water. The sugar is the solute and the water is the{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-sky-100 border-sky-400 text-sky-700' : 'border-sky-200 text-sky-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — in hot water it dissolves…</p>
              <div className="flex gap-2">{['faster', 'slower'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-sky-700 border-sky-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — the water is the…</p>
              <div className="flex gap-2">{['solvent', 'solute'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-sky-700 border-sky-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-sky-500 shadow-[0_5px_0_#0284C7]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🥤</div>
        <p className="font-display font-black text-sky-700 text-sm">Dissolving Detective Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-sky-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🍬🥤🌡️</p>
        <p className="font-black text-gray-700 text-base leading-snug">Stir sugar into a cold drink and a warm one. Which dissolves faster? Heat makes the water particles move faster!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0F2FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0284C7" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-sky-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-sky-600 shadow-[0_6px_0_#0369A1] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

// Activity: Series Circuits — Cells & Brightness — Age 11 (Band C11 · CAPS Gr 6)
//   Plan (predict) → Investigate: add cells, measure brightness → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const OBJECTIVE_ID = 'ec.series_circuit';
const BADGE = 'Circuit Booster Badge 🔋';

const PLAN_VOICE = "In a series circuit, all the parts are in one loop. What happens to the bulb if we add more cells — more batteries — to the circuit? Will it get brighter or dimmer? Predict!";
const TEST_VOICE = "Drag the slider to add more cells. Watch the brightness meter. When you have tested it, record your result.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Circuit Booster Badge! Look at a torch or a remote. How many batteries does it take? They are joined in a series — end to end — to give enough push for the circuit.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function SeriesCircuitActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [cells, setCells] = useState(1);
  const [seen, setSeen] = useState(false);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const brightness = cells * 25; // % brightness, 1→25 … 4→100

  function predict() { setPredicted(true); speak("Let's add cells and measure the brightness!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function onCells(v: number) {
    setCells(v);
    if (v >= 4 && !seen) { setSeen(true); speak(`Four cells! The bulb is at full brightness — one hundred percent!`, 0.92); }
    else if (v >= 3 && !seen) { setSeen(true); }
  }

  function record() { setPhase('conclude'); speak(CONCLUDE_VOICE); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'brighter' && blank2 === 'current') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Adding more cells makes the bulb brighter. More cells push more current through the circuit. But too many can burn the bulb out! You are a Circuit Booster!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("More cells make it brighter by pushing more current. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🔋🔋💡</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">More cells — does the bulb get brighter or dimmer?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">🔆</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">Brighter</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">🔅</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">Dimmer</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⚡</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">🔋 Series Circuit Test</p>
            {/* Bulb with glow scaled to brightness */}
            <motion.div animate={{ scale: 1 + brightness / 400 }} className="w-32 h-32 rounded-full flex items-center justify-center text-6xl border-4 border-amber-300"
              style={{ background: `rgba(250,204,21,${brightness / 130})`, boxShadow: `0 0 ${brightness / 2}px rgba(250,204,21,0.9)` }}>
              💡
            </motion.div>
            {/* Cells row */}
            <div className="flex gap-1">{Array.from({ length: cells }).map((_, i) => <span key={i} className="text-3xl">🔋</span>)}</div>
            {/* Brightness meter */}
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-[10px] font-black text-amber-500 uppercase mb-1"><span>Brightness</span><span>{brightness}%</span></div>
              <div className="w-full h-4 bg-amber-100 rounded-full overflow-hidden"><motion.div animate={{ width: `${brightness}%` }} className="h-full bg-amber-400" /></div>
            </div>
            <div className="w-full max-w-xs">
              <p className="text-xs text-amber-600 font-bold text-center mb-1">Cells: {cells} {cells === 1 ? '🔋' : ''}</p>
              <input type="range" min={1} max={4} value={cells} onChange={e => onCells(Number(e.target.value))} className="w-full accent-amber-500 h-3" />
            </div>
            <button onClick={record} disabled={!seen} className={`px-8 py-4 rounded-3xl font-display font-black text-lg text-white btn-press ${seen ? 'bg-amber-500 shadow-[0_5px_0_#D97706]' : 'bg-gray-300'}`}>
              {seen ? 'Record result →' : 'Add more cells…'}
            </button>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Adding more cells makes the bulb{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank1 ?? '____'}</span>.
                More cells push more{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank2 ?? '____'}</span>{' '}
                through the circuit.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — the bulb gets…</p>
              <div className="flex gap-2">{['brighter', 'dimmer'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — cells push more…</p>
              <div className="flex gap-2">{['current', 'water'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
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
      <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔋</div>
        <p className="font-display font-black text-amber-700 text-sm">Circuit Booster Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🔋🔋💡</p>
        <p className="font-black text-gray-700 text-base leading-snug">Look at a torch or remote. How many batteries does it use? They join end to end — in series — to power the circuit.</p>
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

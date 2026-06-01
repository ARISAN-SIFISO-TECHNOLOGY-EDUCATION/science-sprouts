// Activity: Circuits with Switches — Age 10 (Band C · CAPS Gr 5)
//   Plan (predict) → Use a switch to turn a bulb on and off → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const OBJECTIVE_ID = 'ec.switches';
const BADGE = 'Switch Master Badge 🔌';

const PLAN_VOICE = "A switch controls a circuit. When the switch is closed, the circuit is complete and electricity flows. Will the bulb light when the switch is open? Predict!";
const MISSION1 = "Mission 1: Close the switch to complete the circuit and light the bulb.";
const MISSION2 = "Great — the circuit is complete! Mission 2: Open the switch to break the circuit and switch the bulb off.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Switch Master Badge! Find a light switch at home. When you flick it ON, you close the circuit. When you flick it OFF, you break it. Never poke anything except a switch — electricity can be dangerous!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function SwitchCircuitActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [closed, setClosed] = useState(false);
  const [mission, setMission] = useState<0 | 1 | 2>(0);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const lit = closed;

  function predict() { setPredicted(true); speak("Let's control the bulb with a switch!", 0.9, () => { setPhase('test'); setTimeout(() => speak(MISSION1), 300); }); }

  function toggle() {
    const next = !closed;
    setClosed(next);
    if (mission === 0 && next) {
      setMission(1);
      speak(MISSION2, 0.9);
    } else if (mission === 1 && !next) {
      setMission(2);
      speak("Perfect! You broke the circuit and the bulb went off.", 0.9, () => setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 300));
    } else {
      speak(next ? "Circuit complete — the bulb is on." : "Circuit broken — the bulb is off.", 0.95);
    }
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'closed' && blank2 === 'breaks') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A bulb lights only when the switch is closed and the circuit is complete. Opening the switch breaks the circuit, so the bulb goes off. You are a Switch Master!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Closed switch lights the bulb. Opening it breaks the circuit. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-yellow-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-yellow-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-yellow-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🔋💡🔌</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Will the bulb light when the switch is open?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-yellow-600 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-yellow-200 rounded-3xl active:scale-95"><span className="text-3xl">💡</span><p className="font-black text-yellow-700 text-[11px] uppercase mt-1">Yes</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-yellow-200 rounded-3xl active:scale-95"><span className="text-3xl">🌑</span><p className="font-black text-yellow-700 text-[11px] uppercase mt-1">No</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⚡</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-yellow-400 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-yellow-700 text-base">{mission === 0 ? 'Mission 1 — light the bulb' : 'Mission 2 — switch it off'}</p>
            {/* Bulb */}
            <motion.div animate={{ scale: lit ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.6, repeat: lit ? Infinity : 0 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl border-4 ${lit ? 'bg-yellow-200 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.8)]' : 'bg-gray-100 border-gray-300'}`}>
              {lit ? '💡' : '🌑'}
            </motion.div>
            {/* Circuit row */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔋</span>
              <span className={`h-1 w-8 rounded ${lit ? 'bg-yellow-400' : 'bg-gray-300'}`} />
              <span className="text-3xl">{lit ? '💡' : '⚪'}</span>
              <span className={`h-1 w-8 rounded ${lit ? 'bg-yellow-400' : 'bg-gray-300'}`} />
              <span className="text-2xl font-black text-yellow-700">{closed ? '⎯' : '╱'}</span>
            </div>
            <motion.button whileTap={{ scale: 0.94 }} onClick={toggle}
              className={`px-10 py-5 rounded-3xl font-display font-black text-xl text-white btn-press ${closed ? 'bg-green-500 shadow-[0_6px_0_#16A34A]' : 'bg-gray-500 shadow-[0_6px_0_#374151]'}`}>
              Switch: {closed ? 'CLOSED ✓' : 'OPEN ✕'}
            </motion.button>
            <p className="text-xs text-yellow-600 font-bold">Tap the switch to open or close the circuit</p>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-yellow-400 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-yellow-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-yellow-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                The bulb lights only when the switch is{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'border-yellow-200 text-yellow-300'}`}>{blank1 ?? '____'}</span>.
                Opening the switch{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'border-yellow-200 text-yellow-300'}`}>{blank2 ?? '____'}</span>{' '}
                the circuit.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — bulb lights when switch is…</p>
              <div className="flex gap-2">{['closed', 'open'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-yellow-700 border-yellow-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — opening the switch…</p>
              <div className="flex gap-2">{['breaks', 'completes'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-yellow-700 border-yellow-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-yellow-500 shadow-[0_5px_0_#CA8A04]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-yellow-400 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔌</div>
        <p className="font-display font-black text-yellow-700 text-sm">Switch Master Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-yellow-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">💡🔌🏠</p>
        <p className="font-black text-gray-700 text-base leading-snug">Find a light switch. ON closes the circuit; OFF breaks it. Only ever touch the switch — electricity can be dangerous!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF9C3" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CA8A04" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-yellow-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-yellow-500 shadow-[0_6px_0_#A16207] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

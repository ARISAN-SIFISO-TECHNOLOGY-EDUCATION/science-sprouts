// Activity: Solids, Liquids & Gases — Particle Model — Age 9 (Band B · CAPS Gr 4)
//   Plan (predict) → Heat slider, measure particle speed at 3 temps → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Level { id: string; name: string; temp: number; speed: number; state: string; }
const LEVELS: Level[] = [
  { id: 'cold', name: 'Cold',   temp: 10,  speed: 2,  state: 'Solid' },
  { id: 'warm', name: 'Warm',   temp: 50,  speed: 20, state: 'Liquid' },
  { id: 'hot',  name: 'Hot',    temp: 100, speed: 50, state: 'Gas' },
];
const MAX_SPEED = 50;

const OBJECTIVE_ID = 'mm.particles';
const BADGE = 'Particle Pro Badge ⚛️';

const PLAN_VOICE = "Everything is made of tiny particles. When you heat them up, do the particles move faster or slower? Predict!";
const TEST_VOICE = "Slide the heat. Watch the particles. Then tap Cold, Warm and Hot to measure how fast they move.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Particle Pro Badge! At home: watch an ice cube melt in a warm room. Its particles gained energy and started to move and flow.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function ParticlesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [temp, setTemp] = useState(40);
  const [measured, setMeasured] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const all = measured.size >= LEVELS.length;
  const jiggle = temp / 100;             // 0–1 motion amount
  const stateLabel = temp < 30 ? 'Solid' : temp < 70 ? 'Liquid' : 'Gas';

  function predict() { setPredicted(true); speak("Let's heat the particles and measure their speed!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function measure(l: Level) { if (measured.has(l.id)) return; setTemp(l.temp); speak(`${l.name}: particle speed ${l.speed}. It is a ${l.state.toLowerCase()}.`, 0.92); setMeasured(p => new Set([...p, l.id])); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'faster' && blank2 === 'state') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! When you heat a substance its particles move faster, and it can change state — from solid to liquid to gas. You are a Particle Pro!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Look at your graph — more heat made the particles do what? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-red-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-red-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-red-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🧊→💧→💨</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">When you heat tiny particles, do they move faster or slower?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-red-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-red-200 rounded-3xl active:scale-95"><span className="text-3xl">💨</span><p className="font-black text-red-700 text-[11px] uppercase mt-1">Faster</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-red-200 rounded-3xl active:scale-95"><span className="text-3xl">🐢</span><p className="font-black text-red-700 text-[11px] uppercase mt-1">Slower</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⚛️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-red-300 text-sm font-bold mb-1">← Back</button>
            <p className="text-center font-display font-black text-red-700 text-base">Particle Lab ⚛️</p>
            <p className="text-center text-[11px] text-red-500 font-black mb-2">State: {stateLabel}</p>

            {/* particle box */}
            <div className="rounded-2xl border-2 border-red-100 bg-white p-3 grid grid-cols-5 gap-2 h-32 content-center">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.span key={i} className="text-lg text-center"
                  animate={{ x: [0, jiggle * 10 * (i % 2 ? 1 : -1), 0], y: [0, jiggle * 10 * (i % 3 ? -1 : 1), 0] }}
                  transition={{ duration: Math.max(0.3, 1.2 - jiggle), repeat: Infinity, ease: 'easeInOut' }}>🔴</motion.span>
              ))}
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase"><span>❄️ Cold</span><span>Heat: {temp}%</span><span>🔥 Hot</span></div>
              <input type="range" min={0} max={100} value={temp} onChange={e => setTemp(Number(e.target.value))} className="w-full accent-red-500" />
            </div>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mt-2 mb-1">Particle speed</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-red-100 p-3 min-h-[100px]">
              {LEVELS.map(l => {
                const done = measured.has(l.id);
                const top = l.id === 'hot';
                return (
                  <div key={l.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-red-700 mb-0.5">{l.speed}</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(l.speed / MAX_SPEED) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (top ? 'bg-red-600' : 'bg-red-400') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-1">{l.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {LEVELS.map(l => (
                  <button key={l.id} onClick={() => measure(l)} disabled={measured.has(l.id)} className={`py-3 rounded-2xl border-2 font-black text-xs active:scale-95 ${measured.has(l.id) ? 'bg-red-100 border-red-200 text-red-400' : 'bg-white border-red-200 text-red-700'}`}>{measured.has(l.id) ? '✓' : l.name}</button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-red-500 shadow-[0_5px_0_#DC2626] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-red-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-red-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-red-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                When you heat a substance, its particles move{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-red-100 border-red-400 text-red-700' : 'border-red-200 text-red-300'}`}>{blank1 ?? '____'}</span>{' '}
                and it can change{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-red-100 border-red-400 text-red-700' : 'border-red-200 text-red-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['faster', 'slower'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-700 border-red-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['state', 'colour'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-700 border-red-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-red-500 shadow-[0_5px_0_#DC2626]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-red-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">⚛️</div>
        <p className="font-display font-black text-red-700 text-sm">Particle Pro Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-red-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🧊→💧</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: watch an ice cube melt in a warm room. The particles gained heat energy and began to move and flow.</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEE2E2" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DC2626" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-red-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-red-600 shadow-[0_6px_0_#B91C1C] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

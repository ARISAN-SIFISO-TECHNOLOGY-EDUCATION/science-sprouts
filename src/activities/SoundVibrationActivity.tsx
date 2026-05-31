// Activity: Sound & Vibration — Age 9 (Band B · CAPS Gr 4)
// Vibration makes sound; a bigger vibration makes a louder sound.
//   Plan (predict) → Hit drum at 3 strengths, measure loudness → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Hit { id: string; name: string; loud: number; }
const HITS: Hit[] = [
  { id: 'soft', name: 'Soft tap',  loud: 30 },
  { id: 'med',  name: 'Medium',    loud: 60 },
  { id: 'hard', name: 'Hard hit',  loud: 90 },
];
const MAX_DB = 100;

const OBJECTIVE_ID = 'ec.sound_vibration';
const BADGE = 'Vibration Master Badge 🥁';

const PLAN_VOICE = "Sound is made when something vibrates. If you hit a drum harder, will the sound be louder or softer? Predict!";
const TEST_VOICE = "Tap the drum softly, medium, and hard. Watch it vibrate and measure how loud the sound is.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Vibration Master Badge! At home: sprinkle a little rice on a drum or tin. Hit it and watch the rice jump — that is the vibration making sound!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function SoundVibrationActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested] = useState<Set<string>>(new Set());
  const [hitting, setHitting] = useState<string | null>(null);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const all = tested.size >= HITS.length;
  const lastHit = HITS.find(h => h.id === hitting);

  function predict() { setPredicted(true); speak("Let's hit the drum and measure the sound!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function hit(h: Hit) {
    if (tested.has(h.id)) return;
    setHitting(h.id);
    speak(`${h.name}: ${h.loud} decibels — a ${h.loud >= 80 ? 'loud' : h.loud >= 50 ? 'medium' : 'soft'} sound.`, 0.92);
    setTested(p => new Set([...p, h.id]));
    setTimeout(() => setHitting(null), 900);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'harder' && blank2 === 'louder') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Hitting the drum harder makes a bigger vibration and a louder sound. You are a Vibration Master!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Look at your graph — the hard hit made the sound do what? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-blue-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🥁〰️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Hit a drum harder — is the sound louder or softer?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-blue-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-blue-200 rounded-3xl active:scale-95"><span className="text-3xl">🔊</span><p className="font-black text-blue-700 text-[11px] uppercase mt-1">Louder</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-blue-200 rounded-3xl active:scale-95"><span className="text-3xl">🔉</span><p className="font-black text-blue-700 text-[11px] uppercase mt-1">Softer</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🥁</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold mb-1">← Back</button>
            <p className="text-center font-display font-black text-blue-700 text-base">Drum Lab 🥁</p>
            <p className="text-center text-[11px] text-blue-500 font-bold mb-2">Tap each hit strength · measure loudness</p>

            {/* drum with vibration rings */}
            <div className="rounded-2xl border-2 border-blue-100 bg-white p-3 flex items-center justify-center h-28 relative overflow-hidden">
              <motion.span className="text-5xl" animate={hitting ? { y: [0, -6, 0], scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.4 }}>🥁</motion.span>
              {hitting && lastHit && Array.from({ length: 3 }).map((_, i) => (
                <motion.span key={i} className="absolute text-blue-300" style={{ fontSize: 18 + (lastHit.loud / 10) }} initial={{ opacity: 0.8, scale: 0.5 }} animate={{ opacity: 0, scale: 1.5 + lastHit.loud / 60 }} transition={{ duration: 0.7, delay: i * 0.12 }}>〰️</motion.span>
              ))}
            </div>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mt-3 mb-1">Loudness (decibels)</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-blue-100 p-3 min-h-[120px]">
              {HITS.map(h => {
                const done = tested.has(h.id);
                const top = h.id === 'hard';
                return (
                  <div key={h.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-blue-700 mb-0.5">{h.loud}dB</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(h.loud / MAX_DB) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (top ? 'bg-blue-600' : 'bg-blue-400') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-1">{h.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {HITS.map(h => (
                  <button key={h.id} onClick={() => hit(h)} disabled={tested.has(h.id) || !!hitting} className={`py-3 rounded-2xl border-2 font-black text-[11px] active:scale-95 ${tested.has(h.id) ? 'bg-blue-100 border-blue-200 text-blue-400' : 'bg-white border-blue-200 text-blue-700'}`}>{tested.has(h.id) ? '✓' : h.name}</button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-blue-500 shadow-[0_5px_0_#2563EB] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-blue-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Hitting the drum{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-blue-200 text-blue-300'}`}>{blank1 ?? '____'}</span>{' '}
                makes a bigger vibration and a{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-blue-200 text-blue-300'}`}>{blank2 ?? '____'}</span>{' '}
                sound.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['harder', 'softer'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['louder', 'quieter'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-blue-500 shadow-[0_5px_0_#2563EB]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🥁</div>
        <p className="font-display font-black text-blue-700 text-sm">Vibration Master Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-blue-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🥁🍚</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: sprinkle rice on a drum or tin. Hit it and watch the rice jump — the vibration is making the sound!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DBEAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-blue-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-blue-600 shadow-[0_6px_0_#1D4ED8] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

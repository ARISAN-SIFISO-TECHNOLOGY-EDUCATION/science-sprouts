// Activity: Sound — Loud/Soft & Pitch — Age 8 (Band B8)
// Intermediate Phase Gr 3 — change one variable (band tightness), observe pitch.
//   Plan (predict) → Test 3 rubber bands → Conclude (fill blanks) → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Band { id: string; name: string; pitch: number; label: string; } // pitch 1=low .. 3=high
const BANDS: Band[] = [
  { id: 'loose', name: 'Loose & long', pitch: 1, label: 'Low' },
  { id: 'mid',   name: 'Medium',       pitch: 2, label: 'Middle' },
  { id: 'tight', name: 'Tight & short', pitch: 3, label: 'High' },
];

const OBJECTIVE_ID = 'ec.sound';
const BADGE = 'Sound Scientist 🎵';

const PLAN_VOICE = "Sound is made by vibrations. Will a tight, short rubber band make a HIGH sound or a LOW sound? Predict!";
const TEST_VOICE = "Tap each rubber band to twang it. Listen — is the pitch high or low?";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Sound Scientist Badge! At home: stretch rubber bands over a box. Pluck a tight one and a loose one. Which makes the higher pitch?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function SoundActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [played, setPlayed] = useState<Set<string>>(new Set());
  const [twang, setTwang] = useState<string | null>(null);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const all = played.size >= BANDS.length;

  function predict() { setPredicted(true); speak("Let's twang the bands and listen!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function play(b: Band) {
    if (twang) return;
    setTwang(b.id);
    speak(`${b.name}: a ${b.label.toLowerCase()} pitch sound.`, b.pitch === 3 ? 1.4 : b.pitch === 1 ? 0.7 : 1.0);
    setPlayed(prev => new Set([...prev, b.id]));
    setTimeout(() => setTwang(null), 900);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'tight' && blank2 === 'high') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A tight, short rubber band vibrates fast, so it makes a high sound. A loose band makes a low sound. You are a Sound Scientist!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Think about the tight band you twanged. Was it high or low? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-blue-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🎵〰️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Does a tight rubber band make a high or low sound?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-blue-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-blue-200 rounded-3xl active:scale-95"><span className="text-3xl">🔼</span><p className="font-black text-blue-700 text-[11px] uppercase mt-1">High sound</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-blue-200 rounded-3xl active:scale-95"><span className="text-3xl">🔽</span><p className="font-black text-blue-700 text-[11px] uppercase mt-1">Low sound</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🎵</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4 justify-center gap-4">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-blue-700 text-base">Rubber Band Guitar 🎸</p>
            <p className="text-center text-xs text-blue-500 font-bold">Tap each band to twang it</p>

            <div className="bg-white rounded-3xl border-2 border-blue-100 p-5 flex flex-col gap-5">
              {BANDS.map(b => {
                const done = played.has(b.id);
                const active = twang === b.id;
                return (
                  <button key={b.id} onClick={() => play(b)} disabled={!!twang} className="flex items-center gap-3 active:scale-[0.98]">
                    <span className="text-2xl w-8">{b.pitch === 3 ? '🔼' : b.pitch === 1 ? '🔽' : '➖'}</span>
                    {/* the band: thinner & tighter = higher */}
                    <div className="flex-1 flex items-center">
                      <motion.div animate={active ? { scaleY: [1, 2.4, 0.6, 1.8, 1] } : {}} transition={{ duration: 0.6 }}
                        className="w-full rounded-full bg-blue-400" style={{ height: 6 - b.pitch }} />
                    </div>
                    <span className={`text-xs font-black uppercase w-20 text-right ${done ? 'text-blue-700' : 'text-gray-300'}`}>{done ? b.label : '?'}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] text-gray-400 font-bold">Tighter &amp; shorter band → faster vibration → higher pitch</p>

            {all && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="w-full py-4 bg-blue-500 shadow-[0_5px_0_#2563EB] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-blue-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-blue-200 text-blue-300'}`}>{blank1 ?? '____'}</span>{' '}
                rubber band makes a{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-blue-200 text-blue-300'}`}>{blank2 ?? '____'}</span>{' '}
                sound.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['tight', 'loose'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['high', 'low'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`}>{w}</button>))}</div>
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
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🎵</div>
        <p className="font-display font-black text-blue-700 text-sm">Sound Scientist!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-blue-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🎸📦</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: stretch rubber bands over a box. Pluck a tight one and a loose one. Which makes the higher pitch?</p>
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

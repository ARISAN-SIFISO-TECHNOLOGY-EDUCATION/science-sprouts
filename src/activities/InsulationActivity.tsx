// Activity: Insulation — Keep Water Warm — Age 8 (Band B8)
// Intermediate Phase Gr 3 — the signature Age 8 loop:
//   Plan (hypothesis) → Measure (°C after 5 min) → Record (calculate temp lost)
//   → Conclude (fill-in-the-blanks) → Apply (caregiver card)
// Child is the scientist. The app is the lab notebook + thermometer.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'record' | 'conclude' | 'card';

interface Cup { id: string; emoji: string; name: string; end: number; }

const START_TEMP = 80; // °C — same hot water in every cup (fair test)
// Temperature left after 5 minutes. Foil keeps it warmest.
const CUPS: Cup[] = [
  { id: 'paper',   emoji: '🥤', name: 'Paper',   end: 65 },
  { id: 'plastic', emoji: '🧴', name: 'Plastic', end: 58 },
  { id: 'foil',    emoji: '🌯', name: 'Foil',    end: 70 },
];

const OBJECTIVE_ID = 'mm.insulation';
const BADGE = 'Measurer Badge 📏';

const PLAN_VOICE    = "Question: which cup keeps hot water warmest — paper, plastic, or foil? Make your prediction!";
const TEST_VOICE    = "Fair test: same hot water in each cup. Tap a cup to read its thermometer after five minutes.";
const RECORD_VOICE  = "Now calculate the heat lost. Temperature lost equals eighty minus the temperature left. Tap each row.";
const CONCLUDE_VOICE= "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE    = "You earned the Measurer Badge! At home: which two materials would keep an ice cream coldest? Plan a fair test and try it.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => {
    if (r <= 0) { onDone(); return; }
    const id = setTimeout(() => setR(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function InsulationActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [hypothesis, setHypothesis] = useState<string | null>(null);
  const [measured, setMeasured] = useState<Set<string>>(new Set());
  const [reading, setReading] = useState<string | null>(null);
  const [calculated, setCalculated] = useState<Set<string>>(new Set());

  // Conclusion builder
  const [blank1, setBlank1] = useState<string | null>(null); // which cup
  const [blank2, setBlank2] = useState<string | null>(null); // why
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const winner = CUPS.reduce((a, b) => (b.end > a.end ? b : a)); // foil
  const allMeasured = measured.size >= CUPS.length;
  const allCalculated = calculated.size >= CUPS.length;

  function predict(cup: Cup) {
    setHypothesis(cup.id);
    speak(`You predict ${cup.name}. Let's test it fairly!`, 0.9, () => {
      setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300);
    });
  }

  function measure(cup: Cup) {
    if (measured.has(cup.id) || reading) return;
    setReading(cup.id);
    const isLast = measured.size + 1 >= CUPS.length;
    speak(`${cup.name} cup: ${cup.end} degrees after five minutes.`, 0.9, undefined);
    setTimeout(() => {
      setMeasured(prev => new Set([...prev, cup.id]));
      setReading(null);
      if (isLast) setTimeout(() => { setPhase('record'); speak(RECORD_VOICE); }, 700);
    }, 1300);
  }

  function calcRow(cup: Cup) {
    if (calculated.has(cup.id)) return;
    setCalculated(prev => new Set([...prev, cup.id]));
  }

  function checkConclusion() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'foil' && blank2 === 'traps') {
      setResult('correct');
      awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The foil cup kept water warmest because foil traps heat and stops it escaping. You are a Measurer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else {
      setResult('wrong');
      speak("Not quite. Look at your data — which cup stayed warmest? Try again.", 0.9, undefined);
      setTimeout(() => setResult('idle'), 1600);
    }
  }

  return (
    <div className="fixed inset-0 bg-teal-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── PLAN ─────────────────────────────────────────────── */}
        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">🔬 Plan your investigation</p>
              <p className="text-4xl mb-2">☕️🌡️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Which cup keeps hot water warmest after 5 minutes?</p>
              <p className="text-xs text-gray-400 mt-2 leading-snug">We change the <b>cup material</b>. We keep the <b>water &amp; start temp the same</b>.</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-teal-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            <p className="text-xs font-black text-teal-600 uppercase tracking-wide">My prediction:</p>
            <div className="flex gap-3 w-full max-w-sm">
              {CUPS.map(c => (
                <motion.button key={c.id} whileTap={{ scale: 0.92 }} onClick={() => predict(c)} disabled={!!hypothesis}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-3xl border-2 active:scale-95 transition-all
                    ${hypothesis === c.id ? 'bg-teal-100 border-teal-400' : 'bg-white border-teal-200'}`}>
                  <span className="text-4xl">{c.emoji}</span>
                  <span className="font-black text-teal-700 text-[10px] uppercase">{c.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── TEST (measure) ──────────────────────────────────── */}
        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold mb-2">← Back</button>
            <div className="bg-teal-100 border-2 border-teal-200 rounded-2xl p-2 mb-3">
              <p className="text-[10px] font-black text-teal-700 uppercase tracking-wide text-center">⚖️ Fair test · same water · start {START_TEMP}°C</p>
            </div>
            <p className="text-center text-xs text-teal-500 font-bold mb-2">Tap each cup to read the thermometer 🌡️</p>

            <div className="flex-1 flex items-end justify-around gap-3 pb-2">
              {CUPS.map(c => {
                const done = measured.has(c.id);
                const isReading = reading === c.id;
                // thermometer fill: 0–100°C
                const fill = done ? c.end : START_TEMP;
                return (
                  <motion.button key={c.id} whileTap={{ scale: 0.95 }} onClick={() => measure(c)} disabled={done || !!reading}
                    className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-3xl border-2 transition-all
                      ${done ? 'bg-white border-teal-300' : isReading ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-200 shadow-sm active:scale-95'}`}>
                    <span className="text-3xl">{c.emoji}</span>
                    {/* mini thermometer */}
                    <div className="relative w-3 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <motion.div initial={false} animate={{ height: `${fill}%` }} transition={{ type: 'spring', damping: 16 }}
                        className="absolute bottom-0 left-0 right-0 bg-red-400 rounded-full" />
                    </div>
                    <span className={`font-black text-sm ${done ? 'text-teal-700' : 'text-gray-300'}`}>
                      {isReading ? '…' : done ? `${c.end}°C` : '?'}
                    </span>
                    <span className="text-[9px] font-black uppercase text-gray-400">{c.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {allMeasured && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('record'); speak(RECORD_VOICE); }}
                className="mt-3 w-full py-4 bg-teal-500 shadow-[0_5px_0_#0D9488] text-white font-display font-black text-lg rounded-3xl btn-press">
                Record the results →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── RECORD (data table + calculate) ─────────────────── */}
        {phase === 'record' && (
          <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-teal-700 text-base mb-1">📋 Results Table</p>
            <p className="text-center text-xs text-teal-500 font-bold mb-3">Tap a row to calculate heat lost (80 − temp left)</p>

            <div className="bg-white rounded-2xl border-2 border-teal-100 overflow-hidden">
              <div className="grid grid-cols-4 bg-teal-100 text-teal-700 font-black text-[10px] uppercase text-center">
                <div className="p-2">Cup</div><div className="p-2">Start</div><div className="p-2">After 5min</div><div className="p-2">Lost</div>
              </div>
              {CUPS.map(c => {
                const done = calculated.has(c.id);
                return (
                  <button key={c.id} onClick={() => calcRow(c)} disabled={done}
                    className={`w-full grid grid-cols-4 items-center text-center border-t border-teal-50 text-sm font-bold ${done ? '' : 'active:bg-teal-50'}`}>
                    <div className="p-2 flex items-center justify-center gap-1"><span>{c.emoji}</span><span className="text-[10px] text-gray-500">{c.name}</span></div>
                    <div className="p-2 text-gray-400">{START_TEMP}°</div>
                    <div className="p-2 text-gray-700">{c.end}°</div>
                    <div className="p-2">
                      {done
                        ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-black text-teal-700">{START_TEMP - c.end}°</motion.span>
                        : <span className="text-teal-300 font-black">tap</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* simple bar chart: temperature kept */}
            <p className="text-center text-[10px] font-black text-gray-400 uppercase mt-4 mb-1">Heat kept after 5 min (°C)</p>
            <div className="flex-1 flex items-end justify-around gap-3 bg-white rounded-2xl border-2 border-teal-100 p-3 min-h-[120px]">
              {CUPS.map(c => {
                const isWinner = c.id === winner.id;
                return (
                  <div key={c.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-[10px] font-black text-teal-700 mb-0.5">{c.end}°</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(c.end / 100) * 100}%` }} transition={{ type: 'spring', damping: 14 }}
                      className={`w-full rounded-t-xl ${isWinner ? 'bg-teal-600' : 'bg-teal-300'}`} style={{ minHeight: 6 }} />
                    <span className="text-xl mt-1">{c.emoji}</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase">{c.name}</span>
                  </div>
                );
              })}
            </div>

            {allCalculated && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }}
                className="mt-3 w-full py-4 bg-teal-500 shadow-[0_5px_0_#0D9488] text-white font-display font-black text-lg rounded-3xl btn-press">
                Write my conclusion →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── CONCLUDE (fill the blanks) ──────────────────────── */}
        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-teal-700 text-base">✍️ My Conclusion</p>

            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                I found that the{' '}
                <span className={`inline-block min-w-[64px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-teal-100 border-teal-400 text-teal-700' : 'border-teal-200 text-teal-300'}`}>{blank1 ? CUPS.find(c => c.id === blank1)?.name : '____'}</span>{' '}
                cup kept water warmest because foil{' '}
                <span className={`inline-block min-w-[64px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-teal-100 border-teal-400 text-teal-700' : 'border-teal-200 text-teal-300'}`}>{blank2 === 'traps' ? 'traps heat' : blank2 === 'loses' ? 'loses heat' : '____'}</span>.
              </p>
            </motion.div>

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — which cup?</p>
              <div className="flex gap-2">
                {CUPS.map(c => (
                  <button key={c.id} onClick={() => setBlank1(c.id)}
                    className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank1 === c.id ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-teal-700 border-teal-200'}`}>{c.name}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — why?</p>
              <div className="flex gap-2">
                <button onClick={() => setBlank2('traps')}
                  className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank2 === 'traps' ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-teal-700 border-teal-200'}`}>traps heat</button>
                <button onClick={() => setBlank2('loses')}
                  className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank2 === 'loses' ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-teal-700 border-teal-200'}`}>loses heat</button>
              </div>
            </div>

            <button onClick={checkConclusion} disabled={!blank1 || !blank2 || result === 'correct'}
              className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-teal-500 shadow-[0_5px_0_#0D9488]' : 'bg-gray-300'}`}>
              {result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}
            </button>
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
      <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">📏</div>
        <p className="font-display font-black text-teal-700 text-sm">Measurer Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-teal-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🍦🧪</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: which 2 materials would keep an ice cream coldest? Plan a fair test — same ice cream, same time — and find out!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CCFBF1" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0D9488" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-teal-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-teal-600 shadow-[0_6px_0_#0F766E] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}

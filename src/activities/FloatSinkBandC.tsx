// Activity: Floating & Sinking — Band C (Ages 10–12)
// 5E: explore + explain + evaluate    Kind: experiment    Generator: variableChange
//
// DESIGN PRINCIPLE: Scientists change ONE variable and observe what happens.
// The through-line is DENSITY (mass ÷ volume), not "air inside" — that model
// breaks for steel ships and clay. Band C introduces displacement as the
// complete explanation that survives all three bands.
//
// The four phases:
//   1. Anchor     — the orange trick question (same phenomenon, deeper ask)
//   2. Predict    — record prediction BEFORE testing (scientific habit of mind)
//   3. Investigate — change the variable (clay shape) and record observations
//   4. Conclude   — explain using density/displacement, not just "air"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Lightbulb, FlaskConical } from 'lucide-react';
import { cn } from '../lib/utils';
import { speak } from '../lib/utils';

type Phase = 'anchor' | 'predict' | 'investigate' | 'conclude';

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

// ── Experiment steps ──────────────────────────────────────────────────────────

const CLAY_SHAPES = [
  { id: 'ball',  emoji: '⚫', label: 'Ball', floats: false,
    why: 'A ball of clay is dense and compact — more mass per volume than water.' },
  { id: 'flat',  emoji: '🫓', label: 'Flat disc', floats: false,
    why: 'Still the same clay — same mass — just flatter. Still denser than water.' },
  { id: 'bowl',  emoji: '🥣', label: 'Hollow bowl', floats: true,
    why: 'The hollow shape traps air, making the total volume (clay + air) big enough that the average density is less than water.' },
  { id: 'boat',  emoji: '🚤', label: 'Boat shape', floats: true,
    why: 'Same principle as a steel ship — the shape displaces enough water to support the weight.' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function FloatSinkBandC({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('anchor');
  const [predictions, setPredictions] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState<string | null>(null);

  function predict(shapeId: string, floats: boolean) {
    setPredictions(p => ({ ...p, [shapeId]: floats }));
  }

  function recordResult(shapeId: string, floats: boolean) {
    setResults(r => ({ ...r, [shapeId]: floats }));
    setActiveShape(shapeId);
    setShowWhy(shapeId);
  }

  const allPredicted  = CLAY_SHAPES.every(s => s.id in predictions);
  const allResulted   = CLAY_SHAPES.every(s => s.id in results);
  const correctCount  = CLAY_SHAPES.filter(s =>
    predictions[s.id] === results[s.id]
  ).length;

  return (
    <div className="fixed inset-0 bg-indigo-50 z-40 flex flex-col max-w-lg mx-auto">
      <AnimatePresence mode="wait">

        {/* ── Phase 1: Anchor phenomenon ──────────────────────────────── */}
        {phase === 'anchor' && (
          <motion.div
            key="anchor"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col h-full p-6"
          >
            <button onClick={onExit}
              className="self-start text-indigo-300 text-sm font-bold mb-4 hover:text-indigo-500">
              ← Back
            </button>

            {/* Lab badge */}
            <div className="bg-indigo-100 border-2 border-indigo-200 rounded-2xl px-4 py-2
                            flex items-center gap-2 mb-5 self-start">
              <FlaskConical size={16} className="text-indigo-600" />
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                Junior Scientist · Lab Investigation
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-5">
              {/* Orange trick revisited */}
              <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-indigo-100">
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">
                  You already know this…
                </p>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  A whole orange floats. Peel it and it sinks. The peel was trapping air —
                  making it less dense overall.
                </p>
                <div className="flex gap-6 justify-center text-5xl mt-2">
                  <div className="flex flex-col items-center gap-1">
                    <span>🍊</span>
                    <span className="text-[10px] font-black text-green-500">FLOATS ✓</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span>🟠</span>
                    <span className="text-[10px] font-black text-blue-500">SINKS ↓</span>
                  </div>
                </div>
              </div>

              {/* The real question */}
              <div className="bg-indigo-600 rounded-3xl p-5 shadow-lg text-white">
                <p className="font-display font-black text-xl mb-2">
                  Now here's the investigation:
                </p>
                <p className="text-indigo-100 text-base leading-relaxed">
                  You have a ball of clay. It sinks. Can you <strong>change its shape</strong>{' '}
                  so it floats — <em>without adding or removing any clay?</em>
                </p>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
                <p className="text-amber-700 text-sm font-bold">
                  🔬 Variable being changed: <em>shape only</em>. Mass stays constant.
                </p>
              </div>
            </div>

            <button
              onClick={() => setPhase('predict')}
              className="mt-6 w-full py-4 bg-indigo-500 shadow-[0_6px_0_#4338CA]
                         text-white font-display font-black text-xl rounded-3xl btn-press
                         flex items-center justify-center gap-2"
            >
              Make my predictions <ChevronRight size={22} />
            </button>
          </motion.div>
        )}

        {/* ── Phase 2: Predict ────────────────────────────────────────── */}
        {phase === 'predict' && (
          <motion.div
            key="predict"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col h-full p-6 overflow-y-auto"
          >
            <button onClick={() => setPhase('anchor')}
              className="self-start text-indigo-300 text-sm font-bold mb-4 flex items-center gap-1">
              <ChevronLeft size={14} /> Back
            </button>

            <h2 className="font-display font-black text-2xl text-indigo-700 mb-1">
              Step 1: Predict first
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              Scientists record their prediction <em>before</em> testing. For each clay shape,
              predict: float or sink?
            </p>

            <div className="space-y-3 flex-1">
              {CLAY_SHAPES.map(shape => {
                const pred = predictions[shape.id];
                return (
                  <div key={shape.id}
                    className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{shape.emoji}</span>
                      <div>
                        <p className="font-display font-black text-gray-800">{shape.label}</p>
                        <p className="text-xs text-gray-400">Same clay, different shape</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => predict(shape.id, true)}
                        className={cn(
                          'flex-1 py-2 rounded-xl font-bold text-sm transition-all',
                          pred === true
                            ? 'bg-sky-400 text-white shadow-md'
                            : 'bg-sky-50 text-sky-600 border-2 border-sky-200'
                        )}
                      >
                        🌊 Floats
                      </button>
                      <button
                        onClick={() => predict(shape.id, false)}
                        className={cn(
                          'flex-1 py-2 rounded-xl font-bold text-sm transition-all',
                          pred === false
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                        )}
                      >
                        ↓ Sinks
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint */}
            <button onClick={() => setShowHint(h => !h)}
              className="flex items-center gap-2 mx-auto text-amber-500 text-sm font-bold mt-3">
              <Lightbulb size={14} />
              {showHint ? 'Hide hint' : 'Need a thinking prompt?'}
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-amber-700 text-sm bg-amber-50 rounded-2xl p-3
                             border border-amber-200 mt-2 text-center"
                >
                  💡 Think about the <strong>volume of water</strong> each shape would
                  push aside. More displaced water = more upthrust.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              disabled={!allPredicted}
              onClick={() => setPhase('investigate')}
              className={cn(
                'mt-4 w-full py-4 font-display font-black text-xl rounded-3xl btn-press',
                'flex items-center justify-center gap-2',
                allPredicted
                  ? 'bg-indigo-500 shadow-[0_6px_0_#4338CA] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              Predictions locked in → Investigate
            </button>
          </motion.div>
        )}

        {/* ── Phase 3: Investigate ────────────────────────────────────── */}
        {phase === 'investigate' && (
          <motion.div
            key="investigate"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col h-full p-6 overflow-y-auto"
          >
            <button onClick={() => setPhase('predict')}
              className="self-start text-indigo-300 text-sm font-bold mb-4 flex items-center gap-1">
              <ChevronLeft size={14} /> Back
            </button>

            <h2 className="font-display font-black text-2xl text-indigo-700 mb-1">
              Step 2: Test it
            </h2>
            <p className="text-gray-500 text-sm mb-2">
              Imagine (or actually try!) each clay shape in water.
              Record what actually happens.
            </p>

            {/* Prediction vs result table header */}
            <div className="grid grid-cols-4 gap-1 text-[10px] font-black text-gray-400
                            uppercase tracking-widest mb-2 px-1">
              <span className="col-span-2">Shape</span>
              <span className="text-center">Your predict.</span>
              <span className="text-center">Result</span>
            </div>

            <div className="space-y-3 flex-1">
              {CLAY_SHAPES.map(shape => {
                const pred   = predictions[shape.id];
                const result = results[shape.id];
                const correct = result !== undefined && result === pred;

                return (
                  <div key={shape.id}
                    className={cn(
                      'bg-white rounded-2xl p-3 border-2 shadow-sm',
                      result !== undefined
                        ? correct ? 'border-green-200' : 'border-orange-200'
                        : 'border-gray-100'
                    )}
                  >
                    {/* Row */}
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-3xl">{shape.emoji}</span>
                        <span className="font-bold text-gray-700 text-sm">{shape.label}</span>
                      </div>
                      {/* Prediction badge */}
                      <div className="flex justify-center">
                        <span className={cn(
                          'text-[10px] font-black px-2 py-1 rounded-lg',
                          pred ? 'bg-sky-100 text-sky-600' : 'bg-blue-100 text-blue-600'
                        )}>
                          {pred ? 'floats' : 'sinks'}
                        </span>
                      </div>
                      {/* Result buttons */}
                      <div className="flex flex-col gap-1 items-center">
                        {result !== undefined ? (
                          <span className={cn(
                            'text-[10px] font-black px-2 py-1 rounded-lg',
                            result ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                          )}>
                            {result ? '🌊 floats' : '↓ sinks'}
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            <button onClick={() => recordResult(shape.id, true)}
                              className="text-[10px] font-black px-2 py-1 bg-sky-100
                                         text-sky-700 rounded-lg hover:bg-sky-200">
                              🌊
                            </button>
                            <button onClick={() => recordResult(shape.id, false)}
                              className="text-[10px] font-black px-2 py-1 bg-blue-100
                                         text-blue-700 rounded-lg hover:bg-blue-200">
                              ↓
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Why explanation — revealed after result */}
                    <AnimatePresence>
                      {showWhy === shape.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 pt-2 border-t border-gray-100"
                        >
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {shape.why}
                          </p>
                          {correct && (
                            <p className="text-xs font-black text-green-600 mt-1">
                              ✓ Your prediction was correct!
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Toggle why (if result recorded) */}
                    {result !== undefined && showWhy !== shape.id && (
                      <button
                        onClick={() => setShowWhy(shape.id)}
                        className="text-[10px] font-black text-indigo-400 mt-2 hover:text-indigo-600"
                      >
                        Why? →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              disabled={!allResulted}
              onClick={() => setPhase('conclude')}
              className={cn(
                'mt-4 w-full py-4 font-display font-black text-xl rounded-3xl btn-press',
                'flex items-center justify-center gap-2',
                allResulted
                  ? 'bg-indigo-500 shadow-[0_6px_0_#4338CA] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              Write my conclusion →
            </button>
          </motion.div>
        )}

        {/* ── Phase 4: Conclude ───────────────────────────────────────── */}
        {phase === 'conclude' && (
          <motion.div
            key="conclude"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col h-full p-6 overflow-y-auto"
          >
            <button onClick={() => setPhase('investigate')}
              className="self-start text-indigo-300 text-sm font-bold mb-4 flex items-center gap-1">
              <ChevronLeft size={14} /> Back
            </button>

            <h2 className="font-display font-black text-2xl text-indigo-700 mb-1">
              Step 3: Conclude
            </h2>

            {/* Score */}
            <div className={cn(
              'p-4 rounded-2xl mb-4 flex items-center gap-3',
              correctCount === 4 ? 'bg-green-50 border-2 border-green-200'
              : correctCount >= 2 ? 'bg-amber-50 border-2 border-amber-200'
              : 'bg-indigo-50 border-2 border-indigo-200'
            )}>
              <span className="text-3xl">
                {correctCount === 4 ? '🎯' : correctCount >= 2 ? '🔍' : '🧪'}
              </span>
              <div>
                <p className="font-display font-black text-lg text-gray-800">
                  {correctCount}/4 predictions correct
                </p>
                <p className="text-xs text-gray-500">
                  {correctCount === 4
                    ? "Perfect — you reasoned like a scientist!"
                    : "Good experimenting — unexpected results teach the most."}
                </p>
              </div>
            </div>

            {/* Concept explanation — density/displacement, not just "air" */}
            <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-indigo-100 mb-4">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">
                The key idea
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                An object floats when it <strong>displaces</strong> (pushes aside) water whose
                weight equals the object's own weight. Changing the clay's shape changes how
                much water it displaces — even though the mass of clay didn't change at all.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                This is why a <em>steel ship</em> floats even though steel is much denser
                than water — the hollow hull shape displaces enough water to support it.
                "Air inside" isn't the full story; <strong>displacement</strong> is.
              </p>
            </div>

            {/* CAPS link */}
            <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-100 mb-6">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                Science notebook
              </p>
              <p className="text-indigo-700 text-sm font-bold">
                Density = mass ÷ volume. An object floats when its average density is
                less than water (1 g/cm³).
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-5 bg-indigo-500 shadow-[0_6px_0_#4338CA]
                         text-white font-display font-black text-2xl rounded-3xl btn-press"
            >
              Finish investigation 🌱
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

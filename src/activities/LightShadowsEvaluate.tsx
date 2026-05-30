// Activity: Light & Shadows — EVALUATE (Band B)
// 5E: evaluate    4 questions on shadow direction, size, and time of day.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

interface Question { id: string; question: string; options: string[]; correct: string; explanation: string; hint: string; }

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'The torch is on the RIGHT. Where will the shadow fall?',
    options: ['On the right side', 'On the left side', 'Directly below', 'There is no shadow'],
    correct: 'On the left side',
    explanation: 'Shadows always fall on the OPPOSITE side from the light. Torch on the right → shadow on the left.',
    hint: 'Light travels in straight lines. The shadow is where the light CANNOT reach.',
  },
  {
    id: 'q2',
    question: 'When is your shadow the SHORTEST?',
    options: ['Early morning', 'At midday (12 noon)', 'In the evening', 'On a cloudy day'],
    correct: 'At midday (12 noon)',
    explanation: 'At midday, the sun is directly overhead. Light comes straight down, making the shortest shadow — right at your feet!',
    hint: 'When the light source is directly ABOVE something, what direction does the shadow point?',
  },
  {
    id: 'q3',
    question: 'You move a torch CLOSER to a tree. What happens to the shadow?',
    options: ['Shadow gets bigger', 'Shadow gets smaller', 'Shadow disappears', 'Shadow stays the same'],
    correct: 'Shadow gets bigger',
    explanation: 'Closer light source = bigger shadow. The light rays spread around the object more when the source is close, creating a larger shadow.',
    hint: 'Try with your hand and a torch at home!',
  },
  {
    id: 'q4',
    question: 'Why can you NOT see your shadow on a cloudy day?',
    options: ['The sun is too cold', 'Clouds scatter light in all directions so there is no single light source', 'Shadows only form at night', 'The ground is too dark'],
    correct: 'Clouds scatter light in all directions so there is no single light source',
    explanation: 'Clouds scatter sunlight everywhere. With light coming from all directions, there is no single "beam" to block — so no sharp shadow forms.',
    hint: 'A shadow needs ONE clear light source pointing in one direction.',
  },
];

type Phase = 'question' | 'result';
interface Answer { id: string; chosen: string; correct: boolean; }
interface Props { onComplete: () => void; onExit: () => void; }

export default function LightShadowsEvaluate({ onComplete, onExit }: Props) {
  const [round, setRound]       = useState(0);
  const [phase, setPhase]       = useState<Phase>('question');
  const [answers, setAnswers]   = useState<Answer[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone]         = useState(false);
  const q = QUESTIONS[round];

  function choose(option: string) {
    setAnswers(prev => [...prev, { id: q.id, chosen: option, correct: option === q.correct }]);
    setPhase('result'); setShowHint(false);
  }
  function nextRound() {
    if (round + 1 >= QUESTIONS.length) setDone(true);
    else { setRound(r => r + 1); setPhase('question'); }
  }
  const score = answers.filter(a => a.correct).length;

  if (done) {
    return (
      <ActivityWrapper title="Shadow Quiz!" onExit={onExit} onSuccess={onComplete} accentColor="bg-amber-400">
        <div className="w-full max-w-sm mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="text-7xl mb-5">
            {score === 4 ? '🏆' : score === 3 ? '🌟' : '💪'}
          </motion.div>
          <h3 className="font-display font-black text-3xl text-gray-800 mb-2">{score} / {QUESTIONS.length} correct!</h3>
          <p className="text-gray-500 mb-7">{score === 4 ? 'Perfect! You understand light and shadows.' : 'Great exploring — light physics is fascinating!'}</p>
          <div className="space-y-2 mb-7 text-left">
            {QUESTIONS.map((q, i) => {
              const ans = answers[i];
              return (
                <div key={q.id} className={cn('flex items-start gap-3 p-3 rounded-2xl text-sm', ans?.correct ? 'bg-amber-50 text-amber-800' : 'bg-orange-50 text-orange-800')}>
                  <span className="text-xl flex-shrink-0">{ans?.correct ? '✓' : '✗'}</span>
                  <div className="flex-1"><p className="font-black text-xs">{q.correct}</p><p className="text-xs opacity-80 leading-snug">{q.explanation}</p></div>
                </div>
              );
            })}
          </div>
          <button onClick={onComplete} className="w-full py-4 bg-amber-400 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl btn-press">Finish 🌱</button>
        </div>
      </ActivityWrapper>
    );
  }

  return (
    <ActivityWrapper title="Shadow Quiz!" voicePrompt={phase === 'question' ? q.question : (answers.at(-1)?.correct ? `Correct! ${q.explanation}` : `Not quite. ${q.explanation}`)}
      currentRound={round + 1} totalRounds={QUESTIONS.length} onExit={onExit} onSuccess={onComplete} accentColor="bg-amber-400">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-gray-100 mb-5 text-center">
          <p className="font-display font-black text-lg text-gray-800 leading-snug">{q.question}</p>
        </div>
        <AnimatePresence mode="wait">
          {phase === 'question' ? (
            <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {q.options.map(opt => (
                <button key={opt} onClick={() => choose(opt)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-left font-display font-black text-base text-gray-700 hover:border-amber-400 active:scale-95 transition-all">
                  {opt}
                </button>
              ))}
              <button onClick={() => setShowHint(s => !s)} className="flex items-center gap-2 mx-auto text-amber-500 text-sm font-bold mt-2">
                <Lightbulb size={16} />{showHint ? 'Hide hint' : 'Need a hint?'}
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-center text-amber-700 text-sm bg-amber-50 rounded-2xl p-3 border border-amber-200">
                    💡 {q.hint}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className={cn('p-4 rounded-2xl font-bold text-sm leading-snug', answers.at(-1)?.correct ? 'bg-amber-100 text-amber-700' : 'bg-orange-100 text-orange-700')}>
                <p className="text-base font-black mb-1">{answers.at(-1)?.correct ? '✅ Correct!' : '💡 Not quite —'} {q.correct}</p>
                <p className="opacity-90">{q.explanation}</p>
              </div>
              <button onClick={nextRound} className="w-full py-4 bg-amber-400 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl btn-press">
                {round + 1 < QUESTIONS.length ? 'Next →' : 'See my score!'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ActivityWrapper>
  );
}

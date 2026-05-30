// Activity: Parts of a Plant — EVALUATE (Band B)
// 5E: evaluate    Kind: quiz    4 questions — one per plant part

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  hint: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'Which part of the plant drinks water from the soil?',
    options: ['🌸 Flower', '🍃 Leaf', '🌱 Root', '🌿 Stem'],
    correct: '🌱 Root',
    explanation: 'Roots spread through the soil and absorb water and minerals for the whole plant.',
    hint: 'This part is hidden underground.',
  },
  {
    id: 'q2',
    question: 'Which part makes food using sunlight?',
    options: ['🌱 Root', '🍃 Leaf', '🌸 Flower', '🌿 Stem'],
    correct: '🍃 Leaf',
    explanation: 'Leaves are food factories! They use sunlight, water, and air to make sugar — a process called photosynthesis.',
    hint: 'This part is wide and flat to catch as much sunlight as possible.',
  },
  {
    id: 'q3',
    question: 'Which part carries water from the roots to the leaves?',
    options: ['🌸 Flower', '🌱 Root', '🍃 Leaf', '🌿 Stem'],
    correct: '🌿 Stem',
    explanation: 'The stem is like a straw — it carries water up from the roots and food down from the leaves.',
    hint: 'This part connects the roots below to the leaves above.',
  },
  {
    id: 'q4',
    question: 'Which part makes seeds so new plants can grow?',
    options: ['🌿 Stem', '🌱 Root', '🌸 Flower', '🍃 Leaf'],
    correct: '🌸 Flower',
    explanation: 'Flowers produce seeds after bees carry pollen between them. Seeds grow into new plants!',
    hint: 'Bees love visiting this part. It is usually colourful and smells nice.',
  },
];

type Phase = 'question' | 'result';
interface Answer { id: string; chosen: string; correct: boolean; }

interface Props { onComplete: () => void; onExit: () => void; }

export default function PartsOfPlantEvaluate({ onComplete, onExit }: Props) {
  const [round, setRound]       = useState(0);
  const [phase, setPhase]       = useState<Phase>('question');
  const [answers, setAnswers]   = useState<Answer[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone]         = useState(false);

  const q = QUESTIONS[round];

  function choose(option: string) {
    const correct = option === q.correct;
    setAnswers(prev => [...prev, { id: q.id, chosen: option, correct }]);
    setPhase('result');
    setShowHint(false);
  }

  function nextRound() {
    if (round + 1 >= QUESTIONS.length) setDone(true);
    else { setRound(r => r + 1); setPhase('question'); }
  }

  const score = answers.filter(a => a.correct).length;

  if (done) {
    return (
      <ActivityWrapper title="Plant Quiz!" onExit={onExit} onSuccess={onComplete} accentColor="bg-emerald-500">
        <div className="w-full max-w-sm mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="text-7xl mb-5">
            {score === 4 ? '🏆' : score === 3 ? '🌟' : '💪'}
          </motion.div>
          <h3 className="font-display font-black text-3xl text-gray-800 mb-2">{score} / {QUESTIONS.length} correct!</h3>
          <p className="text-gray-500 mb-7">{score === 4 ? 'Perfect! You know every part of a plant.' : 'Good effort — plants are amazing!'}</p>
          <div className="space-y-2 mb-7 text-left">
            {QUESTIONS.map((q, i) => {
              const ans = answers[i];
              return (
                <div key={q.id} className={cn('flex items-start gap-3 p-3 rounded-2xl text-sm', ans?.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800')}>
                  <span className="text-xl flex-shrink-0">{q.correct.split(' ')[0]}</span>
                  <div className="flex-1">
                    <p className="font-black text-xs">{q.correct}</p>
                    <p className="text-xs opacity-80 leading-snug">{q.explanation}</p>
                  </div>
                  <span className="flex-shrink-0 font-black">{ans?.correct ? '✓' : '✗'}</span>
                </div>
              );
            })}
          </div>
          <button onClick={onComplete} className="w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-xl rounded-3xl btn-press">Finish 🌱</button>
        </div>
      </ActivityWrapper>
    );
  }

  return (
    <ActivityWrapper title="Plant Quiz!" voicePrompt={phase === 'question' ? q.question : (answers.at(-1)?.correct ? `Correct! ${q.explanation}` : `Not quite. ${q.explanation}`)}
      currentRound={round + 1} totalRounds={QUESTIONS.length} onExit={onExit} onSuccess={onComplete} accentColor="bg-emerald-500">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-gray-100 mb-5 text-center">
          <p className="font-display font-black text-lg text-gray-800 leading-snug">{q.question}</p>
        </div>
        <AnimatePresence mode="wait">
          {phase === 'question' ? (
            <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {q.options.map(opt => (
                <button key={opt} onClick={() => choose(opt)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-left font-display font-black text-lg text-gray-700 hover:border-emerald-400 active:scale-95 transition-all">
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
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className={cn('p-4 rounded-2xl font-bold text-sm leading-snug', answers.at(-1)?.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700')}>
                <p className="text-base font-black mb-1">{answers.at(-1)?.correct ? '✅ Correct!' : '💡 Not quite —'} {q.correct}</p>
                <p className="opacity-90">{q.explanation}</p>
              </div>
              <button onClick={nextRound} className="w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-xl rounded-3xl btn-press">
                {round + 1 < QUESTIONS.length ? 'Next question →' : 'See my score!'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ActivityWrapper>
  );
}

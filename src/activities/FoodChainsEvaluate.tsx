// Activity: Food Chains — EVALUATE (Band B)
// 5E: evaluate    4 questions — chain order, roles, and cause-effect scenarios

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

interface Question { id: string; question: string; options: string[]; correct: string; explanation: string; hint: string; }

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'In this chain: Grass → Rabbit → Fox — what does the rabbit eat?',
    options: ['Fox', 'Grass', 'Sunlight', 'Other rabbits'],
    correct: 'Grass',
    explanation: 'The rabbit is a herbivore — it eats only plants (grass). Energy flows: Grass → Rabbit → Fox.',
    hint: 'The arrow points FROM the thing being eaten TO the thing that eats it.',
  },
  {
    id: 'q2',
    question: 'What would happen if ALL the grass in an ecosystem disappeared?',
    options: ['Foxes would get bigger', 'Rabbits and foxes would both struggle to survive', 'Only foxes would die', 'Nothing would change'],
    correct: 'Rabbits and foxes would both struggle to survive',
    explanation: 'No grass → rabbits have no food → rabbits die → foxes have nothing to eat → foxes also struggle. Removing one link can break the whole chain!',
    hint: 'Trace the chain from the bottom. What happens if the first link breaks?',
  },
  {
    id: 'q3',
    question: 'A mouse eats grain. An owl eats mice. What is the mouse?',
    options: ['A carnivore', 'A producer', 'A herbivore', 'An omnivore'],
    correct: 'A herbivore',
    explanation: 'The mouse eats only grain (a plant). An animal that eats only plants is a herbivore.',
    hint: 'What does the mouse eat? Is grain a plant or an animal?',
  },
  {
    id: 'q4',
    question: 'In which direction does energy flow in a food chain?',
    options: [
      'From carnivore back to plant',
      'From plant → herbivore → carnivore (one way)',
      'In all directions equally',
      'From carnivore to the sun',
    ],
    correct: 'From plant → herbivore → carnivore (one way)',
    explanation: 'Energy flows in ONE direction only — from producers (plants) through herbivores to carnivores. It cannot flow backwards.',
    hint: 'The arrows in a food chain always point toward the animal doing the eating.',
  },
];

type Phase = 'question' | 'result';
interface Answer { id: string; chosen: string; correct: boolean; }
interface Props { onComplete: () => void; onExit: () => void; }

export default function FoodChainsEvaluate({ onComplete, onExit }: Props) {
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
      <ActivityWrapper title="Food Chain Quiz!" onExit={onExit} onSuccess={onComplete} accentColor="bg-green-500">
        <div className="w-full max-w-sm mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="text-7xl mb-5">
            {score === 4 ? '🏆' : score === 3 ? '🌟' : '💪'}
          </motion.div>
          <h3 className="font-display font-black text-3xl text-gray-800 mb-2">{score} / {QUESTIONS.length} correct!</h3>
          <p className="text-gray-500 mb-7">{score === 4 ? 'Perfect! You understand food chains completely.' : 'Good thinking — ecology is fascinating!'}</p>
          <div className="space-y-2 mb-7 text-left">
            {QUESTIONS.map((q, i) => {
              const ans = answers[i];
              return (
                <div key={q.id} className={cn('flex items-start gap-3 p-3 rounded-2xl text-sm', ans?.correct ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800')}>
                  <span className="flex-shrink-0 font-black">{ans?.correct ? '✓' : '✗'}</span>
                  <div className="flex-1">
                    <p className="font-black text-xs">{q.correct}</p>
                    <p className="text-xs opacity-80 leading-snug">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={onComplete} className="w-full py-4 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-xl rounded-3xl btn-press">Finish 🌱</button>
        </div>
      </ActivityWrapper>
    );
  }

  return (
    <ActivityWrapper title="Food Chain Quiz!" voicePrompt={phase === 'question' ? q.question : (answers.at(-1)?.correct ? `Correct! ${q.explanation}` : `Not quite. ${q.explanation}`)}
      currentRound={round + 1} totalRounds={QUESTIONS.length} onExit={onExit} onSuccess={onComplete} accentColor="bg-green-500">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-gray-100 mb-5 text-center">
          <p className="font-display font-black text-lg text-gray-800 leading-snug">{q.question}</p>
        </div>
        <AnimatePresence mode="wait">
          {phase === 'question' ? (
            <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {q.options.map(opt => (
                <button key={opt} onClick={() => choose(opt)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-left font-display font-black text-base text-gray-700 hover:border-green-400 active:scale-95 transition-all">
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
              <div className={cn('p-4 rounded-2xl font-bold text-sm leading-snug', answers.at(-1)?.correct ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')}>
                <p className="text-base font-black mb-1">{answers.at(-1)?.correct ? '✅ Correct!' : '💡 Not quite —'} {q.correct}</p>
                <p className="opacity-90">{q.explanation}</p>
              </div>
              <button onClick={nextRound} className="w-full py-4 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-xl rounded-3xl btn-press">
                {round + 1 < QUESTIONS.length ? 'Next →' : 'See my score!'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ActivityWrapper>
  );
}

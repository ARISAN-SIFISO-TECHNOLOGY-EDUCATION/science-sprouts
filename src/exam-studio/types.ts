// Shared types for the Science Academy (ages 13–17) engine.
// The content-free Problem contract + helper foundation, ported from
// math-adventure-rpg's exam-studio. Read semantically for science:
//   question      = the prompt / claim / phenomenon
//   options[4]    = the answers
//   correctAnswer = the sound answer
//   workingSteps  = how to reason / work it through
//   commonMistake = the misconception to watch for
//   examTip       = the science / exam tip

export type Problem = {
  id: string;
  question: string;
  correctAnswer: string;
  options: [string, string, string, string];
  marks: number;
  workingSteps: string[];
  hints: string[];
  calculatorAllowed: boolean;
  commonMistake: string;
  examTip: string;
};

// A single hand-verified conceptual case; fromCases() picks one at random.
export interface CaseDef {
  q: string; c: string; w: string[]; s: string[]; h: string[];
  mistake: string; tip: string; m?: number; calc?: boolean;
}

export type LevelGenerator = () => Problem;
export type TopicLevels = Record<number, LevelGenerator>;

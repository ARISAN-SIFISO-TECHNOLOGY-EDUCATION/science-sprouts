// Activity: Float or Sink? — Age 4 (Band A4) · Matter & Materials
// A gentle tap-and-hear intro to floating. Distinct from Age-3 "Hard vs Soft"
// and Age-5 "Wet or Dry"; the full predict-test float/sink lives in Band B.
import TapAndHear, { type TapItem, type CardPrompt } from './_TapAndHear';

const ITEMS: TapItem[] = [
  { id: 'leaf',  emoji: '🍃', label: 'Leaf',  voice: 'The leaf floats! It is light, so it stays on top of the water.' },
  { id: 'boat',  emoji: '⛵', label: 'Boat',  voice: 'The boat floats! Boats are made to stay on top of the water.' },
  { id: 'duck',  emoji: '🦆', label: 'Duck',  voice: 'The duck floats! It sits on top of the water and swims.' },
  { id: 'stone', emoji: '🪨', label: 'Stone', voice: 'The stone sinks! It is heavy, so it drops down to the bottom.' },
  { id: 'spoon', emoji: '🥄', label: 'Spoon', voice: 'The metal spoon sinks! It is heavy and goes down.' },
  { id: 'key',   emoji: '🔑', label: 'Key',   voice: 'The key sinks! Heavy things sink down to the bottom.' },
];

const PROMPTS: CardPrompt[] = [
  { emoji: '🛁', text: 'Bath time!' },
  { emoji: '🥄', text: 'Drop a spoon' },
  { emoji: '🍃', text: 'Drop a leaf' },
  { emoji: '👀', text: 'Which floats?' },
];

interface Props { onComplete: () => void; onExit: () => void; }

export default function FloatSinkPlayActivity({ onComplete, onExit }: Props) {
  return (
    <TapAndHear
      onComplete={onComplete}
      onExit={onExit}
      hero="🛁"
      introVoice="Some things float on top of the water. Some things sink to the bottom. Tap each one to find out!"
      doPrompt="Tap to see — float or sink?"
      items={ITEMS}
      cardVoice="At bath time, drop a spoon and a leaf in the water. Which one floats?"
      cardText="At bath time, try it! Drop a spoon and a leaf. Watch what floats!"
      cardPrompts={PROMPTS}
    />
  );
}

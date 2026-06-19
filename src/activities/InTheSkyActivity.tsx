// Activity: In the Sky — Age 4 (Band A4) · Earth & Beyond
// Distinct from Age-3 "Weather" and Age-5 "Day & Night".
import TapAndHear, { type TapItem, type CardPrompt } from './_TapAndHear';

const ITEMS: TapItem[] = [
  { id: 'sun',     emoji: '☀️', label: 'Sun',     voice: 'The sun! It gives us warm light in the day.' },
  { id: 'cloud',   emoji: '☁️', label: 'Cloud',   voice: 'A cloud! Clouds are made of tiny drops of water.' },
  { id: 'moon',    emoji: '🌙', label: 'Moon',    voice: 'The moon! We see the moon at night.' },
  { id: 'star',    emoji: '⭐', label: 'Star',    voice: 'A star! Stars twinkle in the dark night sky.' },
  { id: 'bird',    emoji: '🐦', label: 'Bird',    voice: 'A bird! Birds use their wings to fly in the sky.' },
  { id: 'rainbow', emoji: '🌈', label: 'Rainbow', voice: 'A rainbow! We see a rainbow after the rain.' },
];

const PROMPTS: CardPrompt[] = [
  { emoji: '☀️', text: 'In the day?' },
  { emoji: '🌙', text: 'At night?' },
  { emoji: '⭐', text: 'Find a star' },
  { emoji: '☁️', text: 'Find a cloud' },
];

interface Props { onComplete: () => void; onExit: () => void; }

export default function InTheSkyActivity({ onComplete, onExit }: Props) {
  return (
    <TapAndHear
      onComplete={onComplete}
      onExit={onExit}
      hero="🌈"
      introVoice="Look up at the sky! So many things to see. Tap each one to hear about it."
      doPrompt="Tap what is in the sky!"
      items={ITEMS}
      cardVoice="Tonight, look up at the sky. Can you find the moon and a star?"
      cardText="Tonight, look up together. Can you find the moon and a star?"
      cardPrompts={PROMPTS}
    />
  );
}

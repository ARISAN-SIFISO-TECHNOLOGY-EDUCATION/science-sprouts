// Activity: Animal Babies — Age 4 (Band A4) · Life & Living
// Distinct from Age-3 "My Body" and Age-5 "Animal Groups".
import TapAndHear, { type TapItem, type CardPrompt } from './_TapAndHear';

const ITEMS: TapItem[] = [
  { id: 'puppy',    emoji: '🐶', label: 'Puppy',    voice: 'A puppy! That is a baby dog. Woof woof!' },
  { id: 'kitten',   emoji: '🐱', label: 'Kitten',   voice: 'A kitten! That is a baby cat. Meow!' },
  { id: 'chick',    emoji: '🐤', label: 'Chick',    voice: 'A chick! That is a baby chicken. Cheep cheep!' },
  { id: 'calf',     emoji: '🐮', label: 'Calf',     voice: 'A calf! That is a baby cow. Moo!' },
  { id: 'lamb',     emoji: '🐑', label: 'Lamb',     voice: 'A lamb! That is a baby sheep. Baa baa!' },
  { id: 'duckling', emoji: '🦆', label: 'Duckling', voice: 'A duckling! That is a baby duck. Quack!' },
];

const PROMPTS: CardPrompt[] = [
  { emoji: '🐶', text: 'Baby dog?' },
  { emoji: '🐱', text: 'Baby cat?' },
  { emoji: '🐮', text: 'Baby cow?' },
  { emoji: '🐤', text: 'Baby hen?' },
];

interface Props { onComplete: () => void; onExit: () => void; }

export default function AnimalBabiesActivity({ onComplete, onExit }: Props) {
  return (
    <TapAndHear
      onComplete={onComplete}
      onExit={onExit}
      hero="🐤"
      introVoice="Baby animals! Every animal was a baby once. Tap each baby to hear its name."
      doPrompt="Tap a baby animal!"
      items={ITEMS}
      cardVoice="Find animal pictures in a book. Can you name the babies together?"
      cardText="Look at animal pictures together. Name the baby and its mummy!"
      cardPrompts={PROMPTS}
    />
  );
}

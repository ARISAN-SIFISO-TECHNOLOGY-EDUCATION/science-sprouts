// ──────────────────────────────────────────────────────────────────────────────
// Age 14 · Pioneers — how matter, bodies and current behave.
// Chemical Reactions · Body Systems · Electricity & Magnetism.
// SA CAPS Senior Phase Natural Sciences, presented by age (no grade labels).
// ──────────────────────────────────────────────────────────────────────────────
import { fromCases } from '../../exam-studio/helpers.ts';
import type { CaseDef, LevelGenerator, TopicLevels } from '../../exam-studio/types.ts';

const lvl = (cases: CaseDef[]): LevelGenerator => () => fromCases(cases);

// ── Chemical Reactions ────────────────────────────────────────────────────────
const REACT_L1: CaseDef[] = [
  { q: 'Melting ice into water is which kind of change?',
    c: 'A physical change', w: ['A chemical change', 'A new substance forming', 'Burning'],
    s: ['No new substance forms — it is still water.', 'It can be reversed by freezing, so it is physical.'],
    h: ['Can you reverse it easily?'], mistake: 'Calling melting a chemical change — no new substance is made.',
    tip: 'Physical change: same substance, often reversible.' },
  { q: 'Which of these is a CHEMICAL change?',
    c: 'Wood burning to ash', w: ['Ice melting', 'Sugar dissolving', 'Tearing paper'],
    s: ['Burning makes new substances (ash, gases).', 'It cannot be reversed — so it is chemical.'],
    h: ['Which one makes something brand new?'], mistake: 'Thinking dissolving is chemical — it is physical.',
    tip: 'Chemical change makes a new substance.' },
  { q: 'How can you tell a chemical change has happened?',
    c: 'A new substance forms (colour change, gas, or heat given off)', w: ['Only the shape changes', 'It reverses easily', 'Nothing new appears'],
    s: ['Look for signs: colour change, bubbles (gas), heat or light.', 'These signal a new substance.'],
    h: ['Watch for bubbles, colour or heat.'], mistake: 'Expecting a chemical change to reverse easily — usually it does not.',
    tip: 'New substance + hard to reverse = chemical change.' },
];
const REACT_L2: CaseDef[] = [
  { q: 'In a reaction, the starting substances are called the…',
    c: 'Reactants', w: ['Products', 'Mixtures', 'Catalysts'],
    s: ['Reactants → Products.', 'Reactants are what you start with, on the left of the arrow.'],
    h: ['Left of the arrow.'], mistake: 'Swapping reactants and products.',
    tip: 'Reactants start; products are made.' },
  { q: 'The new substances made in a reaction are called the…',
    c: 'Products', w: ['Reactants', 'Atoms', 'Solvents'],
    s: ['Products are on the right of the arrow.', 'They are what the reaction produces.'],
    h: ['Right of the arrow.'], mistake: 'Calling the products “reactants”.',
    tip: 'Products are the result of the reaction.' },
  { q: 'In “magnesium + oxygen → magnesium oxide”, what is the product?',
    c: 'Magnesium oxide', w: ['Magnesium', 'Oxygen', 'Heat'],
    s: ['Reactants: magnesium and oxygen.', 'Product (after the arrow): magnesium oxide.'],
    h: ['It comes after the arrow.'], mistake: 'Picking a reactant as the product.',
    tip: 'The product is what forms after the arrow.' },
];
const REACT_L3: CaseDef[] = [
  { q: 'In a sealed reaction, how does the total mass change?',
    c: 'It stays the same', w: ['It increases', 'It decreases', 'It doubles'],
    s: ['No atoms enter or leave a sealed container.', 'Mass is conserved — it stays the same.'],
    h: ['Atoms cannot escape a sealed jar.'], mistake: 'Thinking mass is lost when a gas forms inside a sealed jar.',
    tip: 'Mass is conserved in a chemical reaction.' },
  { q: 'Why does mass stay the same in a chemical reaction?',
    c: 'Atoms are only rearranged, not created or destroyed', w: ['New atoms are made', 'Atoms disappear', 'Mass turns into light'],
    s: ['The same atoms are present before and after.', 'They just bond in new ways.'],
    h: ['Count the atoms before and after.'], mistake: 'Believing atoms are made or destroyed.',
    tip: 'Conservation of mass: atoms are rearranged.' },
  { q: '10 g of reactants fully react in a sealed jar. What is the mass of products?',
    c: '10 g', w: ['0 g', '20 g', '5 g'],
    s: ['Mass is conserved.', 'Products must also total 10 g.'],
    h: ['Mass in = mass out.'], mistake: 'Adding or losing mass when none can enter or leave.',
    tip: 'Reactant mass = product mass in a closed system.' },
];

// ── Body Systems ──────────────────────────────────────────────────────────────
const BODY_L1: CaseDef[] = [
  { q: 'Which system breaks down food so the body can use it?',
    c: 'The digestive system', w: ['The circulatory system', 'The respiratory system', 'The skeletal system'],
    s: ['Digestion breaks food into small nutrients.', 'That is the digestive system’s job.'],
    h: ['Think of the stomach and intestines.'], mistake: 'Confusing digestion with circulation.',
    tip: 'Digestive system = breaks down and absorbs food.' },
  { q: 'Which system carries blood, oxygen and nutrients around the body?',
    c: 'The circulatory system', w: ['The digestive system', 'The nervous system', 'The skeletal system'],
    s: ['The heart and blood vessels move blood.', 'This delivers oxygen and nutrients.'],
    h: ['Heart + blood vessels.'], mistake: 'Mixing up circulation and digestion.',
    tip: 'Circulatory system = transport around the body.' },
  { q: 'Which organ pumps blood around the body?',
    c: 'The heart', w: ['The lungs', 'The liver', 'The stomach'],
    s: ['The heart is a muscular pump.', 'It pushes blood through the vessels.'],
    h: ['It beats in your chest.'], mistake: 'Thinking the lungs pump blood — they exchange gases.',
    tip: 'The heart is the body’s pump.' },
];
const BODY_L2: CaseDef[] = [
  { q: 'Where does gas exchange (oxygen in, carbon dioxide out) happen?',
    c: 'In the lungs', w: ['In the heart', 'In the stomach', 'In the kidneys'],
    s: ['Air reaches tiny sacs in the lungs.', 'Oxygen enters the blood and carbon dioxide leaves there.'],
    h: ['You fill them when you breathe in.'], mistake: 'Placing gas exchange in the heart.',
    tip: 'Lungs = where gas exchange occurs.' },
  { q: 'What gas does your body take IN when you breathe?',
    c: 'Oxygen', w: ['Carbon dioxide', 'Only nitrogen', 'Hydrogen'],
    s: ['Cells need oxygen for respiration.', 'You breathe oxygen in and carbon dioxide out.'],
    h: ['Cells use it to release energy.'], mistake: 'Swapping the gas you breathe in (oxygen) and out (carbon dioxide).',
    tip: 'In: oxygen. Out: carbon dioxide.' },
  { q: 'What is a main job of the skeletal system?',
    c: 'To support and protect the body', w: ['To digest food', 'To pump blood', 'To exchange gases'],
    s: ['Bones give the body its shape and support.', 'They also protect organs (e.g. the skull protects the brain).'],
    h: ['Think structure and armour.'], mistake: 'Giving the skeleton a job that belongs to another system.',
    tip: 'Skeleton = support, protection and movement.' },
];
const BODY_L3: CaseDef[] = [
  { q: 'Which system controls the body using fast electrical signals?',
    c: 'The nervous system', w: ['The digestive system', 'The skeletal system', 'The circulatory system'],
    s: ['Nerves carry signals quickly.', 'The brain and nerves coordinate the body.'],
    h: ['Brain, spinal cord and nerves.'], mistake: 'Confusing the nervous and circulatory systems.',
    tip: 'Nervous system = fast control and coordination.' },
  { q: 'Why do body systems need to work together?',
    c: 'Each does one job, but the body needs them all to survive', w: ['They compete with each other', 'Only one works at a time', 'They all do the same job'],
    s: ['Systems depend on one another.', 'For example, the circulatory system carries the oxygen the respiratory system collects.'],
    h: ['Think how oxygen reaches your toes.'], mistake: 'Treating each system as independent.',
    tip: 'Systems are interdependent — they cooperate.' },
  { q: 'Blood leaves the heart, drops off oxygen, and returns. What is this process called?',
    c: 'Circulation', w: ['Digestion', 'Respiration', 'Excretion'],
    s: ['Blood travels in a loop around the body.', 'This continuous flow is circulation.'],
    h: ['The blood goes in a loop.'], mistake: 'Confusing circulation with respiration (gas exchange).',
    tip: 'Circulation = the looping flow of blood.' },
];

// ── Electricity & Magnetism ───────────────────────────────────────────────────
const ELEC_L1: CaseDef[] = [
  { q: 'Electric current is the flow of…',
    c: 'Charge (electrons)', w: ['Water', 'Only heat', 'Light'],
    s: ['Current means moving charge.', 'In a wire, electrons carry the charge.'],
    h: ['Tiny charged particles move.'], mistake: 'Thinking current is a flow of water or light.',
    tip: 'Current = flow of electric charge.' },
  { q: 'What does the voltage from a cell do in a circuit?',
    c: 'Pushes the current around the circuit', w: ['Slows the current down', 'Stores the light', 'Cools the wire'],
    s: ['Voltage is the “push” (energy per charge).', 'A bigger push drives more current.'],
    h: ['Think of it as a pump’s pressure.'], mistake: 'Believing voltage resists current rather than driving it.',
    tip: 'Voltage = the push that drives current.' },
  { q: 'Which instrument measures electric current?',
    c: 'An ammeter', w: ['A thermometer', 'A ruler', 'A voltmeter'],
    s: ['An ammeter reads current (in amps).', 'A voltmeter reads voltage — different quantity.'],
    h: ['“Amp”-meter.'], mistake: 'Using a voltmeter (voltage) when you want current.',
    tip: 'Ammeter = current; voltmeter = voltage.' },
];
const ELEC_L2: CaseDef[] = [
  { q: 'In a SERIES circuit (one path), what happens if one bulb breaks?',
    c: 'All the bulbs go out', w: ['The other bulbs stay on', 'They get brighter', 'Nothing changes'],
    s: ['Series means a single path for the current.', 'A break anywhere stops the whole current.'],
    h: ['One path, one break stops everything.'], mistake: 'Expecting series bulbs to stay lit when one fails.',
    tip: 'Series = one path; one break stops all.' },
  { q: 'In a PARALLEL circuit, if one bulb breaks, the others…',
    c: 'Stay on', w: ['All go out', 'Get dimmer and die', 'Explode'],
    s: ['Parallel gives each bulb its own path.', 'A break in one branch leaves the others working.'],
    h: ['Each bulb has its own loop.'], mistake: 'Treating parallel like series.',
    tip: 'Parallel = separate paths; others keep working.' },
  { q: 'Why are house lights usually wired in parallel?',
    c: 'So one light can switch off without the others going out', w: ['To save on all wiring', 'So they share one switch', 'So one break kills them all'],
    s: ['Parallel branches are independent.', 'You can control each light on its own.'],
    h: ['You don’t want the whole house dark when one bulb blows.'], mistake: 'Thinking homes use series wiring.',
    tip: 'Parallel wiring keeps lights independent.' },
];
const ELEC_L3: CaseDef[] = [
  { q: 'Two like poles of magnets (N facing N) will…',
    c: 'Push apart (repel)', w: ['Pull together', 'Do nothing', 'Melt'],
    s: ['Like poles repel; opposite poles attract.', 'N and N are alike, so they repel.'],
    h: ['Same poles don’t get along.'], mistake: 'Thinking like poles attract.',
    tip: 'Like poles repel; opposite poles attract.' },
  { q: 'How can you make a simple electromagnet?',
    c: 'Coil wire around an iron nail and pass current through it', w: ['Rub a plastic rod', 'Heat a copper coin', 'Freeze an iron nail'],
    s: ['Current in a coil creates a magnetic field.', 'An iron core (the nail) strengthens it.'],
    h: ['Coil + iron + current.'], mistake: 'Expecting plastic or heat to make a magnet.',
    tip: 'Electromagnet = coil of wire + iron core + current.' },
  { q: 'What happens to an electromagnet when you switch the current OFF?',
    c: 'It loses its magnetism', w: ['It stays magnetic forever', 'It gets stronger', 'It becomes a permanent magnet'],
    s: ['The magnetism comes from the current.', 'No current means no magnetic field.'],
    h: ['No current, no magnet.'], mistake: 'Thinking an electromagnet stays magnetic with no current.',
    tip: 'Electromagnets can be switched on and off.' },
];

export const AGE14_LEVELS: Record<string, TopicLevels> = {
  'age14-reactions':   { 1: lvl(REACT_L1), 2: lvl(REACT_L2), 3: lvl(REACT_L3) },
  'age14-body':        { 1: lvl(BODY_L1),  2: lvl(BODY_L2),  3: lvl(BODY_L3) },
  'age14-electricity': { 1: lvl(ELEC_L1),  2: lvl(ELEC_L2),  3: lvl(ELEC_L3) },
};

// ──────────────────────────────────────────────────────────────────────────────
// Age 13 · Explorers — the building blocks of everything.
// Atoms & Elements · Cells & Life · Energy & Circuits.
// SA CAPS Senior Phase Natural Sciences, presented by age (no grade labels).
// Each level is a fromCases() over hand-verified conceptual items.
// ──────────────────────────────────────────────────────────────────────────────
import { fromCases } from '../../exam-studio/helpers.ts';
import type { CaseDef, LevelGenerator, TopicLevels } from '../../exam-studio/types.ts';

const lvl = (cases: CaseDef[]): LevelGenerator => () => fromCases(cases);

// ── Atoms & Elements ──────────────────────────────────────────────────────────
const ATOMS_L1: CaseDef[] = [
  { q: 'What is the smallest particle of an element that still behaves like that element?',
    c: 'An atom', w: ['A molecule', 'A cell', 'A grain'],
    s: ['Elements are made of tiny particles.', 'The smallest piece that is still that element is an atom.'],
    h: ['Smaller than a molecule.'], mistake: 'Thinking a cell is the smallest — cells are living units, not the units of matter.',
    tip: 'Atom = the smallest unit of an element.' },
  { q: 'What three particles make up an atom?',
    c: 'Protons, neutrons and electrons', w: ['Protons, neutrons and photons', 'Atoms, ions and electrons', 'Cells, protons and neutrons'],
    s: ['The nucleus holds protons (+) and neutrons (no charge).', 'Electrons (−) move around the nucleus.'],
    h: ['Two sit in the nucleus, one orbits it.'], mistake: 'Confusing photons (light) with the particles of an atom.',
    tip: 'Protons +, electrons −, neutrons neutral.' },
  { q: 'Where is nearly all of an atom’s mass found?',
    c: 'In the nucleus', w: ['In the electron shells', 'Spread out evenly', 'In the empty space'],
    s: ['Protons and neutrons are heavy and sit in the nucleus.', 'Electrons are very light, so the mass is in the centre.'],
    h: ['The heavy particles are in the centre.'], mistake: 'Assuming mass is spread evenly — it is concentrated in the nucleus.',
    tip: 'Mass lives in the nucleus; the rest is mostly empty space.' },
];
const ATOMS_L2: CaseDef[] = [
  { q: 'A substance made of only one kind of atom is called a(n)…',
    c: 'Element', w: ['Compound', 'Mixture', 'Solution'],
    s: ['One kind of atom only = an element.', 'Examples: oxygen, gold, iron.'],
    h: ['It cannot be broken into simpler substances.'], mistake: 'Calling a single-atom substance a compound.',
    tip: 'Element = one type of atom.' },
  { q: 'On the Periodic Table, what does the symbol “Fe” stand for?',
    c: 'Iron', w: ['Fluorine', 'Lead', 'Iodine'],
    s: ['Symbols come from the element’s name (often Latin).', 'Fe = ferrum = iron.'],
    h: ['Used in steel and found in your blood.'], mistake: 'Reading “Fe” as fluorine (that is F).',
    tip: 'Fe = iron, from the Latin “ferrum”.' },
  { q: 'How many different elements does the Periodic Table organise?',
    c: 'About 118', w: ['About 12', 'About 50', 'Thousands'],
    s: ['Each box is one element.', 'Just over 100 elements are known — about 118.'],
    h: ['Just over one hundred.'], mistake: 'Thinking there are only a handful of elements.',
    tip: 'Around 118 elements build every substance there is.' },
];
const ATOMS_L3: CaseDef[] = [
  { q: 'Water is made of hydrogen and oxygen chemically joined. Water is therefore a(n)…',
    c: 'Compound', w: ['Element', 'Mixture', 'Atom'],
    s: ['Two different elements are chemically bonded.', 'Bonded elements form a compound.'],
    h: ['The elements are joined, not just mixed.'], mistake: 'Calling water an element — it is made of two.',
    tip: 'Different elements bonded together = a compound.' },
  { q: 'Which of these is a compound?',
    c: 'Carbon dioxide', w: ['Oxygen gas', 'Copper', 'Helium'],
    s: ['A compound has two or more elements bonded.', 'Carbon dioxide = carbon + oxygen.'],
    h: ['Its name hints at two elements.'], mistake: 'Picking a pure element (copper, helium) as a compound.',
    tip: 'If the name shows two elements, it is usually a compound.' },
  { q: 'How is a mixture different from a compound?',
    c: 'A mixture is not chemically bonded and can be separated easily', w: ['A mixture is always a single element', 'A mixture cannot be separated', 'A mixture has only one kind of atom'],
    s: ['In a compound, elements are chemically bonded.', 'In a mixture they are just together and can be separated (e.g. sand and salt).'],
    h: ['Think sand + iron filings — pull them apart.'], mistake: 'Treating mixtures and compounds as the same thing.',
    tip: 'Mixtures separate physically; compounds need a chemical change.' },
];

// ── Cells & Life ──────────────────────────────────────────────────────────────
const CELLS_L1: CaseDef[] = [
  { q: 'What is the basic unit of all living things?',
    c: 'The cell', w: ['The atom', 'The organ', 'The molecule'],
    s: ['Every living thing is made of cells.', 'The cell is the smallest unit that is alive.'],
    h: ['Smaller than an organ, but alive.'], mistake: 'Choosing the atom — atoms are the unit of matter, not of life.',
    tip: 'Cell = the basic unit of life.' },
  { q: 'Which part of a cell controls its activities?',
    c: 'The nucleus', w: ['The cytoplasm', 'The cell membrane', 'The vacuole'],
    s: ['The nucleus holds the cell’s instructions (DNA).', 'It directs what the cell does.'],
    h: ['It holds the DNA.'], mistake: 'Confusing the nucleus with the membrane.',
    tip: 'Nucleus = control centre.' },
  { q: 'What controls which substances enter and leave a cell?',
    c: 'The cell membrane', w: ['The nucleus', 'The cytoplasm', 'The chloroplast'],
    s: ['The membrane is the cell’s boundary.', 'It lets some things in and keeps others out.'],
    h: ['Think of a gatekeeper at the edge.'], mistake: 'Thinking the nucleus controls entry — it controls activity.',
    tip: 'Membrane = the cell’s gatekeeper.' },
];
const CELLS_L2: CaseDef[] = [
  { q: 'Which structure is found in plant cells but NOT animal cells?',
    c: 'A cell wall', w: ['A nucleus', 'A cell membrane', 'Cytoplasm'],
    s: ['Both cell types share a nucleus, membrane and cytoplasm.', 'Only plant cells add a rigid cell wall.'],
    h: ['It makes plant cells stiff and boxy.'], mistake: 'Confusing the cell wall with the membrane (animals have a membrane).',
    tip: 'Cell wall = plants only; gives shape and support.' },
  { q: 'Which green structure lets plant cells make food using sunlight?',
    c: 'Chloroplast', w: ['Mitochondria', 'Nucleus', 'Vacuole'],
    s: ['Chloroplasts contain chlorophyll (green).', 'They capture light for photosynthesis.'],
    h: ['It is the green one.'], mistake: 'Mixing up chloroplasts (make food) with mitochondria (release energy).',
    tip: 'Chloroplast captures light; it is found in plant cells.' },
  { q: 'Which part releases energy from food in BOTH plant and animal cells?',
    c: 'Mitochondria', w: ['Chloroplast', 'Cell wall', 'Cell membrane'],
    s: ['Respiration releases energy from food.', 'It happens in the mitochondria of all cells.'],
    h: ['Often called the cell’s “powerhouse”.'], mistake: 'Thinking only plants have mitochondria — all cells do.',
    tip: 'Mitochondria = the powerhouse, in every cell.' },
];
const CELLS_L3: CaseDef[] = [
  { q: 'Cells of the same type that work together form a…',
    c: 'Tissue', w: ['Organ', 'System', 'Organism'],
    s: ['Cells group into tissues.', 'Tissues group into organs, organs into systems.'],
    h: ['One step up from a single cell.'], mistake: 'Jumping straight to “organ” — tissue comes first.',
    tip: 'Cell → tissue → organ → system → organism.' },
  { q: 'Put these in order from smallest to largest.',
    c: 'Cell → tissue → organ → system', w: ['Tissue → cell → organ → system', 'Cell → organ → tissue → system', 'System → organ → tissue → cell'],
    s: ['Start with the single cell.', 'Build up: tissue, then organ, then system.'],
    h: ['Begin with the smallest living unit.'], mistake: 'Placing organ before tissue.',
    tip: 'Levels of organisation grow one step at a time.' },
  { q: 'Which of these do ALL living things need to survive?',
    c: 'Energy from food and water', w: ['Only sunlight', 'Only oxygen', 'Metal and plastic'],
    s: ['All living things need energy and water.', 'Not all need sunlight (e.g. animals) or oxygen (some microbes).'],
    h: ['What does every living thing eat or drink?'], mistake: 'Assuming every living thing needs sunlight directly.',
    tip: 'Food (energy) and water are universal needs of life.' },
];

// ── Energy & Circuits ─────────────────────────────────────────────────────────
const ENERGY_L1: CaseDef[] = [
  { q: 'A stretched rubber band stores which kind of energy?',
    c: 'Elastic potential energy', w: ['Kinetic energy', 'Heat energy', 'Sound energy'],
    s: ['Stretching stores energy in the band.', 'Stored energy in a stretched/squashed object is elastic potential energy.'],
    h: ['It is stored, not moving yet.'], mistake: 'Calling stored energy “kinetic” — kinetic means moving.',
    tip: 'Stored in a stretch or squash = elastic potential energy.' },
  { q: 'What kind of energy does a moving soccer ball have?',
    c: 'Kinetic energy', w: ['Potential energy', 'Chemical energy', 'Light energy'],
    s: ['Anything moving has kinetic energy.', 'The faster it moves, the more it has.'],
    h: ['“Kinetic” means motion.'], mistake: 'Confusing kinetic (moving) with potential (stored).',
    tip: 'Movement = kinetic energy.' },
  { q: 'Energy stored in food and in a battery is called…',
    c: 'Chemical energy', w: ['Kinetic energy', 'Sound energy', 'Elastic energy'],
    s: ['Food and batteries store energy in chemical bonds.', 'This is chemical potential energy.'],
    h: ['Think of what you “burn” for fuel.'], mistake: 'Thinking a still battery has no energy — it stores chemical energy.',
    tip: 'Food and fuel store chemical energy.' },
];
const ENERGY_L2: CaseDef[] = [
  { q: 'Which material lets electricity flow through it easily?',
    c: 'Copper', w: ['Plastic', 'Rubber', 'Glass'],
    s: ['Conductors let current flow; metals are good conductors.', 'Copper is used for wires.'],
    h: ['Wires are made of it.'], mistake: 'Picking an insulator (plastic, rubber) as a conductor.',
    tip: 'Metals like copper are good electrical conductors.' },
  { q: 'Why are electrical wires covered in plastic?',
    c: 'Plastic is an insulator, so the wire is safe to touch', w: ['Plastic conducts electricity well', 'Plastic makes the wire heavier', 'Plastic stores the current'],
    s: ['Plastic does not let current through (an insulator).', 'The cover keeps the current in the metal and you safe.'],
    h: ['It stops the current reaching your hand.'], mistake: 'Thinking the plastic carries the current — the metal does.',
    tip: 'Insulators like plastic keep current where it belongs.' },
  { q: 'Which of these is the BEST electrical conductor?',
    c: 'Metal', w: ['Wood', 'Plastic', 'Air'],
    s: ['Conductors carry current well.', 'Metals conduct far better than wood, plastic or air.'],
    h: ['Shiny and used in wires.'], mistake: 'Assuming wood conducts — it is an insulator.',
    tip: 'Metals are the everyday conductors.' },
];
const ENERGY_L3: CaseDef[] = [
  { q: 'What must a circuit have for a bulb to light up?',
    c: 'A complete, unbroken loop', w: ['A broken wire', 'Only one wire', 'An open switch'],
    s: ['Current needs a full path from the cell, through the bulb, and back.', 'Any break stops the flow.'],
    h: ['The path must be a full circle.'], mistake: 'Thinking one wire to the bulb is enough — the loop must close.',
    tip: 'A circuit must be a closed loop to work.' },
  { q: 'What happens to the bulb when you OPEN the switch?',
    c: 'It goes off because the circuit is broken', w: ['It gets brighter', 'Nothing changes', 'It stays on'],
    s: ['Opening the switch breaks the loop.', 'No complete path means no current, so the bulb goes off.'],
    h: ['Open switch = a gap in the loop.'], mistake: 'Mixing up “open” (off) and “closed” (on) for switches.',
    tip: 'Open switch breaks the circuit; closed switch completes it.' },
  { q: 'In a circuit, what does the cell (battery) provide?',
    c: 'The energy that pushes the current', w: ['The light', 'Resistance only', 'The sound'],
    s: ['The cell is the energy source.', 'It pushes current around the loop.'],
    h: ['It is where the energy comes from.'], mistake: 'Thinking the bulb, not the cell, supplies the energy.',
    tip: 'The cell is the energy source that drives the current.' },
];

export const AGE13_LEVELS: Record<string, TopicLevels> = {
  'age13-atoms':  { 1: lvl(ATOMS_L1),  2: lvl(ATOMS_L2),  3: lvl(ATOMS_L3) },
  'age13-cells':  { 1: lvl(CELLS_L1),  2: lvl(CELLS_L2),  3: lvl(CELLS_L3) },
  'age13-energy': { 1: lvl(ENERGY_L1), 2: lvl(ENERGY_L2), 3: lvl(ENERGY_L3) },
};

// ──────────────────────────────────────────────────────────────────────────────
// Age 15 · Builders — classifying matter and life.
// Matter & Classification (Physical Sciences) · Cells & Biodiversity (Life Sciences).
// SA CAPS FET entry, presented by age (no grade labels).
// ──────────────────────────────────────────────────────────────────────────────
import { fromCases } from '../../exam-studio/helpers.ts';
import type { CaseDef, LevelGenerator, TopicLevels } from '../../exam-studio/types.ts';

const lvl = (cases: CaseDef[]): LevelGenerator => () => fromCases(cases);

// ── Matter & Classification ───────────────────────────────────────────────────
const MATTER_L1: CaseDef[] = [
  { q: 'A substance that cannot be separated by physical means is a…',
    c: 'Pure substance', w: ['Mixture', 'Solution', 'Suspension'],
    s: ['Pure substances (elements or compounds) have a fixed make-up.', 'They cannot be split by physical methods.'],
    h: ['Opposite of a mixture.'], mistake: 'Calling a mixture a pure substance.',
    tip: 'Pure substance = element or compound, fixed composition.' },
  { q: 'Salt dissolved in water is an example of a…',
    c: 'Mixture (a solution)', w: ['Pure element', 'Compound only', 'Pure substance'],
    s: ['Two substances are mixed, not bonded.', 'A dissolved mixture is a solution.'],
    h: ['You can get the salt back by evaporating.'], mistake: 'Thinking dissolving creates a new compound.',
    tip: 'A solution is a special kind of mixture.' },
  { q: 'Which method gets pure salt back from salt water?',
    c: 'Evaporation', w: ['Filtration', 'Magnetism', 'Sieving'],
    s: ['The salt is dissolved, so filtering won’t catch it.', 'Evaporate the water and the salt is left behind.'],
    h: ['Boil the water away.'], mistake: 'Trying to filter a dissolved solid out.',
    tip: 'Evaporation recovers a dissolved solid.' },
];
const MATTER_L2: CaseDef[] = [
  { q: 'According to the kinetic theory, particles in a SOLID…',
    c: 'Vibrate in fixed positions', w: ['Move freely and fast', 'Are far apart', 'Have no energy at all'],
    s: ['Solid particles are packed and held in place.', 'They can only vibrate, not move around.'],
    h: ['Packed tightly, just jiggling.'], mistake: 'Saying solid particles have no energy — they still vibrate.',
    tip: 'Solid: fixed positions, vibrating.' },
  { q: 'When a solid is heated and melts, its particles…',
    c: 'Gain energy and move more freely', w: ['Lose energy', 'Stop moving', 'Disappear'],
    s: ['Heating adds energy to the particles.', 'They break free of fixed positions and flow.'],
    h: ['More heat = more movement.'], mistake: 'Thinking melting removes energy.',
    tip: 'Heating gives particles energy to move.' },
  { q: 'Which state has particles that are far apart and move quickly?',
    c: 'Gas', w: ['Solid', 'Liquid', 'Crystal'],
    s: ['Gas particles have the most energy.', 'They spread out and move fast.'],
    h: ['It fills any container.'], mistake: 'Confusing gas with liquid spacing.',
    tip: 'Gas: far apart, fast-moving particles.' },
];
const MATTER_L3: CaseDef[] = [
  { q: 'Why does oil float on water?',
    c: 'Oil is less dense than water', w: ['Oil is heavier than water', 'Oil is a solid', 'Oil dissolves in water'],
    s: ['Less dense substances float on denser ones.', 'Oil is less dense than water, so it sits on top.'],
    h: ['Compare how much mass fits in the same space.'], mistake: 'Linking floating to weight alone instead of density.',
    tip: 'Less dense floats on more dense.' },
  { q: 'Which method separates sand from water?',
    c: 'Filtration', w: ['Evaporation', 'Distillation', 'Chromatography'],
    s: ['Sand is insoluble — it stays as solid bits.', 'A filter lets water through and traps the sand.'],
    h: ['Pour it through filter paper.'], mistake: 'Using evaporation when filtration is simpler for an insoluble solid.',
    tip: 'Filtration separates an insoluble solid from a liquid.' },
  { q: 'Distillation is used to separate…',
    c: 'A liquid from a dissolved substance (e.g. pure water from salt water)', w: ['Two solids from each other', 'Iron filings from sand', 'Only colours in ink'],
    s: ['Distillation boils off the liquid and condenses it back.', 'It recovers the pure liquid, leaving the dissolved solid behind.'],
    h: ['Boil, then cool the vapour back to liquid.'], mistake: 'Confusing distillation with simple filtration.',
    tip: 'Distillation recovers a pure liquid from a solution.' },
];

// ── Cells & Biodiversity ──────────────────────────────────────────────────────
const LIFE_L1: CaseDef[] = [
  { q: 'Which organelle is the site of protein-making in a cell?',
    c: 'The ribosome', w: ['The nucleus', 'The vacuole', 'The cell wall'],
    s: ['Ribosomes build proteins from amino acids.', 'They follow instructions copied from the DNA.'],
    h: ['Tiny “factories” for proteins.'], mistake: 'Confusing the ribosome with the nucleus.',
    tip: 'Ribosome = protein synthesis.' },
  { q: 'What is the jelly-like fluid where many cell reactions happen?',
    c: 'Cytoplasm', w: ['Nucleus', 'Membrane', 'Chloroplast'],
    s: ['Cytoplasm fills the cell.', 'Organelles sit in it and reactions occur there.'],
    h: ['It surrounds the organelles.'], mistake: 'Mixing cytoplasm up with the membrane.',
    tip: 'Cytoplasm = the cell’s reaction medium.' },
  { q: 'Which organelle stores water and helps keep a plant cell firm?',
    c: 'The vacuole', w: ['The nucleus', 'The ribosome', 'The mitochondrion'],
    s: ['Plant cells have a large central vacuole.', 'Full of water, it presses out and keeps the cell firm.'],
    h: ['A water-filled sac.'], mistake: 'Assigning water storage to the nucleus.',
    tip: 'Vacuole stores water; keeps plant cells turgid.' },
];
const LIFE_L2: CaseDef[] = [
  { q: 'What is the main purpose of cell division (mitosis)?',
    c: 'To make new cells for growth and repair', w: ['To make energy', 'To digest food', 'To remove waste'],
    s: ['Mitosis copies a cell into two.', 'This lets organisms grow and repair damage.'],
    h: ['How does a cut heal?'], mistake: 'Linking mitosis to energy production.',
    tip: 'Mitosis = growth and repair.' },
  { q: 'Before a cell divides, what must it copy?',
    c: 'Its DNA', w: ['Its water', 'Its membrane only', 'Its waste'],
    s: ['Each new cell needs a full set of instructions.', 'So the DNA is copied first.'],
    h: ['The instructions must be duplicated.'], mistake: 'Forgetting DNA must double before division.',
    tip: 'DNA is copied before a cell divides.' },
  { q: 'Mitosis produces two cells that are…',
    c: 'Identical to the parent cell', w: ['Completely different', 'Half-sized forever', 'Dead'],
    s: ['Mitosis makes genetically identical cells.', 'Each gets the same DNA as the parent.'],
    h: ['Same instructions in each.'], mistake: 'Thinking mitosis makes different cells (that is meiosis).',
    tip: 'Mitosis → identical daughter cells.' },
];
const LIFE_L3: CaseDef[] = [
  { q: 'Putting living things into groups by shared features is called…',
    c: 'Classification', w: ['Respiration', 'Evolution', 'Digestion'],
    s: ['Scientists group organisms by features.', 'This grouping is classification.'],
    h: ['Sorting life into groups.'], mistake: 'Confusing classification with evolution.',
    tip: 'Classification = organising life into groups.' },
  { q: 'Which is the LARGEST of these classification groups?',
    c: 'Kingdom', w: ['Species', 'Genus', 'Family'],
    s: ['Groups go from broad to narrow: Kingdom → … → Species.', 'Kingdom is the broadest here.'],
    h: ['Broadest group, most members.'], mistake: 'Thinking species is the largest — it is the smallest.',
    tip: 'Kingdom is broad; species is specific.' },
  { q: 'Why is biodiversity important for an ecosystem?',
    c: 'A variety of species makes the ecosystem more stable and resilient', w: ['It makes no difference', 'Fewer species is always better', 'It only matters for plants'],
    s: ['Many species fill many roles.', 'Variety helps an ecosystem survive change.'],
    h: ['What if one species disappears?'], mistake: 'Believing biodiversity does not affect stability.',
    tip: 'More biodiversity → more resilient ecosystems.' },
];

export const AGE15_LEVELS: Record<string, TopicLevels> = {
  'age15-matter':  { 1: lvl(MATTER_L1), 2: lvl(MATTER_L2), 3: lvl(MATTER_L3) },
  'age15-lifesci': { 1: lvl(LIFE_L1),   2: lvl(LIFE_L2),   3: lvl(LIFE_L3) },
};

// ──────────────────────────────────────────────────────────────────────────────
// Age 17 · Thinkers — reasoning across reactions and inheritance.
// Reactions, Rates & Energy (Physical Sciences) · Genetics & Evolution (Life Sciences).
// SA CAPS FET capstone, presented by age (no grade labels).
// ──────────────────────────────────────────────────────────────────────────────
import { fromCases } from '../../exam-studio/helpers.ts';
import type { CaseDef, LevelGenerator, TopicLevels } from '../../exam-studio/types.ts';

const lvl = (cases: CaseDef[]): LevelGenerator => () => fromCases(cases);

// ── Reactions, Rates & Energy ─────────────────────────────────────────────────
const RATE_L1: CaseDef[] = [
  { q: 'Which change will SPEED UP a reaction?',
    c: 'Increasing the temperature', w: ['Cooling it down', 'Using larger lumps', 'Removing the catalyst'],
    s: ['Higher temperature means faster, harder collisions.', 'So the reaction rate increases.'],
    h: ['Hotter particles collide more.'], mistake: 'Thinking cooling or bigger lumps speed things up.',
    tip: 'Higher temperature → faster reaction.' },
  { q: 'Powdering a solid speeds up its reaction because it…',
    c: 'Increases the surface area', w: ['Decreases the surface area', 'Lowers the temperature', 'Removes a reactant'],
    s: ['Powder exposes far more surface than a lump.', 'More surface = more collisions = faster reaction.'],
    h: ['Think how fast powder dissolves vs a block.'], mistake: 'Believing lump size has no effect on rate.',
    tip: 'More surface area → faster reaction.' },
  { q: 'What does a catalyst do to a reaction?',
    c: 'Speeds it up without being used up', w: ['Slows it down', 'Is destroyed in the reaction', 'Becomes a product'],
    s: ['A catalyst lowers the energy needed to react.', 'It is not consumed, so it can work again.'],
    h: ['It helps but is left over at the end.'], mistake: 'Thinking a catalyst is used up like a reactant.',
    tip: 'A catalyst speeds a reaction and is reusable.' },
];
const RATE_L2: CaseDef[] = [
  { q: 'A reaction that RELEASES heat to its surroundings is…',
    c: 'Exothermic', w: ['Endothermic', 'Neutral', 'Catalytic'],
    s: ['“Exo” = out: heat goes out to the surroundings.', 'The surroundings get warmer.'],
    h: ['Heat exits.'], mistake: 'Swapping exothermic and endothermic.',
    tip: 'Exothermic releases heat (surroundings warm up).' },
  { q: 'A reaction that ABSORBS heat (the surroundings get colder) is…',
    c: 'Endothermic', w: ['Exothermic', 'Combustion', 'Neutralisation'],
    s: ['“Endo” = in: heat is taken in from the surroundings.', 'The surroundings get colder.'],
    h: ['Heat enters the reaction.'], mistake: 'Calling a cooling reaction “exothermic”.',
    tip: 'Endothermic absorbs heat (surroundings cool).' },
  { q: 'Burning fuel warms the surroundings, so combustion is…',
    c: 'Exothermic', w: ['Endothermic', 'Energy-free', 'A cooling reaction'],
    s: ['Combustion gives out heat and light.', 'Releasing energy makes it exothermic.'],
    h: ['A fire warms you.'], mistake: 'Thinking burning absorbs energy.',
    tip: 'Combustion is exothermic.' },
];
const RATE_L3: CaseDef[] = [
  { q: 'In a reversible reaction at equilibrium, the forward and reverse rates are…',
    c: 'Equal', w: ['Both zero', 'Forward always faster', 'Reverse has stopped'],
    s: ['At equilibrium both reactions still happen.', 'Their rates are equal, so concentrations stay constant.'],
    h: ['Balanced, but not stopped.'], mistake: 'Thinking equilibrium means the reaction has stopped.',
    tip: 'Equilibrium = equal forward and reverse rates.' },
  { q: 'Compounds built mainly from carbon and hydrogen are called…',
    c: 'Organic compounds', w: ['Metals', 'Salts', 'Noble gases'],
    s: ['Carbon-based compounds are “organic”.', 'They form the basis of fuels and living matter.'],
    h: ['Carbon is the key element.'], mistake: 'Limiting “organic” to living things only.',
    tip: 'Organic chemistry = carbon-based compounds.' },
  { q: 'Methane (CH₄) is the simplest member of which family?',
    c: 'The alkanes (hydrocarbons)', w: ['The acids', 'The metals', 'The salts'],
    s: ['Hydrocarbons contain only carbon and hydrogen.', 'Methane is the first alkane.'],
    h: ['Only C and H atoms.'], mistake: 'Classing methane as an acid or salt.',
    tip: 'Methane is the first of the alkanes.' },
];

// ── Genetics & Evolution ──────────────────────────────────────────────────────
const GENE_L1: CaseDef[] = [
  { q: 'Where is most of a cell’s genetic information stored?',
    c: 'In the DNA in the nucleus', w: ['In the cytoplasm', 'In the cell wall', 'In the membrane'],
    s: ['DNA carries the genetic code.', 'In most cells it sits inside the nucleus.'],
    h: ['Control centre of the cell.'], mistake: 'Placing genetic information in the membrane.',
    tip: 'Genetic information lives in nuclear DNA.' },
  { q: 'A section of DNA that codes for a particular feature is called a…',
    c: 'Gene', w: ['Cell', 'Ribosome', 'Protein'],
    s: ['DNA is divided into sections called genes.', 'Each gene codes for a trait.'],
    h: ['Smaller than a chromosome.'], mistake: 'Confusing a gene with a protein it makes.',
    tip: 'A gene is a coding section of DNA.' },
  { q: 'Which molecule carries the genetic code?',
    c: 'DNA', w: ['Glucose', 'Water', 'Only ATP'],
    s: ['DNA stores instructions in its base sequence.', 'It is the molecule of inheritance.'],
    h: ['A double helix.'], mistake: 'Thinking energy molecules carry the code.',
    tip: 'DNA carries the genetic code.' },
];
const GENE_L2: CaseDef[] = [
  { q: 'An allele that shows its effect even with only one copy is…',
    c: 'Dominant', w: ['Recessive', 'Blended', 'Neutral'],
    s: ['A dominant allele is expressed if at least one is present.', 'A recessive allele needs two copies to show.'],
    h: ['It “wins” over the recessive.'], mistake: 'Swapping dominant and recessive.',
    tip: 'Dominant shows with one copy; recessive needs two.' },
  { q: 'If you cross two Bb parents, the children’s genotypes can be…',
    c: 'BB, Bb or bb', w: ['Only BB', 'Only bb', 'Only Bb'],
    s: ['Each parent passes B or b.', 'Combinations give BB, Bb, Bb and bb.'],
    h: ['Draw a 2×2 Punnett square.'], mistake: 'Forgetting bb (and BB) can appear from two Bb parents.',
    tip: 'Bb × Bb → BB, Bb, bb (a 1:2:1 ratio).' },
  { q: 'A recessive trait only shows when the genotype is…',
    c: 'Two recessive alleles (e.g. bb)', w: ['One dominant allele', 'BB', 'Bb'],
    s: ['A recessive allele is hidden by a dominant one.', 'It only shows when both alleles are recessive (bb).'],
    h: ['Both copies must be recessive.'], mistake: 'Expecting Bb to show the recessive trait.',
    tip: 'Recessive traits need two recessive alleles.' },
];
const GENE_L3: CaseDef[] = [
  { q: 'What is natural selection?',
    c: 'Individuals better suited to their environment survive and reproduce more', w: ['All individuals reproduce equally', 'The strongest always wins by fighting', 'Animals choose to evolve'],
    s: ['Variation exists in a population.', 'Those better suited survive and pass on their genes.'],
    h: ['“Survival of the fittest” — fittest = best suited.'], mistake: 'Thinking organisms decide to evolve.',
    tip: 'Natural selection: better-suited individuals reproduce more.' },
  { q: 'Which of these provides evidence for evolution?',
    c: 'Fossils showing change over long periods of time', w: ['The colour of the sky', 'The phases of the Moon', 'The boiling point of water'],
    s: ['Fossils record organisms from the past.', 'Comparing them shows how life changed over time.'],
    h: ['Clues preserved in rock.'], mistake: 'Looking for evidence outside biology.',
    tip: 'Fossils are key evidence for evolution.' },
  { q: 'Over many generations, helpful inherited features tend to become…',
    c: 'More common in the population', w: ['Less common', 'Removed instantly', 'Completely unchanged'],
    s: ['Helpful features improve survival and reproduction.', 'So they spread through the population over time.'],
    h: ['Helpful genes get passed on more.'], mistake: 'Thinking advantageous traits fade away.',
    tip: 'Beneficial traits spread over generations.' },
];

export const AGE17_LEVELS: Record<string, TopicLevels> = {
  'age17-rates':    { 1: lvl(RATE_L1), 2: lvl(RATE_L2), 3: lvl(RATE_L3) },
  'age17-genetics': { 1: lvl(GENE_L1), 2: lvl(GENE_L2), 3: lvl(GENE_L3) },
};

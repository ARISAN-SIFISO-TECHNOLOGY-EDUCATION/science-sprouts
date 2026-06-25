// ──────────────────────────────────────────────────────────────────────────────
// Age 16 · Systems — bonds, reactions and life processes.
// Chemical Change & Bonding (Physical Sciences) · Life Processes (Life Sciences).
// SA CAPS FET, presented by age (no grade labels).
// ──────────────────────────────────────────────────────────────────────────────
import { fromCases } from '../../exam-studio/helpers.ts';
import type { CaseDef, LevelGenerator, TopicLevels } from '../../exam-studio/types.ts';

const lvl = (cases: CaseDef[]): LevelGenerator => () => fromCases(cases);

// ── Chemical Change & Bonding ─────────────────────────────────────────────────
const BOND_L1: CaseDef[] = [
  { q: 'A bond formed when atoms SHARE electrons is a…',
    c: 'Covalent bond', w: ['Ionic bond', 'Metallic bond', 'A bond with no electrons'],
    s: ['Sharing electrons = covalent bonding.', 'Common between non-metals, e.g. in water.'],
    h: ['Think “share”.'], mistake: 'Confusing sharing (covalent) with transferring (ionic).',
    tip: 'Covalent = shared electrons.' },
  { q: 'A bond formed when one atom TRANSFERS electrons to another is a…',
    c: 'Ionic bond', w: ['Covalent bond', 'Sharing bond', 'Neutral bond'],
    s: ['One atom gives, the other takes electrons.', 'They become charged ions that attract — an ionic bond.'],
    h: ['Think “give and take”.'], mistake: 'Calling electron transfer “covalent”.',
    tip: 'Ionic = transferred electrons, forming ions.' },
  { q: 'Table salt (NaCl) is held together by which type of bond?',
    c: 'Ionic bond', w: ['Covalent bond', 'Metallic bond', 'No bond'],
    s: ['Sodium gives an electron to chlorine.', 'The Na⁺ and Cl⁻ ions attract — ionic bonding.'],
    h: ['A metal + a non-metal.'], mistake: 'Assuming all compounds are covalent.',
    tip: 'Metal + non-metal usually means ionic bonding.' },
];
const BOND_L2: CaseDef[] = [
  { q: 'Why must a chemical equation be balanced?',
    c: 'Atoms are not created or destroyed, so each must be equal on both sides', w: ['To make it look neat', 'Because mass is destroyed', 'To add extra reactants'],
    s: ['Conservation of mass applies.', 'The same number of each atom must appear on both sides.'],
    h: ['Count atoms left and right.'], mistake: 'Treating balancing as cosmetic rather than a mass law.',
    tip: 'Balancing reflects conservation of mass.' },
  { q: 'Balance: H₂ + O₂ → H₂O. The correctly balanced equation is…',
    c: '2H₂ + O₂ → 2H₂O', w: ['H₂ + O₂ → H₂O', '2H₂ + 2O₂ → H₂O', 'H₂ + O₂ → 2H₂O'],
    s: ['O₂ has 2 oxygen atoms, so make 2 H₂O.', '2 H₂O needs 4 H, so use 2 H₂. Both sides balance.'],
    h: ['Start by balancing the oxygen.'], mistake: 'Changing the formula (H₂O₂) instead of the coefficients.',
    tip: 'Balance with coefficients, never by changing formulae.' },
  { q: 'In “2H₂ + O₂ → 2H₂O”, how many oxygen atoms are on each side?',
    c: 'Two', w: ['One', 'Four', 'Three'],
    s: ['Left: O₂ = 2 oxygen atoms.', 'Right: 2 × H₂O = 2 oxygen atoms. Balanced.'],
    h: ['Count the O on each side.'], mistake: 'Forgetting the subscript and coefficient multiply.',
    tip: 'Multiply coefficient × subscript to count atoms.' },
];
const BOND_L3: CaseDef[] = [
  { q: 'An acid has a pH…',
    c: 'Below 7', w: ['Above 7', 'Exactly 7', 'Above 14'],
    s: ['The pH scale runs 0–14.', 'Acids are below 7; bases above 7; 7 is neutral.'],
    h: ['Lower than neutral.'], mistake: 'Thinking acids are above 7 (those are bases).',
    tip: 'Acid pH < 7, base pH > 7, neutral = 7.' },
  { q: 'What is produced when an acid reacts with a base?',
    c: 'A salt and water (neutralisation)', w: ['Only a gas', 'Only an acid', 'Nothing at all'],
    s: ['Acid + base → salt + water.', 'This reaction is called neutralisation.'],
    h: ['The acid and base cancel out.'], mistake: 'Expecting no products from neutralisation.',
    tip: 'Neutralisation: acid + base → salt + water.' },
  { q: 'Which is a typical property of an acid?',
    c: 'Tastes sour and turns blue litmus red', w: ['Tastes bitter and feels slippery', 'Has a pH above 7', 'Turns red litmus blue'],
    s: ['Acids are sour and turn blue litmus red.', 'Bitter, slippery, blue-turning are base properties.'],
    h: ['Lemon juice is acidic.'], mistake: 'Mixing acid and base indicator results.',
    tip: 'Acids: sour; blue litmus → red.' },
];

// ── Life Processes ────────────────────────────────────────────────────────────
const PROC_L1: CaseDef[] = [
  { q: 'What does photosynthesis produce?',
    c: 'Glucose and oxygen', w: ['Carbon dioxide and water', 'Only water', 'Salt and water'],
    s: ['Plants use carbon dioxide + water + light.', 'They produce glucose (food) and release oxygen.'],
    h: ['What gas do plants give off?'], mistake: 'Swapping the inputs and outputs of photosynthesis.',
    tip: 'Photosynthesis: CO₂ + water + light → glucose + oxygen.' },
  { q: 'Cellular respiration releases energy by breaking down…',
    c: 'Glucose', w: ['Water', 'Oxygen', 'Carbon dioxide'],
    s: ['Respiration breaks glucose using oxygen.', 'This releases energy for the cell.'],
    h: ['The sugar made by photosynthesis.'], mistake: 'Thinking oxygen is broken down rather than used.',
    tip: 'Respiration breaks down glucose to release energy.' },
  { q: 'Respiration uses oxygen and releases…',
    c: 'Carbon dioxide', w: ['Oxygen', 'Only glucose', 'Nitrogen'],
    s: ['Respiration is roughly the reverse of photosynthesis.', 'It uses oxygen and gives off carbon dioxide.'],
    h: ['What do you breathe out?'], mistake: 'Saying respiration releases oxygen.',
    tip: 'Respiration: glucose + oxygen → energy + CO₂ + water.' },
];
const PROC_L2: CaseDef[] = [
  { q: 'Keeping a steady internal state (e.g. body temperature) is called…',
    c: 'Homeostasis', w: ['Photosynthesis', 'Digestion', 'Mitosis'],
    s: ['The body regulates conditions to stay stable.', 'This balance is homeostasis.'],
    h: ['“Same state”.'], mistake: 'Confusing homeostasis with digestion.',
    tip: 'Homeostasis = keeping internal conditions steady.' },
  { q: 'What is the role of an enzyme?',
    c: 'To speed up a reaction (a biological catalyst)', w: ['To slow reactions down', 'To destroy cells', 'To store energy'],
    s: ['Enzymes are biological catalysts.', 'They speed up reactions without being used up.'],
    h: ['Catalyst made by living cells.'], mistake: 'Thinking enzymes slow reactions.',
    tip: 'Enzyme = a biological catalyst (speeds reactions).' },
  { q: 'Very high temperatures can stop an enzyme working because the enzyme…',
    c: 'Loses its shape (denatures)', w: ['Gets faster forever', 'Turns into glucose', 'Becomes an acid'],
    s: ['Enzymes work because of their shape.', 'Too much heat changes the shape — it denatures and stops working.'],
    h: ['Shape matters for the “lock and key”.'], mistake: 'Assuming hotter is always faster for enzymes.',
    tip: 'High heat denatures enzymes (shape is lost).' },
];
const PROC_L3: CaseDef[] = [
  { q: 'Which tissue carries water UP from the roots of a plant?',
    c: 'Xylem', w: ['Phloem', 'Stomata', 'Cuticle'],
    s: ['Xylem transports water and minerals upward.', 'Phloem moves sugars made in the leaves.'],
    h: ['X for “up” (water).'], mistake: 'Swapping xylem and phloem.',
    tip: 'Xylem = water up; phloem = food around.' },
  { q: 'Which tissue carries food (sugars) made in the leaves to the rest of the plant?',
    c: 'Phloem', w: ['Xylem', 'Root hair', 'Chloroplast'],
    s: ['Phloem transports dissolved sugars.', 'It moves food from the leaves to where it is needed.'],
    h: ['It carries the “food”.'], mistake: 'Thinking xylem carries food.',
    tip: 'Phloem transports sugars throughout the plant.' },
  { q: 'Through which tiny leaf openings does a plant exchange gases?',
    c: 'Stomata', w: ['Xylem', 'Phloem', 'Veins'],
    s: ['Stomata are small pores, mostly on the leaf underside.', 'Carbon dioxide enters and oxygen/water vapour leave through them.'],
    h: ['Tiny adjustable pores.'], mistake: 'Confusing stomata (gas exchange) with xylem (transport).',
    tip: 'Stomata = gas exchange pores in leaves.' },
];

export const AGE16_LEVELS: Record<string, TopicLevels> = {
  'age16-bonding':  { 1: lvl(BOND_L1), 2: lvl(BOND_L2), 3: lvl(BOND_L3) },
  'age16-lifeproc': { 1: lvl(PROC_L1), 2: lvl(PROC_L2), 3: lvl(PROC_L3) },
};

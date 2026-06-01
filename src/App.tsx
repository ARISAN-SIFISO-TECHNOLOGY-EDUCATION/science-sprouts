// ──────────────────────────────────────────────────────────────────────────────
// Science Sprouts — main app shell
// Multi-topic architecture: topic list → topic detail → activity
//
// Screen flow:
//   bandSelect  (first launch / band change)
//   home        (two sub-views via selectedObjective state)
//     └─ topic list     (selectedObjective === null)
//     └─ topic detail   (selectedObjective set)
//   activity    (full-screen activity component)
// ──────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, Star, FlaskConical, Leaf, Zap, Globe, Lock, ChevronLeft,
} from 'lucide-react';

import { Band, LearnerProfile } from './types';
import { getProfile, saveProfile, awardStar } from './lib/db';
import { OBJECTIVES, BAND_META, STRAND_META } from './curriculum';
import { cn } from './lib/utils';

import Garden       from './components/Garden';
import Dashboard    from './components/Dashboard';
import BandSelector from './components/BandSelector';

// ── Activity imports (lazy) ─────────────────────────────────────────────────
// Each activity is code-split with React.lazy so the phone only downloads an
// activity's code the moment the child opens it. Keeps the home screen tiny
// and the cold start fast on low-end Android. The shell components (Garden,
// Dashboard, BandSelector) stay eager above — they are always needed.

// Matter & Materials — Floating & Sinking
const FloatSinkExplore  = lazy(() => import('./activities/FloatSinkExplore'));
const FloatSinkExplain  = lazy(() => import('./activities/FloatSinkExplain'));
const FloatSinkEvaluate = lazy(() => import('./activities/FloatSinkEvaluate'));
const FloatSinkBandA    = lazy(() => import('./activities/FloatSinkBandA'));
const FloatSinkBandC    = lazy(() => import('./activities/FloatSinkBandC'));

// Ages 3–4 topics (A3 + A4 share same components)
const MyBodyActivity   = lazy(() => import('./activities/MyBodyActivity'));
const HardSoftActivity = lazy(() => import('./activities/HardSoftActivity'));
const WeatherActivity  = lazy(() => import('./activities/WeatherActivity'));

// Age 6 topics (B6 — Predict → Test & Record → Badge)
const FloatSinkRecordActivity       = lazy(() => import('./activities/FloatSinkRecordActivity'));
const PlantPartsRecordActivity      = lazy(() => import('./activities/PlantPartsRecordActivity'));
const ShadowsRecordActivity         = lazy(() => import('./activities/ShadowsRecordActivity'));
const BodyPartsRecordActivity       = lazy(() => import('./activities/BodyPartsRecordActivity'));
const AnimalNeedsRecordActivity     = lazy(() => import('./activities/AnimalNeedsRecordActivity'));
const LifeCycleRecordActivity       = lazy(() => import('./activities/LifeCycleRecordActivity'));
const MaterialsRecordActivity       = lazy(() => import('./activities/MaterialsRecordActivity'));
const StrongMaterialsRecordActivity = lazy(() => import('./activities/StrongMaterialsRecordActivity'));
const LightSortRecordActivity       = lazy(() => import('./activities/LightSortRecordActivity'));
const MovementRecordActivity        = lazy(() => import('./activities/MovementRecordActivity'));
const WeatherChartRecordActivity    = lazy(() => import('./activities/WeatherChartRecordActivity'));
const EarthSpinRecordActivity       = lazy(() => import('./activities/EarthSpinRecordActivity'));

// Age 7 topics (B7 — Predict → Fair Test → Bar Chart → Badge)
const AbsorbentMaterialsActivity = lazy(() => import('./activities/AbsorbentMaterialsActivity'));
const MagnetsActivity            = lazy(() => import('./activities/MagnetsActivity'));
const GrowthActivity             = lazy(() => import('./activities/GrowthActivity'));
const AnimalHomesActivity        = lazy(() => import('./activities/AnimalHomesActivity'));
const FoodSourcesActivity        = lazy(() => import('./activities/FoodSourcesActivity'));
const SensesSafetyActivity       = lazy(() => import('./activities/SensesSafetyActivity'));
const StatesChangeActivity       = lazy(() => import('./activities/StatesChangeActivity'));
const MixturesActivity           = lazy(() => import('./activities/MixturesActivity'));
const EnergySourcesActivity      = lazy(() => import('./activities/EnergySourcesActivity'));
const WindActivity               = lazy(() => import('./activities/WindActivity'));
const WaterSourcesActivity       = lazy(() => import('./activities/WaterSourcesActivity'));
const SoilTypesActivity          = lazy(() => import('./activities/SoilTypesActivity'));

// Age 8 topics (B8 — plan → measure → record → conclude)
const InsulationActivity            = lazy(() => import('./activities/InsulationActivity'));
const FoodChainsInvestigateActivity = lazy(() => import('./activities/FoodChainsInvestigateActivity'));
const ShadowSizeActivity            = lazy(() => import('./activities/ShadowSizeActivity'));
const LifeCycleCompleteActivity     = lazy(() => import('./activities/LifeCycleCompleteActivity'));
const HealthyBodyActivity           = lazy(() => import('./activities/HealthyBodyActivity'));
const EvaporationActivity           = lazy(() => import('./activities/EvaporationActivity'));
const ReversibleChangeActivity      = lazy(() => import('./activities/ReversibleChangeActivity'));
const ForcesActivity                = lazy(() => import('./activities/ForcesActivity'));
const SoundActivity                 = lazy(() => import('./activities/SoundActivity'));
const RocksActivity                 = lazy(() => import('./activities/RocksActivity'));
const WeatherPatternsActivity       = lazy(() => import('./activities/WeatherPatternsActivity'));
const SpaceActivity                 = lazy(() => import('./activities/SpaceActivity'));

// Age 9 topics (Band B — CAPS Gr 4 flagship sims)
const PhotosynthesisActivity        = lazy(() => import('./activities/PhotosynthesisActivity'));
const CircuitBuilderActivity        = lazy(() => import('./activities/CircuitBuilderActivity'));
const WaterCycleActivity            = lazy(() => import('./activities/WaterCycleActivity'));
const PlantReproductionActivity     = lazy(() => import('./activities/PlantReproductionActivity'));
const NutritionActivity             = lazy(() => import('./activities/NutritionActivity'));
const ParticlesActivity             = lazy(() => import('./activities/ParticlesActivity'));
const StructuresActivity            = lazy(() => import('./activities/StructuresActivity'));
const StoredEnergyActivity          = lazy(() => import('./activities/StoredEnergyActivity'));
const SoundVibrationActivity        = lazy(() => import('./activities/SoundVibrationActivity'));
const SolarSystemActivity           = lazy(() => import('./activities/SolarSystemActivity'));
const WeatheringActivity            = lazy(() => import('./activities/WeatheringActivity'));
const SeasonsActivity               = lazy(() => import('./activities/SeasonsActivity'));

// Age 10 topics (Band C — CAPS Gr 5: investigate, classify, conclude)
const VertebratesActivity           = lazy(() => import('./activities/VertebratesActivity'));
const MetalsActivity                = lazy(() => import('./activities/MetalsActivity'));
const PowerStationActivity          = lazy(() => import('./activities/PowerStationActivity'));
const SkeletonsActivity             = lazy(() => import('./activities/SkeletonsActivity'));
const FoodWebActivity               = lazy(() => import('./activities/FoodWebActivity'));
const MetalUsesActivity             = lazy(() => import('./activities/MetalUsesActivity'));
const ProcessingActivity            = lazy(() => import('./activities/ProcessingActivity'));
const FuelsActivity                 = lazy(() => import('./activities/FuelsActivity'));
const SwitchCircuitActivity         = lazy(() => import('./activities/SwitchCircuitActivity'));
const ErosionActivity               = lazy(() => import('./activities/ErosionActivity'));
const FossilsActivity               = lazy(() => import('./activities/FossilsActivity'));
const RotationActivity              = lazy(() => import('./activities/RotationActivity'));

// Age 11 topics (Band C11 — CAPS Gr 6: separate, transfer, model)
const PhotosynthesisIOActivity      = lazy(() => import('./activities/PhotosynthesisIOActivity'));
const MixturesSeparateActivity      = lazy(() => import('./activities/MixturesSeparateActivity'));
const SeriesCircuitActivity         = lazy(() => import('./activities/SeriesCircuitActivity'));
const NutrientsActivity             = lazy(() => import('./activities/NutrientsActivity'));
const FoodPreservationActivity      = lazy(() => import('./activities/FoodPreservationActivity'));
const ChangesOfStateActivity        = lazy(() => import('./activities/ChangesOfStateActivity'));
const DissolvingActivity            = lazy(() => import('./activities/DissolvingActivity'));
const ConductorsActivity            = lazy(() => import('./activities/ConductorsActivity'));
const LeversActivity                = lazy(() => import('./activities/LeversActivity'));
const SolarSystemOrderActivity      = lazy(() => import('./activities/SolarSystemOrderActivity'));
const RotationRevolutionActivity    = lazy(() => import('./activities/RotationRevolutionActivity'));
const MoonPhasesActivity            = lazy(() => import('./activities/MoonPhasesActivity'));

// Age 12 topics (Band C12 — CAPS Gr 7: classify, model, reason)
const BiosphereActivity             = lazy(() => import('./activities/BiosphereActivity'));
const AcidsBasesActivity            = lazy(() => import('./activities/AcidsBasesActivity'));
const HeatTransferActivity          = lazy(() => import('./activities/HeatTransferActivity'));

// Age 5 topics (A5 — See → Predict → Do → Caregiver Card)
const FiveSensesActivity      = lazy(() => import('./activities/FiveSensesActivity'));
const WetDryActivity          = lazy(() => import('./activities/WetDryActivity'));
const DayNightActivity        = lazy(() => import('./activities/DayNightActivity'));
const PlantNeedsActivity      = lazy(() => import('./activities/PlantNeedsActivity'));
const AnimalGroupsActivity    = lazy(() => import('./activities/AnimalGroupsActivity'));
const HotColdActivity         = lazy(() => import('./activities/HotColdActivity'));
const BuildingThingsActivity  = lazy(() => import('./activities/BuildingThingsActivity'));
const LightSourcesActivity    = lazy(() => import('./activities/LightSourcesActivity'));
const PushPullActivity        = lazy(() => import('./activities/PushPullActivity'));
const WaterEverywhereActivity = lazy(() => import('./activities/WaterEverywhereActivity'));

// Matter & Materials — Solids, Liquids & Gases
const SolidsLiquidsGasesBandA    = lazy(() => import('./activities/SolidsLiquidsGasesBandA'));
const SolidsLiquidsGasesExplore  = lazy(() => import('./activities/SolidsLiquidsGasesExplore'));
const SolidsLiquidsGasesExplain  = lazy(() => import('./activities/SolidsLiquidsGasesExplain'));
const SolidsLiquidsGasesEvaluate = lazy(() => import('./activities/SolidsLiquidsGasesEvaluate'));

// Life & Living — Parts of a Plant
const PartsOfPlantBandA    = lazy(() => import('./activities/PartsOfPlantBandA'));
const PartsOfPlantExplore  = lazy(() => import('./activities/PartsOfPlantExplore'));
const PartsOfPlantExplain  = lazy(() => import('./activities/PartsOfPlantExplain'));
const PartsOfPlantEvaluate = lazy(() => import('./activities/PartsOfPlantEvaluate'));

// Life & Living — Food Chains
const FoodChainsBandA    = lazy(() => import('./activities/FoodChainsBandA'));
const FoodChainsExplore  = lazy(() => import('./activities/FoodChainsExplore'));
const FoodChainsExplain  = lazy(() => import('./activities/FoodChainsExplain'));
const FoodChainsEvaluate = lazy(() => import('./activities/FoodChainsEvaluate'));

// Energy & Change — Light & Shadows
const LightShadowsBandA    = lazy(() => import('./activities/LightShadowsBandA'));
const LightShadowsExplore  = lazy(() => import('./activities/LightShadowsExplore'));
const LightShadowsExplain  = lazy(() => import('./activities/LightShadowsExplain'));
const LightShadowsEvaluate = lazy(() => import('./activities/LightShadowsEvaluate'));

// Life & Living — Living vs Non-Living
const LivingNonLivingBandA    = lazy(() => import('./activities/LivingNonLivingBandA'));
const LivingNonLivingExplore  = lazy(() => import('./activities/LivingNonLivingExplore'));
const LivingNonLivingExplain  = lazy(() => import('./activities/LivingNonLivingExplain'));
const LivingNonLivingEvaluate = lazy(() => import('./activities/LivingNonLivingEvaluate'));

// ── Curriculum activity definitions ──────────────────────────────────────────

/** Display metadata for one activity card on the topic detail screen. */
type ActivityDef = {
  id: string;
  label: string;
  fiveE: string;
  voiceHint: string;
};

/**
 * ALL_BAND_ACTIVITIES maps objectiveId → band → activity card definitions.
 * When adding a new topic, add an entry here AND a component in ACTIVITY_REGISTRY.
 */
const ALL_BAND_ACTIVITIES: Record<string, Partial<Record<Band, ActivityDef[]>>> = {
  'mm.float_sink': {
    A5: [
      { id: 'fs.a.engage',       label: 'Try with water!', fiveE: '① EXPLORE',     voiceHint: 'A caregiver-led sensory activity' },
    ],
    B: [
      { id: 'fs.b.explore',      label: 'Explore',         fiveE: '① EXPLORE',     voiceHint: 'Drop objects into water' },
      { id: 'fs.b.explain',      label: 'Why it floats',   fiveE: '② EXPLAIN',     voiceHint: 'Find out WHY things float' },
      { id: 'fs.b.evaluate',     label: 'Predict & Test',  fiveE: '③ TEST',        voiceHint: 'Predict — then check!' },
    ],
    C: [
      { id: 'fs.c.investigate',  label: 'Investigate',     fiveE: '① INVESTIGATE', voiceHint: 'Change the variable — predict & test' },
    ],
  },

  // Age 6 MVP — Predict → Test & Record → Badge (Foundation Phase Gr 1)
  'mm.float_sink_record': {
    B6: [{ id: 'mm.fsr.b6.do', label: 'Float & Sink Lab', fiveE: '① TEST & RECORD', voiceHint: 'Predict, test 5 things, fill the data table' }],
  },
  'll.plant_parts_record': {
    B6: [{ id: 'll.ppr.b6.do', label: 'Plant Parts', fiveE: '① LABEL & LEARN', voiceHint: 'Tap each part — learn its job' }],
  },
  'ec.shadows_record': {
    B6: [{ id: 'ec.shr.b6.do', label: 'Shadow Lab', fiveE: '① EXPLORE & REASON', voiceHint: 'Move the torch — why does the shadow change?' }],
  },
  'll.body_parts': {
    B6: [{ id: 'll.bp.b6.do', label: 'Body Parts', fiveE: '① LABEL & LEARN', voiceHint: 'Tap each part — learn its job' }],
  },
  'll.animal_needs_b6': {
    B6: [{ id: 'll.an.b6.do', label: 'Animal Needs', fiveE: '① CARE & REASON', voiceHint: 'Give the puppy what it needs to live' }],
  },
  'll.life_cycle': {
    B6: [{ id: 'll.lc.b6.do', label: 'Life Cycle', fiveE: '① ORDER & REASON', voiceHint: 'Put egg → chick → chicken in order' }],
  },
  'mm.materials': {
    B6: [{ id: 'mm.mat.b6.do', label: 'Materials Lab', fiveE: '① SORT & REASON', voiceHint: 'What is each thing made of?' }],
  },
  'mm.strong_materials': {
    B6: [{ id: 'mm.sm.b6.do', label: 'Bridge Lab', fiveE: '① TEST & REASON', voiceHint: 'Which bridge holds the car?' }],
  },
  'ec.sources_of_light': {
    B6: [{ id: 'ec.sol.b6.do', label: 'Light Sources', fiveE: '① SORT & REASON', voiceHint: 'Sort things that make light' }],
  },
  'ec.movement': {
    B6: [{ id: 'ec.mv.b6.do', label: 'Push Power', fiveE: '① TEST & REASON', voiceHint: 'Push light and heavy things' }],
  },
  'eb.weather_seasons': {
    B6: [{ id: 'eb.ws.b6.do', label: 'Weather Chart', fiveE: '① RECORD & REASON', voiceHint: 'Fill in a week of weather' }],
  },
  'eb.day_night_spin': {
    B6: [{ id: 'eb.dns.b6.do', label: 'Spinning Earth', fiveE: '① EXPLORE & REASON', voiceHint: 'Spin the Earth — why is it night?' }],
  },

  // Age 7 MVP — Predict → Fair Test → Bar Chart → Badge (Foundation Phase Gr 2)
  'mm.absorbent': {
    B7: [{ id: 'mm.abs.b7.do', label: 'Absorb Lab', fiveE: '① FAIR TEST', voiceHint: 'Which cloth holds the most water?' }],
  },
  'ec.magnets': {
    B7: [{ id: 'ec.mag.b7.do', label: 'Magnet Lab', fiveE: '① TEST & RECORD', voiceHint: 'What does a magnet stick to?' }],
  },
  'll.growth': {
    B7: [{ id: 'll.gro.b7.do', label: 'Growth Graph', fiveE: '① MEASURE & PLOT', voiceHint: 'Measure the plant and plot a graph' }],
  },
  'll.animal_homes': {
    B7: [{ id: 'll.ah.b7.do', label: 'Animal Homes', fiveE: '① MATCH & REASON', voiceHint: 'Match each animal to its home' }],
  },
  'll.food_sources': {
    B7: [{ id: 'll.fs.b7.do', label: 'Food Sorter', fiveE: '① CLASSIFY', voiceHint: 'Plant food or animal food?' }],
  },
  'll.senses_safety': {
    B7: [{ id: 'll.ss.b7.do', label: 'Stay Safe!', fiveE: '① CHOOSE & REASON', voiceHint: 'Pick the safe choice each time' }],
  },
  'mm.states_change': {
    B7: [{ id: 'mm.sc.b7.do', label: 'Heat Lab', fiveE: '① HEAT & OBSERVE', voiceHint: 'Heat ice into water, then steam' }],
  },
  'mm.mixtures': {
    B7: [{ id: 'mm.mix.b7.do', label: 'Mixture Lab', fiveE: '① INVESTIGATE', voiceHint: 'Can you separate sand from water?' }],
  },
  'ec.energy_sources': {
    B7: [{ id: 'ec.en.b7.do', label: 'Energy Match', fiveE: '① MATCH & REASON', voiceHint: 'Where does each living thing get energy?' }],
  },
  'ec.wind': {
    B7: [{ id: 'ec.wind.b7.do', label: 'Wind Lab', fiveE: '① FAIR TEST', voiceHint: 'Same wind — what moves, paper or brick?' }],
  },
  'eb.water_sources': {
    B7: [{ id: 'eb.wat.b7.do', label: 'Water Journey', fiveE: '① EXPLORE & TRACE', voiceHint: 'Follow water from rain to your tap' }],
  },
  'eb.soil': {
    B7: [{ id: 'eb.soil.b7.do', label: 'Soil Lab', fiveE: '① FAIR TEST', voiceHint: 'Which soil holds the most water?' }],
  },

  // Age 8 — Plan → Measure → Record → Conclude (Intermediate Phase Gr 3)
  'mm.insulation': {
    B8: [{ id: 'mm.ins.b8.do', label: 'Insulation Lab', fiveE: '① PLAN → MEASURE → CONCLUDE', voiceHint: 'Which cup keeps hot water warmest? Measure & conclude' }],
  },
  'll.food_chains_b8': {
    B8: [{ id: 'll.fc.b8.do', label: 'Food Chain Lab', fiveE: '① BUILD → TEST → CONCLUDE', voiceHint: 'What happens if we remove the sun from a food chain?' }],
  },
  'ec.shadow_size': {
    B8: [{ id: 'ec.shd.b8.do', label: 'Shadow Lab', fiveE: '① MEASURE → CONCLUDE', voiceHint: 'Measure how shadow size changes with distance' }],
  },
  'll.life_cycle_b8': {
    B8: [{ id: 'll.lc.b8.do', label: 'Life Cycle Lab', fiveE: '① ORDER → COUNT → CONCLUDE', voiceHint: 'Order the butterfly stages and add up the days' }],
  },
  'll.healthy_body': {
    B8: [{ id: 'll.hb.b8.do', label: 'Health Diary', fiveE: '① RECORD → GRAPH → CONCLUDE', voiceHint: 'Track 3 days of water and graph it' }],
  },
  'mm.evaporation': {
    B8: [{ id: 'mm.evap.b8.do', label: 'Evaporation Lab', fiveE: '① MEASURE → CONCLUDE', voiceHint: 'Where does the water go when clothes dry?' }],
  },
  'mm.reversible': {
    B8: [{ id: 'mm.rev.b8.do', label: 'Change Detective', fiveE: '① SORT → CONCLUDE', voiceHint: 'Which changes can be undone, and which cannot?' }],
  },
  'ec.forces_b8': {
    B8: [{ id: 'ec.frc.b8.do', label: 'Force Lab', fiveE: '① MEASURE (N) → CONCLUDE', voiceHint: 'Measure the force to lift each object in Newtons' }],
  },
  'ec.sound': {
    B8: [{ id: 'ec.snd.b8.do', label: 'Sound Lab', fiveE: '① TEST → CONCLUDE', voiceHint: 'Tight or loose band — which makes a higher pitch?' }],
  },
  'eb.rocks': {
    B8: [{ id: 'eb.rck.b8.do', label: 'Rock Lab', fiveE: '① TEST → RECORD → CONCLUDE', voiceHint: 'Scratch-test rocks and record their hardness' }],
  },
  'eb.weather_b8': {
    B8: [{ id: 'eb.wx.b8.do', label: 'Weather Chart', fiveE: '① RECORD → PREDICT → CONCLUDE', voiceHint: 'Record a week of temperatures and spot the pattern' }],
  },
  'eb.space_b8': {
    B8: [{ id: 'eb.spc.b8.do', label: 'Day & Night Lab', fiveE: '① MODEL → CONCLUDE', voiceHint: 'Spin the Earth to discover why we have day and night' }],
  },

  // Age 9 — CAPS Gr 4 flagship sims (Band B)
  'll.photosynthesis': {
    B: [{ id: 'll.photo.b.do', label: 'Photosynthesis Lab', fiveE: '① SLIDER → MEASURE → CONCLUDE', voiceHint: 'Change the light and measure how the plant grows' }],
  },
  'ec.circuits': {
    B: [{ id: 'ec.circ.b.do', label: 'Circuit Builder', fiveE: '① BUILD → TEST → CONCLUDE', voiceHint: 'Build a circuit and make the bulb light up' }],
  },
  'mm.water_cycle': {
    B: [{ id: 'mm.wc.b.do', label: 'Water Cycle Lab', fiveE: '① HEAT → MEASURE → CONCLUDE', voiceHint: 'Heat the sea and watch evaporation, clouds and rain' }],
  },
  'll.plant_reproduction': {
    B: [{ id: 'll.pr.b.do', label: 'Pollination Lab', fiveE: '① OBSERVE → COUNT → CONCLUDE', voiceHint: 'Does a flower need a bee to make seeds?' }],
  },
  'll.nutrition': {
    B: [{ id: 'll.nut.b.do', label: 'Food Groups', fiveE: '① SORT → CONCLUDE', voiceHint: 'Sort foods into energy, building and protecting groups' }],
  },
  'mm.particles': {
    B: [{ id: 'mm.par.b.do', label: 'Particle Lab', fiveE: '① HEAT → MEASURE → CONCLUDE', voiceHint: 'Heat the particles and measure how fast they move' }],
  },
  'mm.structures': {
    B: [{ id: 'mm.str.b.do', label: 'Structure Lab', fiveE: '① TEST → RECORD → CONCLUDE', voiceHint: 'Load-test shapes — which holds the most weight?' }],
  },
  'ec.stored_energy': {
    B: [{ id: 'ec.se.b.do', label: 'Stored Energy', fiveE: '① SORT → CONCLUDE', voiceHint: 'Which things store energy we can use later?' }],
  },
  'ec.sound_vibration': {
    B: [{ id: 'ec.snd.b.do', label: 'Drum Lab', fiveE: '① TEST → MEASURE → CONCLUDE', voiceHint: 'Hit the drum harder — does it get louder?' }],
  },
  'eb.solar_system': {
    B: [{ id: 'eb.ss.b.do', label: 'Solar System', fiveE: '① MEASURE → CONCLUDE', voiceHint: 'Time each planet around the sun' }],
  },
  'eb.weathering': {
    B: [{ id: 'eb.wea.b.do', label: 'Weathering Lab', fiveE: '① TEST → MEASURE → CONCLUDE', voiceHint: 'How long until water and wind break a rock?' }],
  },
  'eb.seasons': {
    B: [{ id: 'eb.sea.b.do', label: 'Seasons Lab', fiveE: '① MODEL → RECORD → CONCLUDE', voiceHint: 'Tilt the Earth — why is summer hotter?' }],
  },

  // Age 10 — CAPS Gr 5 (Band C)
  'll.vertebrates': {
    C: [{ id: 'll.vert.c.do', label: 'Backbone Lab', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Sort animals into vertebrates and invertebrates' }],
  },
  'mm.metals': {
    C: [{ id: 'mm.met.c.do', label: 'Metal Tester', fiveE: '① TEST → CLASSIFY → CONCLUDE', voiceHint: 'Test materials — metal or non-metal?' }],
  },
  'ec.mains_electricity': {
    C: [{ id: 'ec.mains.c.do', label: 'Power Journey', fiveE: '① ORDER → CONCLUDE', voiceHint: 'Follow electricity from the power station to your home' }],
  },
  'll.skeletons': {
    C: [{ id: 'll.skel.c.do', label: 'Skeleton Lab', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Bones inside or shell outside?' }],
  },
  'll.food_webs': {
    C: [{ id: 'll.web.c.do', label: 'Food Web Lab', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Sort producers and consumers' }],
  },
  'mm.metal_uses': {
    C: [{ id: 'mm.use.c.do', label: 'Metal Uses', fiveE: '① MATCH → CONCLUDE', voiceHint: 'Match each object to the metal property it needs' }],
  },
  'mm.processing': {
    C: [{ id: 'mm.proc.c.do', label: 'Material Factory', fiveE: '① MATCH → CONCLUDE', voiceHint: 'Turn raw materials into products' }],
  },
  'ec.fuels': {
    C: [{ id: 'ec.fuel.c.do', label: 'Fuel Lab', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Which things store energy we can burn?' }],
  },
  'ec.switches': {
    C: [{ id: 'ec.sw.c.do', label: 'Switch Lab', fiveE: '① TEST → CONCLUDE', voiceHint: 'Use a switch to turn the bulb on and off' }],
  },
  'eb.erosion': {
    C: [{ id: 'eb.ero.c.do', label: 'Erosion Lab', fiveE: '① INVESTIGATE → MEASURE → CONCLUDE', voiceHint: 'Make it rain on bare and planted soil' }],
  },
  'eb.fossils': {
    C: [{ id: 'eb.fos.c.do', label: 'Fossil Dig', fiveE: '① INVESTIGATE → CONCLUDE', voiceHint: 'Find the oldest fossil in the rock layers' }],
  },
  'eb.earth_rotation': {
    C: [{ id: 'eb.rot.c.do', label: 'Day & Night Lab', fiveE: '① MODEL → CONCLUDE', voiceHint: 'Spin the Earth to make day and night' }],
  },

  // Age 11 — CAPS Gr 6 (Band C11)
  'll.photosynthesis_io': {
    C11: [{ id: 'll.psio.c11.do', label: 'Leaf Factory', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Sort what goes into a leaf and what comes out' }],
  },
  'mm.mixtures_separate': {
    C11: [{ id: 'mm.sep.c11.do', label: 'Separation Lab', fiveE: '① MATCH → CONCLUDE', voiceHint: 'Pick the right way to separate each mixture' }],
  },
  'ec.series_circuit': {
    C11: [{ id: 'ec.ser.c11.do', label: 'Brightness Lab', fiveE: '① INVESTIGATE → MEASURE → CONCLUDE', voiceHint: 'Add cells and measure the bulb brightness' }],
  },
  'll.nutrients': {
    C11: [{ id: 'll.nut.c11.do', label: 'Nutrient Sort', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Sort foods by carbohydrate, protein or vitamins' }],
  },
  'll.food_preservation': {
    C11: [{ id: 'll.pres.c11.do', label: 'Food Keeper', fiveE: '① MATCH → CONCLUDE', voiceHint: 'Choose how to preserve each food' }],
  },
  'mm.changes_of_state': {
    C11: [{ id: 'mm.cos.c11.do', label: 'State Lab', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Sort changes by heating or cooling' }],
  },
  'mm.dissolving': {
    C11: [{ id: 'mm.dis.c11.do', label: 'Dissolving Lab', fiveE: '① INVESTIGATE → MEASURE → CONCLUDE', voiceHint: 'Change the water temperature and time the dissolving' }],
  },
  'ec.conductors': {
    C11: [{ id: 'ec.con.c11.do', label: 'Conductor Lab', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Test which materials let the current through' }],
  },
  'ec.levers': {
    C11: [{ id: 'ec.lev.c11.do', label: 'Lever Lab', fiveE: '① INVESTIGATE → CONCLUDE', voiceHint: 'Move the effort to lift a heavy load' }],
  },
  'eb.solar_order': {
    C11: [{ id: 'eb.sol.c11.do', label: 'Planet Order', fiveE: '① ORDER → CONCLUDE', voiceHint: 'Line up the planets from the sun' }],
  },
  'eb.rotation_revolution': {
    C11: [{ id: 'eb.rr.c11.do', label: 'Spin or Orbit', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Sort events by Earth spinning or orbiting' }],
  },
  'eb.moon_phases': {
    C11: [{ id: 'eb.moon.c11.do', label: 'Moon Phases', fiveE: '① ORDER → CONCLUDE', voiceHint: 'Put the moon phases in order, new to full' }],
  },

  // Age 12 — CAPS Gr 7 (Band C12)
  'll.biosphere': {
    C12: [{ id: 'll.bio.c12.do', label: 'Biosphere Lab', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Sort life by land, water or air' }],
  },
  'mm.acids_bases': {
    C12: [{ id: 'mm.acid.c12.do', label: 'Acid–Base Lab', fiveE: '① TEST → CLASSIFY → CONCLUDE', voiceHint: 'Test substances for acid, neutral or base' }],
  },
  'ec.heat_transfer': {
    C12: [{ id: 'ec.heat.c12.do', label: 'Heat Lab', fiveE: '① CLASSIFY → CONCLUDE', voiceHint: 'Sort how heat moves: conduction, convection, radiation' }],
  },

  // Age 5 MVP — single 4-phase activity per topic (See → Predict → Do → Card)
  'll.five_senses': {
    A5: [{ id: 'll.5s.a5.engage', label: '5 Senses!',  fiveE: '① EXPLORE', voiceHint: 'Predict & tap — eyes, ears, nose, mouth, hands' }],
  },
  'mm.wet_dry': {
    A5: [{ id: 'mm.wd.a5.engage', label: 'Wet or Dry?', fiveE: '① EXPLORE', voiceHint: 'Predict what water does, then test it!' }],
  },
  'eb.day_night': {
    A5: [{ id: 'eb.dn.a5.engage', label: 'Day & Night', fiveE: '① EXPLORE', voiceHint: 'Move the sun — watch day turn to night' }],
  },
  'll.plant_needs': {
    A5: [{ id: 'll.pn.a5.engage', label: 'Plant Needs', fiveE: '① EXPLORE', voiceHint: 'Give the seed sun and water — watch it grow!' }],
  },
  'll.animal_groups': {
    A5: [{ id: 'll.ag.a5.engage', label: 'Animal Groups', fiveE: '① EXPLORE', voiceHint: 'How do animals move — fly, swim, or walk?' }],
  },
  'mm.hot_cold': {
    A5: [{ id: 'mm.hc.a5.engage', label: 'Hot or Cold?', fiveE: '① EXPLORE', voiceHint: 'Which things are hot? Which are cold?' }],
  },
  'mm.building_things': {
    A5: [{ id: 'mm.bt.a5.engage', label: 'Building Things', fiveE: '① EXPLORE', voiceHint: 'Which roof keeps the rain out?' }],
  },
  'ec.light_sources': {
    A5: [{ id: 'ec.lts.a5.engage', label: 'Light Sources', fiveE: '① EXPLORE', voiceHint: 'Tap lights to brighten the dark room' }],
  },
  'ec.push_pull': {
    A5: [{ id: 'ec.pp.a5.engage', label: 'Push & Pull', fiveE: '① EXPLORE', voiceHint: 'Push things away, pull things closer' }],
  },
  'eb.water_everywhere': {
    A5: [{ id: 'eb.we.a5.engage', label: 'Water Everywhere', fiveE: '① EXPLORE', voiceHint: 'Find water in rain, rivers, and taps' }],
  },

  // Ages 3–4 — same activities for both A3 and A4
  'll.my_body': {
    A3: [{ id: 'll.mb.a.engage', label: 'My Body!',   fiveE: '① EXPLORE', voiceHint: 'Tap 6 body parts — head, eyes, mouth, hands, tummy, feet' }],
    A4: [{ id: 'll.mb.a.engage', label: 'My Body!',   fiveE: '① EXPLORE', voiceHint: 'Tap 6 body parts — head, eyes, mouth, hands, tummy, feet' }],
  },
  'mm.hard_soft': {
    A3: [{ id: 'mm.hs.a.engage', label: 'Hard or Soft?', fiveE: '① EXPLORE', voiceHint: 'Sort 4 things into hard and soft boxes' }],
    A4: [{ id: 'mm.hs.a.engage', label: 'Hard or Soft?', fiveE: '① EXPLORE', voiceHint: 'Sort 4 things into hard and soft boxes' }],
  },
  'eb.weather': {
    A3: [{ id: 'eb.wx.a.engage', label: 'Weather!',    fiveE: '① EXPLORE', voiceHint: 'Explore sunny, cloudy, and rainy weather' }],
    A4: [{ id: 'eb.wx.a.engage', label: 'Weather!',    fiveE: '① EXPLORE', voiceHint: 'Explore sunny, cloudy, and rainy weather' }],
  },

  'll.parts_of_plant': {
    A5: [{ id: 'll.pop.a.engage',   label: 'Find a plant!',    fiveE: '① EXPLORE', voiceHint: 'Caregiver-led: name each part on a real plant' }],
    B: [
      { id: 'll.pop.b.explore',  label: 'Discover parts',   fiveE: '① EXPLORE', voiceHint: 'Tap each part to find out what it does' },
      { id: 'll.pop.b.explain',  label: 'What each does',   fiveE: '② EXPLAIN', voiceHint: 'Roots, leaves, flowers — their jobs' },
      { id: 'll.pop.b.evaluate', label: 'Plant Quiz!',       fiveE: '③ TEST',    voiceHint: 'Which part drinks water? Which makes seeds?' },
    ],
  },

  'll.food_chains': {
    A5: [{ id: 'll.fc.a.engage',   label: 'Who eats who?',   fiveE: '① EXPLORE', voiceHint: 'Caregiver-led food chain story' }],
    B: [
      { id: 'll.fc.b.explore',  label: 'Build the chain',  fiveE: '① EXPLORE', voiceHint: 'Arrange the chain in order — who eats who?' },
      { id: 'll.fc.b.explain',  label: 'How chains work',  fiveE: '② EXPLAIN', voiceHint: 'Producers, herbivores, carnivores' },
      { id: 'll.fc.b.evaluate', label: 'Chain Challenge',   fiveE: '③ TEST',    voiceHint: 'What if the grass disappeared?' },
    ],
  },

  'ec.light_shadows': {
    A5: [{ id: 'ec.ls.a.engage',   label: 'Make shadows!',   fiveE: '① EXPLORE', voiceHint: 'Caregiver-led outdoor shadow play' }],
    B: [
      { id: 'ec.ls.b.explore',  label: 'Watch shadows',    fiveE: '① EXPLORE', voiceHint: 'See how shadow changes with torch position' },
      { id: 'ec.ls.b.explain',  label: 'Why shadows form', fiveE: '② EXPLAIN', voiceHint: 'Light travels straight — objects block it' },
      { id: 'ec.ls.b.evaluate', label: 'Shadow Quiz!',      fiveE: '③ TEST',    voiceHint: 'Predict shadow direction and size' },
    ],
  },

  'mm.solids_liquids_gases': {
    A5: [
      { id: 'mm.slg.a.engage',   label: 'Hard or Liquid?',  fiveE: '① EXPLORE', voiceHint: 'A caregiver-led hands-on hunt' },
    ],
    B: [
      { id: 'mm.slg.b.explore',  label: 'Sort it!',         fiveE: '① EXPLORE', voiceHint: 'Sort objects into Solid, Liquid, Gas' },
      { id: 'mm.slg.b.explain',  label: 'Why different?',   fiveE: '② EXPLAIN', voiceHint: 'Discover particle theory' },
      { id: 'mm.slg.b.evaluate', label: 'Tricky States!',   fiveE: '③ TEST',    voiceHint: 'Is steam a gas? Is sand a solid?' },
    ],
  },

  'll.non_living': {
    A5: [
      { id: 'll.non_living.a.engage', label: 'Alive or Not?', fiveE: '① EXPLORE', voiceHint: 'A caregiver-led outdoor explore' },
    ],
    B: [
      { id: 'll.b.explore',   label: 'Sort it out!',    fiveE: '① EXPLORE', voiceHint: 'Sort things into Living and Not Living' },
      { id: 'll.b.explain',   label: 'What is ALIVE?',  fiveE: '② EXPLAIN', voiceHint: 'Discover what makes something alive' },
      { id: 'll.b.evaluate',  label: 'Tricky Things!',  fiveE: '③ TEST',    voiceHint: 'Is fire alive? Is a robot?' },
    ],
  },
};

/**
 * ACTIVITY_REGISTRY maps activity ID → React component.
 * When adding a new topic, register its components here.
 */
const ACTIVITY_REGISTRY: Record<
  string,
  React.ComponentType<{ onComplete: () => void; onExit: () => void }>
> = {
  'fs.a.engage':        FloatSinkBandA,
  'fs.b.explore':       FloatSinkExplore,
  'fs.b.explain':       FloatSinkExplain,
  'fs.b.evaluate':      FloatSinkEvaluate,
  'fs.c.investigate':   FloatSinkBandC,
  'll.mb.a.engage':          MyBodyActivity,
  'mm.hs.a.engage':          HardSoftActivity,
  'eb.wx.a.engage':          WeatherActivity,
  'mm.abs.b7.do':            AbsorbentMaterialsActivity,
  'ec.mag.b7.do':            MagnetsActivity,
  'll.gro.b7.do':            GrowthActivity,
  'll.ah.b7.do':             AnimalHomesActivity,
  'll.fs.b7.do':             FoodSourcesActivity,
  'll.ss.b7.do':             SensesSafetyActivity,
  'mm.sc.b7.do':             StatesChangeActivity,
  'mm.mix.b7.do':            MixturesActivity,
  'ec.en.b7.do':             EnergySourcesActivity,
  'ec.wind.b7.do':           WindActivity,
  'eb.wat.b7.do':            WaterSourcesActivity,
  'eb.soil.b7.do':           SoilTypesActivity,
  'mm.ins.b8.do':            InsulationActivity,
  'll.fc.b8.do':             FoodChainsInvestigateActivity,
  'ec.shd.b8.do':            ShadowSizeActivity,
  'll.lc.b8.do':             LifeCycleCompleteActivity,
  'll.hb.b8.do':             HealthyBodyActivity,
  'mm.evap.b8.do':           EvaporationActivity,
  'mm.rev.b8.do':            ReversibleChangeActivity,
  'ec.frc.b8.do':            ForcesActivity,
  'ec.snd.b8.do':            SoundActivity,
  'eb.rck.b8.do':            RocksActivity,
  'eb.wx.b8.do':             WeatherPatternsActivity,
  'eb.spc.b8.do':            SpaceActivity,
  'll.photo.b.do':           PhotosynthesisActivity,
  'ec.circ.b.do':            CircuitBuilderActivity,
  'mm.wc.b.do':              WaterCycleActivity,
  'll.pr.b.do':              PlantReproductionActivity,
  'll.nut.b.do':             NutritionActivity,
  'mm.par.b.do':             ParticlesActivity,
  'mm.str.b.do':             StructuresActivity,
  'ec.se.b.do':              StoredEnergyActivity,
  'ec.snd.b.do':             SoundVibrationActivity,
  'eb.ss.b.do':              SolarSystemActivity,
  'eb.wea.b.do':             WeatheringActivity,
  'eb.sea.b.do':             SeasonsActivity,
  'll.vert.c.do':            VertebratesActivity,
  'mm.met.c.do':             MetalsActivity,
  'ec.mains.c.do':           PowerStationActivity,
  'll.skel.c.do':            SkeletonsActivity,
  'll.web.c.do':             FoodWebActivity,
  'mm.use.c.do':             MetalUsesActivity,
  'mm.proc.c.do':            ProcessingActivity,
  'ec.fuel.c.do':            FuelsActivity,
  'ec.sw.c.do':              SwitchCircuitActivity,
  'eb.ero.c.do':             ErosionActivity,
  'eb.fos.c.do':             FossilsActivity,
  'eb.rot.c.do':             RotationActivity,
  'll.psio.c11.do':          PhotosynthesisIOActivity,
  'mm.sep.c11.do':           MixturesSeparateActivity,
  'ec.ser.c11.do':           SeriesCircuitActivity,
  'll.nut.c11.do':           NutrientsActivity,
  'll.pres.c11.do':          FoodPreservationActivity,
  'mm.cos.c11.do':           ChangesOfStateActivity,
  'mm.dis.c11.do':           DissolvingActivity,
  'ec.con.c11.do':           ConductorsActivity,
  'ec.lev.c11.do':           LeversActivity,
  'eb.sol.c11.do':           SolarSystemOrderActivity,
  'eb.rr.c11.do':            RotationRevolutionActivity,
  'eb.moon.c11.do':          MoonPhasesActivity,
  'll.bio.c12.do':           BiosphereActivity,
  'mm.acid.c12.do':          AcidsBasesActivity,
  'ec.heat.c12.do':          HeatTransferActivity,
  'mm.fsr.b6.do':            FloatSinkRecordActivity,
  'll.ppr.b6.do':            PlantPartsRecordActivity,
  'ec.shr.b6.do':            ShadowsRecordActivity,
  'll.bp.b6.do':             BodyPartsRecordActivity,
  'll.an.b6.do':             AnimalNeedsRecordActivity,
  'll.lc.b6.do':             LifeCycleRecordActivity,
  'mm.mat.b6.do':            MaterialsRecordActivity,
  'mm.sm.b6.do':             StrongMaterialsRecordActivity,
  'ec.sol.b6.do':            LightSortRecordActivity,
  'ec.mv.b6.do':             MovementRecordActivity,
  'eb.ws.b6.do':             WeatherChartRecordActivity,
  'eb.dns.b6.do':            EarthSpinRecordActivity,
  'll.5s.a5.engage':         FiveSensesActivity,
  'mm.wd.a5.engage':         WetDryActivity,
  'eb.dn.a5.engage':         DayNightActivity,
  'll.pn.a5.engage':         PlantNeedsActivity,
  'll.ag.a5.engage':         AnimalGroupsActivity,
  'mm.hc.a5.engage':         HotColdActivity,
  'mm.bt.a5.engage':         BuildingThingsActivity,
  'ec.lts.a5.engage':        LightSourcesActivity,
  'ec.pp.a5.engage':         PushPullActivity,
  'eb.we.a5.engage':         WaterEverywhereActivity,
  'll.pop.a.engage':         PartsOfPlantBandA,
  'll.pop.b.explore':        PartsOfPlantExplore,
  'll.pop.b.explain':        PartsOfPlantExplain,
  'll.pop.b.evaluate':       PartsOfPlantEvaluate,
  'll.fc.a.engage':          FoodChainsBandA,
  'll.fc.b.explore':         FoodChainsExplore,
  'll.fc.b.explain':         FoodChainsExplain,
  'll.fc.b.evaluate':        FoodChainsEvaluate,
  'ec.ls.a.engage':          LightShadowsBandA,
  'ec.ls.b.explore':         LightShadowsExplore,
  'ec.ls.b.explain':         LightShadowsExplain,
  'ec.ls.b.evaluate':        LightShadowsEvaluate,
  'mm.slg.a.engage':         SolidsLiquidsGasesBandA,
  'mm.slg.b.explore':        SolidsLiquidsGasesExplore,
  'mm.slg.b.explain':        SolidsLiquidsGasesExplain,
  'mm.slg.b.evaluate':       SolidsLiquidsGasesEvaluate,
  'll.non_living.a.engage':  LivingNonLivingBandA,
  'll.b.explore':            LivingNonLivingExplore,
  'll.b.explain':            LivingNonLivingExplain,
  'll.b.evaluate':           LivingNonLivingEvaluate,
};

// ── Strand icon map ───────────────────────────────────────────────────────────

const STRAND_ICON: Record<string, React.ReactNode> = {
  life_and_living:      <Leaf size={20} />,
  matter_and_materials: <FlaskConical size={20} />,
  energy_and_change:    <Zap size={20} />,
  earth_and_beyond:     <Globe size={20} />,
};

// ── Band UI lookup — replaces all ternary chains ──────────────────────────────
// One place to update colours when a new band is added.

const BAND_UI: Record<Band, {
  emoji: string;
  bannerBg: string;       // topic-list band banner background + border
  iconBg: string;         // avatar circle inside banner
  labelText: string;      // band name colour
  subtitleText: string;   // age range + description colour
  pillBg: string;         // "Select Age Group" pill
  nextBorder: string;     // activity card border when it's the NEXT step
  nextAccent: string;     // activity card icon bg + GO badge when NEXT
  doneBg: string;         // full class string for a DONE activity card
  goBadge: string;        // GO → badge bg
}> = {
  A3: {
    emoji: '👶',
    bannerBg:    'bg-rose-50 border-rose-200',
    iconBg:      'bg-rose-200',
    labelText:   'text-rose-700',
    subtitleText:'text-rose-500',
    pillBg:      'bg-rose-100 border-rose-300 text-rose-700',
    nextBorder:  'border-rose-300',
    nextAccent:  'bg-rose-400 shadow-[0_4px_0_#FB7185]',
    doneBg:      'bg-rose-50 border-rose-200 text-rose-700',
    goBadge:     'bg-rose-400',
  },
  A4: {
    emoji: '🌼',
    bannerBg:    'bg-orange-50 border-orange-200',
    iconBg:      'bg-orange-200',
    labelText:   'text-orange-700',
    subtitleText:'text-orange-500',
    pillBg:      'bg-orange-100 border-orange-300 text-orange-700',
    nextBorder:  'border-orange-300',
    nextAccent:  'bg-orange-400 shadow-[0_4px_0_#FB923C]',
    doneBg:      'bg-orange-50 border-orange-200 text-orange-700',
    goBadge:     'bg-orange-400',
  },
  A5: {
    emoji: '🌟',
    bannerBg:    'bg-sky-50 border-sky-200',
    iconBg:      'bg-sky-200',
    labelText:   'text-sky-700',
    subtitleText:'text-sky-500',
    pillBg:      'bg-sky-100 border-sky-300 text-sky-700',
    nextBorder:  'border-sky-300',
    nextAccent:  'bg-sky-400 shadow-[0_4px_0_#0EA5E9]',
    doneBg:      'bg-sky-50 border-sky-200 text-sky-700',
    goBadge:     'bg-sky-400',
  },
  B6: {
    emoji: '🔬',
    bannerBg:    'bg-lime-50 border-lime-200',
    iconBg:      'bg-lime-200',
    labelText:   'text-lime-700',
    subtitleText:'text-lime-600',
    pillBg:      'bg-lime-100 border-lime-300 text-lime-700',
    nextBorder:  'border-lime-300',
    nextAccent:  'bg-lime-500 shadow-[0_4px_0_#65A30D]',
    doneBg:      'bg-lime-50 border-lime-200 text-lime-700',
    goBadge:     'bg-lime-500',
  },
  B7: {
    emoji: '🧪',
    bannerBg:    'bg-emerald-50 border-emerald-200',
    iconBg:      'bg-emerald-200',
    labelText:   'text-emerald-700',
    subtitleText:'text-emerald-600',
    pillBg:      'bg-emerald-100 border-emerald-300 text-emerald-700',
    nextBorder:  'border-emerald-300',
    nextAccent:  'bg-emerald-500 shadow-[0_4px_0_#059669]',
    doneBg:      'bg-emerald-50 border-emerald-200 text-emerald-700',
    goBadge:     'bg-emerald-500',
  },
  B8: {
    emoji: '📏',
    bannerBg:    'bg-teal-50 border-teal-200',
    iconBg:      'bg-teal-200',
    labelText:   'text-teal-700',
    subtitleText:'text-teal-600',
    pillBg:      'bg-teal-100 border-teal-300 text-teal-700',
    nextBorder:  'border-teal-300',
    nextAccent:  'bg-teal-500 shadow-[0_4px_0_#0D9488]',
    doneBg:      'bg-teal-50 border-teal-200 text-teal-700',
    goBadge:     'bg-teal-500',
  },
  B: {
    emoji: '🧒',
    bannerBg:    'bg-green-50 border-green-200',
    iconBg:      'bg-green-200',
    labelText:   'text-green-700',
    subtitleText:'text-green-500',
    pillBg:      'bg-green-100 border-green-300 text-green-700',
    nextBorder:  'border-green-300',
    nextAccent:  'bg-green-500 shadow-[0_4px_0_#16A34A]',
    doneBg:      'bg-green-50 border-green-200 text-green-700',
    goBadge:     'bg-green-500',
  },
  C: {
    emoji: '👦',
    bannerBg:    'bg-indigo-50 border-indigo-200',
    iconBg:      'bg-indigo-200',
    labelText:   'text-indigo-700',
    subtitleText:'text-indigo-500',
    pillBg:      'bg-indigo-100 border-indigo-300 text-indigo-700',
    nextBorder:  'border-indigo-300',
    nextAccent:  'bg-indigo-500 shadow-[0_4px_0_#4338CA]',
    doneBg:      'bg-indigo-50 border-indigo-200 text-indigo-700',
    goBadge:     'bg-indigo-500',
  },
  C11: {
    emoji: '🧑‍🔬',
    bannerBg:    'bg-purple-50 border-purple-200',
    iconBg:      'bg-purple-200',
    labelText:   'text-purple-700',
    subtitleText:'text-purple-500',
    pillBg:      'bg-purple-100 border-purple-300 text-purple-700',
    nextBorder:  'border-purple-300',
    nextAccent:  'bg-purple-500 shadow-[0_4px_0_#7E22CE]',
    doneBg:      'bg-purple-50 border-purple-200 text-purple-700',
    goBadge:     'bg-purple-500',
  },
  C12: {
    emoji: '🔭',
    bannerBg:    'bg-fuchsia-50 border-fuchsia-200',
    iconBg:      'bg-fuchsia-200',
    labelText:   'text-fuchsia-700',
    subtitleText:'text-fuchsia-500',
    pillBg:      'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700',
    nextBorder:  'border-fuchsia-300',
    nextAccent:  'bg-fuchsia-500 shadow-[0_4px_0_#A21CAF]',
    doneBg:      'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
    goBadge:     'bg-fuchsia-500',
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Screen = 'bandSelect' | 'home' | 'activity';

const BAND_CHOSEN_KEY = 'bandExplicitlyChosen';

// ── Suspense fallback while a lazy activity loads ──────────────────────────────
// Shown only for the brief moment a code-split activity is fetched (instant
// once installed offline). Matches the app's sprout splash so it never jars.

function ActivityLoading() {
  return (
    <div className="fixed inset-0 bg-brand-cream z-40 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="text-5xl"
      >
        🌱
      </motion.div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading]               = useState(true);
  const [profile, setProfile]               = useState<LearnerProfile | null>(null);
  const [screen, setScreen]                 = useState<Screen>('home');
  const [activeAct, setActiveAct]           = useState<string | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [showDashboard, setShowDashboard]   = useState(false);

  // Load profile from IndexedDB
  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      const chosen = localStorage.getItem(BAND_CHOSEN_KEY);
      setScreen(chosen ? 'home' : 'bandSelect');
      setLoading(false);
    });
  }, [showDashboard]);

  // ── Band selection ──────────────────────────────────────────────────────────

  async function handleBandSelect(band: Band) {
    if (!profile) return;
    const updated = { ...profile, selectedBand: band };
    await saveProfile(updated);
    setProfile(updated);
    localStorage.setItem(BAND_CHOSEN_KEY, '1');
    setSelectedObjective(null);  // return to topic list for new band
    setScreen('home');
  }

  // ── Activity lifecycle ──────────────────────────────────────────────────────

  async function handleComplete(activityId: string) {
    if (!profile || !selectedObjective) return;
    const updated = await awardStar(selectedObjective, activityId);
    setProfile(updated);
    setScreen('home');
    setActiveAct(null);
    // Keep selectedObjective so user returns to their topic's activity list
  }

  function handleExit() {
    setScreen('home');
    setActiveAct(null);
    // Keep selectedObjective — return to topic detail
  }

  // ── Loading splash ──────────────────────────────────────────────────────────

  if (loading || !profile) {
    return (
      <div className="fixed inset-0 bg-brand-cream flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          🌱
        </motion.div>
      </div>
    );
  }

  // ── Band selection screen ───────────────────────────────────────────────────

  if (screen === 'bandSelect') {
    const alreadyChosen = !!localStorage.getItem(BAND_CHOSEN_KEY);
    return (
      <BandSelector
        currentBand={profile.selectedBand}
        onSelect={handleBandSelect}
        onBack={alreadyChosen ? () => setScreen('home') : undefined}
      />
    );
  }

  // ── Activity screen — registry-driven routing ───────────────────────────────

  if (screen === 'activity' && activeAct && selectedObjective) {
    const Component = ACTIVITY_REGISTRY[activeAct];
    if (Component) {
      return (
        <Suspense fallback={<ActivityLoading />}>
          <Component
            onComplete={() => handleComplete(activeAct)}
            onExit={handleExit}
          />
        </Suspense>
      );
    }
  }

  // ── Home screen helpers ─────────────────────────────────────────────────────

  const band      = profile.selectedBand;
  const bandMeta  = BAND_META[band];

  // Topics available for the current band (have at least one activity)
  const availableObjectives = OBJECTIVES.filter(obj => {
    const acts = ALL_BAND_ACTIVITIES[obj.id]?.[band];
    return acts && acts.length > 0;
  });

  // ── Topic detail view (an objective is selected) ────────────────────────────

  if (selectedObjective) {
    const objective = OBJECTIVES.find(o => o.id === selectedObjective);
    if (!objective) { setSelectedObjective(null); return null; }

    const mastery   = profile.masteryByObjective[selectedObjective];
    const completed = mastery?.completedActivityIds ?? [];
    const bandActs  = ALL_BAND_ACTIVITIES[selectedObjective]?.[band] ?? [];

    // Band accent colours — from lookup table
    const ui         = BAND_UI[band];
    const nextBg     = ui.nextAccent;
    const nextBorder = ui.nextBorder;
    const doneBg     = ui.doneBg;
    const goBadge    = ui.goBadge;

    return (
      <div className="relative min-h-screen max-w-lg mx-auto bg-brand-cream pb-20 shadow-xl overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="topic-detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="p-6 min-h-screen flex flex-col"
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <header className="flex items-center justify-between mb-5 pb-4 dashed-divider">
              <button
                onClick={() => setSelectedObjective(null)}
                className="flex items-center gap-1 text-sm font-black text-gray-500
                           hover:text-gray-800 transition-colors"
                aria-label="Back to topics"
              >
                <ChevronLeft size={18} />
                Topics
              </button>

              <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center
                              gap-1 border-2 border-gray-100">
                <Star size={15} fill="currentColor" className="text-yellow-400" />
                <span className="font-black text-gray-700 text-sm">{profile.totalStars}</span>
              </div>
            </header>

            {/* ── Topic header card ───────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm mb-4">
              <div className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-3',
                STRAND_META[objective.strand].color
              )}>
                {STRAND_ICON[objective.strand]}
                {STRAND_META[objective.strand].label}
              </div>
              <h2 className="font-display font-black text-2xl text-gray-800 leading-tight mb-1">
                {objective.topic}
              </h2>
              <p className="text-xs text-gray-400 italic">"{objective.anchoringPhenomenon}"</p>
            </div>

            {/* ── Activity sequence ───────────────────────────────────────── */}
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Your learning journey
            </p>

            {bandActs.length === 0 ? (
              <div className="text-center p-8 text-gray-400 text-sm font-bold">
                No activities yet for this age group. Coming soon! 🌱
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {bandActs.map((act, i) => {
                  const isDone   = completed.includes(act.id);
                  const prevDone = i === 0 || completed.includes(bandActs[i - 1].id);
                  const isLocked = !profile.settings.overrideSequence && !prevDone && !isDone;
                  const isNext   = !isDone && prevDone && !isLocked;

                  return (
                    <motion.button
                      key={act.id}
                      whileTap={!isLocked ? { scale: 0.97 } : {}}
                      disabled={isLocked}
                      onClick={() => {
                        if (!isLocked) {
                          setActiveAct(act.id);
                          setScreen('activity');
                        }
                      }}
                      className={cn(
                        'w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-4',
                        isDone    ? doneBg
                        : isNext  ? `bg-white ${nextBorder} shadow-md text-gray-800`
                        : isLocked ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                        :            'bg-white border-gray-200 text-gray-700'
                      )}
                    >
                      {/* Step icon */}
                      <div className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0',
                        isDone   ? 'bg-white/60'
                        : isNext ? `${nextBg} text-white`
                        :          'bg-gray-200'
                      )}>
                        {isDone ? '✅' : isLocked ? <Lock size={18} /> : STRAND_ICON[objective.strand]}
                      </div>

                      {/* Labels */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                          {act.fiveE}
                        </p>
                        <p className="font-display font-black text-lg leading-tight">
                          {act.label}
                        </p>
                        <p className="text-xs opacity-60 truncate">{act.voiceHint}</p>
                      </div>

                      {/* Status badge */}
                      {isDone   && <span className="text-[10px] font-black bg-white/60 px-2 py-0.5 rounded-full flex-shrink-0">DONE ✓</span>}
                      {isNext   && <span className={cn('text-[10px] font-black text-white px-2 py-0.5 rounded-full animate-pulse flex-shrink-0', goBadge)}>GO →</span>}
                      {isLocked && <span className="text-[10px] font-black text-gray-400 flex-shrink-0">LOCKED</span>}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* CAPS reference */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-[9px] text-gray-300 text-center font-medium tracking-wide">
                {objective.capsRef} · South African CAPS curriculum
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dashboard overlay */}
        <AnimatePresence>
          {showDashboard && (
            <Dashboard
              profile={profile}
              onUpdate={setProfile}
              onClose={() => setShowDashboard(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Topic list view (home) ──────────────────────────────────────────────────

  const homeUi = BAND_UI[band];

  return (
    <div className="relative min-h-screen max-w-lg mx-auto bg-brand-cream pb-20 shadow-xl overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="p-6 min-h-screen flex flex-col"
        >
          {/* ── Header ──────────────────────────────────────────────────── */}
          <header className="flex items-center justify-between mb-4 pb-4 dashed-divider">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center
                              text-2xl shadow-[0_4px_0_#16A34A]">
                🌿
              </div>
              <div>
                <h1 className="font-display font-black text-xl text-gray-800 leading-tight">
                  Science Sprouts
                </h1>
                <p className="text-xs font-bold text-gray-400 tracking-wide">Ages 3 – 12</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center
                              gap-1 border-2 border-gray-100">
                <Star size={15} fill="currentColor" className="text-yellow-400" />
                <span className="font-black text-gray-700 text-sm">{profile.totalStars}</span>
              </div>
              <button
                onClick={() => setShowDashboard(true)}
                className="p-2.5 bg-gray-100 rounded-xl text-gray-500 hover:text-green-600
                           transition-colors"
                aria-label="Parent settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </header>

          {/* ── Band banner ─────────────────────────────────────────────── */}
          <button
            onClick={() => setScreen('bandSelect')}
            className={cn('w-full flex items-center gap-4 p-4 rounded-2xl mb-5 text-left border-2 transition-all hover:brightness-95', homeUi.bannerBg)}
            aria-label="Change age band"
          >
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0', homeUi.iconBg)}>
              {homeUi.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <p className={cn('font-display font-black text-lg leading-tight', homeUi.labelText)}>
                {bandMeta.label}
              </p>
              <p className={cn('text-sm font-bold', homeUi.subtitleText)}>
                {bandMeta.ageRange} · {bandMeta.description}
              </p>
            </div>

            <div className={cn('flex-shrink-0 px-3 py-2 rounded-xl border-2 text-center', homeUi.pillBg)}>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">Select</p>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Age</p>
            </div>
          </button>

          {/* ── Garden ──────────────────────────────────────────────────── */}
          <Garden flowers={profile.gardenFlowers} />

          {/* ── Topic list ──────────────────────────────────────────────── */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-5 mb-3">
            🌿 Choose a Topic
          </p>

          <div className="space-y-3 flex-1">
            {availableObjectives.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-5xl mb-4">🌱</span>
                <p className="font-display font-black text-gray-500 text-lg">Coming soon!</p>
                <p className="text-sm text-gray-400 mt-2 max-w-xs">
                  We are growing brand-new activities for {bandMeta.ageRange}. Check back soon!
                </p>
                <button
                  onClick={() => setScreen('bandSelect')}
                  className="mt-6 px-6 py-3 bg-green-500 shadow-[0_4px_0_#16A34A] text-white font-display font-black rounded-2xl text-sm btn-press"
                >
                  Choose a different age
                </button>
              </div>
            )}
            {availableObjectives.map(obj => {
              const mastery    = profile.masteryByObjective[obj.id];
              const completed  = mastery?.completedActivityIds ?? [];
              const bandActs   = ALL_BAND_ACTIVITIES[obj.id]?.[band] ?? [];
              const doneCount  = bandActs.filter(a => completed.includes(a.id)).length;
              const allDone    = bandActs.length > 0 && doneCount === bandActs.length;
              const inProgress = doneCount > 0 && !allDone;

              return (
                <motion.button
                  key={obj.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedObjective(obj.id)}
                  className="w-full p-4 rounded-2xl border-2 bg-white border-gray-100
                             shadow-sm text-left flex items-center gap-4
                             active:scale-95 transition-transform hover:shadow-md"
                >
                  {/* Strand icon pill */}
                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
                    STRAND_META[obj.strand].color
                  )}>
                    {STRAND_ICON[obj.strand]}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                      {STRAND_META[obj.strand].label}
                    </p>
                    <p className="font-display font-black text-base text-gray-800 leading-tight">
                      {obj.topic}
                    </p>
                    <p className="text-xs text-gray-400 italic truncate mt-0.5">
                      "{obj.anchoringPhenomenon}"
                    </p>
                  </div>

                  {/* Progress badge */}
                  <div className="flex-shrink-0">
                    {allDone ? (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50
                                       border border-emerald-200 px-2 py-1 rounded-full">
                        ✓ DONE
                      </span>
                    ) : inProgress ? (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50
                                       border border-amber-200 px-2 py-1 rounded-full">
                        {doneCount}/{bandActs.length} ✦
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50
                                       border border-indigo-200 px-2 py-1 rounded-full">
                        START →
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[9px] text-gray-300 text-center font-medium tracking-wide">
              South African CAPS curriculum · Ages 3–12 · Offline &amp; free
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dashboard overlay */}
      <AnimatePresence>
        {showDashboard && (
          <Dashboard
            profile={profile}
            onUpdate={setProfile}
            onClose={() => setShowDashboard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

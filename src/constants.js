/**
 * NARRATIVE FRONT - Game Constants
 * All game configuration, costs, and enums
 */

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

export const GAME_CONFIG = {
  STARTING_MANPOWER: 4,
  MANPOWER_PER_TURN: 2,
  TOTAL_ROUNDS: 6,
  
  // Meter bounds
  METER_MIN: -5,
  METER_MAX: 5,
  
  // Victory/defeat thresholds
  VICTORY_THRESHOLD: 3,
  DEFEAT_THRESHOLD: -3,
  
  // Save/load
  SAVE_KEY: 'narrative-front-save',
  SETTINGS_KEY: 'narrative-front-settings'
};

// ============================================================================
// RESPONSE TYPES & COSTS
// ============================================================================

export const RESPONSE_TYPES = {
  IGNORE: 'IGNORE',
  FACT_CHECK: 'FACT_CHECK',
  PRE_BUNK: 'PRE_BUNK',
  COUNTER_NARRATIVE: 'COUNTER_NARRATIVE',
  DISCREDIT_SOURCE: 'DISCREDIT_SOURCE'
};

export const RESPONSE_COSTS = {
  [RESPONSE_TYPES.IGNORE]: 0,
  [RESPONSE_TYPES.FACT_CHECK]: 2,  // Basic fact-check
  [RESPONSE_TYPES.PRE_BUNK]: 3,
  [RESPONSE_TYPES.COUNTER_NARRATIVE]: 3,
  [RESPONSE_TYPES.DISCREDIT_SOURCE]: 2
};

// Advanced fact-check option (4 manpower)
export const FACT_CHECK_THOROUGH_COST = 4;

// ============================================================================
// INTELLIGENCE METRICS
// ============================================================================

export const VERACITY_LEVELS = {
  TRUE: 'True',
  MOSTLY_TRUE: 'Mostly True',
  MISLEADING: 'Misleading',
  FALSE: 'False'
};

export const METRIC_RANGES = {
  HOURS_ACTIVE: { min: 0.25, max: 48 },
  BOT_AMPLIFICATION: { min: 0, max: 100 },
  DAMAGE_POTENTIAL: { min: 1, max: 10 },
  EMOTIONAL_RESONANCE: { min: 1, max: 10 }
};

// ============================================================================
// OUTCOME TYPES
// ============================================================================

export const OUTCOME_TYPES = {
  SUCCESS: 'SUCCESS',
  NEUTRAL: 'NEUTRAL',
  FAILURE: 'FAILURE'
};

// ============================================================================
// AUDIO CONFIGURATION
// ============================================================================

export const AUDIO_CONFIG = {
  VOLUME: 0.4,
  LOOP: true,
  FADE_DURATION: 1000, // ms
  
  // Audio states based on meter value
  AUDIO_STATES: {
    FRACTURING: 'fracturing', // meter <= -2
    NEUTRAL: 'neutral',       // -1 to 1
    UNITY: 'unity'            // meter >= 2
  }
};

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI_CONFIG = {
  TYPEWRITER_SPEED: 20, // milliseconds per character
  TYPEWRITER_SPEED_FAST: 10, // for skip effect
  
  ANIMATION_DURATION: 300, // ms for slides, fades
  
  METER_ANIMATION_DURATION: 1000, // ms for meter movements
  
  // Keyboard shortcuts
  KEYS: {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    TAB: 'Tab',
    SPACE: ' '
  }
};

// ============================================================================
// LANGUAGES
// ============================================================================

export const LANGUAGES = {
  EN: 'en',
  FR: 'fr' // Future implementation
};

export const DEFAULT_LANGUAGE = LANGUAGES.EN;

// ============================================================================
// SCREEN NAMES
// ============================================================================

export const SCREENS = {
  START: 'start',
  BRIEFING: 'briefing',
  MODE_SELECTION: 'mode_selection', // ADDED
  GAME: 'game',
  OUTCOME: 'outcome',
  END: 'end'
};

// ============================================================================
// GAME MODES
// ============================================================================

export const GAME_MODES = {
  SCENARIO: 'scenario',
  PROCEDURAL: 'procedural'
};

export const MODE_CONFIG = {
  [GAME_MODES.SCENARIO]: {
    name: 'Scenario Mode',
    description: 'Hand-crafted learning scenarios with Filter guidance',
    hasFilter: true,
    hasDecBuilding: false,
    fixedResponses: true
  },
  [GAME_MODES.PROCEDURAL]: {
    name: 'Procedural Mode',
    description: 'Endless generated scenarios with deck-building',
    hasFilter: false,
    hasDeckBuilding: true,
    fixedResponses: false
  }
};

// ============================================================================
// LOCALSTORAGE KEYS
// ============================================================================

export const STORAGE = {
  GAME_STATE: 'narrative-front-game-state',
  SETTINGS: 'narrative-front-settings',
  PROGRESS: 'narrative-front-progress'
};

// ============================================================================
// FILTER PERSONALITY
// ============================================================================

export const FILTER_CONFIG = {
  // Generic responses pool
  SUCCESS_PHRASES: [
    "Adversary frustrated. Nice.",
    "Good. Clean work.",
    "Efficient.",
    "That worked well.",
    "Solid choice."
  ],
  
  FAILURE_PHRASES: [
    "Could be worse.",
    "We learn from this.",
    "Adversary had advantage here.",
    "Difficult situation.",
    "Not ideal, but we continue."
  ],
  
  NEUTRAL_PHRASES: [
    "Acceptable.",
    "Standard result.",
    "As expected.",
    "Situation managed.",
    "Could go either way."
  ]
};

// ============================================================================
// PROBABILITY CALCULATION
// ============================================================================

export const PROBABILITY_CONFIG = {
  // Base success chance modifiers
  MANPOWER_BONUS_THOROUGH: 0.15, // +15% for thorough fact-check
  
  // Random variance in outcomes
  VARIANCE: 0.1, // ±10% random swing
  
  // Critical success/failure chances
  CRITICAL_SUCCESS_CHANCE: 0.05, // 5% chance of extra good outcome
  CRITICAL_FAILURE_CHANCE: 0.05  // 5% chance of extra bad outcome
};

// ============================================================================
// VALIDATION
// ============================================================================

export const VALIDATION = {
  MIN_SCENARIOS: 1,
  MAX_SCENARIOS: 100,
  
  MIN_MANPOWER: 0,
  MAX_MANPOWER: 999,
  
  REQUIRED_SCENARIO_FIELDS: [
    'id',
    'inject',
    'intelligence',
    'filter',
    'probabilities'
  ],
  
  REQUIRED_INTELLIGENCE_FIELDS: [
    'hoursActive',
    'botAmplification',
    'damagePotential',
    'veracity',
    'emotionalResonance'
  ]
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  GAME_CONFIG,
  RESPONSE_TYPES,
  RESPONSE_COSTS,
  FACT_CHECK_THOROUGH_COST,
  VERACITY_LEVELS,
  METRIC_RANGES,
  OUTCOME_TYPES,
  AUDIO_CONFIG,
  UI_CONFIG,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  SCREENS,
  STORAGE,
  FILTER_CONFIG,
  PROBABILITY_CONFIG,
  VALIDATION
};
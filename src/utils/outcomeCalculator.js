import { RESPONSE_TYPES, FACT_CHECK_THOROUGH_COST, PROBABILITY_CONFIG, OUTCOME_TYPES } from '../constants';
import outcomesData from '../data/outcomes/outcomes.json';

/**
 * Calculate outcome based on player responses and scenario probabilities
 */
export class OutcomeCalculator {
  constructor() {
    this.outcomes = outcomesData;
  }

  /**
   * Main calculation function
   * @param {object} scenario - Current scenario data
   * @param {array} responses - Array of selected responses
   * @param {object} gameState - Current game state (meter, manpower, preBunksUsed)
   * @returns {object} Outcome with meterShift, manpowerCost, narratives
   */
  calculateOutcome(scenario, responses, gameState) {
    const { preBunksUsed = [] } = gameState;
    
    // Calculate total manpower cost
    const manpowerCost = this.calculateManpowerCost(responses);
    
    // Process each response
    const responseOutcomes = responses.map(response => {
      return this.processResponse(response, scenario, preBunksUsed);
    });
    
    // Aggregate results
    let totalMeterShift = responseOutcomes.reduce((sum, outcome) => sum + outcome.shift, 0);
    const narratives = responseOutcomes.map(outcome => outcome.narrative);
    
    // Check for synergies or inefficiencies
    const synergy = this.checkSynergies(responses, scenario);
    if (synergy) {
      narratives.push(synergy.narrative);
      totalMeterShift += synergy.shift;
    }
    
    return {
      meterShift: Math.max(-5, Math.min(5, totalMeterShift)), // Bound to ±5
      manpowerCost,
      outcomes: narratives,
      responses: responses.map(r => r.type),
      success: totalMeterShift > 0
    };
  }

  /**
   * Calculate total manpower cost
   */
  calculateManpowerCost(responses) {
    return responses.reduce((total, response) => {
      return total + (response.manpowerCost || 0);
    }, 0);
  }

  /**
   * Process a single response
   */
  processResponse(response, scenario, preBunksUsed) {
    const responseType = response.type;
    const probabilities = scenario.probabilities[responseType];
    
    if (!probabilities) {
      console.error(`No probabilities found for response type: ${responseType}`);
      return { shift: 0, narrative: { text: 'Unknown response type.' } };
    }
    
    // Check for pre-bunk synergy
    const hasPreBunkAdvantage = preBunksUsed.includes(scenario.metadata.theme);
    
    // Calculate modified probabilities
    let successChance = probabilities.success;
    let neutralChance = probabilities.neutral;
    let failureChance = probabilities.failure;
    
    // Apply thorough fact-check bonus
    if (responseType === RESPONSE_TYPES.FACT_CHECK && response.manpowerCost === FACT_CHECK_THOROUGH_COST) {
      successChance += (probabilities.thorough_bonus || 0);
      failureChance -= (probabilities.thorough_bonus || 0);
    }
    
    // Apply pre-bunk advantage if applicable
    if (hasPreBunkAdvantage && responseType === RESPONSE_TYPES.PRE_BUNK) {
      successChance = Math.min(1.0, successChance + 0.2);
      failureChance = Math.max(0.0, failureChance - 0.2);
    }
    
    // Add random variance
    const variance = (Math.random() - 0.5) * PROBABILITY_CONFIG.VARIANCE * 2;
    successChance += variance;
    failureChance -= variance;
    
    // Normalize probabilities
    const total = successChance + neutralChance + failureChance;
    successChance /= total;
    neutralChance /= total;
    failureChance /= total;
    
    // Roll the dice
    const roll = Math.random();
    let outcomeType;
    
    if (roll < successChance) {
      outcomeType = OUTCOME_TYPES.SUCCESS;
    } else if (roll < successChance + neutralChance) {
      outcomeType = OUTCOME_TYPES.NEUTRAL;
    } else {
      outcomeType = OUTCOME_TYPES.FAILURE;
    }
    
    // Check for critical outcomes (rare)
    const criticalRoll = Math.random();
    if (criticalRoll < PROBABILITY_CONFIG.CRITICAL_SUCCESS_CHANCE && outcomeType === OUTCOME_TYPES.SUCCESS) {
      return this.getCriticalOutcome(true);
    } else if (criticalRoll < PROBABILITY_CONFIG.CRITICAL_FAILURE_CHANCE && outcomeType === OUTCOME_TYPES.FAILURE) {
      return this.getCriticalOutcome(false);
    }
    
    // Get narrative text
    const narrative = this.selectNarrative(responseType, outcomeType);
    
    return {
      shift: narrative.shift,
      narrative: { text: narrative.text }
    };
  }

  /**
   * Select narrative text from outcomes.json
   */
  selectNarrative(responseType, outcomeType) {
    const options = this.outcomes[responseType]?.[outcomeType];
    
    if (!options || options.length === 0) {
      console.warn(`No narrative found for ${responseType} - ${outcomeType}`);
      return { shift: 0, text: 'The situation evolves...' };
    }
    
    // Pick random narrative from available options
    const selected = options[Math.floor(Math.random() * options.length)];
    return selected;
  }

  /**
   * Get critical outcome (very rare, extra good/bad result)
   */
  getCriticalOutcome(isSuccess) {
    const critical = isSuccess 
      ? this.outcomes.CRITICAL_OUTCOMES.CRITICAL_SUCCESS
      : this.outcomes.CRITICAL_OUTCOMES.CRITICAL_FAILURE;
    
    return {
      shift: critical.shift,
      narrative: { text: critical.text }
    };
  }

  /**
   * Check for synergies or inefficiencies between multiple responses
   */
  checkSynergies(responses, scenario) {
    if (responses.length < 2) return null;
    
    const types = responses.map(r => r.type);
    
    // Pre-bunk + Fact-check synergy
    if (types.includes(RESPONSE_TYPES.PRE_BUNK) && types.includes(RESPONSE_TYPES.FACT_CHECK)) {
      return {
        shift: 1,
        narrative: { text: this.outcomes.COMBINED.SYNERGY_PREBUNK_FACTCHECK.bonus }
      };
    }
    
    // Counter-narrative + Fact-check synergy
    if (types.includes(RESPONSE_TYPES.COUNTER_NARRATIVE) && types.includes(RESPONSE_TYPES.FACT_CHECK)) {
      return {
        shift: 1,
        narrative: { text: this.outcomes.COMBINED.SYNERGY_COUNTER_FACTCHECK.bonus }
      };
    }
    
    // Fact-check + Discredit (might be too aggressive)
    if (types.includes(RESPONSE_TYPES.FACT_CHECK) && types.includes(RESPONSE_TYPES.DISCREDIT_SOURCE)) {
      return {
        shift: 0,
        narrative: { text: this.outcomes.COMBINED.SYNERGY_FACTCHECK_DISCREDIT.bonus }
      };
    }
    
    // Multiple fact-checks (inefficient)
    const factCheckCount = types.filter(t => t === RESPONSE_TYPES.FACT_CHECK).length;
    if (factCheckCount > 1) {
      return {
        shift: -1,
        narrative: { text: this.outcomes.COMBINED.INEFFICIENCY_MULTIPLE_FACTCHECKS.penalty }
      };
    }
    
    return null;
  }
}

export default OutcomeCalculator;
import { useState, useCallback } from 'react';
import { GAME_CONFIG, STORAGE } from '../constants';

/**
 * Game state management hook
 * Handles all game state and provides actions to modify it
 */
export function useGameState() {
  const [round, setRound] = useState(0);
  const [meter, setMeter] = useState(0);
  const [manpower, setManpower] = useState(GAME_CONFIG.STARTING_MANPOWER);
  const [scenarioHistory, setScenarioHistory] = useState([]);
  const [preBunksUsed, setPreBunksUsed] = useState([]); // Track which pre-bunks have been deployed

  /**
   * Reset game to initial state
   */
  const resetGameState = useCallback(() => {
    setRound(0);
    setMeter(0);
    setManpower(GAME_CONFIG.STARTING_MANPOWER);
    setScenarioHistory([]);
    setPreBunksUsed([]);
  }, []);

  /**
   * Advance to next round
   */
  const advanceRound = useCallback(() => {
    const newRound = round + 1;
    setRound(newRound);
    
    // Add manpower income
    const newManpower = manpower + GAME_CONFIG.MANPOWER_PER_TURN;
    setManpower(newManpower);
    
    return newRound;
  }, [round, manpower]);

  /**
   * Update meter with bounds checking
   */
  const updateMeter = useCallback((change) => {
    setMeter(prev => {
      const newValue = prev + change;
      return Math.max(
        GAME_CONFIG.METER_MIN,
        Math.min(GAME_CONFIG.METER_MAX, newValue)
      );
    });
  }, []);

  /**
   * Spend manpower
   */
  const spendManpower = useCallback((cost) => {
    setManpower(prev => Math.max(0, prev - cost));
  }, []);

  /**
   * Add manpower
   */
  const addManpower = useCallback((amount) => {
    setManpower(prev => prev + amount);
  }, []);

  /**
   * Record a scenario outcome in history
   */
  const recordScenario = useCallback((scenario, responses, outcome) => {
    const record = {
      round,
      scenarioId: scenario.id,
      inject: scenario.inject,
      responses,
      outcome,
      meterBefore: meter,
      meterAfter: meter + outcome.meterShift,
      manpowerSpent: outcome.manpowerCost,
      timestamp: new Date().toISOString()
    };
    
    setScenarioHistory(prev => [...prev, record]);
    
    return record;
  }, [round, meter]);

  /**
   * Register a pre-bunk as used (for future synergy bonuses)
   */
  const registerPreBunk = useCallback((scenarioTheme) => {
    setPreBunksUsed(prev => [...prev, scenarioTheme]);
  }, []);

  /**
   * Check if pre-bunk exists for a given theme
   */
  const hasPreBunkFor = useCallback((theme) => {
    return preBunksUsed.includes(theme);
  }, [preBunksUsed]);

  /**
   * Save game state to localStorage
   */
  const saveGame = useCallback(() => {
    try {
      const gameState = {
        round,
        meter,
        manpower,
        scenarioHistory,
        preBunksUsed,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE.GAME_STATE, JSON.stringify(gameState));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }, [round, meter, manpower, scenarioHistory, preBunksUsed]);

  /**
   * Load game state from localStorage
   */
  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE.GAME_STATE);
      if (!saved) return false;
      
      const gameState = JSON.parse(saved);
      
      setRound(gameState.round);
      setMeter(gameState.meter);
      setManpower(gameState.manpower);
      setScenarioHistory(gameState.scenarioHistory || []);
      setPreBunksUsed(gameState.preBunksUsed || []);
      
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }, []);

  /**
   * Check if saved game exists
   */
  const hasSavedGame = useCallback(() => {
    return !!localStorage.getItem(STORAGE.GAME_STATE);
  }, []);

  /**
   * Clear saved game
   */
  const clearSavedGame = useCallback(() => {
    localStorage.removeItem(STORAGE.GAME_STATE);
  }, []);

  /**
   * Get game outcome based on final meter
   */
  const getGameOutcome = useCallback(() => {
    if (meter >= GAME_CONFIG.VICTORY_THRESHOLD) return 'victory';
    if (meter <= GAME_CONFIG.DEFEAT_THRESHOLD) return 'defeat';
    return 'neutral';
  }, [meter]);

  /**
   * Check if game is over
   */
  const isGameOver = useCallback(() => {
    return round >= GAME_CONFIG.TOTAL_ROUNDS;
  }, [round]);

  return {
    // State
    round,
    meter,
    manpower,
    scenarioHistory,
    preBunksUsed,
    
    // Setters
    setRound,
    setMeter,
    setManpower,
    setScenarioHistory,
    
    // Actions
    resetGameState,
    advanceRound,
    updateMeter,
    spendManpower,
    addManpower,
    recordScenario,
    registerPreBunk,
    hasPreBunkFor,
    
    // Save/Load
    saveGame,
    loadGame,
    hasSavedGame,
    clearSavedGame,
    
    // Game state queries
    getGameOutcome,
    isGameOver
  };
}
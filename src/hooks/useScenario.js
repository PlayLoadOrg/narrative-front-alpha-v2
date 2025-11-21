import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_LANGUAGE } from '../constants';

/**
 * Scenario Hook
 * Handles lazy loading of scenario data
 */
export function useScenario() {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [loading, setLoading] = useState(false);
  const scenarioCache = useRef({});

  /**
   * Load scenario by round and language
   */
  const loadScenario = useCallback(async (round, language = DEFAULT_LANGUAGE) => {
    const cacheKey = `${round}-${language}`;
    
    // Check cache first
    if (scenarioCache.current[cacheKey]) {
      setCurrentScenario(scenarioCache.current[cacheKey]);
      return;
    }

    try {
      setLoading(true);
      const scenarioNumber = String(round + 1).padStart(2, '0');
      const data = await import(`../data/scenarios/scenario-${scenarioNumber}-${language}.json`);
      const scenario = data.default || data;
      
      // Cache the scenario
      scenarioCache.current[cacheKey] = scenario;
      setCurrentScenario(scenario);
    } catch (error) {
      console.error(`Failed to load scenario ${round} in language ${language}:`, error);
      setCurrentScenario(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Preload next scenario for smoother transitions
   */
  const preloadNextScenario = useCallback(async (currentRound, language = DEFAULT_LANGUAGE) => {
    const nextRound = currentRound + 1;
    const cacheKey = `${nextRound}-${language}`;
    
    // Don't preload if already cached
    if (scenarioCache.current[cacheKey]) return;

    try {
      const scenarioNumber = String(nextRound + 1).padStart(2, '0');
      const data = await import(`../data/scenarios/scenario-${scenarioNumber}-${language}.json`);
      const scenario = data.default || data;
      scenarioCache.current[cacheKey] = scenario;
    } catch (error) {
      // Silent fail - preloading is optional
      console.debug(`Could not preload scenario ${nextRound}`);
    }
  }, []);

  return {
    currentScenario,
    loading,
    loadScenario,
    preloadNextScenario
  };
}
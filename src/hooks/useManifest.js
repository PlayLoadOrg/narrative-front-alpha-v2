import { useState, useEffect } from 'react';
import manifestData from '../data/scenarios/manifest.json';

/**
 * Manifest Hook
 * Loads and provides access to scenario manifest
 */
export function useManifest() {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setManifest(manifestData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load manifest:', err);
      setError(err);
      setLoading(false);
    }
  }, []);

  /**
   * Get all enabled scenarios
   */
  const getEnabledScenarios = () => {
    if (!manifest) return [];
    return manifest.scenarios.filter(s => s.enabled);
  };

  /**
   * Get scenario by ID
   */
  const getScenarioById = (id) => {
    if (!manifest) return null;
    return manifest.scenarios.find(s => s.id === id);
  };

  /**
   * Get default scenario
   */
  const getDefaultScenario = () => {
    if (!manifest) return null;
    return manifest.scenarios.find(s => s.id === manifest.defaultScenario);
  };

  /**
   * Check if a scenario mode is available
   */
  const isModeAvailable = (mode) => {
    if (!manifest) return false;
    return manifest.scenarios.some(s => s.mode === mode && s.enabled);
  };

  return {
    manifest,
    loading,
    error,
    getEnabledScenarios,
    getScenarioById,
    getDefaultScenario,
    isModeAvailable
  };
}
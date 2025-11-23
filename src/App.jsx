import React, { useState, useEffect } from 'react';
import { SCREENS, DEFAULT_LANGUAGE, GAME_MODES } from './constants';
import { useGameState } from './hooks/useGameState';
import { useAudio } from './hooks/useAudio';
import { useTranslation } from './hooks/useTranslation';
import { StartScreen } from './screens/StartScreen';
import { BriefingScreen } from './screens/BriefingScreen';
import { GameScreen } from './screens/GameScreen';
import { EndScreen } from './screens/EndScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import './App.css';

/**
 * Main App Component
 * Handles screen routing and global state coordination
 */
function App() {
  // Screen State
  const [screen, setScreen] = useState(SCREENS.START);
  
  // Settings State
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  
  // Game Mode State
  const [gameMode, setGameMode] = useState(GAME_MODES.SCENARIO);
  const [scenarioId, setScenarioId] = useState('nato-eastern-europe');
  
  // Translation Hook
  const { t, loading: translationsLoading } = useTranslation();
  
  // Game State Hook
  const gameState = useGameState();
  
  // Audio Hook
  const { userInteracted, setUserInteracted } = useAudio(
    gameState.meter,
    screen,
    isMuted
  );
  
  // Load saved settings on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('narrative-front-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.isMuted !== undefined) setIsMuted(settings.isMuted);
        if (settings.language) setLanguage(settings.language);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);
  
  // Save settings when they change
  useEffect(() => {
    try {
      const settings = { isMuted, language };
      localStorage.setItem('narrative-front-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [isMuted, language]);

  /**
   * Navigation Handlers
   */
  const handleStartToGame = () => {
    if (!userInteracted) setUserInteracted(true);
    setScreen(SCREENS.BRIEFING);
  };

  const handleBriefingToGame = () => {
    // For now, go directly to game with default scenario
    // In Output 5, this will go to MODE_SELECTION screen
    gameState.resetGameState();
    setGameMode(GAME_MODES.SCENARIO);
    setScenarioId('nato-eastern-europe');
    setScreen(SCREENS.MODE_SELECTION);
  };

  const handleModeSelection = (mode, scenarioId) => {
    gameState.resetGameState();
    setGameMode(mode);
    setScenarioId(scenarioId);
    setScreen(SCREENS.GAME);
  };

  const handleGameEnd = () => {
    setScreen(SCREENS.END);
  };

  const handlePlayAgain = () => {
    gameState.resetGameState();
    setScreen(SCREENS.BRIEFING);
  };

  const handleReturnToStart = () => {
    setScreen(SCREENS.START);
  };

  /**
   * Game Action Handlers
   */
  const handleMeterChange = (change) => {
    gameState.updateMeter(change);
  };

  const handleManpowerChange = (change) => {
    if (change < 0) {
      gameState.spendManpower(Math.abs(change));
    } else {
      gameState.addManpower(change);
    }
  };

  const handleAdvanceRound = () => {
    return gameState.advanceRound();
  };

  const handleRecordScenario = (scenario, responses, outcome) => {
    gameState.recordScenario(scenario, responses, outcome);
  };

  const handleRegisterPreBunk = (theme) => {
    gameState.registerPreBunk(theme);
  };

  /**
   * Save/Load Handlers
   */
  const handleSaveGame = () => {
    return gameState.saveGame();
  };

  const handleLoadGame = () => {
    const success = gameState.loadGame();
    if (success) {
      setScreen(SCREENS.GAME);
    }
    return success;
  };

  // Show loading state while translations load
  if (translationsLoading) {
    return (
      <div className="screen-container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Render appropriate screen
  const renderScreen = () => {
    switch (screen) {
      case SCREENS.START:
        return (
          <StartScreen 
            onStart={handleStartToGame}
            t={t}
          />
        );

      case SCREENS.BRIEFING:
        return (
          <BriefingScreen
            onStart={handleBriefingToGame}
            t={t}
          />
        );
      
      case SCREENS.MODE_SELECTION:
        return (
          <ModeSelectionScreen
            onSelectMode={handleModeSelection}
            t={t}
          />
        );

      case SCREENS.GAME:
        return (
          <GameScreen
            round={gameState.round}
            meter={gameState.meter}
            manpower={gameState.manpower}
            preBunksUsed={gameState.preBunksUsed}
            gameMode={gameMode}
            scenarioId={scenarioId}
            language={language}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onMeterChange={handleMeterChange}
            onManpowerChange={handleManpowerChange}
            onAdvanceRound={handleAdvanceRound}
            onRegisterPreBunk={handleRegisterPreBunk}
            onRecordScenario={handleRecordScenario}
            onSaveGame={handleSaveGame}
            onLoadGame={handleLoadGame}
            onGameEnd={handleGameEnd}
            hasSavedGame={gameState.hasSavedGame()}
            t={t}
          />
        );

      case SCREENS.END:
        return (
          <EndScreen
            meter={gameState.meter}
            manpower={gameState.manpower}
            scenarioHistory={gameState.scenarioHistory}
            onPlayAgain={handlePlayAgain}
            t={t}
          />
        );

      default:
        return (
          <div className="screen-container">
            <div className="card">
              <p>Error: Unknown screen state</p>
              <button onClick={handleReturnToStart} className="button primary-button">
                Return to Start
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Menu, AlertTriangle } from 'lucide-react';
import { MeterDisplay } from '../components/MeterDisplays';
import { IntelligenceDashboard } from '../components/IntelligenceDashboard';
import { FilterChat, createFilterMessage } from '../components/FilterChat';
import { ResponsePanel } from '../components/ResponsePanel';
import { SettingsMenu } from '../components/SettingsMenu';
import { OutcomeScreen } from './OutcomeScreen';
import { useScenario } from '../hooks/useScenario';
import { OutcomeCalculator } from '../utils/outcomeCalculator';
import { GAME_CONFIG, RESPONSE_TYPES } from '../constants';
import narrativeFrontLogo from '../assets/narrativeFront.svg';
import PlayloadFooter from '../components/PlayloadFooter';

/**
 * Main Game Screen
 * Handles scenario display, response selection, and game flow
 */
export function GameScreen({
  round,
  meter,
  manpower,
  preBunksUsed,
  language,
  isMuted,
  setIsMuted,
  onMeterChange,
  onManpowerChange,
  onAdvanceRound,
  onRegisterPreBunk,
  onRecordScenario,
  onSaveGame,
  onLoadGame,
  onGameEnd,
  hasSavedGame,
  t
}) {
  // UI State
  const [activeTab, setActiveTab] = useState('scenario'); // scenario | response | filter
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  
  // Response State
  const [selectedResponses, setSelectedResponses] = useState([]);
  const [currentOutcome, setCurrentOutcome] = useState(null);
  
  // Filter Messages
  const [filterMessages, setFilterMessages] = useState([]);
  
  // Scenario Loading
  const { currentScenario, loading, loadScenario, preloadNextScenario } = useScenario();
  
  // Outcome Calculator
  const outcomeCalculator = useRef(new OutcomeCalculator());

  // Load scenario when round changes
  useEffect(() => {
    loadScenario(round, language);
  }, [round, language, loadScenario]);

  // Show Filter's intro when scenario loads
  useEffect(() => {
    if (currentScenario?.filter?.intro) {
      setFilterMessages([
        createFilterMessage(currentScenario.filter.intro)
      ]);
    }
  }, [currentScenario]);

  // Preload next scenario for smooth transitions
  useEffect(() => {
    if (currentScenario && round < GAME_CONFIG.TOTAL_ROUNDS - 1) {
      preloadNextScenario(round, language);
    }
  }, [currentScenario, round, language, preloadNextScenario]);

  /**
   * Handle response selection/removal
   */
  const handleSelectResponse = (response) => {
    // Check if response type already selected
    const existing = selectedResponses.find(r => r.type === response.type);
    
    if (existing) {
      // Replace with new version (e.g., upgrading fact-check)
      setSelectedResponses(prev => 
        prev.map(r => r.type === response.type ? response : r)
      );
    } else {
      // Add new response
      setSelectedResponses(prev => [...prev, response]);
    }
  };

  const handleRemoveResponse = (responseType) => {
    setSelectedResponses(prev => prev.filter(r => r.type !== responseType));
  };

  /**
   * Confirm responses and calculate outcome
   */
  const handleConfirmResponse = () => {
    // If no responses selected, default to IGNORE
    const responses = selectedResponses.length > 0 
      ? selectedResponses 
      : [{ type: RESPONSE_TYPES.IGNORE, manpowerCost: 0 }];
    
    // Calculate outcome
    const outcome = outcomeCalculator.current.calculateOutcome(
      currentScenario,
      responses,
      { meter, manpower, preBunksUsed }
    );
    
    // Register pre-bunks for future rounds
    responses.forEach(response => {
      if (response.type === RESPONSE_TYPES.PRE_BUNK && currentScenario.metadata?.theme) {
        onRegisterPreBunk(currentScenario.metadata.theme);
      }
    });
    
    // Record scenario history
    onRecordScenario(currentScenario, responses, outcome);
    
    // Store outcome and show outcome screen
    setCurrentOutcome(outcome);
    setShowOutcome(true);
  };

  /**
   * Continue from outcome screen
   */
  const handleOutcomeContinue = () => {
    if (!currentOutcome) return;
    
    // Apply meter change
    onMeterChange(currentOutcome.meterShift);
    
    // Deduct manpower
    onManpowerChange(-currentOutcome.manpowerCost);
    
    // Check if game is over
    if (round >= GAME_CONFIG.TOTAL_ROUNDS - 1) {
      onGameEnd();
      return;
    }
    
    // Advance to next round
    onAdvanceRound();
    
    // Reset UI state
    setShowOutcome(false);
    setCurrentOutcome(null);
    setSelectedResponses([]);
    setActiveTab('scenario');
  };

  /**
   * Calculate total manpower allocated
   */
  const getTotalAllocated = () => {
    return selectedResponses.reduce((sum, r) => sum + r.manpowerCost, 0);
  };

  /**
   * Check if confirm button should be enabled
   */
  const canConfirm = () => {
    const totalAllocated = getTotalAllocated();
    return totalAllocated <= manpower;
  };

  // Show outcome screen if active
  if (showOutcome && currentOutcome) {
    return (
      <OutcomeScreen
        outcome={currentOutcome}
        scenario={currentScenario}
        onContinue={handleOutcomeContinue}
        t={t}
      />
    );
  }

  // Show loading state
  if (loading || !currentScenario) {
    return (
      <div className="screen-container game-screen">
        <div className="card">
          <p>{t('ui.loading')}</p>
        </div>
        <PlayloadFooter />
      </div>
    );
  }

  return (
    <div className="screen-container game-screen">
      {/* Settings Menu */}
      <SettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onSaveGame={onSaveGame}
        onLoadGame={onLoadGame}
        hasSavedGame={hasSavedGame}
        t={t}
      />

      {/* Main Game Card */}
      <div className={`card game-card ${isSettingsOpen ? 'blurred' : ''}`}>
        {/* Header */}
        <header className="game-header">
          <button 
            className="settings-hamburger" 
            onClick={() => setIsSettingsOpen(true)}
            aria-label={t('accessibility.menuButton')}
          >
            <Menu size={24} />
          </button>
          
          <div className="header-title-container">
            <Shield className="header-icon" />
            <span className="header-title">{t('game.appTitle')}</span>
          </div>
          
          <img 
            src={narrativeFrontLogo} 
            alt="Narrative Front Logo" 
            className="header-logo" 
          />
        </header>

        <div className="header-subtitle">{t('game.appSubtitle')}</div>

        {/* Resource Display */}
        <div className="resource-display">
          <div className="resource-item">
            <span className="resource-label">{t('game.manpowerLabel')}:</span>
            <span className="resource-value">{manpower}</span>
          </div>
          <div className="resource-item">
            <span className="resource-label">{t('game.roundLabel')}:</span>
            <span className="resource-value">
              {round + 1} {t('game.ofLabel')} {GAME_CONFIG.TOTAL_ROUNDS}
            </span>
          </div>
        </div>

        {/* Meter Display */}
        <MeterDisplay value={meter} meterType="tugofwar" t={t} />

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'scenario' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenario')}
          >
            {t('game.tabScenario')}
          </button>
          <button
            className={`tab-button ${activeTab === 'response' ? 'active' : ''}`}
            onClick={() => setActiveTab('response')}
          >
            {t('game.tabResponse')}
          </button>
          <button
            className={`tab-button ${activeTab === 'filter' ? 'active' : ''}`}
            onClick={() => setActiveTab('filter')}
          >
            {t('game.tabFilter')}
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Scenario Tab */}
          {activeTab === 'scenario' && (
            <div className="scenario-tab">
              {/* Adversary Inject */}
              <div className="inject-section">
                <div className="inject-header">
                  <AlertTriangle className="inject-icon" />
                  <h3 className="inject-title">{t('game.adversaryInject')}</h3>
                </div>
                <p className="inject-text">{currentScenario.inject}</p>
              </div>

              {/* Intelligence Dashboard */}
              <IntelligenceDashboard 
                intelligence={currentScenario.intelligence} 
                t={t} 
              />
            </div>
          )}

          {/* Response Tab */}
          {activeTab === 'response' && (
            <div className="response-tab">
              <h3 className="response-tab-title">{t('game.yourResponse')}</h3>
              
              {/* Manpower Summary */}
              <div className="manpower-summary">
                <span>{t('game.manpowerAllocated')}: {getTotalAllocated()} / {manpower}</span>
              </div>

              {/* Response Panel */}
              <ResponsePanel
                selectedResponses={selectedResponses}
                availableManpower={manpower}
                onSelectResponse={handleSelectResponse}
                onRemoveResponse={handleRemoveResponse}
                t={t}
              />

              {/* Confirm Button */}
              <button
                onClick={handleConfirmResponse}
                disabled={!canConfirm()}
                className="button primary-button full-width confirm-response-button"
              >
                {selectedResponses.length === 0 
                  ? t('responses.noResponseSelected')
                  : t('game.confirmButton')
                }
              </button>

              {!canConfirm() && (
                <p className="error-text">{t('responses.insufficientManpower')}</p>
              )}
            </div>
          )}

          {/* Filter Tab */}
          {activeTab === 'filter' && (
            <div className="filter-tab">
              <h3 className="filter-tab-title">{t('game.filterChatTitle')}</h3>
              <FilterChat messages={filterMessages} t={t} />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="game-footer">
          {t('game.roundLabel')} {round + 1} {t('game.ofLabel')} {GAME_CONFIG.TOTAL_ROUNDS}
        </footer>
      </div>

      <PlayloadFooter />
    </div>
  );
}
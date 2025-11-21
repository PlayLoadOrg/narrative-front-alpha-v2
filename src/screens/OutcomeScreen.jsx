import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Users, Zap } from 'lucide-react';
import { MeterDisplay } from '../components/MeterDisplays';
import { FilterChat, createFilterMessage, createSystemMessage } from '../components/FilterChat';
import PlayloadFooter from '../components/PlayloadFooter';

/**
 * Outcome Screen
 * Shows results of player's response with Filter's analysis
 */
export function OutcomeScreen({ outcome, scenario, onContinue, t }) {
  const [filterMessages, setFilterMessages] = useState([]);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (!outcome || !scenario) return;

    const messages = [];
    
    // Add outcome narratives as system messages
    if (outcome.outcomes && outcome.outcomes.length > 0) {
      outcome.outcomes.forEach(outcomeNarrative => {
        messages.push(createSystemMessage(outcomeNarrative.text));
      });
    }
    
    // Add Filter's outro analysis
    if (scenario.filter?.outro) {
      messages.push(createFilterMessage(scenario.filter.outro));
    }
    
    setFilterMessages(messages);
    
    // Show continue button after short delay
    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [outcome, scenario]);

  if (!outcome) {
    return (
      <div className="screen-container outcome-screen">
        <div className="card">
          <p>{t('ui.loading')}</p>
        </div>
        <PlayloadFooter />
      </div>
    );
  }

  return (
    <div className="screen-container outcome-screen">
      <div className="card outcome-card">
        <h2 className="outcome-title">{t('outcome.title')}</h2>

        {/* Meter Impact Preview */}
        <div className="outcome-summary">
          <div className="outcome-stat">
            {outcome.meterShift > 0 ? (
              <TrendingUp className="outcome-icon" style={{ color: '#4ade80' }} size={32} />
            ) : outcome.meterShift < 0 ? (
              <TrendingDown className="outcome-icon" style={{ color: '#f87171' }} size={32} />
            ) : (
              <Minus className="outcome-icon" style={{ color: '#9ca3af' }} size={32} />
            )}
            <div className="outcome-stat-details">
              <span className="outcome-stat-label">{t('outcome.meterImpact')}</span>
              <span 
                className="outcome-stat-value"
                style={{ 
                  color: outcome.meterShift > 0 ? '#4ade80' : 
                         outcome.meterShift < 0 ? '#f87171' : '#9ca3af' 
                }}
              >
                {outcome.meterShift > 0 ? '+' : ''}{outcome.meterShift}
              </span>
            </div>
          </div>

          <div className="outcome-stat">
            <Users className="outcome-icon" style={{ color: '#22d3ee' }} size={32} />
            <div className="outcome-stat-details">
              <span className="outcome-stat-label">{t('outcome.manpowerSpent')}</span>
              <span className="outcome-stat-value" style={{ color: '#22d3ee' }}>
                {outcome.manpowerCost}
              </span>
            </div>
          </div>
        </div>

        {/* Filter's Analysis */}
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            color: '#22d3ee', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {t('outcome.analysis')}
          </h3>
          <FilterChat messages={filterMessages} t={t} />
        </div>

        {/* Continue Button */}
        {showContinue && (
          <button
            onClick={onContinue}
            className="button primary-button full-width"
            autoFocus
          >
            {t('outcome.continueButton')}
          </button>
        )}
      </div>

      <PlayloadFooter />
    </div>
  );
}
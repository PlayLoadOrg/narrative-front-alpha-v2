import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { RESPONSE_TYPES, RESPONSE_COSTS, FACT_CHECK_THOROUGH_COST } from '../constants';

/**
 * Response Selection Panel
 * Shows available responses with costs and allows selection
 */
export function ResponsePanel({ 
  selectedResponses, 
  availableManpower,
  onSelectResponse,
  onRemoveResponse,
  t 
}) {
  const isResponseSelected = (type) => {
    return selectedResponses.some(r => r.type === type);
  };

  const getSelectedResponse = (type) => {
    return selectedResponses.find(r => r.type === type);
  };

  const canAfford = (cost) => {
    const currentlyAllocated = selectedResponses.reduce((sum, r) => sum + r.manpowerCost, 0);
    return (currentlyAllocated + cost) <= availableManpower;
  };

  const responses = [
    {
      type: RESPONSE_TYPES.IGNORE,
      title: t('responses.ignore.title'),
      description: t('responses.ignore.description'),
      cost: RESPONSE_COSTS[RESPONSE_TYPES.IGNORE],
      riskWarning: t('responses.ignore.riskWarning')
    },
    {
      type: RESPONSE_TYPES.FACT_CHECK,
      title: t('responses.factCheckBasic.title'),
      description: t('responses.factCheckBasic.description'),
      cost: RESPONSE_COSTS[RESPONSE_TYPES.FACT_CHECK],
      riskWarning: null,
      hasUpgrade: true
    },
    {
      type: RESPONSE_TYPES.PRE_BUNK,
      title: t('responses.preBunk.title'),
      description: t('responses.preBunk.description'),
      cost: RESPONSE_COSTS[RESPONSE_TYPES.PRE_BUNK],
      riskWarning: t('responses.preBunk.riskWarning')
    },
    {
      type: RESPONSE_TYPES.COUNTER_NARRATIVE,
      title: t('responses.counterNarrative.title'),
      description: t('responses.counterNarrative.description'),
      cost: RESPONSE_COSTS[RESPONSE_TYPES.COUNTER_NARRATIVE],
      riskWarning: null
    },
    {
      type: RESPONSE_TYPES.DISCREDIT_SOURCE,
      title: t('responses.discreditSource.title'),
      description: t('responses.discreditSource.description'),
      cost: RESPONSE_COSTS[RESPONSE_TYPES.DISCREDIT_SOURCE],
      riskWarning: t('responses.discreditSource.riskWarning')
    }
  ];

  const handleSelect = (response) => {
    const selected = getSelectedResponse(response.type);
    
    if (selected) {
      // Already selected, remove it
      onRemoveResponse(response.type);
    } else {
      // Select with basic cost
      if (canAfford(response.cost)) {
        onSelectResponse({
          type: response.type,
          manpowerCost: response.cost
        });
      }
    }
  };

  const handleUpgrade = (response) => {
    if (canAfford(FACT_CHECK_THOROUGH_COST)) {
      // Remove basic if exists
      onRemoveResponse(response.type);
      // Add thorough version
      onSelectResponse({
        type: response.type,
        manpowerCost: FACT_CHECK_THOROUGH_COST
      });
    }
  };

  return (
    <div className="response-panel">
      <div className="response-grid">
        {responses.map((response) => {
          const selected = getSelectedResponse(response.type);
          const isSelected = !!selected;
          const isThorough = selected?.manpowerCost === FACT_CHECK_THOROUGH_COST;
          const affordable = canAfford(response.cost);

          return (
            <div key={response.type} className="response-option-wrapper">
              <button
                className={`response-option ${isSelected ? 'selected' : ''} ${!affordable && !isSelected ? 'disabled' : ''}`}
                onClick={() => handleSelect(response)}
                disabled={!affordable && !isSelected}
              >
                <div className="response-header">
                  <div className="response-title">{response.title}</div>
                  {isSelected && (
                    <CheckCircle size={18} className="response-check-icon" />
                  )}
                </div>
                
                <div className="response-description">{response.description}</div>
                
                <div className="response-footer">
                  <span className="response-cost">
                    {response.cost} MP
                  </span>
                  
                  {response.riskWarning && (
                    <span className="response-risk">⚠️</span>
                  )}
                </div>

                {response.riskWarning && (
                  <div className="response-warning">
                    {response.riskWarning}
                  </div>
                )}
              </button>

              {/* Thorough Fact-Check Upgrade Option */}
              {response.hasUpgrade && isSelected && !isThorough && (
                <button
                  className={`response-upgrade ${canAfford(FACT_CHECK_THOROUGH_COST) ? '' : 'disabled'}`}
                  onClick={() => handleUpgrade(response)}
                  disabled={!canAfford(FACT_CHECK_THOROUGH_COST)}
                >
                  <span>⬆️ {t('responses.factCheckThorough.title')}</span>
                  <span className="upgrade-cost">{FACT_CHECK_THOROUGH_COST} MP</span>
                </button>
              )}
              
              {response.hasUpgrade && isSelected && isThorough && (
                <div className="response-thorough-badge">
                  ✓ {t('responses.factCheckThorough.title')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
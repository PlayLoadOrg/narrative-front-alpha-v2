import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { MeterDisplay } from '../components/MeterDisplays';
import { GAME_CONFIG } from '../constants';
import PlayloadFooter from '../components/PlayloadFooter';

/**
 * End Screen
 * Shows final results and game outcome based on meter value
 */
export function EndScreen({ 
  meter,
  manpower,
  scenarioHistory,
  onPlayAgain, 
  t 
}) {
  // Determine outcome based on final meter
  const getOutcome = () => {
    if (meter >= GAME_CONFIG.VICTORY_THRESHOLD) {
      return {
        type: 'victory',
        title: t('end.victoryTitle'),
        message: t('end.victoryMessage'),
        icon: <CheckCircle className="end-icon" />,
        colorClass: 'text-green'
      };
    } else if (meter <= GAME_CONFIG.DEFEAT_THRESHOLD) {
      return {
        type: 'defeat',
        title: t('end.defeatTitle'),
        message: t('end.defeatMessage'),
        icon: <XCircle className="end-icon" />,
        colorClass: 'text-red'
      };
    } else {
      return {
        type: 'neutral',
        title: t('end.neutralTitle'),
        message: t('end.neutralMessage'),
        icon: <AlertTriangle className="end-icon" />,
        colorClass: 'text-yellow'
      };
    }
  };

  const outcome = getOutcome();

  return (
    <div className="screen-container end-screen">
      <div className="card end-card">
        {/* Outcome Icon */}
        <div className={`end-icon-container ${outcome.colorClass}`}>
          {outcome.icon}
        </div>

        {/* Outcome Title */}
        <h2 className={`end-title ${outcome.colorClass}`}>
          {outcome.title}
        </h2>

        {/* Meter Display */}
        <MeterDisplay value={meter} meterType="tugofwar" t={t} />

        {/* Outcome Message */}
        <p className="end-message">{outcome.message}</p>

        {/* Final Statistics */}
        <div className="end-stats">
          <div className="end-stat-row">
            <span className="end-stat-label">{t('end.finalMeterLabel')}:</span>
            <span className={`end-stat-value ${outcome.colorClass}`}>
              {meter > 0 ? '+' : ''}{meter}
            </span>
          </div>
          
          <div className="end-stat-row">
            <span className="end-stat-label">{t('end.finalManpowerLabel')}:</span>
            <span className="end-stat-value">{manpower}</span>
          </div>
          
          <div className="end-stat-row">
            <span className="end-stat-label">{t('end.scenariosCompletedLabel')}:</span>
            <span className="end-stat-value">{scenarioHistory.length}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="end-actions">
          <button 
            onClick={onPlayAgain} 
            className="button primary-button full-width"
            autoFocus
          >
            {t('end.playAgainButton')}
          </button>
        </div>
      </div>

      <PlayloadFooter />
    </div>
  );
}
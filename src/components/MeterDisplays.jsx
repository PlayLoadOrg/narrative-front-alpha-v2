import React from 'react';
import { GAME_CONFIG } from '../constants';

/**
 * Tug-of-war style meter (default)
 */
export const TugOfWarMeter = ({ value, t }) => {
  // Calculate percentage position (0% = fragmentation, 100% = unity)
  const range = GAME_CONFIG.METER_MAX - GAME_CONFIG.METER_MIN;
  const normalizedValue = value - GAME_CONFIG.METER_MIN;
  const percentage = (normalizedValue / range) * 100;

  return (
    <div className="tug-of-war-container">
      <div className="tug-of-war-bar">
        <div 
          className="bar-color-fill" 
          style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
        />
        <div 
          className="bar-marker" 
          style={{ left: `${percentage}%` }}
        >
          <div className="bar-marker-orb" />
        </div>
      </div>
      
      <div className="bar-labels">
        <span className="label-fragmentation">{t('meter.fragmentationLabel')}</span>
        <span className="label-neutral">{t('meter.neutralLabel')}</span>
        <span className="label-unity">{t('meter.unityLabel')}</span>
      </div>
      
      <div className="meter-value">
        {t('meter.label')}: {value > 0 ? '+' : ''}{value}
      </div>
    </div>
  );
};

/**
 * Main meter display component
 * Currently only supports tug-of-war, but architecture allows for future styles
 */
export const MeterDisplay = ({ value, meterType = 'tugofwar', t }) => {
  return <TugOfWarMeter value={value} t={t} />;
};
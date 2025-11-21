import React from 'react';
import narrativeFrontLogo from '../assets/narrativeFront.svg';
import PlayloadFooter from '../components/PlayloadFooter';

/**
 * Start Screen
 * Initial landing page with disclaimer and "I Affirm" button
 */
export function StartScreen({ onStart, t }) {
  return (
    <div className="screen-container start-screen">
      <div className="card start-card">
        <img 
          src={narrativeFrontLogo} 
          alt="Narrative Front Logo" 
          className="logo"
        />
        
        <div className="title-container">
          <h1 className="main-title">{t('start.title')}</h1>
          <p className="brand-text">{t('start.presenter')}</p>
          <p className="credit-text">{t('start.credits')}</p>
        </div>
        
        <div className="disclaimer-box">
          <p className="disclaimer-text">{t('start.disclaimer')}</p>
        </div>
        
        <button 
          onClick={onStart} 
          className="button primary-button"
          autoFocus
        >
          {t('start.affirmButton')}
        </button>
      </div>
      
      <PlayloadFooter />
    </div>
  );
}
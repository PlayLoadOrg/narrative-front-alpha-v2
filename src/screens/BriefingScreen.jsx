import React, { useState, useEffect } from 'react';
import { Typewriter } from '../components/Typewriter';
import PlayloadFooter from '../components/PlayloadFooter';

/**
 * Briefing Screen
 * Mission briefing with Filter's introduction
 */
export function BriefingScreen({ onStart, t }) {
  const [quoteComplete, setQuoteComplete] = useState(false);
  const [textComplete, setTextComplete] = useState(false);

  // Auto-focus button when typewriter completes
  useEffect(() => {
    if (textComplete) {
      document.getElementById('begin-button')?.focus();
    }
  }, [textComplete]);

  return (
    <div className="screen-container briefing-screen">
      <div className="card briefing-card">
        <div className="briefing-quote">
          <Typewriter 
            text={t('briefing.quote')}
            speed={60}
            onComplete={() => setQuoteComplete(true)}
          />
        </div>
        
        {quoteComplete && (
          <div className="briefing-attribution">
            {t('briefing.attribution')}
          </div>
        )}
        
        {quoteComplete && (
          <div className="briefing-text">
            <Typewriter 
              text={t('briefing.text')}
              speed={10}
              onComplete={() => setTextComplete(true)}
            />
          </div>
        )}
        
        {textComplete && (
          <div className="briefing-action">
            <button 
              id="begin-button"
              onClick={onStart} 
              className="button primary-button"
            >
              {t('briefing.beginButton')}
            </button>
          </div>
        )}
      </div>
      
      <PlayloadFooter />
    </div>
  );
}
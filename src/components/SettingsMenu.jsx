import React from 'react';
import { X, VolumeX, Volume2, Save, Download } from 'lucide-react';

/**
 * Settings Menu (slides in from left)
 * Sound toggle, save/load, language selection (future)
 */
export function SettingsMenu({ 
  isOpen,
  onClose, 
  isMuted, 
  setIsMuted,
  onSaveGame,
  onLoadGame,
  hasSavedGame,
  t
}) {
  if (!isOpen) return null;

  const handleSave = () => {
    const success = onSaveGame();
    if (success) {
      // Could show a toast notification here
      console.log('Game saved successfully');
    }
  };

  const handleLoad = () => {
    const success = onLoadGame();
    if (success) {
      console.log('Game loaded successfully');
      onClose();
    }
  };

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-menu slide-in">
        <button 
          className="settings-close" 
          onClick={onClose}
          aria-label={t('accessibility.closeMenu')}
        >
          <X size={24} />
        </button>
        
        <h3 className="settings-title">{t('settings.title')}</h3>
        
        {/* Sound Toggle */}
        <button 
          className="button settings-button" 
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          <span>{isMuted ? t('settings.unmuteButton') : t('settings.muteButton')}</span>
        </button>
        
        <div className="settings-divider" />
        
        {/* Save Game */}
        <button 
          className="button settings-button" 
          onClick={handleSave}
        >
          <Save size={20} />
          <span>{t('settings.saveGameButton')}</span>
        </button>
        
        {/* Load Game */}
        <button 
          className="button settings-button" 
          onClick={handleLoad}
          disabled={!hasSavedGame}
        >
          <Download size={20} />
          <span>{t('settings.loadGameButton')}</span>
        </button>
        
        {!hasSavedGame && (
          <p className="settings-note">{t('settings.noSavedGame') || 'No saved game available'}</p>
        )}
      </div>
    </>
  );
}
import React from 'react';
import { Shield, Target, Infinity, Lock } from 'lucide-react';
import { useManifest } from '../hooks/useManifest';
import { GAME_MODES } from '../constants';
import PlayloadFooter from '../components/PlayloadFooter';

/**
 * Mode Selection Screen
 * Player chooses between Scenario and Procedural modes
 */
export function ModeSelectionScreen({ onSelectMode, t }) {
  const { getEnabledScenarios, loading } = useManifest();

  if (loading) {
    return (
      <div className="screen-container mode-selection-screen">
        <div className="card">
          <p>{t('ui.loading')}</p>
        </div>
        <PlayloadFooter />
      </div>
    );
  }

  const modes = [
    {
      id: 'nato-eastern-europe',
      mode: GAME_MODES.SCENARIO,
      icon: <Target size={48} />,
      title: t('modeSelection.natoEE.title'),
      subtitle: t('modeSelection.natoEE.subtitle'),
      classification: t('modeSelection.classification'),
      description: t('modeSelection.natoEE.description'),
      features: [
        t('modeSelection.natoEE.feature1'),
        t('modeSelection.natoEE.feature2'),
        t('modeSelection.natoEE.feature3'),
        t('modeSelection.natoEE.feature4')
      ],
      difficulty: t('modeSelection.natoEE.difficulty'),
      duration: t('modeSelection.natoEE.duration'),
      enabled: true
    },
    {
      id: 'procedural-infinite',
      mode: GAME_MODES.PROCEDURAL,
      icon: <Infinity size={48} />,
      title: t('modeSelection.infinite.title'),
      subtitle: t('modeSelection.infinite.subtitle'),
      classification: t('modeSelection.classification'),
      description: t('modeSelection.infinite.description'),
      features: [
        t('modeSelection.infinite.feature1'),
        t('modeSelection.infinite.feature2'),
        t('modeSelection.infinite.feature3'),
        t('modeSelection.infinite.feature4')
      ],
      difficulty: t('modeSelection.infinite.difficulty'),
      duration: t('modeSelection.infinite.duration'),
      enabled: false
    }
  ];

  return (
    <div className="screen-container mode-selection-screen">
      <div className="card mode-selection-card">
        {/* Header */}
        <div className="mode-selection-header">
          <Shield className="mode-selection-icon" size={40} />
          <h1 className="mode-selection-title">{t('modeSelection.title')}</h1>
          <p className="mode-selection-subtitle">
            {t('modeSelection.subtitle')}
          </p>
        </div>

        {/* Mode Cards */}
        <div className="mode-grid">
          {modes.map((modeOption) => (
            <div
              key={modeOption.id}
              className={`mode-card ${!modeOption.enabled ? 'mode-card-disabled' : ''}`}
            >
              {/* Classification Banner */}
              <div className="mode-classification">
                {modeOption.classification}
              </div>

              {/* Icon & Title */}
              <div className="mode-card-header">
                <div className="mode-icon-container" style={{
                  color: modeOption.enabled ? '#22d3ee' : '#6b7280'
                }}>
                  {modeOption.enabled ? modeOption.icon : <Lock size={48} />}
                </div>
                <h2 className="mode-card-title">{modeOption.title}</h2>
                <p className="mode-card-subtitle">{modeOption.subtitle}</p>
              </div>

              {/* Description */}
              <p className="mode-card-description">
                {modeOption.description}
              </p>

              {/* Features */}
              <div className="mode-features">
                {modeOption.features.map((feature, idx) => (
                  <div key={idx} className="mode-feature">
                    <span className="mode-feature-bullet">•</span>
                    <span className="mode-feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Meta Info */}
              <div className="mode-meta">
                <span className="mode-meta-item">
                  <strong>{t('modeSelection.difficultyLabel')}:</strong> {modeOption.difficulty}
                </span>
                <span className="mode-meta-item">
                  <strong>{t('modeSelection.durationLabel')}:</strong> {modeOption.duration}
                </span>
              </div>

              {/* Action Button */}
              {modeOption.enabled ? (
                <button
                  onClick={() => onSelectMode(modeOption.mode, modeOption.id)}
                  className="button primary-button full-width mode-select-button"
                >
                  {t('modeSelection.deployButton')}
                </button>
              ) : (
                <div className="mode-coming-soon">
                  <Lock size={16} />
                  <span>{t('modeSelection.comingSoon')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <PlayloadFooter />
    </div>
  );
}
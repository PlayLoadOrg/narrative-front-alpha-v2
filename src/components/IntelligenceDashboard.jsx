import React from 'react';
import { Clock, TrendingUp, Eye, Activity, AlertCircle } from 'lucide-react';
import { VERACITY_LEVELS } from '../constants';

/**
 * Intelligence Dashboard
 * Displays 5 key metrics for scenario analysis
 */
export function IntelligenceDashboard({ intelligence, t }) {
  const getVeracityColor = (veracity) => {
    switch (veracity) {
      case VERACITY_LEVELS.TRUE:
        return '#4ade80'; // green
      case VERACITY_LEVELS.MOSTLY_TRUE:
        return '#facc15'; // yellow
      case VERACITY_LEVELS.MISLEADING:
        return '#fb923c'; // orange
      case VERACITY_LEVELS.FALSE:
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getBarColor = (value, max = 10) => {
    const percentage = (value / max) * 100;
    if (percentage <= 33) return '#4ade80'; // green
    if (percentage <= 66) return '#facc15'; // yellow
    return '#ef4444'; // red
  };

  const getThreatLevel = () => {
    const avgThreat = (intelligence.damagePotential + (intelligence.botAmplification / 10)) / 2;
    const urgencyMultiplier = intelligence.hoursActive <= 2 ? 1.3 : 1.0;
    const totalThreat = avgThreat * urgencyMultiplier;

    if (totalThreat >= 7) {
      return {
        label: t('intelligence.threatLevelCritical'),
        color: '#ef4444'
      };
    } else if (totalThreat >= 4) {
      return {
        label: t('intelligence.threatLevelHigh'),
        color: '#facc15'
      };
    } else {
      return {
        label: t('intelligence.threatLevelModerate'),
        color: '#4ade80'
      };
    }
  };

  const threat = getThreatLevel();

  const metrics = [
    {
      icon: <Clock size={18} />,
      label: t('intelligence.hoursActiveLabel'),
      value: `${intelligence.hoursActive}${t('intelligence.hoursActiveUnit')}`,
      description: t('intelligence.hoursActiveDesc'),
      color: intelligence.hoursActive <= 2 ? '#ef4444' : intelligence.hoursActive <= 6 ? '#facc15' : '#4ade80'
    },
    {
      icon: <Activity size={18} />,
      label: t('intelligence.botAmplificationLabel'),
      value: `${intelligence.botAmplification}${t('intelligence.botAmplificationUnit')}`,
      description: t('intelligence.botAmplificationDesc'),
      barValue: intelligence.botAmplification,
      barMax: 100,
      color: getBarColor(intelligence.botAmplification, 100)
    },
    {
      icon: <TrendingUp size={18} />,
      label: t('intelligence.damagePotentialLabel'),
      value: `${intelligence.damagePotential}${t('intelligence.damagePotentialScale')}`,
      description: t('intelligence.damagePotentialDesc'),
      barValue: intelligence.damagePotential,
      barMax: 10,
      color: getBarColor(intelligence.damagePotential, 10)
    },
    {
      icon: <Eye size={18} />,
      label: t('intelligence.veracityLabel'),
      value: t(`intelligence.veracity${intelligence.veracity.replace(/\s/g, '')}`),
      description: t('intelligence.veracityDesc'),
      color: getVeracityColor(intelligence.veracity)
    },
    {
      icon: <AlertCircle size={18} />,
      label: t('intelligence.emotionalResonanceLabel'),
      value: `${intelligence.emotionalResonance}${t('intelligence.emotionalResonanceScale')}`,
      description: t('intelligence.emotionalResonanceDesc'),
      barValue: intelligence.emotionalResonance,
      barMax: 10,
      color: getBarColor(intelligence.emotionalResonance, 10)
    }
  ];

  return (
    <div className="intelligence-dashboard">
      <h4 className="intelligence-title">{t('intelligence.title')}</h4>
      
      {/* Threat Level Badge */}
      <div className="threat-badge" style={{ backgroundColor: `${threat.color}20`, borderColor: threat.color }}>
        <span style={{ color: threat.color }}>{threat.label}</span>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <div className="metric-header">
              <div className="metric-icon" style={{ color: metric.color }}>
                {metric.icon}
              </div>
              <div className="metric-info">
                <span className="metric-label">{metric.label}</span>
                <span className="metric-value" style={{ color: metric.color }}>
                  {metric.value}
                </span>
              </div>
            </div>
            
            {/* Optional bar for quantitative metrics */}
            {metric.barValue !== undefined && (
              <div className="metric-bar">
                <div 
                  className="metric-bar-fill"
                  style={{
                    width: `${(metric.barValue / metric.barMax) * 100}%`,
                    backgroundColor: metric.color
                  }}
                />
              </div>
            )}
            
            <p className="metric-description">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
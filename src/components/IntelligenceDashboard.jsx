import React from 'react';
import { Clock, TrendingUp, Eye, Activity, AlertCircle } from 'lucide-react';
import { VERACITY_LEVELS } from '../constants';

/**
 * Compact Intelligence Dashboard (Original's superior design)
 * Single card with all metrics - much more space efficient
 * Metrics ordered: Time, Veracity, then 3 bars grouped together
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
        label: '🔴 CRITICAL THREAT',
        color: '#ef4444'
      };
    } else if (totalThreat >= 4) {
      return {
        label: '🟡 HIGH THREAT',
        color: '#facc15'
      };
    } else {
      return {
        label: '🟢 MODERATE THREAT',
        color: '#4ade80'
      };
    }
  };

  const threat = getThreatLevel();

  // REORDERED: Time and Veracity first (no bars), then 3 bars grouped
  const metrics = [
    {
      icon: <Clock size={14} />,
      label: t('intelligence.hoursActiveLabel'),
      value: `${intelligence.hoursActive}${t('intelligence.hoursActiveUnit')}`,
      color: intelligence.hoursActive <= 2 ? '#ef4444' : intelligence.hoursActive <= 6 ? '#facc15' : '#4ade80'
    },
    {
      icon: <Eye size={14} />,
      label: t('intelligence.veracityLabel'),
      value: t(`intelligence.veracity${intelligence.veracity.replace(/\s/g, '')}`),
      color: getVeracityColor(intelligence.veracity)
    },
    {
      icon: <TrendingUp size={14} />,
      label: t('intelligence.damagePotentialLabel'),
      value: `${intelligence.damagePotential}${t('intelligence.damagePotentialScale')}`,
      barValue: intelligence.damagePotential,
      barMax: 10,
      color: getBarColor(intelligence.damagePotential, 10)
    },
    {
      icon: <AlertCircle size={14} />,
      label: t('intelligence.emotionalResonanceLabel'),
      value: `${intelligence.emotionalResonance}${t('intelligence.emotionalResonanceScale')}`,
      barValue: intelligence.emotionalResonance,
      barMax: 10,
      color: getBarColor(intelligence.emotionalResonance, 10)
    },
    {
      icon: <Activity size={14} />,
      label: t('intelligence.botAmplificationLabel'),
      value: `${intelligence.botAmplification}${t('intelligence.botAmplificationUnit')}`,
      barValue: intelligence.botAmplification,
      barMax: 100,
      color: getBarColor(intelligence.botAmplification, 100)
    }
  ];

  return (
    <div className="intel-compact">
      <h4 className="intel-compact-title">{t('intelligence.title')}</h4>
      
      {/* Threat Level Badge */}
      <div className="threat-badge-compact" style={{ 
        backgroundColor: `${threat.color}20`, 
        borderColor: threat.color,
        color: threat.color
      }}>
        {threat.label}
      </div>

      {/* All Metrics in Compact Layout */}
      {metrics.map((metric, idx) => (
        <div key={idx} className="intel-metric-compact">
          <div className="metric-header-compact">
            <span className="metric-icon-compact" style={{ color: metric.color }}>
              {metric.icon}
            </span>
            <span className="metric-label-compact">{metric.label}:</span>
            <span className="metric-value-compact" style={{ color: metric.color }}>
              {metric.value}
            </span>
          </div>
          
          {/* Optional bar for quantitative metrics */}
          {metric.barValue !== undefined && (
            <div className="metric-bar-compact">
              <div 
                className="metric-bar-fill-compact"
                style={{
                  width: `${(metric.barValue / metric.barMax) * 100}%`,
                  backgroundColor: metric.color
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
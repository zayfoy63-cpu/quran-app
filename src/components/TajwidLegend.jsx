import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { TAJWID_RULES } from '../utils/tajwid'
import './TajwidLegend.css'

export default function TajwidLegend({ activeRules = [] }) {
  const [expanded, setExpanded] = useState(false)
  const rules = activeRules.length > 0
    ? activeRules
    : Object.entries(TAJWID_RULES).map(([key, r]) => ({ key, ...r }))

  return (
    <div className="tajwid-legend">
      <button
        className="legend-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <Info size={14} />
        <span>Règles de Tajwid</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {activeRules.length > 0 && (
          <span className="rules-count">{activeRules.length}</span>
        )}
      </button>

      {expanded && (
        <div className="legend-content">
          <div className="legend-grid">
            {rules.map(rule => (
              <div key={rule.key} className="legend-item">
                <span
                  className="legend-color"
                  style={{ background: rule.color }}
                />
                <div className="legend-info">
                  <div className="legend-names">
                    <span className="legend-name-fr">{rule.name}</span>
                    <span className="legend-name-ar">{rule.nameAr}</span>
                  </div>
                  <p className="legend-desc">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

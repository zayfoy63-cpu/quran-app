import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { TAJWEED_LEGEND } from '../utils/tajwid'
import './TajwidLegend.css'

export default function TajwidLegend() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="tajwid-legend">
      <button
        className="legend-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <Info size={14} />
        <span>Légende Tajwid — couleurs officielles alquran.cloud</span>
        <span className="rules-count">{TAJWEED_LEGEND.length} règles</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="legend-content">
          <div className="legend-grid">
            {TAJWEED_LEGEND.map(rule => (
              <div key={rule.group} className="legend-item">
                <span
                  className="legend-color"
                  style={{ background: rule.color }}
                />
                <div className="legend-info">
                  <div className="legend-names">
                    <span className="legend-name-fr">{rule.label}</span>
                    <span className="legend-name-ar">{rule.nameAr}</span>
                  </div>
                  <p className="legend-desc">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

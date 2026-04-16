import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { TAJWEED_LEGEND } from '../utils/tajwid'
import { getTajweedVerses, getSurahArabic } from '../services/quranApi'
import TajwidText from '../components/TajwidText'
import './TajwidPage.css'

export default function TajwidPage() {
  const [fatiha,     setFatiha]     = useState(null)
  const [tajweedMap, setTajweedMap] = useState({})

  useEffect(() => {
    getSurahArabic(1).then(setFatiha).catch(() => {})
    getTajweedVerses(1).then(setTajweedMap).catch(() => {})
  }, [])

  return (
    <div className="page tajwid-page">
      <div className="container">

        {/* Header */}
        <div className="tajwid-header">
          <Link to="/" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Accueil
          </Link>
          <div className="tajwid-title-block">
            <h1 className="tajwid-title-ar">أحكام التجويد</h1>
            <h2 className="tajwid-title-fr">Règles de Tajwid</h2>
            <p className="tajwid-subtitle">
              Couleurs officielles du Mushaf coloré de Dar Al-Ma'rifah (Beyrouth)
              et du Complexe du Roi Fahd (Médine) — narration Hafs an Asim.
            </p>
          </div>
        </div>

        {/* Rules grid — one card per group */}
        <div className="rules-grid">
          {TAJWEED_LEGEND.map((rule) => (
            <div
              key={rule.group}
              className="rule-card"
              style={{ '--rule-color': rule.color }}
            >
              <div className="rule-card-header">
                <span className="rule-dot" style={{ background: rule.color }} />
                <div>
                  <span className="rule-name-fr">{rule.label}</span>
                  <span className="rule-name-ar">{rule.nameAr}</span>
                </div>
              </div>
              <p className="rule-description">{rule.desc}</p>
            </div>
          ))}
        </div>

        {/* Live example: Al-Fatiha with real tajweed colours */}
        <div className="live-example-section">
          <h3 className="live-title">
            <BookOpen size={18} />
            Exemple en direct — Al-Fatiha
          </h3>
          <p className="live-subtitle">
            Texte Uthmani coloré avec les balises Tajwid officielles de l'API quran.com.
          </p>

          {!fatiha && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner" />
            </div>
          )}

          {fatiha && (
            <div className="live-verses">
              {fatiha.ayahs.map((ayah) => (
                <div key={ayah.number} className="live-verse">
                  <span className="live-verse-num">{ayah.numberInSurah}</span>
                  <span className="example-arabic" dir="rtl">
                    <TajwidText
                      html={tajweedMap[ayah.numberInSurah]}
                      plainText={ayah.text}
                    />
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Legend chips */}
          <div className="live-legend">
            {TAJWEED_LEGEND.map((rule) => (
              <span
                key={rule.group}
                className="legend-chip"
                style={{ borderColor: rule.color, color: rule.color }}
              >
                <span className="legend-chip-dot" style={{ background: rule.color }} />
                {rule.label.split(' — ')[0]}
              </span>
            ))}
          </div>

          <div className="live-cta">
            <Link to="/surah/1" className="btn btn-primary">
              Ouvrir Al-Fatiha avec le lecteur complet
            </Link>
            <Link to="/library" className="btn btn-outline">
              Choisir une sourate
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

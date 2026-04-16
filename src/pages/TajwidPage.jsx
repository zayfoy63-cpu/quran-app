import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { TAJWID_RULES, analyzeTajwid } from '../utils/tajwid'
import { getSurahArabic } from '../services/quranApi'
import './TajwidPage.css'

// Example verses for each rule
const RULE_EXAMPLES = {
  qalqala:  { text: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ', source: 'Al-Falaq 113:1' },
  madd:     { text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', source: 'Al-Fatiha 1:1' },
  ghunna:   { text: 'إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ', source: 'Al-Asr 103:2' },
  tafkhim:  { text: 'وَٱلضُّحَىٰ وَٱلَّيْلِ إِذَا سَجَىٰ', source: 'Ad-Duha 93:1-2' },
  idgham:   { text: 'مِن نَّعِيمٍ', source: 'At-Takathur 102:8' },
  ikhfa:    { text: 'مِن شَرِّ مَا خَلَقَ', source: 'Al-Falaq 113:2' },
  iqlab:    { text: 'أَنبِئُونِى بِأَسْمَآءِ', source: 'Al-Baqara 2:31' },
}

function ColoredText({ text }) {
  const parts = analyzeTajwid(text)
  return (
    <span className="example-arabic" dir="rtl">
      {parts.map((p, i) => (
        p.rule ? (
          <span
            key={i}
            style={{ color: TAJWID_RULES[p.rule]?.color, fontWeight: 700 }}
            title={TAJWID_RULES[p.rule]?.name}
          >
            {p.char}
          </span>
        ) : (
          <span key={i}>{p.char}</span>
        )
      ))}
    </span>
  )
}

export default function TajwidPage() {
  const [fatiha, setFatiha] = useState(null)

  useEffect(() => {
    getSurahArabic(1).then(setFatiha).catch(() => {})
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
              Le Tajwid est la science de la bonne récitation du Coran.
              Chaque couleur ci-dessous correspond à une règle de prononciation précise.
            </p>
          </div>
        </div>

        {/* Rules grid */}
        <div className="rules-grid">
          {Object.entries(TAJWID_RULES).map(([key, rule]) => {
            const example = RULE_EXAMPLES[key]
            return (
              <div key={key} className="rule-card" style={{ '--rule-color': rule.color }}>
                <div className="rule-card-header">
                  <span className="rule-dot" style={{ background: rule.color }} />
                  <div>
                    <span className="rule-name-fr">{rule.name}</span>
                    <span className="rule-name-ar">{rule.nameAr}</span>
                  </div>
                </div>
                <p className="rule-description">{rule.description}</p>
                {example && (
                  <div className="rule-example">
                    <ColoredText text={example.text} />
                    <span className="rule-source">{example.source}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Live example: Al-Fatiha */}
        <div className="live-example-section">
          <h3 className="live-title">
            <BookOpen size={18} />
            Exemple en direct — Al-Fatiha
          </h3>
          <p className="live-subtitle">
            Le texte ci-dessous est colorisé automatiquement selon les règles de Tajwid.
          </p>

          {!fatiha && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner" />
            </div>
          )}

          {fatiha && (
            <div className="live-verses">
              {fatiha.ayahs.map((ayah, i) => (
                <div key={ayah.number} className="live-verse">
                  <span className="live-verse-num">{ayah.numberInSurah}</span>
                  <ColoredText text={ayah.text} />
                </div>
              ))}
            </div>
          )}

          <div className="live-legend">
            {Object.entries(TAJWID_RULES).map(([key, rule]) => (
              <span key={key} className="legend-chip" style={{ borderColor: rule.color, color: rule.color }}>
                <span className="legend-chip-dot" style={{ background: rule.color }} />
                {rule.name}
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

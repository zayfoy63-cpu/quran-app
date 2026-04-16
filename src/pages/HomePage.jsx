import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Book, BarChart2, Mic, Repeat, Zap, ChevronRight, Star, BookOpen, Award } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getSurahList } from '../services/quranApi'
import './HomePage.css'

const FEATURES = [
  {
    icon: Book,
    title: 'Bibliothèque',
    desc: '114 sourates avec texte arabe, translittération et traduction française',
    link: '/library',
    color: '#1a6b3c',
  },
  {
    icon: Zap,
    title: 'Lecteur audio',
    desc: 'Récitation par Mishary Alafasy avec répétition verset par verset',
    link: '/surah/1',
    color: '#c9a84c',
  },
  {
    icon: Repeat,
    title: 'Mode Répétition',
    desc: 'Boucle intelligente : 2×, 3×, 5×, 10× avec pause configurable',
    link: '/surah/1?tab=repeat',
    color: '#9b59b6',
  },
  {
    icon: Mic,
    title: 'Correction Prononciation',
    desc: 'Lisez à voix haute et obtenez un score de précision en temps réel',
    link: '/surah/1?tab=pronounce',
    color: '#e74c3c',
  },
  {
    icon: BookOpen,
    title: 'Règles de Tajwid',
    desc: 'Visualisez les règles de tajwid avec code couleur sur le texte arabe',
    link: '/tajwid',
    color: '#3498db',
  },
  {
    icon: BarChart2,
    title: 'Suivi de progression',
    desc: 'Dashboard avec statistiques, historique des sessions et score global',
    link: '/progress',
    color: '#27ae60',
  },
]

const LEVEL_INFO = {
  beginner: { label: 'Débutant', color: '#27ae60', tip: 'Commencez par les courtes sourates de Juz Amma' },
  intermediate: { label: 'Intermédiaire', color: '#e67e22', tip: 'Approfondissez les règles de tajwid' },
  advanced: { label: 'Avancé', color: '#e74c3c', tip: 'Maîtrisez les longues sourates et perfectionnez votre récitation' },
}

export default function HomePage() {
  const { level, progress, getAveragePronunciationScore } = useApp()
  const [recentSurahs, setRecentSurahs] = useState([])
  const [allSurahs, setAllSurahs] = useState([])

  useEffect(() => {
    getSurahList().then(list => {
      setAllSurahs(list)
      if (progress.listenedSurahs.length > 0) {
        const recent = progress.listenedSurahs
          .slice(-3)
          .map(n => list.find(s => s.number === n))
          .filter(Boolean)
        setRecentSurahs(recent)
      }
    }).catch(() => {})
  }, [progress.listenedSurahs])

  const info = LEVEL_INFO[level]
  const avgScore = getAveragePronunciationScore()

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-pattern" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <Star size={14} fill="currentColor" />
            Niveau : {info.label}
          </div>
          <h1 className="hero-title">
            <span className="hero-arabic">تعلّم القرآن الكريم</span>
            <span className="hero-french">Apprendre le Saint Coran</span>
          </h1>
          <p className="hero-subtitle">
            Lisez, écoutez, et mémorisez avec correction de prononciation,
            règles de tajwid et suivi de progression personnalisé.
          </p>
          <div className="hero-cta">
            <Link to="/library" className="btn btn-gold btn-lg">
              <Book size={18} />
              Explorer la bibliothèque
            </Link>
            <Link to="/progress" className="btn btn-outline btn-lg">
              <BarChart2 size={18} />
              Ma progression
            </Link>
          </div>
          <p className="hero-level-tip">{info.tip}</p>
        </div>
      </section>

      <div className="container">
        {/* Stats bar */}
        <section className="stats-bar">
          <StatCard
            icon={<Book size={20} />}
            value={progress.listenedSurahs.length}
            label="Sourates écoutées"
            color="var(--primary)"
          />
          <StatCard
            icon={<Star size={20} />}
            value={progress.memorizedVerses.length}
            label="Versets mémorisés"
            color="var(--gold)"
          />
          <StatCard
            icon={<Mic size={20} />}
            value={avgScore ? `${avgScore}%` : '–'}
            label="Score prononciation"
            color="#e74c3c"
          />
          <StatCard
            icon={<Award size={20} />}
            value={progress.currentStreak}
            label="Jours consécutifs"
            color="#9b59b6"
          />
        </section>

        {/* Continue section */}
        {recentSurahs.length > 0 && (
          <section className="continue-section">
            <div className="section-header">
              <h2>Continuer l'apprentissage</h2>
              <Link to="/library" className="see-all">
                Voir tout <ChevronRight size={16} />
              </Link>
            </div>
            <div className="recent-surahs">
              {recentSurahs.map(surah => (
                <Link
                  key={surah.number}
                  to={`/surah/${surah.number}`}
                  className="recent-surah-card card"
                >
                  <div className="surah-num" style={{ background: 'var(--primary)' }}>
                    {surah.number}
                  </div>
                  <div className="surah-info">
                    <span className="surah-name-ar">{surah.name}</span>
                    <span className="surah-name-fr">{surah.englishNameTranslation}</span>
                  </div>
                  <ChevronRight size={16} className="surah-arrow" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Features grid */}
        <section className="features-section">
          <div className="section-header">
            <h2>Fonctionnalités</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map(({ icon: Icon, title, desc, link, color }) => (
              <Link key={title} to={link} className="feature-card card">
                <div className="feature-icon" style={{ background: `${color}18`, color }}>
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="feature-link">
                  Explorer <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recommended surahs by level */}
        <section className="recommended-section">
          <div className="section-header">
            <h2>Recommandé pour votre niveau</h2>
            <span className="level-badge" style={{ background: info.color }}>
              {info.label}
            </span>
          </div>
          <RecommendedSurahs level={level} surahs={allSurahs} />
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon" style={{ color, background: `${color}18` }}>
        {icon}
      </div>
      <div className="stat-value" style={{ color }}>{value || 0}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function RecommendedSurahs({ level, surahs }) {
  const ranges = {
    beginner: [112, 113, 114, 109, 108, 107, 106, 105, 104, 103, 102, 101],
    intermediate: [1, 2, 36, 55, 67, 78, 79, 80],
    advanced: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  }
  const numbers = ranges[level] || ranges.beginner
  const filtered = numbers.map(n => surahs.find(s => s.number === n)).filter(Boolean)

  if (filtered.length === 0) return (
    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div className="recommended-grid">
      {filtered.map(surah => (
        <Link
          key={surah.number}
          to={`/surah/${surah.number}`}
          className="rec-card card"
        >
          <div className="rec-num">{surah.number}</div>
          <div className="rec-info">
            <span className="rec-arabic">{surah.name}</span>
            <span className="rec-french">{surah.englishNameTranslation}</span>
            <span className="rec-verses">{surah.numberOfAyahs} versets</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

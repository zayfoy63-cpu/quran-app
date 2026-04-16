import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Settings, Palette, Type,
  Mic, Repeat, BookOpen, ZoomIn, ZoomOut, Eye
} from 'lucide-react'
import { getFullSurah } from '../services/quranApi'
import { useApp } from '../context/AppContext'
import AudioPlayer from '../components/AudioPlayer'
import VerseDisplay from '../components/VerseDisplay'
import TajwidLegend from '../components/TajwidLegend'
import PronunciationChecker from '../components/PronunciationChecker'
import RepetitionMode from '../components/RepetitionMode'
import './SurahPage.css'

const TABS = [
  { key: 'read',      label: 'Lecture',       icon: BookOpen },
  { key: 'repeat',    label: 'Répétition',     icon: Repeat   },
  { key: 'pronounce', label: 'Prononciation',  icon: Mic      },
]

export default function SurahPage() {
  const { number } = useParams()
  const [searchParams] = useSearchParams()
  const {
    markSurahListened, showTajwid, setShowTajwid,
    showTransliteration, setShowTransliteration,
    showTranslation, setShowTranslation,
    fontSize, setFontSize,
  } = useApp()

  const [surah,              setSurah]              = useState(null)
  const [loading,            setLoading]            = useState(true)
  const [error,              setError]              = useState(null)
  const [currentVerseIndex,  setCurrentVerseIndex]  = useState(0)
  const [activeTab,          setActiveTab]          = useState(() => {
    const t = searchParams.get('tab')
    return ['read', 'repeat', 'pronounce'].includes(t) ? t : 'read'
  })
  const [settingsOpen, setSettingsOpen] = useState(false)

  const verseRefs    = useRef({})
  const contentRef   = useRef(null)   // ref to surah-verses-col
  const isMobileRef  = useRef(false)

  // Detect mobile once on mount
  useEffect(() => {
    isMobileRef.current = window.innerWidth <= 900
  }, [])

  // Load surah
  useEffect(() => {
    setLoading(true)
    setError(null)
    setSurah(null)
    setCurrentVerseIndex(0)

    getFullSurah(number)
      .then(data => {
        setSurah(data)
        markSurahListened(data.number)
      })
      .catch(() => setError('Impossible de charger cette sourate. Vérifiez votre connexion.'))
      .finally(() => setLoading(false))
  }, [number])

  // ── Tab change: on mobile scroll content into view immediately ──────────────
  function handleTabChange(key) {
    setActiveTab(key)
    if (window.innerWidth <= 900 && contentRef.current) {
      setTimeout(() => {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }

  // ── Manual verse selection: scroll verse into view (desktop only) ───────────
  const handleVerseSelect = useCallback((verse) => {
    const idx = surah?.ayahs.findIndex(a => a.number === verse.number) ?? -1
    if (idx === -1) return
    setCurrentVerseIndex(idx)
    // On desktop only: scroll the clicked verse into view
    if (window.innerWidth > 900) {
      setTimeout(() => {
        verseRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    }
  }, [surah])

  // ── Audio auto-advance: update index WITHOUT scrolling ──────────────────────
  const handleVerseChange = useCallback((idx) => {
    setCurrentVerseIndex(idx)
    // No scrollIntoView here — prevents the "page change" effect on mobile
  }, [])

  const currentVerse = surah?.ayahs?.[currentVerseIndex]

  return (
    <div className="page surah-page">
      <div className="container">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="surah-page-header">
          <Link to="/library" className="back-btn btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Bibliothèque
          </Link>

          {surah && (
            <div className="surah-title-block">
              <h1 className="surah-page-name">{surah.name}</h1>
              <p className="surah-page-meta">
                {surah.englishNameTranslation} · {surah.numberOfAyahs} versets ·{' '}
                {surah.revelationType === 'Meccan' ? 'Mecquoise' : 'Médinoise'}
              </p>
            </div>
          )}

          <button
            className={`btn btn-ghost btn-sm settings-btn ${settingsOpen ? 'active' : ''}`}
            onClick={() => setSettingsOpen(o => !o)}
          >
            <Settings size={16} /> Paramètres
          </button>
        </div>

        {/* ── Settings ───────────────────────────────────────────────────── */}
        {settingsOpen && (
          <div className="settings-panel animate-fade-in">
            <div className="settings-row">
              <span className="settings-label"><Type size={14} /> Taille arabe</span>
              <div className="font-size-controls">
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setFontSize(Math.max(18, fontSize - 4))}>
                  <ZoomOut size={16} />
                </button>
                <span className="font-size-val">{fontSize}px</span>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setFontSize(Math.min(72, fontSize + 4))}>
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>
            <div className="settings-row">
              <span className="settings-label"><Eye size={14} /> Translittération</span>
              <ToggleSwitch value={showTransliteration} onChange={setShowTransliteration} />
            </div>
            <div className="settings-row">
              <span className="settings-label"><BookOpen size={14} /> Traduction</span>
              <ToggleSwitch value={showTranslation} onChange={setShowTranslation} />
            </div>
            <div className="settings-row">
              <span className="settings-label"><Palette size={14} /> Couleurs Tajwid</span>
              <ToggleSwitch value={showTajwid} onChange={setShowTajwid} />
            </div>
          </div>
        )}

        {/* ── Bismillah ──────────────────────────────────────────────────── */}
        {surah && surah.number !== 1 && surah.number !== 9 && (
          <div className="bismillah-banner">
            <span className="bismillah-text">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
          </div>
        )}

        {/* ── Tabs ───────────────────────────────────────────────────────── */}
        <div className="surah-tabs">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => handleTabChange(key)}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* ── Loading / Error ────────────────────────────────────────────── */}
        {loading && (
          <div className="surah-loading">
            <div className="loading-spinner-wrap">
              <div className="spinner large" />
              <p>Chargement de la sourate...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="surah-error">
            <p>{error}</p>
            <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        )}

        {/* ── Main layout ────────────────────────────────────────────────── */}
        {surah && !loading && (
          <div className="surah-layout">

            {/* Verses column (left / top on mobile) */}
            <div className="surah-verses-col" ref={contentRef}>

              {showTajwid && activeTab === 'read' && (
                <div className="mb-16">
                  <TajwidLegend />
                </div>
              )}

              {activeTab === 'read' && (
                <div className="verses-list">
                  {surah.ayahs.map((verse, i) => (
                    <div key={verse.number} ref={el => (verseRefs.current[i] = el)}>
                      <VerseDisplay
                        verse={verse}
                        surahNumber={surah.number}
                        isActive={i === currentVerseIndex}
                        onSelect={handleVerseSelect}
                        showTajwid={showTajwid}
                        showTransliteration={showTransliteration}
                        showTranslation={showTranslation}
                        fontSize={fontSize}
                        tajweedText={verse.tajweedText}
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'repeat' && (
                <RepetitionMode verses={surah.ayahs} surahNumber={surah.number} />
              )}

              {activeTab === 'pronounce' && (
                <PronunciationChecker verse={currentVerse} surahNumber={surah.number} />
              )}
            </div>

            {/* Player column (right on desktop, fixed bottom on mobile) */}
            <div className="surah-player-col">
              <div className="sticky-player">

                <AudioPlayer
                  verses={surah.ayahs}
                  currentIndex={currentVerseIndex}
                  onVerseChange={handleVerseChange}
                  autoPlay={false}
                />

                {/* Current verse preview — hidden on mobile (shown in AudioPlayer) */}
                {currentVerse && (
                  <div className="current-verse-preview desktop-only">
                    <div className="cvp-header">
                      <span className="cvp-label">Verset en cours</span>
                      <span className="cvp-num">{currentVerse.numberInSurah} / {surah.numberOfAyahs}</span>
                    </div>
                    <p className="cvp-arabic" dir="rtl">{currentVerse.text}</p>
                    {showTranslation && currentVerse.translation && (
                      <p className="cvp-translation">{currentVerse.translation}</p>
                    )}
                  </div>
                )}

                {/* Compact verse text shown on mobile inside fixed bar */}
                {currentVerse && (
                  <div className="cvp-mobile mobile-only">
                    <span className="cvp-mobile-num">{currentVerse.numberInSurah}/{surah.numberOfAyahs}</span>
                    <p className="cvp-mobile-text" dir="rtl">{currentVerse.text}</p>
                  </div>
                )}

                {/* Jump to verse — desktop only */}
                <div className="jump-to-verse desktop-only">
                  <label className="jump-label">Aller au verset :</label>
                  <div className="jump-controls">
                    <input
                      type="number"
                      className="jump-input"
                      min="1"
                      max={surah.numberOfAyahs}
                      value={currentVerseIndex + 1}
                      onChange={e => {
                        const v = parseInt(e.target.value) - 1
                        if (v >= 0 && v < surah.ayahs.length) setCurrentVerseIndex(v)
                      }}
                    />
                    <span className="jump-total">/ {surah.numberOfAyahs}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ToggleSwitch({ value, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-track"><span className="toggle-thumb" /></span>
    </label>
  )
}

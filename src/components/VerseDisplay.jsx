import React, { useState } from 'react'
import { CheckCircle, BookOpen, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import TajwidText from './TajwidText'
import './VerseDisplay.css'

export default function VerseDisplay({
  verse,
  surahNumber,
  isActive = false,
  onSelect,
  showTajwid,
  showTransliteration,
  showTranslation,
  fontSize = 32,
  tajweedText,
}) {
  const { isVerseMemorized, markVerseMemorized, level } = useApp()
  const [expanded, setExpanded] = useState(false)

  if (!verse) return null

  const memorized = isVerseMemorized(surahNumber, verse.numberInSurah)

  const isBismillah = verse.numberInSurah === 1 && verse.text?.startsWith('بِسْمِ')

  return (
    <div
      className={`verse-card ${isActive ? 'active' : ''} ${memorized ? 'memorized' : ''}`}
      onClick={() => onSelect?.(verse)}
    >
      {/* Verse header */}
      <div className="verse-header">
        <div className="verse-number-badge">
          <span>{verse.numberInSurah}</span>
        </div>

        <div className="verse-actions">
          {memorized && (
            <span className="memorized-badge" title="Mémorisé">
              <Star size={14} fill="currentColor" />
            </span>
          )}
          <button
            className={`btn btn-sm ${memorized ? 'btn-gold' : 'btn-outline'}`}
            onClick={(e) => {
              e.stopPropagation()
              markVerseMemorized(surahNumber, verse.numberInSurah)
            }}
            title={memorized ? 'Mémorisé' : 'Marquer comme mémorisé'}
          >
            <CheckCircle size={14} />
            {memorized ? 'Mémorisé' : 'Mémoriser'}
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <div
        className="verse-arabic"
        style={{ '--user-font-size': `${fontSize}px` }}
        dir="rtl"
      >
        {showTajwid ? (
          <TajwidText html={tajweedText} plainText={verse.text} />
        ) : (
          verse.text
        )}
      </div>

      {/* Transliteration */}
      {showTransliteration && verse.transliteration && (
        <div className="verse-transliteration">
          {verse.transliteration}
        </div>
      )}

      {/* Translation */}
      {showTranslation && verse.translation && (
        <div className="verse-translation">
          <span className="translation-label">
            <BookOpen size={12} />
            Traduction
          </span>
          <p>{verse.translation}</p>
        </div>
      )}

      {/* Verse number in Arabic numerals */}
      <div className="verse-footer">
        <span className="verse-global-num">
          Verset #{verse.number}
        </span>
        {isActive && (
          <span className="playing-indicator">
            <span />
            <span />
            <span />
            En lecture
          </span>
        )}
      </div>
    </div>
  )
}

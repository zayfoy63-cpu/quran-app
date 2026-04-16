import React, { useState, useEffect } from 'react'
import { Mic, MicOff, CheckCircle, XCircle, RefreshCw, Volume2 } from 'lucide-react'
import { useSpeechRecognition, computePronunciationScore } from '../hooks/useSpeechRecognition'
import { useApp } from '../context/AppContext'
import './PronunciationChecker.css'

function ScoreRing({ score }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#27ae60' : score >= 50 ? '#e67e22' : '#e74c3c'

  return (
    <div className="score-ring-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="50" y="50" textAnchor="middle" dy="0.4em" fontSize="20" fontWeight="700" fill={color}>
          {score}%
        </text>
      </svg>
      <p className="score-label" style={{ color }}>
        {score >= 80 ? 'Excellent !' : score >= 60 ? 'Bien !' : score >= 40 ? 'Continuez...' : 'Réessayez'}
      </p>
    </div>
  )
}

function WordComparison({ spoken, expected }) {
  const normalize = s => s.replace(/[\u064B-\u065F]/g, '').replace(/[أإآ]/g, 'ا').trim()
  const spokenWords = (spoken || '').split(/\s+/).map(normalize)
  const expectedWords = (expected || '').split(/\s+/).map(normalize)
  const maxLen = Math.max(spokenWords.length, expectedWords.length)

  return (
    <div className="word-comparison" dir="rtl">
      {Array.from({ length: maxLen }, (_, i) => {
        const exp = expectedWords[i] || ''
        const spo = spokenWords[i] || ''
        const match = exp === spo

        return (
          <span
            key={i}
            className={`cmp-word ${match ? 'match' : 'mismatch'}`}
            title={spo ? `Prononcé: "${spo}"` : 'Non prononcé'}
          >
            {exp}
          </span>
        )
      })}
    </div>
  )
}

export default function PronunciationChecker({ verse, surahNumber }) {
  const { isListening, transcript, error, supported, startListening, stopListening, setTranscript } = useSpeechRecognition()
  const { addPronunciationScore } = useApp()
  const [score, setScore] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    if (transcript && verse?.text) {
      const s = computePronunciationScore(transcript, verse.text)
      setScore(s)
      addPronunciationScore(surahNumber, verse.numberInSurah, s)
      setAttempts(prev => [...prev.slice(-4), { transcript, score: s, date: new Date() }])
    }
  }, [transcript])

  function handleStart() {
    setScore(null)
    setShowComparison(false)
    startListening('ar-SA')
  }

  function handleReset() {
    setScore(null)
    setTranscript('')
    setAttempts([])
    setShowComparison(false)
  }

  if (!supported) {
    return (
      <div className="pronunciation-checker unsupported">
        <XCircle size={24} />
        <p>La reconnaissance vocale n'est pas supportée par votre navigateur.<br />
          Utilisez Chrome ou Edge pour cette fonctionnalité.</p>
      </div>
    )
  }

  return (
    <div className="pronunciation-checker">
      <div className="checker-header">
        <h3>Correction de prononciation</h3>
        <span className="checker-lang-badge">عربي</span>
      </div>

      {/* Expected text */}
      {verse && (
        <div className="expected-text" dir="rtl">
          <p className="expected-label">Lisez ce verset à voix haute :</p>
          <p className="expected-arabic">{verse.text}</p>
          {verse.transliteration && (
            <p className="expected-transliteration">{verse.transliteration}</p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="checker-controls">
        {!isListening ? (
          <button
            className="btn btn-primary btn-lg mic-btn"
            onClick={handleStart}
          >
            <Mic size={20} />
            Commencer la lecture
          </button>
        ) : (
          <button
            className="btn btn-lg mic-btn listening"
            onClick={stopListening}
          >
            <MicOff size={20} />
            Arrêter
            <span className="mic-pulse" />
          </button>
        )}

        {(score !== null || attempts.length > 0) && (
          <button className="btn btn-ghost btn-sm" onClick={handleReset}>
            <RefreshCw size={14} />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Listening indicator */}
      {isListening && (
        <div className="listening-indicator">
          <div className="sound-waves">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p>Je vous écoute... Lisez en arabe.</p>
        </div>
      )}

      {error && (
        <div className="checker-error">{error}</div>
      )}

      {/* Results */}
      {score !== null && (
        <div className="checker-results animate-fade-in">
          <ScoreRing score={score} />

          {transcript && (
            <div className="transcript-display">
              <p className="transcript-label">Ce que vous avez dit :</p>
              <p className="transcript-text" dir="rtl">{transcript}</p>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowComparison(!showComparison)}
              >
                {showComparison ? 'Masquer' : 'Voir la comparaison mot par mot'}
              </button>
            </div>
          )}

          {showComparison && verse?.text && transcript && (
            <div className="comparison-panel">
              <p className="comparison-label">Comparaison (vert = correct, rouge = incorrect) :</p>
              <WordComparison spoken={transcript} expected={verse.text} />
            </div>
          )}
        </div>
      )}

      {/* History */}
      {attempts.length > 1 && (
        <div className="attempts-history">
          <p className="attempts-title">Historique :</p>
          <div className="attempts-list">
            {attempts.slice().reverse().map((a, i) => (
              <div key={i} className="attempt-item">
                <span className="attempt-num">#{attempts.length - i}</span>
                <div className="attempt-score-bar">
                  <div
                    className="attempt-score-fill"
                    style={{
                      width: `${a.score}%`,
                      background: a.score >= 80 ? '#27ae60' : a.score >= 50 ? '#e67e22' : '#e74c3c'
                    }}
                  />
                </div>
                <span className="attempt-score-val" style={{
                  color: a.score >= 80 ? '#27ae60' : a.score >= 50 ? '#e67e22' : '#e74c3c'
                }}>
                  {a.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

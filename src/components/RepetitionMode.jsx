import React, { useState, useEffect, useRef } from 'react'
import { Repeat, Play, Pause, StopCircle, Settings2, Clock } from 'lucide-react'
import { useAudio } from '../hooks/useAudio'
import './RepetitionMode.css'

const REPEAT_OPTIONS = [2, 3, 5, 10]
const PAUSE_OPTIONS = [
  { label: '0.5s', value: 500 },
  { label: '1s', value: 1000 },
  { label: '2s', value: 2000 },
  { label: '3s', value: 3000 },
]

export default function RepetitionMode({ verses = [], surahNumber }) {
  const { isPlaying, isLoading, loadAndPlay, stop, audioRef } = useAudio()
  const [active, setActive] = useState(false)
  const [selectedVerses, setSelectedVerses] = useState([])
  const [repeatCount, setRepeatCount] = useState(3)
  const [pauseDuration, setPauseDuration] = useState(1000)
  const [currentVerse, setCurrentVerse] = useState(null)
  const [currentRep, setCurrentRep] = useState(0)
  const [progress, setProgress] = useState({ verse: 0, rep: 0 })
  const [mode, setMode] = useState('verse') // 'verse' | 'word'
  const timerRef = useRef(null)
  const abortRef = useRef(false)

  useEffect(() => {
    return () => {
      abortRef.current = true
      stop()
      clearTimeout(timerRef.current)
    }
  }, [])

  function toggleVerseSelection(verse) {
    setSelectedVerses(prev =>
      prev.some(v => v.number === verse.number)
        ? prev.filter(v => v.number !== verse.number)
        : [...prev, verse]
    )
  }

  function selectRange(from, to) {
    const range = verses.slice(from, to + 1)
    setSelectedVerses(range)
  }

  async function startRepetition() {
    if (selectedVerses.length === 0) return
    abortRef.current = false
    setActive(true)

    const targets = [...selectedVerses]

    for (let vi = 0; vi < targets.length; vi++) {
      if (abortRef.current) break
      const verse = targets[vi]
      setCurrentVerse(verse)

      for (let rep = 0; rep < repeatCount; rep++) {
        if (abortRef.current) break
        setCurrentRep(rep + 1)
        setProgress({ verse: vi + 1, rep: rep + 1 })

        await playVerseAudio(verse.audio)
        if (abortRef.current) break

        if (rep < repeatCount - 1) {
          await delay(pauseDuration)
        }
      }

      if (vi < targets.length - 1 && !abortRef.current) {
        await delay(pauseDuration * 1.5)
      }
    }

    if (!abortRef.current) {
      setActive(false)
      setCurrentVerse(null)
      setCurrentRep(0)
    }
  }

  function playVerseAudio(url) {
    return new Promise((resolve) => {
      if (!url || abortRef.current) { resolve(); return }
      const audio = audioRef.current
      if (!audio) { resolve(); return }

      audio.src = url
      audio.load()

      const onEnd = () => {
        audio.removeEventListener('ended', onEnd)
        audio.removeEventListener('error', onEnd)
        resolve()
      }

      audio.addEventListener('ended', onEnd)
      audio.addEventListener('error', onEnd)
      audio.play().catch(onEnd)
    })
  }

  function delay(ms) {
    return new Promise(resolve => {
      if (abortRef.current) { resolve(); return }
      timerRef.current = setTimeout(resolve, ms)
    })
  }

  function stopRepetition() {
    abortRef.current = true
    stop()
    clearTimeout(timerRef.current)
    setActive(false)
    setCurrentVerse(null)
    setCurrentRep(0)
  }

  const totalRepetitions = selectedVerses.length * repeatCount

  return (
    <div className="repetition-mode">
      <div className="rep-header">
        <div className="rep-header-icon">
          <Repeat size={20} />
        </div>
        <div>
          <h3>Mode Répétition</h3>
          <p>Sélectionnez des versets et répétez-les autant de fois que vous le souhaitez</p>
        </div>
      </div>

      {/* Settings */}
      <div className="rep-settings">
        <div className="rep-setting-group">
          <Settings2 size={14} />
          <label>Répétitions par verset :</label>
          <div className="rep-options">
            {REPEAT_OPTIONS.map(n => (
              <button
                key={n}
                className={`rep-opt ${repeatCount === n ? 'active' : ''}`}
                onClick={() => setRepeatCount(n)}
                disabled={active}
              >
                {n}×
              </button>
            ))}
          </div>
        </div>

        <div className="rep-setting-group">
          <Clock size={14} />
          <label>Pause entre répétitions :</label>
          <div className="rep-options">
            {PAUSE_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                className={`rep-opt ${pauseDuration === value ? 'active' : ''}`}
                onClick={() => setPauseDuration(value)}
                disabled={active}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick select */}
      <div className="quick-select">
        <span className="quick-label">Sélection rapide :</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVerses(verses.slice(0, 5))} disabled={active}>5 premiers</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVerses(verses.slice(0, 10))} disabled={active}>10 premiers</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVerses(verses)} disabled={active}>Tous</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedVerses([])} disabled={active}>Aucun</button>
      </div>

      {/* Verse selector */}
      <div className="verse-selector">
        {verses.map((verse) => {
          const selected = selectedVerses.some(v => v.number === verse.number)
          const isCurrent = active && currentVerse?.number === verse.number
          return (
            <button
              key={verse.number}
              className={`verse-sel-btn ${selected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
              onClick={() => !active && toggleVerseSelection(verse)}
              title={verse.text?.slice(0, 40) + '...'}
            >
              {verse.numberInSurah}
              {isCurrent && <span className="current-dot" />}
            </button>
          )
        })}
      </div>

      {/* Summary */}
      <div className="rep-summary">
        <span>{selectedVerses.length} verset(s) sélectionné(s)</span>
        <span>→ {totalRepetitions} lectures au total</span>
      </div>

      {/* Active progress */}
      {active && currentVerse && (
        <div className="rep-progress animate-fade-in">
          <div className="rep-progress-info">
            <span>Verset {progress.verse}/{selectedVerses.length}</span>
            <span>Répétition {progress.rep}/{repeatCount}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${((progress.verse - 1) * repeatCount + progress.rep) / totalRepetitions * 100}%` }}
            />
          </div>
          <div className="rep-current-text" dir="rtl">
            {currentVerse.text}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="rep-controls">
        {!active ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={startRepetition}
            disabled={selectedVerses.length === 0}
          >
            <Play size={18} />
            Démarrer la répétition
          </button>
        ) : (
          <button className="btn btn-lg stop-btn" onClick={stopRepetition}>
            <StopCircle size={18} />
            Arrêter
          </button>
        )}
      </div>
    </div>
  )
}

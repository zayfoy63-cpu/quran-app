import React, { useState, useEffect } from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, RefreshCw, Loader
} from 'lucide-react'
import { useAudio } from '../hooks/useAudio'
import './AudioPlayer.css'

const REPEAT_OPTIONS = [1, 3, 5, 10]

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function AudioPlayer({
  verses = [],
  currentIndex = 0,
  onVerseChange,
  onVerseEnd,
  autoPlay = false,
}) {
  const {
    isPlaying, isLoading, currentTime, duration, volume, error,
    loadAndPlay, play, pause, toggle, seek, setVolumeLevel, stop,
  } = useAudio()

  const [repeatCount, setRepeatCount] = useState(1)
  const [autoNext, setAutoNext] = useState(true)
  const [currentRepeatDone, setCurrentRepeatDone] = useState(0)
  const [muted, setMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(1)

  const currentVerse = verses[currentIndex]

  useEffect(() => {
    if (!currentVerse?.audio) return
    const url = currentVerse.audio
    setCurrentRepeatDone(0)

    loadAndPlay(url, repeatCount, handleVerseEnd)
  }, [currentIndex, currentVerse?.audio])

  useEffect(() => {
    if (autoPlay && currentVerse?.audio) {
      loadAndPlay(currentVerse.audio, repeatCount, handleVerseEnd)
    }
  }, [autoPlay])

  function handleVerseEnd() {
    if (autoNext && currentIndex < verses.length - 1) {
      setTimeout(() => {
        onVerseChange?.(currentIndex + 1)
      }, 800)
    } else {
      onVerseEnd?.()
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      onVerseChange?.(currentIndex - 1)
    }
  }

  function handleNext() {
    if (currentIndex < verses.length - 1) {
      onVerseChange?.(currentIndex + 1)
    }
  }

  function handleRepeatChange(n) {
    setRepeatCount(n)
    if (currentVerse?.audio) {
      loadAndPlay(currentVerse.audio, n, handleVerseEnd)
    }
  }

  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seek(ratio * duration)
  }

  function handleToggleMute() {
    if (muted) {
      setVolumeLevel(prevVolume)
      setMuted(false)
    } else {
      setPrevVolume(volume)
      setVolumeLevel(0)
      setMuted(true)
    }
  }

  function handleVolumeChange(e) {
    const v = parseFloat(e.target.value)
    setVolumeLevel(v)
    setMuted(v === 0)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="audio-player">
      {error && (
        <div className="audio-error">
          <span>{error}</span>
        </div>
      )}

      {/* Verse info */}
      {currentVerse && (
        <div className="player-verse-info">
          <span className="verse-num-badge">
            {currentVerse.numberInSurah || currentIndex + 1}
          </span>
          <span className="verse-count-text">
            Verset {(currentVerse.numberInSurah || currentIndex + 1)} / {verses.length}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="player-progress" onClick={handleSeek}>
        <div className="player-progress-fill" style={{ width: `${progress}%` }} />
        <div className="player-progress-thumb" style={{ left: `${progress}%` }} />
      </div>

      <div className="player-times">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Main controls */}
      <div className="player-controls">
        <button
          className="ctrl-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          title="Verset précédent"
        >
          <SkipBack size={20} />
        </button>

        <button
          className="ctrl-btn play-btn"
          onClick={toggle}
          disabled={!currentVerse}
          title={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isLoading ? (
            <Loader size={24} className="spin" />
          ) : isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} />
          )}
        </button>

        <button
          className="ctrl-btn"
          onClick={handleNext}
          disabled={currentIndex >= verses.length - 1}
          title="Verset suivant"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Repeat options */}
      <div className="player-repeat">
        <Repeat size={14} className="repeat-icon" />
        <span className="repeat-label">Répéter :</span>
        <div className="repeat-btns">
          {REPEAT_OPTIONS.map(n => (
            <button
              key={n}
              className={`repeat-opt ${repeatCount === n ? 'active' : ''}`}
              onClick={() => handleRepeatChange(n)}
            >
              {n === 1 ? '1×' : `${n}×`}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-next & Volume */}
      <div className="player-bottom">
        <label className="auto-next-toggle">
          <input
            type="checkbox"
            checked={autoNext}
            onChange={e => setAutoNext(e.target.checked)}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <span>Auto suivant</span>
        </label>

        <div className="volume-control">
          <button className="ctrl-btn sm" onClick={handleToggleMute}>
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            className="volume-slider"
            min="0" max="1" step="0.05"
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  )
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'quran_app_data'

const defaultProgress = {
  listenedSurahs: [],
  memorizedVerses: [],
  pronunciationScores: [],
  sessions: [],
  totalListeningTime: 0,
  currentStreak: 0,
  lastStudyDate: null,
}

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('quran_dark_mode') === 'true'
  })

  const [level, setLevel] = useState(() => {
    return localStorage.getItem('quran_level') || 'beginner'
  })

  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress
    } catch {
      return defaultProgress
    }
  })

  const [currentSurah, setCurrentSurah] = useState(null)
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [showTajwid, setShowTajwid] = useState(true)
  const [showTransliteration, setShowTransliteration] = useState(true)
  const [showTranslation, setShowTranslation] = useState(true)
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('quran_font_size') || '32')
  })

  // Sync dark mode to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('quran_dark_mode', darkMode)
  }, [darkMode])

  // Save progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  // Save level
  useEffect(() => {
    localStorage.setItem('quran_level', level)
  }, [level])

  // Save font size
  useEffect(() => {
    localStorage.setItem('quran_font_size', fontSize)
    document.documentElement.style.setProperty('--font-arabic-size', `${fontSize}px`)
  }, [fontSize])

  const markSurahListened = useCallback((surahNumber) => {
    setProgress(prev => ({
      ...prev,
      listenedSurahs: [...new Set([...prev.listenedSurahs, surahNumber])],
    }))
  }, [])

  const markVerseMemorized = useCallback((surahNumber, verseNumber) => {
    const key = `${surahNumber}:${verseNumber}`
    setProgress(prev => ({
      ...prev,
      memorizedVerses: [...new Set([...prev.memorizedVerses, key])],
    }))
  }, [])

  const addPronunciationScore = useCallback((surahNumber, verseNumber, score) => {
    setProgress(prev => ({
      ...prev,
      pronunciationScores: [
        ...prev.pronunciationScores.slice(-99),
        { surahNumber, verseNumber, score, date: new Date().toISOString() },
      ],
    }))
  }, [])

  const addSession = useCallback((duration) => {
    const today = new Date().toDateString()
    setProgress(prev => {
      const lastDate = prev.lastStudyDate
      const streak = lastDate === new Date(Date.now() - 86400000).toDateString()
        ? prev.currentStreak + 1
        : lastDate === today ? prev.currentStreak : 1

      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(-29),
          { date: new Date().toISOString(), duration },
        ],
        totalListeningTime: prev.totalListeningTime + duration,
        currentStreak: streak,
        lastStudyDate: today,
      }
    })
  }, [])

  const isVerseMemorized = useCallback((surahNumber, verseNumber) => {
    return progress.memorizedVerses.includes(`${surahNumber}:${verseNumber}`)
  }, [progress.memorizedVerses])

  const isSurahListened = useCallback((surahNumber) => {
    return progress.listenedSurahs.includes(surahNumber)
  }, [progress.listenedSurahs])

  const getAveragePronunciationScore = useCallback(() => {
    if (progress.pronunciationScores.length === 0) return 0
    const sum = progress.pronunciationScores.reduce((acc, s) => acc + s.score, 0)
    return Math.round(sum / progress.pronunciationScores.length)
  }, [progress.pronunciationScores])

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      level, setLevel,
      progress,
      currentSurah, setCurrentSurah,
      currentVerseIndex, setCurrentVerseIndex,
      showTajwid, setShowTajwid,
      showTransliteration, setShowTransliteration,
      showTranslation, setShowTranslation,
      fontSize, setFontSize,
      markSurahListened,
      markVerseMemorized,
      addPronunciationScore,
      addSession,
      isVerseMemorized,
      isSurahListened,
      getAveragePronunciationScore,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

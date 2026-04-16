import { useState, useEffect, useRef, useCallback } from 'react'

export function useAudio() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [error, setError] = useState(null)
  const repeatCountRef = useRef(0)
  const targetRepeatRef = useRef(1)
  const onEndRef = useRef(null)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      repeatCountRef.current += 1
      if (repeatCountRef.current < targetRepeatRef.current) {
        // pause 600ms then replay
        setTimeout(() => {
          audio.currentTime = 0
          audio.play().catch(() => {})
        }, 600)
      } else {
        setIsPlaying(false)
        repeatCountRef.current = 0
        if (onEndRef.current) onEndRef.current()
      }
    }
    const handleCanPlay = () => setIsLoading(false)
    const handleWaiting = () => setIsLoading(true)
    const handleError = () => {
      setError('Impossible de charger le fichier audio.')
      setIsLoading(false)
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('error', handleError)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const loadAndPlay = useCallback((url, repeatTimes = 1, onEnd = null) => {
    const audio = audioRef.current
    if (!audio) return
    setError(null)
    setIsLoading(true)
    repeatCountRef.current = 0
    targetRepeatRef.current = repeatTimes
    onEndRef.current = onEnd

    audio.src = url
    audio.load()
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(e => {
        setError('Lecture impossible.')
        setIsLoading(false)
      })
  }, [])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio?.src) return
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {})
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    isPlaying ? pause() : play()
  }, [isPlaying, play, pause])

  const seek = useCallback((time) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
  }, [])

  const setVolumeLevel = useCallback((v) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = v
    setVolume(v)
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    repeatCountRef.current = 0
  }, [])

  const setRepeat = useCallback((times) => {
    targetRepeatRef.current = times
    repeatCountRef.current = 0
  }, [])

  return {
    isPlaying, isLoading, currentTime, duration, volume, error,
    loadAndPlay, play, pause, toggle, seek, setVolumeLevel, stop, setRepeat,
    audioRef,
  }
}

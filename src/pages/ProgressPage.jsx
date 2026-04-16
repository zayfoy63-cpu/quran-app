import React, { useEffect, useState } from 'react'
import {
  BarChart2, Award, Flame, BookOpen, Mic, Star,
  TrendingUp, Calendar, Clock, Target, Trophy, RefreshCw
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'
import { useApp } from '../context/AppContext'
import { getSurahList } from '../services/quranApi'
import './ProgressPage.css'

const COLORS = ['#1a6b3c', '#c9a84c', '#3498db', '#9b59b6', '#e74c3c']

function StatBox({ icon, label, value, sub, color = 'var(--primary)' }) {
  return (
    <div className="stat-box card">
      <div className="stat-box-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div className="stat-box-value" style={{ color }}>{value}</div>
      <div className="stat-box-label">{label}</div>
      {sub && <div className="stat-box-sub">{sub}</div>}
    </div>
  )
}

export default function ProgressPage() {
  const { progress, getAveragePronunciationScore } = useApp()
  const [surahs, setSurahs] = useState([])
  const avgScore = getAveragePronunciationScore()

  useEffect(() => {
    getSurahList().then(setSurahs).catch(() => {})
  }, [])

  // Session data for the last 7 days
  const sessionChartData = buildSessionChart(progress.sessions)
  const pronunciationChartData = buildPronunciationChart(progress.pronunciationScores)
  const memorizedBySurah = buildMemorizedBySurah(progress.memorizedVerses, surahs)
  const totalTime = formatDuration(progress.totalListeningTime)

  function handleReset() {
    if (window.confirm('Réinitialiser toute la progression ? Cette action est irréversible.')) {
      localStorage.removeItem('quran_app_data')
      window.location.reload()
    }
  }

  return (
    <div className="page progress-page">
      <div className="container">
        {/* Header */}
        <div className="progress-header">
          <div>
            <h1 className="page-title">
              <BarChart2 size={24} />
              Tableau de bord
            </h1>
            <p className="page-subtitle">Suivez votre progression dans l'apprentissage du Coran</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Réinitialiser">
            <RefreshCw size={14} />
            Réinitialiser
          </button>
        </div>

        {/* Top stats */}
        <div className="stats-grid">
          <StatBox
            icon={<BookOpen size={20} />}
            label="Sourates écoutées"
            value={progress.listenedSurahs.length}
            sub={`sur 114 (${Math.round(progress.listenedSurahs.length / 114 * 100)}%)`}
            color="var(--primary)"
          />
          <StatBox
            icon={<Star size={20} />}
            label="Versets mémorisés"
            value={progress.memorizedVerses.length}
            color="var(--gold)"
          />
          <StatBox
            icon={<Mic size={20} />}
            label="Score prononciation"
            value={avgScore ? `${avgScore}%` : '–'}
            sub={`${progress.pronunciationScores.length} essai(s)`}
            color="#e74c3c"
          />
          <StatBox
            icon={<Flame size={20} />}
            label="Série actuelle"
            value={`${progress.currentStreak}j`}
            sub="jours consécutifs"
            color="#e67e22"
          />
          <StatBox
            icon={<Clock size={20} />}
            label="Temps total"
            value={totalTime}
            color="#3498db"
          />
          <StatBox
            icon={<Calendar size={20} />}
            label="Sessions"
            value={progress.sessions.length}
            sub="sessions enregistrées"
            color="#9b59b6"
          />
        </div>

        {/* Charts row */}
        <div className="charts-row">
          {/* Sessions chart */}
          <div className="chart-card card">
            <div className="chart-header">
              <TrendingUp size={16} />
              <h3>Activité — 14 derniers jours</h3>
            </div>
            {sessionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={sessionChartData}>
                  <defs>
                    <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#sessionGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Commencez à écouter pour voir votre activité" />
            )}
          </div>

          {/* Pronunciation scores */}
          <div className="chart-card card">
            <div className="chart-header">
              <Mic size={16} />
              <h3>Scores de prononciation</h3>
            </div>
            {pronunciationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pronunciationChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                    formatter={(v) => [`${v}%`, 'Score']}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {pronunciationChartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.score >= 80 ? '#27ae60' : entry.score >= 50 ? '#e67e22' : '#e74c3c'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Utilisez la correction de prononciation pour voir vos scores" />
            )}
          </div>
        </div>

        {/* Overall progress ring + memorized by surah */}
        <div className="bottom-row">
          {/* Completion ring */}
          <div className="completion-card card">
            <div className="chart-header">
              <Target size={16} />
              <h3>Progression globale</h3>
            </div>
            <div className="completion-rings">
              <RingProgress
                label="Sourates"
                value={progress.listenedSurahs.length}
                max={114}
                color="#1a6b3c"
              />
              <RingProgress
                label="Prononciation"
                value={avgScore}
                max={100}
                color="#e74c3c"
                unit="%"
              />
            </div>
          </div>

          {/* Memorized surahs list */}
          <div className="memorized-card card">
            <div className="chart-header">
              <Trophy size={16} />
              <h3>Sourates écoutées</h3>
            </div>
            {progress.listenedSurahs.length === 0 ? (
              <EmptyChart message="Aucune sourate écoutée pour l'instant" />
            ) : (
              <div className="memorized-list">
                {progress.listenedSurahs.slice(-12).map(n => {
                  const s = surahs.find(s => s.number === n)
                  const versesDone = progress.memorizedVerses.filter(v => v.startsWith(`${n}:`)).length
                  return (
                    <div key={n} className="memorized-item">
                      <div className="memorized-num">{n}</div>
                      <div className="memorized-info">
                        <span className="memorized-arabic">{s?.name || '...'}</span>
                        {versesDone > 0 && (
                          <span className="memorized-verses">{versesDone} verset(s) mémorisé(s)</span>
                        )}
                      </div>
                      <div className="memorized-check">✓</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Last study date */}
        {progress.lastStudyDate && (
          <div className="last-study-bar">
            <Calendar size={14} />
            Dernière session : {new Date(progress.lastStudyDate).toLocaleDateString('fr-FR', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function RingProgress({ label, value, max, color, unit = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="ring-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="800" fill={color}>
          {value}{unit}
        </text>
        <text x="65" y="78" textAnchor="middle" fontSize="11" fill="var(--text-muted)">
          sur {max}{unit}
        </text>
      </svg>
      <p className="ring-label">{label}</p>
    </div>
  )
}

function EmptyChart({ message }) {
  return (
    <div className="empty-chart">
      <p>{message}</p>
    </div>
  )
}

// Helpers
function buildSessionChart(sessions) {
  const map = {}
  const now = Date.now()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 86400000)
    const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    map[key] = { date: key, sessions: 0 }
  }
  sessions.forEach(s => {
    const key = new Date(s.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    if (map[key]) map[key].sessions++
  })
  return Object.values(map)
}

function buildPronunciationChart(scores) {
  return scores.slice(-10).map((s, i) => ({
    name: `#${i + 1}`,
    score: s.score,
  }))
}

function buildMemorizedBySurah(memorizedVerses, surahs) {
  const map = {}
  memorizedVerses.forEach(v => {
    const [surahNum] = v.split(':')
    map[surahNum] = (map[surahNum] || 0) + 1
  })
  return Object.entries(map).map(([num, count]) => {
    const s = surahs.find(s => s.number === parseInt(num))
    return { name: s?.englishName || `S${num}`, count }
  }).slice(0, 8)
}

function formatDuration(seconds) {
  if (!seconds) return '0 min'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Book, CheckCircle, Filter, X, Grid, List } from 'lucide-react'
import { getSurahList } from '../services/quranApi'
import { useApp } from '../context/AppContext'
import './LibraryPage.css'

const REVELATION_LABELS = { Meccan: 'Mecquoise', Medinan: 'Médinoise' }
const JUZS = Array.from({ length: 30 }, (_, i) => i + 1)

function SurahCardGrid({ surah, listened, memorizedCount }) {
  return (
    <Link to={`/surah/${surah.number}`} className="surah-card-grid card">
      <div className="surah-card-number">
        <span>{surah.number}</span>
      </div>
      <div className="surah-card-body">
        <div className="surah-arabic">{surah.name}</div>
        <div className="surah-trans">{surah.englishNameTranslation}</div>
        <div className="surah-meta-row">
          <span className={`revelation-badge ${surah.revelationType === 'Meccan' ? 'meccan' : 'medinan'}`}>
            {REVELATION_LABELS[surah.revelationType]}
          </span>
          <span className="verse-count">{surah.numberOfAyahs} v.</span>
        </div>
      </div>
      {listened && (
        <CheckCircle size={16} className="listened-check" />
      )}
    </Link>
  )
}

function SurahCardList({ surah, listened, memorizedCount }) {
  return (
    <Link to={`/surah/${surah.number}`} className="surah-card-list card">
      <div className="surah-list-num">{surah.number}</div>
      <div className="surah-list-arabic">{surah.name}</div>
      <div className="surah-list-info">
        <span className="surah-list-trans">{surah.englishNameTranslation}</span>
        <span className="surah-list-sub">
          {REVELATION_LABELS[surah.revelationType]} · {surah.numberOfAyahs} versets
        </span>
      </div>
      <div className="surah-list-right">
        {listened && <CheckCircle size={14} className="listened-check-sm" />}
        <span className="surah-list-arrow">›</span>
      </div>
    </Link>
  )
}

export default function LibraryPage() {
  const { isSurahListened, progress } = useApp()
  const [surahs, setSurahs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'meccan' | 'medinan' | 'listened' | 'not-listened'
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  useEffect(() => {
    getSurahList()
      .then(setSurahs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return surahs.filter(s => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.number.toString().includes(q) ||
        s.name.includes(search)

      const listened = isSurahListened(s.number)
      const matchFilter =
        filter === 'all' ||
        (filter === 'meccan' && s.revelationType === 'Meccan') ||
        (filter === 'medinan' && s.revelationType === 'Medinan') ||
        (filter === 'listened' && listened) ||
        (filter === 'not-listened' && !listened)

      return matchSearch && matchFilter
    })
  }, [surahs, search, filter, isSurahListened])

  const listenedCount = progress.listenedSurahs.length

  return (
    <div className="page library-page">
      <div className="container">
        {/* Header */}
        <div className="library-header">
          <div>
            <h1 className="page-title">
              <Book size={24} />
              Bibliothèque des Sourates
            </h1>
            <p className="page-subtitle">
              {surahs.length > 0 && `${listenedCount} / ${surahs.length} sourates écoutées`}
            </p>
          </div>

          {/* Progress bar */}
          {surahs.length > 0 && (
            <div className="library-progress">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(listenedCount / 114) * 100}%` }}
                />
              </div>
              <span className="progress-pct">
                {Math.round((listenedCount / 114) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="library-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une sourate..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-chips">
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'meccan', label: 'Mecquoises' },
              { key: 'medinan', label: 'Médinoises' },
              { key: 'listened', label: 'Écoutées' },
              { key: 'not-listened', label: 'Non écoutées' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`filter-chip ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <Grid size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="results-count">
          {!loading && `${filtered.length} sourate(s)`}
        </div>

        {/* Loading */}
        {loading && (
          <div className="library-loading">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`skeleton ${viewMode === 'grid' ? 'skeleton-card' : 'skeleton-row'}`} />
            ))}
          </div>
        )}

        {/* Surah list */}
        {!loading && (
          <div className={viewMode === 'grid' ? 'surahs-grid' : 'surahs-list'}>
            {filtered.map(surah => {
              const listened = isSurahListened(surah.number)
              const memorizedCount = progress.memorizedVerses.filter(v =>
                v.startsWith(`${surah.number}:`)
              ).length

              return viewMode === 'grid' ? (
                <SurahCardGrid
                  key={surah.number}
                  surah={surah}
                  listened={listened}
                  memorizedCount={memorizedCount}
                />
              ) : (
                <SurahCardList
                  key={surah.number}
                  surah={surah}
                  listened={listened}
                  memorizedCount={memorizedCount}
                />
              )
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <Book size={48} />
            <p>Aucune sourate trouvée</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setFilter('all') }}>
              Réinitialiser la recherche
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

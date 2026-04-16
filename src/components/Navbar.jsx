import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Book, BarChart2, Home, Menu, X, Settings, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './Navbar.css'

const LEVEL_LABELS = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' }
const LEVEL_COLORS = { beginner: '#27ae60', intermediate: '#e67e22', advanced: '#e74c3c' }

export default function Navbar() {
  const { darkMode, setDarkMode, level, setLevel } = useApp()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [levelOpen, setLevelOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/library', label: 'Bibliothèque', icon: Book },
    { to: '/tajwid', label: 'Tajwid', icon: BookOpen },
    { to: '/progress', label: 'Progression', icon: BarChart2 },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M20 6 C14 12, 10 16, 10 22 C10 28, 14 32, 20 34 C26 32, 30 28, 30 22 C30 16, 26 12, 20 6Z"
                fill="currentColor" opacity="0.15"/>
              <text x="20" y="26" textAnchor="middle" fontSize="16" fill="currentColor"
                fontFamily="Amiri Quran, serif">ق</text>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-arabic">تعلّم القرآن</span>
            <span className="logo-french">Apprendre le Coran</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${isActive(to) ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="navbar-controls">
          {/* Level selector */}
          <div className="level-selector">
            <button
              className="level-btn"
              onClick={() => setLevelOpen(!levelOpen)}
              style={{ '--level-color': LEVEL_COLORS[level] }}
            >
              <span className="level-dot" style={{ background: LEVEL_COLORS[level] }} />
              {LEVEL_LABELS[level]}
            </button>
            {levelOpen && (
              <div className="level-dropdown">
                {Object.entries(LEVEL_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`level-option ${level === key ? 'active' : ''}`}
                    onClick={() => { setLevel(key); setLevelOpen(false) }}
                  >
                    <span className="level-dot" style={{ background: LEVEL_COLORS[key] }} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn btn-ghost btn-icon theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="btn btn-ghost btn-icon mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`mobile-nav-link ${isActive(to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <div className="mobile-level">
            {Object.entries(LEVEL_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`level-option ${level === key ? 'active' : ''}`}
                onClick={() => { setLevel(key); setMenuOpen(false) }}
              >
                <span className="level-dot" style={{ background: LEVEL_COLORS[key] }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

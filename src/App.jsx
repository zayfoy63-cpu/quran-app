import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import SurahPage from './pages/SurahPage'
import ProgressPage from './pages/ProgressPage'

export default function App() {
  return (
    <AppProvider>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/surah/:number" element={<SurahPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppProvider>
  )
}

function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: '16px',
      color: 'var(--text-muted)', textAlign: 'center', padding: '20px'
    }}>
      <div style={{ fontSize: '4rem', fontFamily: 'var(--font-arabic)' }}>٤٠٤</div>
      <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Page introuvable</h2>
      <p>Cette page n'existe pas.</p>
      <a href="/" className="btn btn-primary">Retour à l'accueil</a>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '24px 0',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.82rem',
      background: 'var(--bg-card)',
    }}>
      <div className="container">
        <p style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.2rem', marginBottom: '6px', color: 'var(--gold)' }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p>
          Application d'apprentissage du Coran · Audio par{' '}
          <strong style={{ color: 'var(--primary)' }}>Mishary Alafasy</strong> ·
          Données via <strong style={{ color: 'var(--primary)' }}>AlQuran Cloud API</strong>
        </p>
      </div>
    </footer>
  )
}

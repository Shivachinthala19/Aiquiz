import { useState } from 'react'
import Generator from './components/Generator'
import History from './components/History'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('generate')

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: '800',
          letterSpacing: '-0.06em',
          marginBottom: '1rem',
          lineHeight: '1',
          background: 'linear-gradient(to right, #ffffff, #818cf8, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Wiki<span style={{ fontStyle: 'italic', fontWeight: '900' }}>Quiz</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1.25rem',
          fontWeight: '500',
          letterSpacing: '0.02em',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Powered by Generative AI. Explore Wikipedia through interactive challenges.
        </p>
      </header>

      <div className="tabs">
        <div
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate Quiz
        </div>
        <div
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </div>
      </div>

      <main>
        {activeTab === 'generate' ? <Generator /> : <History />}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Powered by Google Gemini & LangChain
      </footer>
    </div>
  )
}

export default App

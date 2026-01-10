import { useState } from 'react'
import QuizView from './QuizView'

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"

export default function Generator() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)

    const handleGenerate = async () => {
        if (!url) return
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const response = await fetch(`${API_BASE}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || 'Failed to generate quiz')
            }

            const data = await response.json()
            setResult(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleGenerate()
        }
    }

    return (
        <div>
            <div className="glass-card">
                <h2 style={{ marginBottom: '1rem' }}>Enter Wikipedia URL</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="url"
                        placeholder="https://en.wikipedia.org/wiki/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button onClick={handleGenerate} disabled={loading || !url}>
                        {loading ? 'Generating...' : 'Generate Quiz'}
                    </button>
                </div>
                {error && <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</p>}
            </div>

            {loading && (
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ marginBottom: '1rem' }}></div>
                    <p>Analyzing article and crafting questions...</p>
                </div>
            )}

            {result && (
                <div className="glass-card" style={{ padding: '4rem' }}>
                    <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                        <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '1rem' }}>Article Processed</div>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to bottom, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {result.title}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '2', fontSize: '1.2rem', maxWidth: '750px', margin: '0 auto', fontWeight: '400' }}>{result.summary}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Intelligence Extract</h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {[...result.key_entities.people, ...result.key_entities.organizations].map((e, i) => (
                                    <span key={i} className="badge" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.6rem 1.2rem' }}>{e}</span>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--glass-border)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Semantic Map</h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {result.related_topics.map((t, i) => (
                                    <span key={i} className="badge" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#d8b4fe', padding: '0.6rem 1.2rem' }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--glass-border), transparent)', margin: '4rem 0' }} />

                    <QuizView quiz={result.quiz} />
                </div>
            )}
        </div>
    )
}

import { useState, useEffect } from 'react'
import QuizView from './QuizView'

const API_BASE = "http://localhost:8000"

export default function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedQuiz, setSelectedQuiz] = useState(null)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_BASE}/history`)
            const data = await response.json()
            setHistory(data)
        } catch (err) {
            console.error("Failed to fetch history", err)
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = async (id) => {
        try {
            const response = await fetch(`${API_BASE}/quiz/${id}`)
            const data = await response.json()
            setSelectedQuiz(data)
        } catch (err) {
            alert("Failed to fetch quiz details")
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm("Are you sure you want to delete this quiz?")) return

        try {
            const response = await fetch(`${API_BASE}/quiz/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                setHistory(history.filter(item => item.id !== id))
            } else {
                alert("Failed to delete quiz")
            }
        } catch (err) {
            console.error("Delete error:", err)
        }
    }

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading history...</div>

    return (
        <div>
            <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem' }}>Past Quizzes</h2>
                {history.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No quizzes generated yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '1rem' }}>Title</th>
                                    <th style={{ padding: '1rem' }}>Generated On</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: '600' }}>{item.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.url}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.75rem' }}>
                                            <button
                                                onClick={() => handleViewDetails(item.id)}
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, item.id)}
                                                style={{
                                                    background: 'var(--danger-glass)',
                                                    color: 'var(--danger)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.85rem',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedQuiz && (
                <div className="modal-overlay" onClick={() => setSelectedQuiz(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Quiz Details</h2>
                            <button onClick={() => setSelectedQuiz(null)} style={{ background: 'var(--danger)' }}>Close</button>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{ marginBottom: '0.5rem' }}>{selectedQuiz.title}</h1>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{selectedQuiz.summary}</p>
                        </div>

                        <QuizView quiz={selectedQuiz.quiz} />
                    </div>
                </div>
            )}
        </div>
    )
}

import { useState } from 'react'

export default function QuizView({ quiz }) {
    const [userAnswers, setUserAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    const handleSelect = (qIdx, option) => {
        if (submitted) return
        setUserAnswers({ ...userAnswers, [qIdx]: option })
    }

    const handleSubmit = () => {
        let newScore = 0
        quiz.forEach((q, idx) => {
            if (userAnswers[idx] === q.answer) {
                newScore++
            }
        })
        setScore(newScore)
        setSubmitted(true)
    }

    return (
        <div className="quiz-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Knowledge Check</h2>
                <span className="badge" style={{ background: 'var(--primary)', padding: '0.5rem 1rem' }}>{quiz.length} Questions</span>
            </div>
            {quiz.map((q, idx) => (
                <div key={idx} className="quiz-question" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    </div>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                        <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>Q{idx + 1}.</span> {q.question}
                    </p>

                    <div className="options">
                        {q.options.map((opt, oIdx) => {
                            const isSelected = userAnswers[idx] === opt
                            const isCorrect = submitted && opt === q.answer
                            const isWrong = submitted && isSelected && opt !== q.answer

                            let className = "option"
                            if (isSelected) className += " selected"
                            if (isCorrect) className += " correct"
                            if (isWrong) className += " wrong"

                            return (
                                <div
                                    key={oIdx}
                                    className={className}
                                    onClick={() => handleSelect(idx, opt)}
                                >
                                    {opt}
                                </div>
                            )
                        })}
                    </div>

                    {submitted && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--glass)', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                            <strong>Explanation:</strong> {q.explanation}
                        </div>
                    )}
                </div>
            ))}

            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem' }}
                    disabled={Object.keys(userAnswers).length < quiz.length}
                >
                    Submit Quiz
                </button>
            ) : (
                <div className="glass-card" style={{ marginTop: '2rem', textAlign: 'center', border: '2px solid var(--primary)' }}>
                    <h3>Quiz Complete!</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '800', margin: '1rem 0' }}>{score} / {quiz.length}</p>
                    <button onClick={() => { setSubmitted(false); setUserAnswers({}); }}>Retake Quiz</button>
                </div>
            )}
        </div>
    )
}

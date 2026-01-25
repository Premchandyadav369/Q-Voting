import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PARTY_LOGOS = {
    "TDP": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Telugu_Desam_Party_Flag.svg/60px-Telugu_Desam_Party_Flag.svg.png",
    "YSRCP": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YSR_Congress_Party_logo.svg/60px-YSR_Congress_Party_logo.svg.png",
    "JSP": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/JanaSena_Party_Logo.svg/60px-JanaSena_Party_Logo.svg.png",
    "BJP": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/60px-Bharatiya_Janata_Party_logo.svg.png",
    "INC": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_hand_logo.svg/60px-Indian_National_Congress_hand_logo.svg.png"
}

const PARTY_COLORS = {
    "TDP": "#FFEB3B",
    "YSRCP": "#1565C0",
    "JSP": "#E53935",
    "BJP": "#FF9933",
    "INC": "#00BCD4",
    "IND": "#9E9E9E"
}

function DualBallotPage({ session, mlaConstituency, mpConstituency, setVoteReceipt }) {
    const navigate = useNavigate()
    const [currentElection, setCurrentElection] = useState('MLA')
    const [mlaCandidates, setMlaCandidates] = useState([])
    const [mpCandidates, setMpCandidates] = useState([])
    const [selectedMlaCandidate, setSelectedMlaCandidate] = useState(null)
    const [selectedMpCandidate, setSelectedMpCandidate] = useState(null)
    const [mlaVoted, setMlaVoted] = useState(false)
    const [mpVoted, setMpVoted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [confirmModal, setConfirmModal] = useState(null)
    const [receipts, setReceipts] = useState({ mla: null, mp: null })

    useEffect(() => {
        loadCandidates()
    }, [mlaConstituency, mpConstituency])

    const loadCandidates = async () => {
        try {
            setLoading(true)
            const [mlaRes, mpRes] = await Promise.all([
                axios.get(`/api/voting/candidates/${mlaConstituency.id}`),
                axios.get(`/api/voting/candidates/${mpConstituency.id}`)
            ])
            setMlaCandidates(mlaRes.data.candidates || [])
            setMpCandidates(mpRes.data.candidates || [])
        } catch (err) {
            setError('Failed to load candidates')
        } finally {
            setLoading(false)
        }
    }

    const handleCastVote = async (electionType) => {
        const candidateId = electionType === 'MLA' ? selectedMlaCandidate : selectedMpCandidate

        if (!candidateId) {
            setError(`Please select a candidate for ${electionType}`)
            return
        }

        try {
            setSubmitting(true)
            setError(null)

            const response = await axios.post('/api/voting/cast', {
                session_id: session.session_id,
                candidate_id: candidateId,
                election_type: electionType
            })

            if (response.data.success) {
                if (electionType === 'MLA') {
                    setMlaVoted(true)
                    setReceipts(prev => ({ ...prev, mla: response.data.receipt_code }))
                    setConfirmModal(null)
                    if (!mpVoted) {
                        setCurrentElection('MP')
                    }
                } else {
                    setMpVoted(true)
                    setReceipts(prev => ({ ...prev, mp: response.data.receipt_code }))
                    setConfirmModal(null)
                }

                if (response.data.voting_complete) {
                    setVoteReceipt({ ...response.data, receipts })
                    navigate('/confirmation')
                }
            }
        } catch (err) {
            setError(err.response?.data?.detail || `Failed to cast ${electionType} vote`)
            setConfirmModal(null)
        } finally {
            setSubmitting(false)
        }
    }

    const currentCandidates = currentElection === 'MLA' ? mlaCandidates : mpCandidates
    const currentConstituency = currentElection === 'MLA' ? mlaConstituency : mpConstituency
    const selectedCandidate = currentElection === 'MLA' ? selectedMlaCandidate : selectedMpCandidate
    const setSelectedCandidate = currentElection === 'MLA' ? setSelectedMlaCandidate : setSelectedMpCandidate
    const hasVoted = currentElection === 'MLA' ? mlaVoted : mpVoted

    if (loading) {
        return (
            <div style={{ background: 'var(--bg-space)', minHeight: 'calc(100vh - 160px)', padding: '3rem 0' }}>
                <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>⏳</div>
                    <p style={{ color: 'var(--text-muted)' }}>Loading candidates...</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ background: 'var(--bg-space)', minHeight: 'calc(100vh - 160px)', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: '900px' }}>

                {/* Voting Progress Tabs */}
                <div style={{
                    display: 'flex', gap: '1rem', marginBottom: '2rem',
                    padding: '1rem', background: 'var(--bg-glass)',
                    border: '1px solid var(--glass-border)', borderRadius: '16px'
                }}>
                    <div
                        onClick={() => !mlaVoted && setCurrentElection('MLA')}
                        style={{
                            flex: 1, padding: '1.5rem', borderRadius: '12px',
                            cursor: mlaVoted ? 'default' : 'pointer',
                            background: currentElection === 'MLA' ? 'linear-gradient(135deg, #1e3a5f, #2b4d7a)' : 'transparent',
                            border: mlaVoted ? '2px solid var(--neon-green)' : currentElection === 'MLA' ? 'none' : '1px solid var(--glass-border)',
                            textAlign: 'center', transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{mlaVoted ? '✅' : '🏛️'}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>MLA VOTE</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {mlaVoted ? 'Completed' : mlaConstituency?.name}
                        </div>
                    </div>
                    <div
                        onClick={() => !mpVoted && setCurrentElection('MP')}
                        style={{
                            flex: 1, padding: '1.5rem', borderRadius: '12px',
                            cursor: mpVoted ? 'default' : 'pointer',
                            background: currentElection === 'MP' ? 'linear-gradient(135deg, #ff9933, #e67e22)' : 'transparent',
                            border: mpVoted ? '2px solid var(--neon-green)' : currentElection === 'MP' ? 'none' : '1px solid var(--glass-border)',
                            textAlign: 'center', transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{mpVoted ? '✅' : '🇮🇳'}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>MP VOTE</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {mpVoted ? 'Completed' : mpConstituency?.name}
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={{
                        marginBottom: '2rem', padding: '1rem 1.5rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--neon-red)',
                        borderRadius: '12px', color: 'var(--neon-red)',
                        display: 'flex', alignItems: 'center', gap: '12px'
                    }}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Current Election Ballot */}
                {!hasVoted ? (
                    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{
                            background: currentElection === 'MLA'
                                ? 'linear-gradient(135deg, #1e3a5f, #2b4d7a)'
                                : 'linear-gradient(135deg, #ff9933, #e67e22)',
                            padding: '2rem', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                                {currentElection === 'MLA' ? '🏛️' : '🇮🇳'}
                            </div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>
                                {currentElection} ELECTION
                            </h2>
                            <div style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: '0.5rem' }}>
                                {currentConstituency?.name}
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                {currentConstituency?.district} District
                            </div>
                        </div>

                        {/* Candidates */}
                        <div style={{ padding: '2rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', fontSize: '1rem', letterSpacing: '1px' }}>
                                SELECT YOUR CANDIDATE
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {currentCandidates.map(candidate => (
                                    <div
                                        key={candidate.id}
                                        onClick={() => setSelectedCandidate(candidate.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '1.25rem',
                                            background: selectedCandidate === candidate.id ? `${candidate.party_color}20` : 'var(--bg-glass)',
                                            border: selectedCandidate === candidate.id ? `2px solid ${candidate.party_color}` : '1px solid var(--glass-border)',
                                            borderRadius: '12px', cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: selectedCandidate === candidate.id ? `0 0 20px ${candidate.party_color}30` : 'none'
                                        }}
                                    >
                                        {/* Radio */}
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            border: `3px solid ${selectedCandidate === candidate.id ? candidate.party_color : 'var(--glass-border)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: selectedCandidate === candidate.id ? candidate.party_color : 'transparent',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            {selectedCandidate === candidate.id && (
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />
                                            )}
                                        </div>

                                        {/* Party Logo */}
                                        <div style={{
                                            width: '60px', height: '60px', borderRadius: '12px',
                                            background: candidate.party_color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {PARTY_LOGOS[candidate.party_short] ? (
                                                <img
                                                    src={PARTY_LOGOS[candidate.party_short]}
                                                    alt={candidate.party_short}
                                                    style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                                                    onError={(e) => { e.target.style.display = 'none' }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: '1.8rem' }}>{candidate.symbol}</span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                                                    {candidate.name}
                                                </div>
                                                {['TDP', 'JSP', 'BJP'].includes(candidate.party_short) && (
                                                    <span style={{
                                                        fontSize: '0.65rem', background: 'rgba(255, 235, 59, 0.2)',
                                                        color: '#FFD700', padding: '3px 8px', borderRadius: '4px',
                                                        border: '1px solid rgba(255, 215, 0, 0.3)', fontWeight: '800'
                                                    }}>KUTAMI 🤝</span>
                                                )}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {candidate.party}
                                            </div>
                                        </div>

                                        {/* Party Badge */}
                                        <div style={{
                                            padding: '0.5rem 1.25rem', borderRadius: '20px',
                                            background: candidate.party_color,
                                            color: ['TDP', 'BJP'].includes(candidate.party_short) ? '#000' : '#fff',
                                            fontWeight: '800', fontSize: '0.85rem'
                                        }}>
                                            {candidate.party_short}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setConfirmModal(currentElection)}
                                disabled={!selectedCandidate}
                                className="btn btn-primary btn-lg"
                                style={{
                                    marginTop: '2rem', width: '100%', padding: '1.2rem',
                                    borderRadius: '12px', fontSize: '1rem',
                                    background: selectedCandidate ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'var(--bg-glass)',
                                    boxShadow: selectedCandidate ? '0 0 30px rgba(34, 197, 94, 0.4)' : 'none',
                                    opacity: selectedCandidate ? 1 : 0.5
                                }}
                            >
                                ✓ CONFIRM {currentElection} VOTE
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✅</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-green)', marginBottom: '0.5rem' }}>
                            {currentElection} VOTE RECORDED
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Receipt: <span style={{ color: 'var(--neon-cyan)', fontFamily: 'monospace' }}>
                                {receipts[currentElection.toLowerCase()]}
                            </span>
                        </p>
                        {(!mlaVoted || !mpVoted) && (
                            <button
                                onClick={() => setCurrentElection(mlaVoted ? 'MP' : 'MLA')}
                                className="btn btn-primary btn-lg"
                                style={{ marginTop: '1.5rem' }}
                            >
                                Continue to {mlaVoted ? 'MP' : 'MLA'} Voting →
                            </button>
                        )}
                    </div>
                )}

                {/* Confirmation Modal */}
                {confirmModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, padding: '1rem'
                    }}>
                        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗳️</div>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                                    CONFIRM YOUR {confirmModal} VOTE
                                </h2>
                            </div>

                            {currentCandidates.find(c => c.id === selectedCandidate) && (
                                <div style={{
                                    padding: '1.5rem',
                                    background: `${currentCandidates.find(c => c.id === selectedCandidate).party_color}20`,
                                    border: `1px solid ${currentCandidates.find(c => c.id === selectedCandidate).party_color}`,
                                    borderRadius: '16px', marginBottom: '2rem', textAlign: 'center'
                                }}>
                                    <div style={{
                                        width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem',
                                        background: currentCandidates.find(c => c.id === selectedCandidate).party_color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {PARTY_LOGOS[currentCandidates.find(c => c.id === selectedCandidate).party_short] ? (
                                            <img
                                                src={PARTY_LOGOS[currentCandidates.find(c => c.id === selectedCandidate).party_short]}
                                                alt="" style={{ width: '55px', height: '55px', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '2.5rem' }}>
                                                {currentCandidates.find(c => c.id === selectedCandidate).symbol}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontWeight: '700', fontSize: '1.3rem' }}>
                                        {currentCandidates.find(c => c.id === selectedCandidate).name}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)' }}>
                                        {currentCandidates.find(c => c.id === selectedCandidate).party}
                                    </div>
                                </div>
                            )}

                            <div style={{
                                padding: '1rem 1.5rem', background: 'rgba(251, 191, 36, 0.1)',
                                border: '1px solid var(--neon-yellow)', borderRadius: '12px',
                                marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px'
                            }}>
                                <span>⚠️</span>
                                <span style={{ fontSize: '0.9rem' }}>This vote cannot be changed after submission.</span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="btn btn-secondary"
                                    disabled={submitting}
                                    style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}
                                >
                                    ← BACK
                                </button>
                                <button
                                    onClick={() => handleCastVote(confirmModal)}
                                    disabled={submitting}
                                    style={{
                                        flex: 2, padding: '1rem', borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                        border: 'none', color: 'white', fontFamily: 'var(--font-display)',
                                        fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
                                    }}
                                >
                                    {submitting ? '⏳ CASTING...' : '🗳️ CAST MY VOTE'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DualBallotPage

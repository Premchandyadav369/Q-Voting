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
                    // Switch to MP voting
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
            <div className="container">
                <div className="loading-container" style={{ minHeight: '400px' }}>
                    <div className="spinner"></div>
                    <span>Loading candidates...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Voting Progress */}
                <div style={{
                    display: 'flex', gap: '16px', marginBottom: '24px',
                    padding: '16px', background: 'var(--neutral-100)', borderRadius: '12px'
                }}>
                    <div
                        onClick={() => !mlaVoted && setCurrentElection('MLA')}
                        style={{
                            flex: 1, padding: '16px', borderRadius: '12px', cursor: mlaVoted ? 'default' : 'pointer',
                            background: currentElection === 'MLA' ? 'linear-gradient(135deg, #1e3a5f, #2b4d7a)' : 'white',
                            color: currentElection === 'MLA' ? 'white' : 'var(--neutral-800)',
                            border: mlaVoted ? '2px solid #22c55e' : '2px solid transparent',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>{mlaVoted ? '✅' : '🏛️'}</div>
                        <div style={{ fontWeight: '600' }}>MLA Vote</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            {mlaVoted ? 'Completed' : mlaConstituency?.name}
                        </div>
                    </div>
                    <div
                        onClick={() => !mpVoted && setCurrentElection('MP')}
                        style={{
                            flex: 1, padding: '16px', borderRadius: '12px', cursor: mpVoted ? 'default' : 'pointer',
                            background: currentElection === 'MP' ? 'linear-gradient(135deg, #ff9933, #e67e22)' : 'white',
                            color: currentElection === 'MP' ? 'white' : 'var(--neutral-800)',
                            border: mpVoted ? '2px solid #22c55e' : '2px solid transparent',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>{mpVoted ? '✅' : '🇮🇳'}</div>
                        <div style={{ fontWeight: '600' }}>MP Vote</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            {mpVoted ? 'Completed' : mpConstituency?.name}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Current Election Ballot */}
                {!hasVoted ? (
                    <div className="card">
                        <div className="card-header" style={{
                            background: currentElection === 'MLA'
                                ? 'linear-gradient(135deg, #1e3a5f, #2b4d7a)'
                                : 'linear-gradient(135deg, #ff9933, #e67e22)',
                            color: 'white', margin: '-24px -24px 24px', padding: '24px', borderRadius: '12px 12px 0 0'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                                    {currentElection === 'MLA' ? '🏛️' : '🇮🇳'}
                                </div>
                                <h2 style={{ margin: 0, color: 'white' }}>
                                    {currentElection} Election - {currentConstituency?.name}
                                </h2>
                                <div style={{ opacity: 0.8, marginTop: '4px' }}>
                                    {currentConstituency?.district} District
                                </div>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '16px' }}>Select Your Candidate</h3>

                        <div className="candidate-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {currentCandidates.map(candidate => (
                                <div
                                    key={candidate.id}
                                    onClick={() => setSelectedCandidate(candidate.id)}
                                    className={`candidate-card ${selectedCandidate === candidate.id ? 'selected' : ''}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        border: selectedCandidate === candidate.id ? `3px solid ${candidate.party_color}` : '2px solid var(--neutral-200)',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        background: selectedCandidate === candidate.id ? `${candidate.party_color}15` : 'white',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {/* Radio button */}
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        border: `3px solid ${selectedCandidate === candidate.id ? candidate.party_color : 'var(--neutral-300)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: selectedCandidate === candidate.id ? candidate.party_color : 'white'
                                    }}>
                                        {selectedCandidate === candidate.id && (
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
                                        )}
                                    </div>

                                    {/* Party logo/symbol */}
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
                                                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '2rem' }}>{candidate.symbol}</span>
                                        )}
                                    </div>

                                    {/* Candidate info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px' }}>
                                            {candidate.name}
                                        </div>
                                        <div style={{ color: 'var(--neutral-600)' }}>
                                            {candidate.party}
                                        </div>
                                        {candidate.votes_2024 > 0 && (
                                            <div style={{ fontSize: '12px', color: 'var(--neutral-500)', marginTop: '4px' }}>
                                                2024: {candidate.votes_2024.toLocaleString()} votes
                                            </div>
                                        )}
                                    </div>

                                    {/* Party badge */}
                                    <div style={{
                                        padding: '6px 16px', borderRadius: '20px',
                                        background: candidate.party_color,
                                        color: ['TDP', 'BJP'].includes(candidate.party_short) ? '#000' : '#fff',
                                        fontWeight: '600', fontSize: '14px'
                                    }}>
                                        {candidate.party_short}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setConfirmModal(currentElection)}
                            disabled={!selectedCandidate}
                            className="btn btn-success btn-lg"
                            style={{ marginTop: '24px', width: '100%' }}
                        >
                            ✓ Confirm {currentElection} Vote
                        </button>
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', background: '#f0fdf4' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
                        <h2 style={{ color: '#16a34a' }}>{currentElection} Vote Recorded!</h2>
                        <p style={{ color: 'var(--neutral-600)' }}>
                            Receipt: <strong>{receipts[currentElection.toLowerCase()]}</strong>
                        </p>
                        {!mlaVoted || !mpVoted ? (
                            <button
                                onClick={() => setCurrentElection(mlaVoted ? 'MP' : 'MLA')}
                                className="btn btn-primary btn-lg"
                                style={{ marginTop: '16px' }}
                            >
                                Continue to {mlaVoted ? 'MP' : 'MLA'} Voting →
                            </button>
                        ) : null}
                    </div>
                )}

                {/* Confirmation Modal */}
                {confirmModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.7)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, padding: '16px'
                    }}>
                        <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🗳️</div>
                                <h2>Confirm Your {confirmModal} Vote</h2>
                            </div>

                            {currentCandidates.find(c => c.id === selectedCandidate) && (
                                <div style={{
                                    padding: '20px',
                                    background: `${currentCandidates.find(c => c.id === selectedCandidate).party_color}20`,
                                    borderRadius: '12px', marginBottom: '24px'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 12px',
                                            background: currentCandidates.find(c => c.id === selectedCandidate).party_color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {PARTY_LOGOS[currentCandidates.find(c => c.id === selectedCandidate).party_short] ? (
                                                <img
                                                    src={PARTY_LOGOS[currentCandidates.find(c => c.id === selectedCandidate).party_short]}
                                                    alt="" style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: '2.5rem' }}>
                                                    {currentCandidates.find(c => c.id === selectedCandidate).symbol}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontWeight: '700', fontSize: '20px' }}>
                                            {currentCandidates.find(c => c.id === selectedCandidate).name}
                                        </div>
                                        <div style={{ color: 'var(--neutral-600)' }}>
                                            {currentCandidates.find(c => c.id === selectedCandidate).party}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="alert alert-warning" style={{ marginBottom: '24px' }}>
                                <span>⚠️</span>
                                <span>This vote cannot be changed after submission.</span>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="btn btn-secondary"
                                    disabled={submitting}
                                    style={{ flex: 1 }}
                                >
                                    ← Go Back
                                </button>
                                <button
                                    onClick={() => handleCastVote(confirmModal)}
                                    className="btn btn-success"
                                    disabled={submitting}
                                    style={{ flex: 2 }}
                                >
                                    {submitting ? '⏳ Casting Vote...' : '🗳️ CAST MY VOTE'}
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

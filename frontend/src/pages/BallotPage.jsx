import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CandidateCard from '../components/CandidateCard'

function BallotPage({ session, constituency, electionType, setVoteReceipt }) {
    const navigate = useNavigate()
    const [candidates, setCandidates] = useState([])
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [confirmVote, setConfirmVote] = useState(false)

    useEffect(() => {
        fetchCandidates()
    }, [constituency])

    const fetchCandidates = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/voting/candidates/${constituency.id}`)
            setCandidates(response.data.candidates || [])
        } catch (err) {
            setError('Failed to load candidates')
        } finally {
            setLoading(false)
        }
    }

    const handleCastVote = async () => {
        if (!selectedCandidate) {
            setError('Please select a candidate')
            return
        }

        try {
            setSubmitting(true)
            setError(null)

            const response = await axios.post('/api/voting/cast', {
                session_id: session.session_id,
                candidate_id: selectedCandidate
            })

            if (response.data.success) {
                setVoteReceipt(response.data)
                navigate('/confirmation')
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to cast vote')
            setConfirmVote(false)
        } finally {
            setSubmitting(false)
        }
    }

    const selectedCandidateInfo = candidates.find(c => c.id === selectedCandidate)

    return (
        <div className="container">
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 style={{ marginBottom: '8px' }}>🗳️ Cast Your Vote</h1>
                    <div className="badge badge-info" style={{ fontSize: '14px' }}>
                        {electionType} Election • Quantum Encrypted
                    </div>
                </div>

                {/* Constituency Info */}
                <div className="card" style={{
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, var(--primary-700), var(--primary-800))',
                    color: 'white'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>
                            Constituency
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '700', textTransform: 'capitalize' }}>
                            {constituency.name}
                        </div>
                        <div style={{ opacity: 0.8, marginTop: '4px', textTransform: 'capitalize' }}>
                            {constituency.district} District
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Candidates List */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <span>Loading candidates...</span>
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Select Your Candidate</h3>
                            <p style={{ margin: 0, color: 'var(--neutral-500)', fontSize: '14px' }}>
                                {candidates.length} candidates • Click to select
                            </p>
                        </div>

                        <div className="candidate-list">
                            {candidates.map(candidate => (
                                <CandidateCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    selected={selectedCandidate === candidate.id}
                                    onSelect={setSelectedCandidate}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Vote Confirmation */}
                {selectedCandidate && !confirmVote && (
                    <div style={{ marginTop: '24px' }}>
                        <button
                            className="btn btn-success btn-lg"
                            onClick={() => setConfirmVote(true)}
                            style={{ width: '100%' }}
                        >
                            ✓ Confirm Selection & Proceed
                        </button>
                    </div>
                )}

                {/* Final Confirmation Modal */}
                {confirmVote && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.7)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, padding: '16px'
                    }}>
                        <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🗳️</div>
                                <h2>Confirm Your Vote</h2>
                                <p style={{ color: 'var(--neutral-600)' }}>
                                    Please review your selection. This action cannot be undone.
                                </p>
                            </div>

                            {selectedCandidateInfo && (
                                <div style={{
                                    padding: '16px', background: 'var(--primary-50)',
                                    borderRadius: '12px', marginBottom: '24px'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                                            {selectedCandidateInfo.symbol || '👤'}
                                        </div>
                                        <div style={{ fontWeight: '600', fontSize: '18px', textTransform: 'capitalize' }}>
                                            {selectedCandidateInfo.name}
                                        </div>
                                        <div style={{ color: 'var(--neutral-600)', textTransform: 'capitalize' }}>
                                            {selectedCandidateInfo.party}
                                        </div>
                                        <div className="badge badge-info" style={{ marginTop: '8px' }}>
                                            {selectedCandidateInfo.party_short}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="alert alert-warning" style={{ marginBottom: '24px' }}>
                                <span>⚠️</span>
                                <span>
                                    Your vote will be encrypted with your quantum key and stored anonymously.
                                    Once cast, it cannot be changed.
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmVote(false)}
                                    disabled={submitting}
                                    style={{ flex: 1 }}
                                >
                                    ← Go Back
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={handleCastVote}
                                    disabled={submitting}
                                    style={{ flex: 2 }}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner" style={{ width: '20px', height: '20px' }}></span>
                                            Casting Vote...
                                        </>
                                    ) : (
                                        '🗳️ CAST MY VOTE'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="alert alert-info" style={{ marginTop: '24px' }}>
                    <span>ℹ️</span>
                    <div>
                        <strong>Voting Instructions</strong>
                        <ul style={{ margin: '8px 0 0', paddingLeft: '20px', fontSize: '14px' }}>
                            <li>Click on a candidate to select</li>
                            <li>Review your selection carefully</li>
                            <li>Press "Cast My Vote" to submit</li>
                            <li>Your vote is encrypted and anonymous</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BallotPage

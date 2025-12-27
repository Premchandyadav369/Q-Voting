import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function VoterAuth({ session, setSession, setSelectedConstituency, setElectionType }) {
    const navigate = useNavigate()
    const [step, setStep] = useState(session ? 2 : 1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Constituency selection state
    const [selectedElectionType, setSelectedElectionType] = useState('MLA')
    const [constituencies, setConstituencies] = useState([])
    const [selectedConstId, setSelectedConstId] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch constituencies when election type changes
    useEffect(() => {
        if (step === 2) {
            fetchConstituencies(selectedElectionType)
        }
    }, [step, selectedElectionType])

    const fetchConstituencies = async (type) => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/voting/constituencies/${type}`)
            setConstituencies(response.data.constituencies || [])
        } catch (err) {
            setError('Failed to load constituencies. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateSession = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await axios.post('/api/auth/session/create')
            setSession(response.data)
            setStep(2)
        } catch (err) {
            setError('Failed to create session. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSelectConstituency = async () => {
        if (!selectedConstId) {
            setError('Please select a constituency')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const response = await axios.post('/api/auth/session/select-constituency', {
                session_id: session.session_id,
                constituency_id: parseInt(selectedConstId),
                election_type: selectedElectionType
            })

            if (response.data.success) {
                setSelectedConstituency(response.data.constituency)
                setElectionType(selectedElectionType)
                navigate('/quantum')
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to select constituency')
        } finally {
            setLoading(false)
        }
    }

    const filteredConstituencies = constituencies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* Progress Steps */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        color: step >= 1 ? 'var(--primary-600)' : 'var(--neutral-400)'
                    }}>
                        <span style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: step >= 1 ? 'var(--primary-600)' : 'var(--neutral-200)',
                            color: step >= 1 ? 'white' : 'var(--neutral-500)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: '600'
                        }}>{step > 1 ? '✓' : '1'}</span>
                        <span style={{ fontWeight: step === 1 ? '600' : '400' }}>Create Session</span>
                    </div>
                    <div style={{ width: '40px', height: '2px', background: step > 1 ? 'var(--primary-600)' : 'var(--neutral-200)', alignSelf: 'center' }} />
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        color: step >= 2 ? 'var(--primary-600)' : 'var(--neutral-400)'
                    }}>
                        <span style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: step >= 2 ? 'var(--primary-600)' : 'var(--neutral-200)',
                            color: step >= 2 ? 'white' : 'var(--neutral-500)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: '600'
                        }}>2</span>
                        <span style={{ fontWeight: step === 2 ? '600' : '400' }}>Select Constituency</span>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Step 1: Create Session */}
                {step === 1 && (
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔐</div>
                        <h2 style={{ marginBottom: '8px' }}>Create Anonymous Session</h2>
                        <p style={{ color: 'var(--neutral-600)', marginBottom: '24px' }}>
                            Your voting session is completely anonymous.
                            No identification information is required or stored.
                        </p>
                        <div className="alert alert-info" style={{ textAlign: 'left' }}>
                            <span>ℹ️</span>
                            <span>
                                This simulation demonstrates quantum-secure voting.
                                No real voter data is collected.
                            </span>
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleCreateSession}
                            disabled={loading}
                            style={{ marginTop: '16px', width: '100%' }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ width: '20px', height: '20px' }}></span>
                                    Creating Session...
                                </>
                            ) : (
                                '🚀 Create Secure Session'
                            )}
                        </button>
                    </div>
                )}

                {/* Step 2: Select Constituency */}
                {step === 2 && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Select Your Constituency</h2>
                        </div>

                        {/* Election Type Toggle */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <button
                                className={`btn ${selectedElectionType === 'MLA' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setSelectedElectionType('MLA')}
                                style={{ flex: 1 }}
                            >
                                🏛️ MLA Election
                                <span style={{ display: 'block', fontSize: '12px', opacity: 0.8 }}>
                                    175 Constituencies
                                </span>
                            </button>
                            <button
                                className={`btn ${selectedElectionType === 'MP' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setSelectedElectionType('MP')}
                                style={{ flex: 1 }}
                            >
                                🇮🇳 MP Election
                                <span style={{ display: 'block', fontSize: '12px', opacity: 0.8 }}>
                                    25 Constituencies
                                </span>
                            </button>
                        </div>

                        {/* Search */}
                        <div className="form-group">
                            <label className="form-label">Search Constituency</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Type constituency or district name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Constituency List */}
                        <div className="form-group">
                            <label className="form-label">
                                Select Constituency ({filteredConstituencies.length} found)
                            </label>
                            {loading ? (
                                <div className="loading-container" style={{ padding: '24px' }}>
                                    <div className="spinner"></div>
                                    <span>Loading constituencies...</span>
                                </div>
                            ) : (
                                <select
                                    className="form-select"
                                    value={selectedConstId}
                                    onChange={(e) => setSelectedConstId(e.target.value)}
                                    size={8}
                                    style={{ height: 'auto' }}
                                >
                                    <option value="">-- Select a constituency --</option>
                                    {filteredConstituencies.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} ({c.district})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <button
                            className="btn btn-quantum btn-lg"
                            onClick={handleSelectConstituency}
                            disabled={loading || !selectedConstId}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Processing...' : '🔐 Proceed to Quantum Key Exchange'}
                        </button>
                    </div>
                )}

                {/* Session Info */}
                {session && (
                    <div style={{
                        marginTop: '24px', padding: '16px',
                        background: 'var(--neutral-50)', borderRadius: '8px',
                        fontSize: '14px', color: 'var(--neutral-600)'
                    }}>
                        <strong>Session ID:</strong> {session.session_id?.substring(0, 16)}...
                        <br />
                        <strong>Expires:</strong> {new Date(session.expires_at).toLocaleString()}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VoterAuth

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function DualVoterAuth({ session, setSession, setMlaConstituency, setMpConstituency }) {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // District and constituency selection
    const [districts, setDistricts] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [mlaConstituencies, setMlaConstituencies] = useState([])
    const [mpConstituencies, setMpConstituencies] = useState([])
    const [selectedMla, setSelectedMla] = useState('')
    const [selectedMp, setSelectedMp] = useState('')

    useEffect(() => {
        loadDistricts()
    }, [])

    const loadDistricts = async () => {
        try {
            const response = await axios.get('/api/auth/districts')
            setDistricts(response.data.districts || [])
        } catch (err) {
            console.error('Failed to load districts:', err)
        }
    }

    const handleCreateSession = async () => {
        if (!selectedDistrict) {
            setError('Please select your district')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const response = await axios.post('/api/auth/session/create', {
                district: selectedDistrict
            })

            setSession(response.data)
            setMlaConstituencies(response.data.mla_constituencies || [])
            setMpConstituencies(response.data.mp_constituencies || [])
            setStep(2)
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create session')
        } finally {
            setLoading(false)
        }
    }

    const handleSelectConstituencies = async () => {
        if (!selectedMla || !selectedMp) {
            setError('Please select both MLA and MP constituencies')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const response = await axios.post('/api/auth/session/select-constituencies', {
                session_id: session.session_id,
                mla_constituency_id: parseInt(selectedMla),
                mp_constituency_id: parseInt(selectedMp)
            })

            if (response.data.success) {
                setMlaConstituency(response.data.mla_constituency)
                setMpConstituency(response.data.mp_constituency)
                navigate('/quantum')
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to select constituencies')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Progress Steps */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
                    {[1, 2].map(s => (
                        <div key={s} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            color: step >= s ? 'var(--primary-600)' : 'var(--neutral-400)'
                        }}>
                            <span style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: step >= s ? 'var(--primary-600)' : 'var(--neutral-200)',
                                color: step >= s ? 'white' : 'var(--neutral-500)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px', fontWeight: '600'
                            }}>{step > s ? '✓' : s}</span>
                            <span style={{ fontWeight: step === s ? '600' : '400' }}>
                                {s === 1 ? 'Select District' : 'Select Constituencies'}
                            </span>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Step 1: Select District */}
                {step === 1 && (
                    <div className="card">
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🗳️</div>
                            <h2>Select Your District</h2>
                            <p style={{ color: 'var(--neutral-600)' }}>
                                You will vote for both MLA and MP in a single session
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">District</label>
                            <select
                                className="form-select"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                                <option value="">-- Select your district --</option>
                                {districts.map(d => (
                                    <option key={typeof d === 'string' ? d : d.name} value={typeof d === 'string' ? d : d.name}>
                                        {typeof d === 'string' ? d : d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="alert alert-info">
                            <span>ℹ️</span>
                            <span>Your district determines which MLA and MP constituencies you can vote in.</span>
                        </div>

                        <button
                            onClick={handleCreateSession}
                            disabled={loading || !selectedDistrict}
                            className="btn btn-primary btn-lg"
                            style={{ marginTop: '16px', width: '100%' }}
                        >
                            {loading ? '⏳ Creating Session...' : '🚀 Create Voting Session'}
                        </button>
                    </div>
                )}

                {/* Step 2: Select Both Constituencies */}
                {step === 2 && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Select Your Constituencies</h2>
                            <p style={{ margin: 0, color: 'var(--neutral-500)' }}>
                                District: <strong>{selectedDistrict}</strong>
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* MLA Selection */}
                            <div>
                                <div style={{
                                    padding: '16px', marginBottom: '16px',
                                    background: 'linear-gradient(135deg, #1e3a5f, #2b4d7a)',
                                    borderRadius: '12px', color: 'white', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2rem' }}>🏛️</div>
                                    <div style={{ fontWeight: '600' }}>MLA Election</div>
                                    <div style={{ fontSize: '12px', opacity: 0.8 }}>State Assembly</div>
                                </div>
                                <select
                                    className="form-select"
                                    value={selectedMla}
                                    onChange={(e) => setSelectedMla(e.target.value)}
                                    size={6}
                                    style={{ height: 'auto' }}
                                >
                                    <option value="">-- Select MLA Constituency --</option>
                                    {mlaConstituencies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* MP Selection */}
                            <div>
                                <div style={{
                                    padding: '16px', marginBottom: '16px',
                                    background: 'linear-gradient(135deg, #ff9933, #e67e22)',
                                    borderRadius: '12px', color: 'white', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2rem' }}>🇮🇳</div>
                                    <div style={{ fontWeight: '600' }}>MP Election</div>
                                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Lok Sabha</div>
                                </div>
                                <select
                                    className="form-select"
                                    value={selectedMp}
                                    onChange={(e) => setSelectedMp(e.target.value)}
                                    size={6}
                                    style={{ height: 'auto' }}
                                >
                                    <option value="">-- Select MP Constituency --</option>
                                    {mpConstituencies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSelectConstituencies}
                            disabled={loading || !selectedMla || !selectedMp}
                            className="btn btn-quantum btn-lg"
                            style={{ marginTop: '24px', width: '100%' }}
                        >
                            {loading ? '⏳ Processing...' : '🔐 Proceed to Quantum Key Exchange'}
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

export default DualVoterAuth

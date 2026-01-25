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
        <div style={{ background: 'var(--bg-space)', minHeight: 'calc(100vh - 160px)', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                {/* Progress Steps */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem' }}>
                    {[1, 2].map(s => (
                        <div key={s} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            opacity: step >= s ? 1 : 0.4
                        }}>
                            <div style={{
                                width: '50px', height: '50px', borderRadius: '50%',
                                background: step >= s ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                                border: step >= s ? 'none' : '2px solid var(--glass-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.2rem', fontWeight: '700', color: 'white',
                                boxShadow: step >= s ? 'var(--glow-cyan)' : 'none'
                            }}>
                                {step > s ? '✓' : s}
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: step === s ? '700' : '500' }}>
                                    {s === 1 ? 'SELECT DISTRICT' : 'SELECT CONSTITUENCIES'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {s === 1 ? 'Identity Verification' : 'MLA & MP Selection'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {error && (
                    <div style={{
                        marginBottom: '2rem', padding: '1rem 1.5rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--neon-red)',
                        borderRadius: '12px', color: 'var(--neon-red)',
                        display: 'flex', alignItems: 'center', gap: '12px',
                        fontFamily: 'var(--font-display)', fontSize: '0.9rem'
                    }}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Step 1: Select District */}
                {step === 1 && (
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{
                                fontSize: '5rem', marginBottom: '1.5rem',
                                animation: 'float 4s ease-in-out infinite'
                            }}>🗳️</div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                                SELECT YOUR DISTRICT
                            </h2>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                                You will vote for both MLA and MP representatives in a single secure quantum session
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block', marginBottom: '0.75rem',
                                fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                                color: 'var(--neon-cyan)', letterSpacing: '1px'
                            }}>
                                DISTRICT
                            </label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem 1.5rem',
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px', color: 'var(--text-main)',
                                    fontSize: '1rem', cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="">-- Select your district --</option>
                                {districts.map(d => (
                                    <option key={typeof d === 'string' ? d : d.name} value={typeof d === 'string' ? d : d.name}>
                                        {typeof d === 'string' ? d : d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{
                            padding: '1rem 1.5rem',
                            background: 'rgba(0, 212, 255, 0.05)',
                            border: '1px solid var(--neon-cyan)',
                            borderRadius: '12px', marginBottom: '2rem',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            fontSize: '0.9rem', color: 'var(--text-muted)'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                            <span>Your district determines which MLA and MP constituencies you can vote in.</span>
                        </div>

                        <button
                            onClick={handleCreateSession}
                            disabled={loading || !selectedDistrict}
                            className="btn btn-primary btn-lg"
                            style={{
                                width: '100%', padding: '1.2rem',
                                fontSize: '1rem', borderRadius: '12px',
                                opacity: (!selectedDistrict || loading) ? 0.5 : 1
                            }}
                        >
                            {loading ? '⏳ Creating Quantum Session...' : '🚀 CREATE VOTING SESSION'}
                        </button>
                    </div>
                )}

                {/* Step 2: Select Both Constituencies */}
                {step === 2 && (
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                                SELECT YOUR CONSTITUENCIES
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                District: <span style={{ color: 'var(--neon-cyan)', fontWeight: '600' }}>{selectedDistrict}</span>
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            {/* MLA Selection */}
                            <div>
                                <div style={{
                                    padding: '1.5rem', marginBottom: '1rem',
                                    background: 'linear-gradient(135deg, #1e3a5f, #2b4d7a)',
                                    borderRadius: '16px', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏛️</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>MLA Election</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>State Assembly</div>
                                </div>
                                <div style={{
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    maxHeight: '250px',
                                    overflowY: 'auto'
                                }}>
                                    {mlaConstituencies.map(c => (
                                        <div
                                            key={c.id}
                                            onClick={() => setSelectedMla(c.id)}
                                            style={{
                                                padding: '1rem 1.5rem',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid var(--glass-border)',
                                                background: selectedMla == c.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                                                borderLeft: selectedMla == c.id ? '3px solid var(--neon-cyan)' : '3px solid transparent',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{
                                                fontWeight: selectedMla == c.id ? '600' : '400',
                                                color: selectedMla == c.id ? 'var(--neon-cyan)' : 'var(--text-main)'
                                            }}>
                                                {c.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* MP Selection */}
                            <div>
                                <div style={{
                                    padding: '1.5rem', marginBottom: '1rem',
                                    background: 'linear-gradient(135deg, #ff9933, #e67e22)',
                                    borderRadius: '16px', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🇮🇳</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>MP Election</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Lok Sabha</div>
                                </div>
                                <div style={{
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    maxHeight: '250px',
                                    overflowY: 'auto'
                                }}>
                                    {mpConstituencies.map(c => (
                                        <div
                                            key={c.id}
                                            onClick={() => setSelectedMp(c.id)}
                                            style={{
                                                padding: '1rem 1.5rem',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid var(--glass-border)',
                                                background: selectedMp == c.id ? 'rgba(255, 153, 51, 0.1)' : 'transparent',
                                                borderLeft: selectedMp == c.id ? '3px solid #ff9933' : '3px solid transparent',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{
                                                fontWeight: selectedMp == c.id ? '600' : '400',
                                                color: selectedMp == c.id ? '#ff9933' : 'var(--text-main)'
                                            }}>
                                                {c.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSelectConstituencies}
                            disabled={loading || !selectedMla || !selectedMp}
                            className="btn btn-primary btn-lg"
                            style={{
                                width: '100%', padding: '1.2rem',
                                fontSize: '1rem', borderRadius: '12px',
                                background: 'var(--gradient-primary)',
                                opacity: (!selectedMla || !selectedMp || loading) ? 0.5 : 1
                            }}
                        >
                            {loading ? '⏳ Processing...' : '🔐 PROCEED TO QUANTUM KEY EXCHANGE'}
                        </button>
                    </div>
                )}

                {/* Session Info */}
                {session && (
                    <div style={{
                        marginTop: '2rem', padding: '1.5rem',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px', fontSize: '0.85rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)' }}>Session ID: </span>
                                <span style={{ color: 'var(--neon-cyan)', fontFamily: 'monospace' }}>
                                    {session.session_id?.substring(0, 16)}...
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: 'var(--neon-green)', animation: 'pulse 1.5s infinite'
                                }}></div>
                                <span style={{ color: 'var(--neon-green)', fontSize: '0.8rem' }}>ACTIVE</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DualVoterAuth

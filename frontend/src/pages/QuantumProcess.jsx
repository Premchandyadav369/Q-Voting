import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function QuantumProcess({ session, constituency, setQuantumResult }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [started, setStarted] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [simulateAttack, setSimulateAttack] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const steps = [
        { name: 'Initializing Quantum Channel', icon: '🔗', description: 'Preparing quantum communication channel' },
        { name: 'Generating Qubits', icon: '⚛️', description: 'Creating random qubits with polarization' },
        { name: 'Secure Transmission', icon: '📡', description: 'Transmitting through quantum channel' },
        { name: 'Measurement & Sifting', icon: '📏', description: 'Measuring and reconciling bases' },
        { name: 'Security Verification', icon: '🛡️', description: 'Checking for eavesdropping' },
        { name: 'Key Generation', icon: '🔑', description: 'Generating shared secret key' },
    ]

    const startQuantumKeyGeneration = async () => {
        try {
            setLoading(true)
            setStarted(true)
            setError(null)
            setCurrentStep(0)

            // Animate through steps
            for (let i = 0; i < steps.length; i++) {
                setCurrentStep(i)
                await new Promise(resolve => setTimeout(resolve, 600))
            }

            const response = await axios.post(
                `/api/auth/quantum/generate-key?session_id=${session.session_id}&simulate_attack=${simulateAttack}`
            )

            setResult(response.data)
            setQuantumResult(response.data)
            setCurrentStep(steps.length) // All complete

            if (response.data.channel_secure) {
                setTimeout(() => {
                    navigate('/ballot')
                }, 2500)
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Quantum key generation failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ background: 'var(--bg-space)', minHeight: 'calc(100vh - 160px)', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        fontSize: '4rem', marginBottom: '1rem',
                        animation: started ? 'pulse 1s infinite' : 'float 4s ease-in-out infinite'
                    }}>🔐</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                        QUANTUM KEY DISTRIBUTION
                    </h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                        Generating a secure quantum key using the BB84 protocol
                    </p>
                </div>

                {/* Constituency Info */}
                <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem', boxShadow: 'var(--glow-cyan)'
                        }}>🏛️</div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                                {constituency.name}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {constituency.district} • {constituency.election_type} Election
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <div style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(34, 197, 94, 0.1)',
                                border: '1px solid var(--neon-green)',
                                borderRadius: '20px', fontSize: '0.8rem',
                                color: 'var(--neon-green)', fontFamily: 'var(--font-display)'
                            }}>
                                SESSION ACTIVE
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
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

                {/* Quantum Steps Visualization */}
                <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {steps.map((step, i) => {
                            const isComplete = i < currentStep
                            const isActive = i === currentStep && loading
                            const isPending = i > currentStep

                            return (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '1rem',
                                    background: isActive ? 'rgba(0, 212, 255, 0.1)' : isComplete ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                                    border: isActive ? '1px solid var(--neon-cyan)' : '1px solid transparent',
                                    borderRadius: '12px',
                                    opacity: isPending ? 0.4 : 1,
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '12px',
                                        background: isComplete ? 'rgba(34, 197, 94, 0.2)' : isActive ? 'var(--bg-glass)' : 'var(--bg-glass)',
                                        border: isComplete ? '2px solid var(--neon-green)' : isActive ? '2px solid var(--neon-cyan)' : '1px solid var(--glass-border)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        animation: isActive ? 'pulse 1s infinite' : 'none'
                                    }}>
                                        {isComplete ? '✓' : step.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.9rem',
                                            color: isComplete ? 'var(--neon-green)' : isActive ? 'var(--neon-cyan)' : 'var(--text-main)'
                                        }}>
                                            {step.name}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {step.description}
                                        </div>
                                    </div>
                                    {isActive && (
                                        <div style={{
                                            width: '24px', height: '24px',
                                            borderRadius: '50%',
                                            border: '3px solid var(--neon-cyan)',
                                            borderTopColor: 'transparent',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Result Status */}
                {result && (
                    <div className="glass-card" style={{
                        marginBottom: '2rem', padding: '2rem',
                        borderLeft: result.channel_secure ? '4px solid var(--neon-green)' : '4px solid var(--neon-red)'
                    }}>
                        {result.channel_secure ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '3rem' }}>✅</div>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--neon-green)', marginBottom: '0.5rem' }}>
                                        QUANTUM CHANNEL SECURE
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Error rate: <span style={{ color: 'var(--neon-green)' }}>{(result.error_rate * 100).toFixed(2)}%</span> (below 11% threshold)
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', marginTop: '0.5rem' }}>
                                        🔄 Redirecting to ballot...
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '3rem' }}>🚨</div>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--neon-red)', marginBottom: '0.5rem' }}>
                                        EAVESDROPPING DETECTED
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Error rate: <span style={{ color: 'var(--neon-red)' }}>{(result.error_rate * 100).toFixed(2)}%</span> (above 11% threshold)
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--neon-yellow)', marginTop: '0.5rem' }}>
                                        The quantum channel may be compromised. Please try again.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                {!started && (
                    <>
                        {/* Attack Simulation Toggle */}
                        <div style={{
                            marginBottom: '1.5rem', padding: '1rem 1.5rem',
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid var(--neon-yellow)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                            <input
                                type="checkbox"
                                id="simulateAttack"
                                checked={simulateAttack}
                                onChange={(e) => setSimulateAttack(e.target.checked)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor="simulateAttack" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                                🎭 <strong>Simulate eavesdropping attack</strong> (for demonstration purposes)
                            </label>
                        </div>

                        <button
                            className="btn btn-primary btn-lg"
                            onClick={startQuantumKeyGeneration}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '1.5rem',
                                fontSize: '1.1rem', borderRadius: '12px',
                                background: 'var(--gradient-primary)'
                            }}
                        >
                            ⚛️ START QUANTUM KEY GENERATION
                        </button>
                    </>
                )}

                {result && !result.channel_secure && (
                    <button
                        className="btn btn-secondary btn-lg"
                        onClick={startQuantumKeyGeneration}
                        disabled={loading}
                        style={{ width: '100%', padding: '1.2rem', borderRadius: '12px' }}
                    >
                        🔄 RETRY KEY GENERATION
                    </button>
                )}

                {/* Info Box */}
                <div style={{
                    marginTop: '2rem', padding: '1.5rem',
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px'
                }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                HOW BB84 WORKS
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                The BB84 protocol uses quantum mechanics to detect any attempt to
                                intercept the key exchange. If an eavesdropper (Eve) tries to measure
                                the qubits, it introduces detectable errors above the 11% threshold,
                                ensuring your vote remains secure.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default QuantumProcess

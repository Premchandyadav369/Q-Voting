import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import QuantumSteps from '../components/QuantumSteps'

function QuantumProcess({ session, constituency, setQuantumResult }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [started, setStarted] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [simulateAttack, setSimulateAttack] = useState(false)

    const startQuantumKeyGeneration = async () => {
        try {
            setLoading(true)
            setStarted(true)
            setError(null)

            const response = await axios.post(
                `/api/auth/quantum/generate-key?session_id=${session.session_id}&simulate_attack=${simulateAttack}`
            )

            setResult(response.data)
            setQuantumResult(response.data)

            if (response.data.channel_secure) {
                // Wait a moment for user to see success, then proceed
                setTimeout(() => {
                    navigate('/ballot')
                }, 2000)
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Quantum key generation failed')
        } finally {
            setLoading(false)
        }
    }

    const getDefaultSteps = () => [
        { step: 1, name: 'Initializing Quantum Channel', description: 'Preparing quantum communication channel...', status: 'active' },
        { step: 2, name: 'Generating Quantum Bits', description: 'Creating random qubits with random polarization', status: '' },
        { step: 3, name: 'Secure Transmission', description: 'Transmitting qubits through quantum channel', status: '' },
        { step: 4, name: 'Measurement & Sifting', description: 'Measuring and reconciling bases', status: '' },
        { step: 5, name: 'Security Verification', description: 'Checking for eavesdropping', status: '' },
        { step: 6, name: 'Key Generation', description: 'Generating shared secret key', status: '' },
    ]

    return (
        <div className="container">
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ marginBottom: '8px' }}>🔐 Quantum Key Distribution</h1>
                    <p style={{ color: 'var(--neutral-600)' }}>
                        Generating a secure quantum key for your vote using the BB84 protocol
                    </p>
                </div>

                {/* Constituency Info */}
                <div className="card" style={{ marginBottom: '24px', background: 'var(--primary-50)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'var(--primary-600)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>🏛️</div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '18px' }}>{constituency.name}</div>
                            <div style={{ color: 'var(--neutral-600)' }}>
                                {constituency.district} • {constituency.election_type} Election
                            </div>
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

                {/* Quantum Steps Visualization */}
                <QuantumSteps steps={result?.protocol_steps || getDefaultSteps()} />

                {/* Result Status */}
                {result && (
                    <div style={{ marginTop: '24px' }}>
                        {result.channel_secure ? (
                            <div className="alert alert-success">
                                <span>✅</span>
                                <div>
                                    <strong>Quantum Channel Secure!</strong>
                                    <p style={{ margin: '4px 0 0' }}>
                                        Error rate: {(result.error_rate * 100).toFixed(2)}% (below 11% threshold)
                                    </p>
                                    <p style={{ margin: '4px 0 0', fontSize: '14px' }}>
                                        Redirecting to ballot...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-warning">
                                <span>⚠️</span>
                                <div>
                                    <strong>Eavesdropping Detected!</strong>
                                    <p style={{ margin: '4px 0 0' }}>
                                        Error rate: {(result.error_rate * 100).toFixed(2)}% (above 11% threshold)
                                    </p>
                                    <p style={{ margin: '4px 0 0', fontSize: '14px' }}>
                                        The quantum channel may be compromised. Please try again.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div style={{ marginTop: '24px' }}>
                    {!started && (
                        <>
                            {/* Attack Simulation Toggle (for demo) */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                marginBottom: '16px', padding: '12px',
                                background: 'var(--warning-light)', borderRadius: '8px'
                            }}>
                                <input
                                    type="checkbox"
                                    id="simulateAttack"
                                    checked={simulateAttack}
                                    onChange={(e) => setSimulateAttack(e.target.checked)}
                                />
                                <label htmlFor="simulateAttack" style={{ fontSize: '14px' }}>
                                    🎭 Simulate eavesdropping attack (for demonstration)
                                </label>
                            </div>

                            <button
                                className="btn btn-quantum btn-lg"
                                onClick={startQuantumKeyGeneration}
                                disabled={loading}
                                style={{ width: '100%' }}
                            >
                                ⚛️ Start Quantum Key Generation
                            </button>
                        </>
                    )}

                    {started && loading && (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <span>Generating quantum key...</span>
                        </div>
                    )}

                    {result && !result.channel_secure && (
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={startQuantumKeyGeneration}
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            🔄 Retry Key Generation
                        </button>
                    )}
                </div>

                {/* Info Box */}
                <div className="alert alert-info" style={{ marginTop: '24px' }}>
                    <span>ℹ️</span>
                    <div>
                        <strong>How BB84 Works</strong>
                        <p style={{ margin: '4px 0 0', fontSize: '14px' }}>
                            The BB84 protocol uses quantum mechanics to detect any attempt to
                            intercept the key exchange. If an eavesdropper (Eve) tries to measure
                            the qubits, it introduces detectable errors above the 11% threshold.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuantumProcess

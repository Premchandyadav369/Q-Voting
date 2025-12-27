import { useState } from 'react'
import axios from 'axios'

function AttackSimulator() {
    const [selectedAttack, setSelectedAttack] = useState('eve_intercept')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [history, setHistory] = useState(null)
    const [interceptRate, setInterceptRate] = useState(0.3)

    const attackTypes = [
        { id: 'eve_intercept', name: 'Eve Intercept-Resend', icon: '👁️', description: 'Eavesdropper intercepts and resends qubits' },
        { id: 'photon_number_split', name: 'Photon Splitting', icon: '💡', description: 'Exploits multi-photon pulses' },
        { id: 'replay', name: 'Replay Attack', icon: '🔄', description: 'Attempts to reuse captured votes' }
    ]

    const simulateAttack = async () => {
        try {
            setLoading(true)
            const params = selectedAttack === 'eve_intercept'
                ? { intercept_rate: interceptRate }
                : {}

            const response = await axios.post('/api/advanced/attacks/simulate', {
                attack_type: selectedAttack,
                parameters: params
            })
            setResult(response.data)
        } catch (err) {
            console.error('Attack simulation failed:', err)
        } finally {
            setLoading(false)
        }
    }

    const loadHistory = async () => {
        try {
            const response = await axios.get('/api/advanced/attacks/history')
            setHistory(response.data)
        } catch (err) {
            console.error('Failed to load history:', err)
        }
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '32px' }}>
                <h1>🛡️ Attack Simulation Lab</h1>
                <p style={{ color: 'var(--neutral-600)' }}>
                    Test how quantum cryptography protects against various attacks
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Attack Selection */}
                <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>Select Attack Type</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {attackTypes.map(attack => (
                            <div
                                key={attack.id}
                                onClick={() => setSelectedAttack(attack.id)}
                                style={{
                                    padding: '16px',
                                    border: `2px solid ${selectedAttack === attack.id ? 'var(--error)' : 'var(--neutral-200)'}`,
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    background: selectedAttack === attack.id ? 'var(--error-light)' : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '2rem' }}>{attack.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{attack.name}</div>
                                        <div style={{ fontSize: '14px', color: 'var(--neutral-600)' }}>
                                            {attack.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Eve Attack Parameters */}
                    {selectedAttack === 'eve_intercept' && (
                        <div style={{ marginTop: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Interception Rate: {(interceptRate * 100).toFixed(0)}%
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={interceptRate}
                                onChange={(e) => setInterceptRate(parseFloat(e.target.value))}
                                style={{ width: '100%' }}
                            />
                            <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>
                                Higher rate = more qubits intercepted = easier to detect
                            </div>
                        </div>
                    )}

                    <button
                        onClick={simulateAttack}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '24px', width: '100%', background: 'var(--error)' }}
                    >
                        {loading ? '⏳ Simulating...' : '⚔️ Launch Attack Simulation'}
                    </button>
                </div>

                {/* Attack Result */}
                <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>Attack Result</h3>

                    {!result ? (
                        <div style={{
                            padding: '48px', textAlign: 'center',
                            color: 'var(--neutral-400)', background: 'var(--neutral-50)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎯</div>
                            <div>Select an attack and click "Launch" to simulate</div>
                        </div>
                    ) : (
                        <div>
                            {/* Status Banner */}
                            <div style={{
                                padding: '24px',
                                borderRadius: '12px',
                                background: result.security_status === 'BLOCKED' ? 'var(--success-light)' : 'var(--error-light)',
                                marginBottom: '24px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
                                    {result.security_status === 'BLOCKED' ? '🛡️' : '⚠️'}
                                </div>
                                <div style={{
                                    fontSize: '24px', fontWeight: '700',
                                    color: result.security_status === 'BLOCKED' ? 'var(--success)' : 'var(--error)'
                                }}>
                                    {result.security_status}
                                </div>
                                <div style={{ color: 'var(--neutral-600)' }}>
                                    {result.result.detected_by_system ? 'Attack detected by quantum monitoring' : 'Attack went undetected'}
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                                    <span>Attack Type</span>
                                    <strong>{result.attack_name}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                                    <span>Error Rate</span>
                                    <strong>{result.result.error_rate}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                                    <span>Detection Threshold</span>
                                    <strong>11%</strong>
                                </div>
                            </div>

                            {/* Explanation */}
                            {result.result.details?.explanation && (
                                <div className="alert alert-info" style={{ marginTop: '16px' }}>
                                    <span>ℹ️</span>
                                    <span>{result.result.details.explanation}</span>
                                </div>
                            )}

                            {/* Countermeasure */}
                            {result.result.details?.countermeasure && (
                                <div className="alert alert-success" style={{ marginTop: '16px' }}>
                                    <span>🛡️</span>
                                    <span><strong>Countermeasure:</strong> {result.result.details.countermeasure}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Attack History */}
            <div className="card" style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3>Attack History & Statistics</h3>
                    <button onClick={loadHistory} className="btn btn-secondary btn-sm">
                        🔄 Load History
                    </button>
                </div>

                {history && (
                    <div>
                        <div className="stats-grid" style={{ marginBottom: '24px' }}>
                            <div className="stat-card">
                                <div className="stat-label">Total Attacks</div>
                                <div className="stat-value">{history.total_attacks}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Detected</div>
                                <div className="stat-value" style={{ color: 'var(--success)' }}>{history.detected}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Blocked</div>
                                <div className="stat-value" style={{ color: 'var(--success)' }}>{history.blocked}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Detection Rate</div>
                                <div className="stat-value">{history.detection_rate}%</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="alert alert-warning" style={{ marginTop: '24px' }}>
                <span>⚠️</span>
                <span>
                    <strong>Educational Purpose:</strong> This attack simulator demonstrates how quantum cryptography
                    (BB84 protocol) detects various security threats. In real systems, these attacks would be
                    logged and investigated.
                </span>
            </div>
        </div>
    )
}

export default AttackSimulator

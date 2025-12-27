import { useState, useEffect } from 'react'
import axios from 'axios'

function AuditTrail() {
    const [loading, setLoading] = useState(true)
    const [auditData, setAuditData] = useState(null)
    const [verifying, setVerifying] = useState(false)
    const [verificationResult, setVerificationResult] = useState(null)

    useEffect(() => {
        loadAuditChain()
    }, [])

    const loadAuditChain = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/advanced/audit/chain')
            setAuditData(response.data)
        } catch (err) {
            console.error('Failed to load audit chain:', err)
        } finally {
            setLoading(false)
        }
    }

    const verifyChain = async () => {
        try {
            setVerifying(true)
            const response = await axios.get('/api/advanced/audit/verify')
            setVerificationResult(response.data)
        } catch (err) {
            console.error('Verification failed:', err)
        } finally {
            setVerifying(false)
        }
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading-container" style={{ minHeight: '400px' }}>
                    <div className="spinner"></div>
                    <span>Loading audit chain...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '32px' }}>
                <h1>⛓️ Blockchain Audit Trail</h1>
                <p style={{ color: 'var(--neutral-600)' }}>
                    Immutable, cryptographically-linked record of all election activities
                </p>
            </div>

            {/* Chain Status */}
            <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--primary-800), var(--primary-700))', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ color: 'white', marginBottom: '8px' }}>Chain Integrity Status</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span className={`badge ${auditData?.chain_status?.valid ? 'badge-success' : 'badge-error'}`}>
                                {auditData?.chain_status?.valid ? '✓ VERIFIED' : '⚠ ALERT'}
                            </span>
                            <span style={{ opacity: 0.8 }}>
                                {auditData?.total_blocks} blocks in chain
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={verifyChain}
                        disabled={verifying}
                        className="btn btn-secondary"
                        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
                    >
                        {verifying ? '⏳ Verifying...' : '🔍 Verify Chain'}
                    </button>
                </div>

                {verificationResult && (
                    <div style={{
                        marginTop: '16px', padding: '16px',
                        background: verificationResult.status === 'VERIFIED' ? 'rgba(5,150,105,0.3)' : 'rgba(220,38,38,0.3)',
                        borderRadius: '8px'
                    }}>
                        <strong>{verificationResult.status}:</strong> {verificationResult.message}
                    </div>
                )}
            </div>

            {/* Chain Visualization */}
            <div className="card">
                <h3 style={{ marginBottom: '24px' }}>Audit Chain Blocks</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {auditData?.latest_entries?.map((entry, index) => (
                        <div key={entry.block_id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            {/* Chain Link Visualization */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: entry.action === 'SYSTEM_INIT' ? 'var(--quantum-purple)' :
                                        entry.action.includes('VOTE') ? 'var(--success)' :
                                            entry.action.includes('ATTACK') ? 'var(--warning)' : 'var(--primary-500)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: '600', fontSize: '14px'
                                }}>
                                    {index === 0 ? '🏁' : index + 1}
                                </div>
                                {index < auditData.latest_entries.length - 1 && (
                                    <div style={{ width: '2px', height: '40px', background: 'var(--neutral-300)' }} />
                                )}
                            </div>

                            {/* Block Content */}
                            <div style={{
                                flex: 1, padding: '16px',
                                background: 'var(--neutral-50)', borderRadius: '12px',
                                border: '1px solid var(--neutral-200)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span className={`badge ${entry.verified ? 'badge-success' : 'badge-warning'}`}>
                                        {entry.action}
                                    </span>
                                    <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--neutral-600)' }}>
                                    <div><strong>Block ID:</strong> {entry.block_id}</div>
                                    <div><strong>Data Hash:</strong> {entry.data_hash}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div className="card" style={{ marginTop: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>🔗 How Blockchain Audit Works</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '16px', background: 'var(--primary-50)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>1️⃣</div>
                        <strong>Action Logged</strong>
                        <p style={{ fontSize: '14px', color: 'var(--neutral-600)', margin: '8px 0 0' }}>
                            Every action (vote, session, attack) creates an audit entry
                        </p>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--primary-50)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>2️⃣</div>
                        <strong>Hash Chain</strong>
                        <p style={{ fontSize: '14px', color: 'var(--neutral-600)', margin: '8px 0 0' }}>
                            Each block contains the hash of the previous block
                        </p>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--primary-50)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>3️⃣</div>
                        <strong>Immutable</strong>
                        <p style={{ fontSize: '14px', color: 'var(--neutral-600)', margin: '8px 0 0' }}>
                            Any tampering breaks the chain and is immediately detected
                        </p>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--primary-50)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>4️⃣</div>
                        <strong>Privacy</strong>
                        <p style={{ fontSize: '14px', color: 'var(--neutral-600)', margin: '8px 0 0' }}>
                            Only hashes stored - no voter data in audit trail
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditTrail

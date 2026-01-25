import { Link } from 'react-router-dom'

function Confirmation({ receipt, onNewVote }) {
    return (
        <div style={{ background: 'var(--bg-space)', minHeight: 'calc(100vh - 160px)', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>

                {/* Success Animation */}
                <div style={{
                    width: '120px', height: '120px', margin: '0 auto 2rem',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                    border: '3px solid var(--neon-green)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '4rem',
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)'
                }}>
                    ✅
                </div>

                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: 'var(--neon-green)',
                    marginBottom: '0.5rem'
                }}>
                    VOTE SUCCESSFULLY CAST
                </h1>

                <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 3rem', fontSize: '1.1rem' }}>
                    Your vote has been securely recorded using quantum encryption.
                    Your identity is completely anonymous.
                </p>

                {/* Receipt Code */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '1px' }}>
                        YOUR ANONYMOUS RECEIPT CODE
                    </p>
                    <div style={{
                        padding: '1.5rem 2rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '2px dashed var(--neon-cyan)',
                        borderRadius: '12px',
                        fontFamily: 'monospace',
                        fontSize: '1.5rem',
                        letterSpacing: '3px',
                        color: 'var(--neon-cyan)',
                        marginBottom: '1rem'
                    }}>
                        {receipt.receipt_code}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Save this code for your records. It cannot identify your vote.
                    </p>
                </div>

                {/* Vote Details */}
                <div className="glass-card" style={{
                    padding: '1.5rem', marginBottom: '2rem',
                    borderLeft: '4px solid var(--neon-green)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem', boxShadow: 'var(--glow-green)'
                        }}>🔐</div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--neon-green)' }}>
                                QUANTUM ENCRYPTED
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Timestamp: {new Date(receipt.timestamp).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Guarantees */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', fontSize: '1rem' }}>
                        🛡️ SECURITY GUARANTEES
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎭</div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Anonymity</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Identity not linked to vote</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Integrity</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vote cannot be altered</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>No Duplication</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantum no-cloning theorem</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(0, 212, 255, 0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔑</div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Privacy</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantum-derived encryption</div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    <Link to="/" onClick={onNewVote} className="btn btn-primary btn-lg">
                        🏠 Return Home
                    </Link>
                    <Link to="/verify" className="btn btn-secondary btn-lg">
                        🔐 Verify Inclusion (ZK)
                    </Link>
                    <Link to="/dashboard" className="btn btn-secondary btn-lg">
                        📊 Live Dashboard
                    </Link>
                </div>

                {/* Session Destroyed Notice */}
                <div style={{
                    padding: '1rem 1.5rem', background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid var(--neon-cyan)', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '0.9rem', color: 'var(--text-muted)'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                    <span>
                        Your voting session has been automatically destroyed for security.
                        Create a new session to vote in a different constituency.
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Confirmation

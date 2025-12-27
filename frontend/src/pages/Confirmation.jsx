import { Link } from 'react-router-dom'

function Confirmation({ receipt, onNewVote }) {
    return (
        <div className="container">
            <div className="confirmation">
                <div className="confirmation-icon">✅</div>

                <h1 style={{ marginBottom: '8px', color: 'var(--success)' }}>
                    Vote Successfully Cast!
                </h1>

                <p style={{ color: 'var(--neutral-600)', maxWidth: '500px', margin: '0 auto 24px' }}>
                    Your vote has been securely recorded using quantum encryption.
                    Your identity is completely anonymous.
                </p>

                {/* Receipt Code */}
                <div style={{ marginBottom: '32px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>
                        Your Anonymous Receipt Code
                    </p>
                    <div className="confirmation-receipt">
                        {receipt.receipt_code}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--neutral-400)', marginTop: '8px' }}>
                        Save this code for your records. It cannot identify your vote.
                    </p>
                </div>

                {/* Vote Details */}
                <div className="card" style={{
                    maxWidth: '400px', margin: '0 auto 32px',
                    background: 'var(--success-light)', border: '2px solid var(--success)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'var(--success)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>🔐</div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '600', color: 'var(--success)' }}>
                                Quantum Encrypted
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--neutral-600)' }}>
                                Timestamp: {new Date(receipt.timestamp).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Info */}
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto 32px', textAlign: 'left' }}>
                    <h4 style={{ marginBottom: '16px' }}>🛡️ Security Guarantees</h4>
                    <ul style={{ paddingLeft: '20px', color: 'var(--neutral-600)' }}>
                        <li style={{ marginBottom: '8px' }}>
                            <strong>Anonymity:</strong> Your identity is not linked to your vote
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            <strong>Integrity:</strong> Your vote cannot be altered
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            <strong>No Duplication:</strong> Each vote is unique (no-cloning theorem)
                        </li>
                        <li>
                            <strong>Privacy:</strong> Vote content is encrypted with quantum-derived key
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" onClick={onNewVote} className="btn btn-primary btn-lg">
                        🏠 Return Home
                    </Link>
                    <Link to="/admin" className="btn btn-secondary btn-lg">
                        📊 View Results
                    </Link>
                </div>

                {/* Session Destroyed Notice */}
                <div className="alert alert-info" style={{ maxWidth: '500px', margin: '32px auto 0' }}>
                    <span>ℹ️</span>
                    <span>
                        Your voting session has been automatically destroyed for security.
                        You would need to create a new session to vote in a different constituency.
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Confirmation

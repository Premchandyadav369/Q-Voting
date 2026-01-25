import { useState } from 'react';
import axios from 'axios';

function ZKVerifyPortal() {
    const [receiptId, setReceiptId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!receiptId) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await axios.post('/api/security/verify', {
                receipt_hash: receiptId.trim().toUpperCase()
            });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification service unavailable. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'var(--bg-space)', minHeight: 'calc(100vh - 160px)', padding: '3rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        fontSize: '4rem', marginBottom: '1rem',
                        animation: 'glow-pulse 4s infinite'
                    }}>🔐</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1rem' }}>
                        CITIZEN TRUST LAYER
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Verify your vote's inclusion in the Global Immutable Ledger using Zero-Knowledge Mathematics.
                        Proof without revealing your choice.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>
                        VERIFY YOUR VOTE RECEIPT
                    </h3>

                    <form onSubmit={handleVerify}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block', color: 'var(--neon-cyan)',
                                fontSize: '0.85rem', marginBottom: '0.75rem',
                                letterSpacing: '1px'
                            }}>
                                RECEIPT ID (Format: QV-XXXX-XXXX-XXXX)
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Paste your 17-character receipt code here..."
                                value={receiptId}
                                onChange={(e) => setReceiptId(e.target.value)}
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: '1.2rem',
                                    padding: '1.25rem',
                                    textAlign: 'center',
                                    letterSpacing: '2px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--glass-border)',
                                    textTransform: 'uppercase'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', padding: '1.25rem' }}
                            disabled={loading || !receiptId}
                        >
                            {loading ? '⚛️ PERFORMING ZK-AUDIT...' : '🔍 VERIFY INCLUSION'}
                        </button>
                    </form>

                    {error && (
                        <div style={{
                            marginTop: '2rem', padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--neon-red)',
                            borderRadius: '12px', color: 'var(--neon-red)',
                            textAlign: 'center'
                        }}>
                            <span>❌ {error}</span>
                        </div>
                    )}

                    {result && result.verified && (
                        <div style={{
                            marginTop: '2.5rem',
                            padding: '2rem',
                            background: 'rgba(34, 197, 94, 0.05)',
                            border: '1px solid var(--neon-green)',
                            borderRadius: '16px',
                            animation: 'slide-up 0.5s ease-out',
                            boxShadow: '0 0 30px rgba(34, 197, 94, 0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
                                }}>✅</div>
                                <div>
                                    <h2 style={{ margin: 0, color: 'var(--neon-green)', fontSize: '1.5rem' }}>VOTE VERIFIED</h2>
                                    <div style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                                        STATUS: {result.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                {result.message}
                            </p>

                            <div style={{
                                background: 'rgba(0,0,0,0.4)',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>SEALED AT:</span>
                                    <span style={{ color: 'var(--white)', fontWeight: '600' }}>
                                        {new Date(result.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>LEDGER BLOCK:</span>
                                    <span style={{ color: 'var(--neon-cyan)', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                        {result.ledger_block}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                <div style={{
                                    display: 'inline-block', padding: '0.5rem 1rem',
                                    background: 'rgba(0, 212, 255, 0.1)',
                                    border: '1px solid var(--neon-cyan)',
                                    borderRadius: '20px', fontSize: '0.75rem',
                                    color: 'var(--neon-cyan)', letterSpacing: '1px'
                                }}>
                                    QUANTUM SEAL ACTIVE 🛡️
                                </div>
                            </div>
                        </div>
                    )}

                    {result && !result.verified && (
                        <div style={{
                            marginTop: '2.5rem',
                            padding: '2rem',
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid var(--neon-red)',
                            borderRadius: '16px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚨</div>
                            <h3 style={{ color: 'var(--neon-red)', marginBottom: '0.5rem' }}>VERIFICATION FAILED</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{result.message}</p>
                        </div>
                    )}
                </div>

                <div className="glass-card" style={{ marginTop: '3rem', padding: '2rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        HOW DOES ZK-VERIFICATION WORK?
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                        The system uses a <strong>Zero-Knowledge Proof</strong> scheme. When you vote, the system generates a
                        mathematical commitment that is stored on the Global Ledger. By providing your receipt ID, you are
                        verifying that this specific commitment exists in the "Audit Tree" of the election results without
                        revealing which candidate you voted for. This ensures <strong>Unlinkability</strong> while maintaining
                        <strong>Integrity</strong>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ZKVerifyPortal;

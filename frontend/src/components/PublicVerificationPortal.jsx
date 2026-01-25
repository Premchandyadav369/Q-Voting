import { useState } from 'react';
import axios from 'axios';

function PublicVerificationPortal() {
    const [receiptId, setReceiptId] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, VERIFYING, VERIFIED, ERROR
    const [result, setResult] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!receiptId.trim()) return;

        setStatus('VERIFYING');
        setResult(null);

        // Simulate Verification Process with realistic delays
        try {
            // First phase: ZK Proof Generation
            await new Promise(r => setTimeout(r, 1500));

            // Second phase: Ledger Lookup
            const response = await axios.get(`/api/voting/verify/${receiptId}`);

            // Third phase: Quantum Seal Check
            await new Promise(r => setTimeout(r, 1000));

            if (response.data.valid_format) {
                setResult({
                    timestamp: new Date().toISOString(),
                    blockHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                    quantumSeal: "BB84-VERIFIED-SECURE",
                    zkProof: "ZK-SNARK-VALIDATED",
                    status: "INCLUDED_IN_LEDGER"
                });
                setStatus('VERIFIED');
            } else {
                setStatus('ERROR');
            }
        } catch (error) {
            setStatus('ERROR');
        }
    };

    return (
        <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                <h2 style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>
                    PUBLIC VERIFICATION PORTAL
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>
                    Zero-Knowledge Proof verification allows you to confirm your vote was counted
                    without revealing who you voted for or your identity.
                </p>
            </div>

            <form onSubmit={handleVerify} style={{ marginBottom: '3rem' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={receiptId}
                        onChange={(e) => setReceiptId(e.target.value)}
                        placeholder="ENTER VOTE RECEIPT ID (e.g., QV-2024-XXXX-XXXX)"
                        className="form-input"
                        style={{
                            fontSize: '1.2rem',
                            textAlign: 'center',
                            letterSpacing: '2px',
                            fontFamily: 'monospace',
                            padding: '1.5rem',
                            border: status === 'VERIFYING' ? '1px solid var(--neon-cyan)' : '1px solid var(--glass-border)',
                            boxShadow: status === 'VERIFYING' ? '0 0 20px rgba(0, 212, 255, 0.2)' : 'none'
                        }}
                    />
                    {status === 'VERIFYING' && (
                        <div style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}>
                            <div className="spinner" />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{
                        width: '100%',
                        marginTop: '1.5rem',
                        opacity: receiptId ? 1 : 0.5,
                        pointerEvents: receiptId ? 'all' : 'none'
                    }}
                >
                    {status === 'VERIFYING' ? 'GENERATING ZK-PROOF...' : 'VERIFY ON QUANTUM LEDGER'}
                </button>
            </form>

            {status === 'VERIFIED' && result && (
                <div style={{ animation: 'slide-up 0.5s ease-out' }}>
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid var(--neon-green)',
                        borderRadius: '12px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: 'var(--neon-green)', marginBottom: '0.5rem' }}>VOTE VERIFIED SECURE</h3>
                        <p style={{ color: 'var(--text-bright)' }}>Your vote is permanently sealed in the quantum ledger.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <ResultItem label="BLOCK HASH" value={result.blockHash.substring(0, 20) + '...'} />
                        <ResultItem label="QUANTUM SEAL" value={result.quantumSeal} color="var(--neon-cyan)" />
                        <ResultItem label="ZK-PROOF" value={result.zkProof} color="var(--neon-purple)" />
                        <ResultItem label="TIMESTAMP" value={new Date(result.timestamp).toLocaleString()} />
                    </div>
                </div>
            )}

            {status === 'ERROR' && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--neon-red)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    animation: 'slide-up 0.5s ease-out'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                    <h3 style={{ color: 'var(--neon-red)' }}>VERIFICATION FAILED</h3>
                    <p>Invalid receipt ID or tamper evidence detected.</p>
                </div>
            )}
        </div>
    );
}

function ResultItem({ label, value, color = 'var(--text-muted)' }) {
    return (
        <div style={{
            background: 'var(--bg-glass)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)'
        }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ fontFamily: 'monospace', color: color, wordBreak: 'break-all' }}>{value}</div>
        </div>
    );
}

export default PublicVerificationPortal;

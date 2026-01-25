import { useState } from 'react';
import { Link } from 'react-router-dom';

function AttackSimulator() {
    const [attackResults, setAttackResults] = useState({});
    const [attackLogs, setAttackLogs] = useState([]);

    const runAttack = (attackType, attackName) => {
        setAttackResults(prev => ({ ...prev, [attackType]: 'running' }));

        // Add attack log
        const newLog = {
            time: new Date().toLocaleTimeString(),
            type: 'ALERT',
            msg: `${attackName} initiated...`
        };
        setAttackLogs(prev => [newLog, ...prev].slice(0, 10));

        // Simulate attack and defense
        setTimeout(() => {
            setAttackResults(prev => ({ ...prev, [attackType]: 'blocked' }));

            const defenseLog = {
                time: new Date().toLocaleTimeString(),
                type: 'SECURE',
                msg: `${attackName} → NEUTRALIZED by Quantum Defense`
            };
            setAttackLogs(prev => [defenseLog, ...prev].slice(0, 10));
        }, 2500);
    };

    const attacks = [
        {
            id: 'grover',
            name: "Grover's Brute-Force",
            icon: '🧠',
            description: 'Quantum algorithm attempting to crack vote hashes using quadratic speedup.',
            defense: 'SHA-3 with 256-bit security maintains resistance even against quantum search.'
        },
        {
            id: 'eve',
            name: 'Eve Intercept (BB84)',
            icon: '🕵️',
            description: 'Man-in-the-middle eavesdropping attempt on quantum key distribution channel.',
            defense: 'BB84 protocol detects 25%+ error rate, automatically discards compromised keys.'
        },
        {
            id: 'shor',
            name: "Shor's Factorization",
            icon: '🔓',
            description: 'Quantum algorithm targeting RSA/ECDSA signatures used in vote sealing.',
            defense: 'System uses Kyber/Dilithium PQC algorithms immune to Shor attack.'
        },
        {
            id: 'tamper',
            name: 'Ledger Tampering',
            icon: '💥',
            description: 'Attempt to modify sealed vote blocks in the immutable ledger.',
            defense: 'Hash chain integrity verification instantly detects any modifications.'
        },
        {
            id: 'sybil',
            name: 'Sybil Attack',
            icon: '👥',
            description: 'Creating multiple fake voter identities to influence election results.',
            defense: 'Quantum Random ID generation + one-time session tokens prevent duplication.'
        },
        {
            id: 'replay',
            name: 'Replay Attack',
            icon: '🔄',
            description: 'Capturing and re-transmitting valid vote packets.',
            defense: 'Time-locked quantum signatures expire after single use.'
        }
    ];

    return (
        <div style={{ background: 'var(--bg-space)', minHeight: '100vh', padding: '2rem 0' }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1rem' }}>
                        ⚔️ ATTACK SIMULATION LAB
                    </h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                        Stress-test Q-Voting Ultra against high-tech quantum and classical threats.
                        Observe real-time defense mechanisms activating.
                    </p>
                </div>

                {/* Attack Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                    {attacks.map(attack => (
                        <div key={attack.id} className="glass-card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{attack.icon}</div>
                            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>{attack.name}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '60px' }}>
                                {attack.description}
                            </p>

                            <button
                                className="btn btn-danger"
                                onClick={() => runAttack(attack.id, attack.name)}
                                disabled={attackResults[attack.id] === 'running'}
                                style={{ marginBottom: '1rem' }}
                            >
                                {attackResults[attack.id] === 'running' ? '⏳ Attacking...' : '🚀 Run Attack'}
                            </button>

                            {attackResults[attack.id] === 'blocked' && (
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    border: '1px solid var(--neon-green)',
                                    borderRadius: '8px',
                                    animation: 'slide-up 0.3s ease-out'
                                }}>
                                    <div style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                        ✅ ATTACK NEUTRALIZED
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {attack.defense}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Attack Logs */}
                <div className="glass-card">
                    <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>📜 Attack & Defense Logs</h3>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '1rem',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '0.85rem'
                    }}>
                        {attackLogs.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                                No attacks initiated yet. Click "Run Attack" to begin simulation.
                            </div>
                        ) : (
                            attackLogs.map((log, i) => (
                                <div key={i} style={{
                                    padding: '0.5rem 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    gap: '1rem'
                                }}>
                                    <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>[{log.time}]</span>
                                    <span style={{
                                        color: log.type === 'SECURE' ? 'var(--neon-green)' :
                                            log.type === 'ALERT' ? 'var(--neon-red)' : 'var(--neon-cyan)',
                                        minWidth: '80px'
                                    }}>
                                        [{log.type}]
                                    </span>
                                    <span>{log.msg}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/dashboard" className="btn btn-secondary btn-lg">
                        ← Back to Live Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AttackSimulator;

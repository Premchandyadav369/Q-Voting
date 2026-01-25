import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AttackLab() {
    const [activeAttack, setActiveAttack] = useState(null);
    const [steps, setSteps] = useState([]);
    const [status, setStatus] = useState('IDLE');

    const ATTACKS = [
        {
            id: 'grover',
            name: "Grover's Search Attack",
            description: "A quantum brute-force algorithm that attempts to reverse-engineer vote hashes using quadratic speedup. Normally takes trillion years, but with Grover's it's faster.",
            defense: "Quantum-Resistant Hash Functions (Post-Quantum Cryptography) ensure even Grover's algorithm cannot find collisions.",
            icon: "🧠"
        },
        {
            id: 'eve',
            name: "Eve Intercept (Man-in-the-Middle)",
            description: "An eavesdropper 'Eve' tries to intercept photons in the Quantum Key Distribution (BB84) channel to steal the encryption key.",
            defense: "Quantum No-Cloning Theorem guarantees that measuring a photon changes its state. The system detects high Error Rate (QBER) and discards the key.",
            icon: "🕵️"
        },
        {
            id: 'shor',
            name: "Shor's Factorization",
            description: "Attacks RSA/ECC encryptions by factoring large prime numbers exponentially faster than classical computers.",
            defense: "Q-Voting uses Lattice-Based Cryptography (Kyber/Dilithium) which is immune to Shor's algorithm.",
            icon: "💥"
        }
    ];

    const runAttack = (attackId) => {
        if (status === 'RUNNING') return;

        setActiveAttack(attackId);
        setStatus('RUNNING');
        setSteps([]);

        // Simulate Attack Steps
        const attackSteps = [
            { msg: "🚀 Initializing Quantum Circuit...", delay: 800 },
            { msg: "⚡ Targeting Voting Ledger...", delay: 1600 },
            { msg: "🔓 Attempting State Superposition...", delay: 2400 },
            { msg: "⚠️ SYSTEM ALERT: Anomalous Qubit Activity Detected!", delay: 3500 },
            { msg: "🛡️ AUTOMATED DEFENSE TRIGGERED", delay: 4500 },
            { msg: "🚫 Attack Vector Isolated & Neutralized", delay: 5500 },
            { msg: "✅ INTEGRITY CONFIRMED", delay: 6500 }
        ];

        let totalDelay = 0;
        attackSteps.forEach((step, index) => {
            totalDelay = step.delay;
            setTimeout(() => {
                setSteps(prev => [...prev, step.msg]);
                if (index === attackSteps.length - 1) {
                    setStatus('BLOCKED');
                }
            }, step.delay);
        });
    };

    return (
        <div className="ultra-page" style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-space)' }}>
            <div className="container">
                <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
                    ← Back to Dashboard
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '3rem',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem'
                    }}>
                        ⚔️ QUANTUM ATTACK LAB
                    </h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                        Simulate advanced quantum threats against the voting infrastructure and observe how the
                        Quantum Security Operations Center (QSOC) neutralizes them in real-time.
                    </p>
                </div>

                <div className="attack-lab-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Left: Attack Selection */}
                    <div className="attack-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {ATTACKS.map(attack => (
                            <div
                                key={attack.id}
                                className={`glass-card ${activeAttack === attack.id ? 'active' : ''}`}
                                style={{
                                    padding: '2rem',
                                    border: activeAttack === attack.id ? '1px solid var(--neon-red)' : '1px solid var(--glass-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: activeAttack === attack.id ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-glass)'
                                }}
                                onClick={() => runAttack(attack.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
                                    <div style={{ fontSize: '2.5rem' }}>{attack.icon}</div>
                                    <div>
                                        <h3 style={{ marginBottom: '0.5rem', color: 'white' }}>{attack.name}</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{attack.description}</p>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--neon-green)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                            🛡️ Defense: {attack.defense}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn"
                                    style={{
                                        marginTop: '1.5rem',
                                        width: '100%',
                                        background: activeAttack === attack.id ? 'var(--neon-red)' : 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {activeAttack === attack.id && status === 'RUNNING' ? 'Running Simulation...' : '⚠️ LAUNCH ATTACK'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right: Live Terminal */}
                    <div className="attack-terminal">
                        <div style={{
                            background: '#0a0e17',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            padding: '2rem',
                            height: '100%',
                            minHeight: '600px',
                            position: 'sticky',
                            top: '120px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                paddingBottom: '1rem',
                                marginBottom: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontFamily: 'monospace', color: 'var(--neon-cyan)' }}>ROOT@QSOC-DEFENSE-NODE:~#</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                                </div>
                            </div>

                            <div className="terminal-output" style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'relative', overflow: 'hidden' }}>
                                {/* Scanline Effect */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                                    background: 'rgba(0, 255, 255, 0.3)', opacity: 0.4,
                                    animation: 'scanline 3s linear infinite', zIndex: 10, pointerEvents: 'none'
                                }}></div>

                                {!activeAttack && (
                                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '50%' }}>
                                        <div style={{ fontSize: '3rem', opacity: 0.2 }}>🛡️</div>
                                        [ WAITING FOR HOSTILE SIGNAL ]
                                    </div>
                                )}

                                {steps.map((step, i) => (
                                    <div key={i} className="step-line" style={{
                                        opacity: 0,
                                        animation: 'fadeIn 0.3s forwards',
                                        color: step.includes('ALERT') ? 'var(--neon-red)' : step.includes('CONFIRMED') ? 'var(--neon-green)' : 'var(--neon-cyan)',
                                        textShadow: '0 0 5px rgba(0,0,0,0.5)',
                                        borderLeft: step.includes('ALERT') ? '3px solid var(--neon-red)' : 'none',
                                        paddingLeft: step.includes('ALERT') ? '10px' : '0'
                                    }}>
                                        <span style={{ opacity: 0.5, marginRight: '10px' }}>{new Date().toLocaleTimeString()}</span>
                                        <span style={{ fontFamily: 'var(--font-mono)' }}>{step}</span>
                                    </div>
                                ))}

                                {status === 'BLOCKED' && (
                                    <div style={{
                                        marginTop: '2rem',
                                        padding: '1.5rem',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid var(--neon-green)',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        animation: 'pulse 2s infinite',
                                        backdropFilter: 'blur(5px)'
                                    }}>
                                        <h2 style={{ color: 'var(--neon-green)', margin: 0, fontFamily: 'var(--font-display)' }}>THREAT NEUTRALIZED</h2>
                                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>The distributed ledger remains immutable.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes scanline {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}

export default AttackLab;

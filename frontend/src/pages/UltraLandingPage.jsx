import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SimulationController from '../components/SimulationController';
import AndhraPradeshMap from '../components/AndhraPradeshMap';
import PublicVerificationPortal from '../components/PublicVerificationPortal';
import ElectionTimelineReplay from '../components/ElectionTimelineReplay';
import QuantumTrustScore from '../components/QuantumTrustScore';

// Particle component for background animation
function Particle({ delay, left }) {
    return (
        <div
            className="particle"
            style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${6 + Math.random() * 4}s`
            }}
        />
    );
}

// Animated Log Messages
const LOG_MESSAGES = [
    { text: '✓ Vote Sealed', type: 'success' },
    { text: '🔑 Quantum Key Generated', type: 'info' },
    { text: '🚨 Eavesdropper Detected: BLOCKED', type: 'danger' },
    { text: '📦 Block Added to Ledger', type: 'success' },
    { text: '🔐 BB84 Channel Secure', type: 'info' },
];

function UltraLandingPage() {
    const [logs, setLogs] = useState([LOG_MESSAGES[0], LOG_MESSAGES[1], LOG_MESSAGES[2]]);
    const [qsocMetrics, setQsocMetrics] = useState({
        entropy: 98.7,
        fidelity: 99.2,
        decoherence: 0.03,
        threatLevel: 'LOW'
    });
    const [systemLogs, setSystemLogs] = useState([
        { time: '00:00:01', type: 'INFO', msg: 'Quantum Channel Initialized' },
        { time: '00:00:02', type: 'SECURE', msg: 'BB84 Key Exchange Successful' },
        { time: '00:00:03', type: 'ALERT', msg: 'Eve Detected → Channel Reset' },
        { time: '00:00:04', type: 'OK', msg: 'Vote Block Sealed' },
    ]);
    const [attackResults, setAttackResults] = useState({});

    // Cycle live logs
    useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => {
                const next = [...prev];
                next.shift();
                next.push(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Update QSOC metrics
    useEffect(() => {
        const interval = setInterval(() => {
            setQsocMetrics({
                entropy: (97 + Math.random() * 2.5).toFixed(1),
                fidelity: (98.5 + Math.random() * 1.5).toFixed(1),
                decoherence: (0.01 + Math.random() * 0.04).toFixed(3),
                threatLevel: Math.random() > 0.9 ? 'MEDIUM' : 'LOW'
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Attack simulation
    const runAttack = (type) => {
        setAttackResults(prev => ({ ...prev, [type]: 'running' }));
        setTimeout(() => {
            setAttackResults(prev => ({ ...prev, [type]: 'blocked' }));
        }, 2000);
    };

    return (
        <div className="ultra-landing">
            {/* ========== HERO SECTION ========== */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-grid"></div>
                    <div className="hero-particles">
                        {[...Array(20)].map((_, i) => (
                            <Particle key={i} delay={i * 0.4} left={Math.random() * 100} />
                        ))}
                    </div>

                    {/* Radar */}
                    <div className="radar-container">
                        <div className="radar-ring" style={{ width: '100%', height: '100%', top: 0, left: 0 }}></div>
                        <div className="radar-ring" style={{ width: '70%', height: '70%', top: '15%', left: '15%' }}></div>
                        <div className="radar-ring" style={{ width: '40%', height: '40%', top: '30%', left: '30%' }}></div>
                        <div className="radar-sweep"></div>
                    </div>
                </div>

                <div className="container">
                    <div className="hero-content">
                        <img src="/qvoting-logo.png" alt="Q-Voting Ultra" className="hero-logo" />
                        <h1 className="hero-title">The World's First Real-Time, Quantum-Encrypted Digital Democracy Platform</h1>
                        <p className="hero-subtitle">
                            Privacy-Preserving. Tamper-Proof. Instantly Verifiable.
                        </p>
                        <div className="hero-ctas">
                            <Link to="/vote" className="btn btn-primary btn-lg">▶️ Start Voting</Link>
                            <Link to="/dashboard" className="btn btn-secondary btn-lg">📊 Live Dashboard</Link>
                            <Link to="/attacks" className="btn btn-secondary btn-lg">🧪 Attack Lab</Link>
                        </div>
                    </div>
                </div>

                {/* Live Logs */}
                <div className="live-logs">
                    {logs.map((log, i) => (
                        <div key={i} className={`log-item ${log.type}`}>
                            {log.text}
                        </div>
                    ))}
                </div>
            </section>

            {/* ========== QUANTUM FEATURES SECTION ========== */}
            <section style={{ padding: '4rem 0', background: 'transperent' }}>
                <div className="container">
                    <div className="qsoc-grid-container" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        alignItems: 'start',
                        marginBottom: '3rem'
                    }}>
                        <QuantumTrustScore />
                        <div className="glass-card">
                            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>
                                🕵️ PUBLIC VERIFICATION & REPLAY
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <PublicVerificationPortal />
                                <ElectionTimelineReplay />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== SIMULATION & MAP SECTION ========== */}
            <section style={{ padding: '4rem 0', background: 'var(--bg-space)' }}>
                <div className="container">
                    <div className="simulation-grid">
                        {/* Simulation Controller */}
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                                🚀 BATCH VOTE SIMULATOR
                            </h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                                Stress-test the quantum voting system with 10 to 100,000 simultaneous voters.
                            </p>
                            <SimulationController />
                        </div>

                        {/* AP Map Preview */}
                        <AndhraPradeshMap />
                    </div>
                </div>
            </section>

            {/* ========== HOW IT WORKS ========== */}
            <section className="pipeline-section" id="pipeline">
                <div className="container">
                    <h2 className="pipeline-title">🔐 How It Works — Live Pipeline</h2>
                    <div className="pipeline-flow">
                        <div className="pipeline-step">
                            <div className="pipeline-icon">👤</div>
                            <div className="pipeline-label">Voter Authentication</div>
                            <div className="pipeline-desc">Quantum Random ID generation</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="pipeline-icon">🔑</div>
                            <div className="pipeline-label">Quantum Key Distribution</div>
                            <div className="pipeline-desc">BB84 Protocol with Eve Detection</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="pipeline-icon">🔒</div>
                            <div className="pipeline-label">Vote Encryption</div>
                            <div className="pipeline-desc">AES-256-GCM with Quantum Entropy</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="pipeline-icon">📦</div>
                            <div className="pipeline-label">Immutable Ledger</div>
                            <div className="pipeline-desc">Cryptographically Linked Blocks</div>
                        </div>
                        <div className="pipeline-step">
                            <div className="pipeline-icon">✅</div>
                            <div className="pipeline-label">Public Verification</div>
                            <div className="pipeline-desc">ZK-Proof without Identity Disclosure</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== QSOC DASHBOARD ========== */}
            <section className="qsoc-section" id="qsoc">
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-display)' }}>
                        🛡️ Quantum Security Operations Center
                    </h2>

                    <div className="qsoc-grid">
                        <div className="glass-card qsoc-card">
                            <div className="qsoc-value">{qsocMetrics.entropy}%</div>
                            <div className="qsoc-label">🔐 QKD Entropy</div>
                        </div>
                        <div className="glass-card qsoc-card">
                            <div className="qsoc-value">{qsocMetrics.fidelity}%</div>
                            <div className="qsoc-label">📡 Photon Fidelity</div>
                        </div>
                        <div className="glass-card qsoc-card">
                            <div className="qsoc-value">{qsocMetrics.decoherence}</div>
                            <div className="qsoc-label">⚛️ Decoherence Rate</div>
                        </div>
                        <div className="glass-card qsoc-card">
                            <div className="qsoc-value" style={{ color: qsocMetrics.threatLevel === 'LOW' ? 'var(--neon-green)' : 'var(--neon-yellow)' }}>
                                {qsocMetrics.threatLevel}
                            </div>
                            <div className="qsoc-label">🚨 Threat Level</div>
                        </div>
                    </div>

                    <div className="qsoc-logs">
                        {systemLogs.map((log, i) => (
                            <div key={i} className="qsoc-log-entry">
                                <span className="timestamp">[{log.time}]</span>
                                <span style={{
                                    color: log.type === 'SECURE' ? 'var(--neon-green)' :
                                        log.type === 'ALERT' ? 'var(--neon-red)' :
                                            log.type === 'OK' ? 'var(--neon-cyan)' : 'var(--text-muted)'
                                }}>
                                    [{log.type}]
                                </span>
                                <span>{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== ATTACK SIMULATION ========== */}
            <section className="attack-section" id="attacks">
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-display)' }}>
                        ⚔️ Attack Simulation Lab
                    </h2>

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <Link to="/attacks" className="btn btn-danger btn-lg" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
                            🧪 ENTER QUANTUM ATTACK LAB
                        </Link>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                            Launch full-scale quantum threats in a controlled environment with step-by-step visualization.
                        </p>
                    </div>

                    <div className="attack-grid">
                        <div className="glass-card attack-card">
                            <div className="attack-icon">🧠</div>
                            <h4>Grover's Attack</h4>
                            <p>Quantum brute-force search algorithm attempt</p>
                            <Link to="/attacks" className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>Simulate in Lab</Link>
                        </div>

                        <div className="glass-card attack-card">
                            <div className="attack-icon">🕵️</div>
                            <h4>Eve Intercept</h4>
                            <p>Man-in-the-middle eavesdropping simulation</p>
                            <Link to="/attacks" className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>Simulate in Lab</Link>
                        </div>

                        <div className="glass-card attack-card">
                            <div className="attack-icon">💥</div>
                            <h4>Ledger Tampering</h4>
                            <p>Attempt to modify sealed vote blocks</p>
                            <Link to="/attacks" className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>Simulate in Lab</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== DEPLOYMENT ========== */}
            <section className="deploy-section" id="deploy">
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-display)' }}>
                        🚀 One-Click Local Launch
                    </h2>

                    <div className="deploy-steps">
                        <div className="glass-card deploy-step">
                            <div className="deploy-step-header">
                                <div className="deploy-step-number">1</div>
                                <h4>Requirements</h4>
                            </div>
                            <ul style={{ listStyle: 'none', fontSize: '0.9rem' }}>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Windows OS (PowerShell)</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Python 3.10+</li>
                                <li>✅ Node.js 18+</li>
                            </ul>
                        </div>

                        <div className="glass-card deploy-step">
                            <div className="deploy-step-header">
                                <div className="deploy-step-number">2</div>
                                <h4>Clone Repository</h4>
                            </div>
                            <div className="terminal">
                                <div className="terminal-header">
                                    <div className="terminal-dot red"></div>
                                    <div className="terminal-dot yellow"></div>
                                    <div className="terminal-dot green"></div>
                                </div>
                                <div className="terminal-content">
                                    <div className="command">$ git clone https://github.com/yourrepo/q-voting-ultra</div>
                                    <div className="command">$ cd q-voting-ultra</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card deploy-step">
                            <div className="deploy-step-header">
                                <div className="deploy-step-number">3</div>
                                <h4>Launch System</h4>
                            </div>
                            <div className="terminal">
                                <div className="terminal-header">
                                    <div className="terminal-dot red"></div>
                                    <div className="terminal-dot yellow"></div>
                                    <div className="terminal-dot green"></div>
                                </div>
                                <div className="terminal-content">
                                    <div className="command">$ .\run_project.ps1</div>
                                    <div className="output">🚀 INITIALIZING Q-VOTING ULTRA...</div>
                                </div>
                            </div>
                            <div className="status-indicators">
                                <div className="status-item">
                                    <div className="status-dot active"></div>
                                    <span>Backend: 8000</span>
                                </div>
                                <div className="status-item">
                                    <div className="status-dot active"></div>
                                    <span>Frontend: 5173</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card deploy-step" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>System Fully Operational</h4>
                            <p style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                                ACTIVE — MONITORING
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== TECH STACK ========== */}
            <section className="tech-section" id="tech">
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-display)' }}>
                        ⚙️ Tech Stack
                    </h2>

                    <div className="tech-grid">
                        <div className="glass-card tech-card">
                            <div className="tech-icon">⚛️</div>
                            <div className="tech-name">React + Vite</div>
                            <div className="tech-desc">Ultra-responsive frontend</div>
                        </div>
                        <div className="glass-card tech-card">
                            <div className="tech-icon">🐍</div>
                            <div className="tech-name">FastAPI</div>
                            <div className="tech-desc">High-performance async API</div>
                        </div>
                        <div className="glass-card tech-card">
                            <div className="tech-icon">🗄️</div>
                            <div className="tech-name">SQLite WAL</div>
                            <div className="tech-desc">Optimized for concurrency</div>
                        </div>
                        <div className="glass-card tech-card">
                            <div className="tech-icon">🔬</div>
                            <div className="tech-name">Qiskit</div>
                            <div className="tech-desc">Quantum simulation (BB84)</div>
                        </div>
                        <div className="glass-card tech-card">
                            <div className="tech-icon">🤖</div>
                            <div className="tech-name">Gemini AI</div>
                            <div className="tech-desc">Real-time insights</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default UltraLandingPage;

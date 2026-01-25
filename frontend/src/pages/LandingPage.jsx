import { Link } from 'react-router-dom'
import APMap from '../components/APMap'
import SimulationController from '../components/SimulationController'
import QuantumBenchmarks from '../components/QuantumBenchmarks'
import QSOCDashboard from '../components/QSOCDashboard'
import LiveLedger from '../components/LiveLedger'

function LandingPage() {
    return (
        <div>
            {/* Beast Mode Hero Section */}
            <section className="landing-hero" style={{
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--bg-dark)'
            }}>
                {/* Quantum Lattice Animation Backdrop */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }}>
                    <svg width="100%" height="100%">
                        <pattern id="lattice" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="var(--primary-600)" />
                            <line x1="2" y1="2" x2="52" y2="2" stroke="var(--primary-600)" strokeWidth="0.5" />
                            <line x1="2" y1="2" x2="2" y2="52" stroke="var(--primary-600)" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#lattice)" />
                    </svg>
                    <div className="lattice-glow" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, var(--primary-600) 0%, transparent 70%)',
                        filter: 'blur(120px)',
                        opacity: 0.3,
                        animation: 'pulse 10s infinite alternate'
                    }}></div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div className="landing-emblem" style={{
                        fontSize: '5rem',
                        marginBottom: '1.5rem',
                        animation: 'float 6s ease-in-out infinite'
                    }}>🛡️</div>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 5rem)',
                        fontWeight: '900',
                        letterSpacing: '-2px',
                        lineHeight: '1.1',
                        marginBottom: '1rem',
                        textTransform: 'uppercase'
                    }}>Q-VOTING ULTRA++</h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                        color: 'var(--text-muted)',
                        marginBottom: '3.5rem',
                        fontWeight: '300',
                        maxWidth: '800px',
                        margin: '0 auto 3.5rem'
                    }}>
                        Democracy, <span style={{ color: 'var(--primary-500)', fontWeight: 'bold' }}>mathematically protected.</span><br />
                        The world's most advanced quantum-secure digital election simulator.
                    </p>

                    <div className="landing-actions" style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/vote" className="btn btn-primary btn-lg" style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem', borderRadius: '50px' }}>
                            🗳️ ENTER LIVE DASHBOARD
                        </Link>
                        <Link to="/verify" className="btn btn-secondary btn-lg" style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem', borderRadius: '50px', background: 'rgba(255,255,255,0.05)' }}>
                            🔐 VERIFY A VOTE
                        </Link>
                        <Link to="/explanation" className="btn btn-secondary btn-lg" style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem', borderRadius: '50px', background: 'rgba(255,255,255,0.05)' }}>
                            📄 SECURITY WHITEPAPER
                        </Link>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview Section */}
            <section className="dashboard-preview" style={{ padding: '6rem 0', background: 'var(--bg-dark)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗺️ QUANTUM RADAR SENSORS</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Real-time electoral surge monitoring across 26 districts of Andhra Pradesh.</p>
                    </div>

                    <APMap />

                    <div style={{ marginTop: '6rem' }}>
                        <QSOCDashboard />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '48px',
                        marginTop: '6rem',
                        marginBottom: '6rem',
                        textAlign: 'left'
                    }}>
                        <div className="card-outer">
                            <h3 style={{ marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '4px solid var(--primary-600)' }}>
                                🚀 POPULATION SURGE SIMULATOR
                            </h3>
                            <SimulationController />
                        </div>
                        <div className="card-outer">
                            <h3 style={{ marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '4px solid var(--primary-600)' }}>
                                📊 QUANTUM BENCHMARKS
                            </h3>
                            <QuantumBenchmarks />
                        </div>
                    </div>

                    <div style={{ marginTop: '4rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>📜 LIVE IMMUTABLE LEDGER</h2>
                        <LiveLedger />
                    </div>
                </div>
            </section>

            {/* Features Info Section */}
            <section className="landing-features" style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        <div className="feature-card">
                            <div className="feature-icon">🔐</div>
                            <h3 className="feature-title">PQC Migration Engine</h3>
                            <p className="feature-desc">
                                Future-proof algorithm switching between Classical, Hybrid, and Full Post-Quantum modes.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">👤</div>
                            <h3 className="feature-title">ZK-Verifiability</h3>
                            <p className="feature-desc">
                                Zero-Knowledge Proof receipts allow voters to verify their vote without exposing their ballot.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3 className="feature-title">AI Election Observer</h3>
                            <p className="feature-desc">
                                Gemini-powered neutral analysis of system health, anomaly detection, and integrity reporting.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage

import { Link } from 'react-router-dom'
import APMap from '../components/APMap'

function LandingPage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="landing-hero">
                <div className="container">
                    <div className="landing-emblem">🗳️</div>
                    <h1 className="landing-title">Quantum Voting System</h1>
                    <p className="landing-subtitle">
                        Privacy-Preserving Quantum Voting Simulation for
                        Andhra Pradesh MLA & MP Elections
                    </p>
                    <APMap />
                    <div className="landing-actions">
                        <Link to="/vote" className="btn btn-quantum btn-lg">
                            🗳️ Start Voting (Simulation)
                        </Link>
                        <Link to="/features" className="btn btn-secondary btn-lg">
                            ✨ Learn More
                        </Link>
                        <Link to="/admin" className="btn btn-secondary btn-lg">
                            📊 View Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="landing-features">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <div className="feature-card">
                            <div className="feature-icon">🔐</div>
                            <h3 className="feature-title">Quantum Security</h3>
                            <p className="feature-desc">
                                BB84 Quantum Key Distribution ensures secure key exchange
                                with eavesdropping detection
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">👤</div>
                            <h3 className="feature-title">Voter Anonymity</h3>
                            <p className="feature-desc">
                                No link between voter identity and vote.
                                Complete privacy protection
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">One Vote Only</h3>
                            <p className="feature-desc">
                                No-cloning theorem simulation ensures
                                each vote is unique and cannot be duplicated
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3 className="feature-title">Tamper Detection</h3>
                            <p className="feature-desc">
                                Any vote modification is immediately detected
                                through cryptographic verification
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏛️</div>
                            <h3 className="feature-title">AP Elections</h3>
                            <p className="feature-desc">
                                175 MLA constituencies and 25 MP constituencies
                                of Andhra Pradesh
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Live Results</h3>
                            <p className="feature-desc">
                                Real-time result aggregation with party-wise
                                and constituency-wise statistics
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section style={{ padding: '48px 16px', background: '#f3f4f6' }}>
                <div className="container">
                    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h3 style={{ marginBottom: '16px' }}>🧠 How Quantum Voting Works</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <span style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'var(--primary-100)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>1</span>
                                <div>
                                    <strong>Session Creation</strong>
                                    <p style={{ margin: 0, color: '#6b7280' }}>
                                        An anonymous voting session is created. No voter identification is stored.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <span style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'var(--primary-100)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>2</span>
                                <div>
                                    <strong>Quantum Key Distribution</strong>
                                    <p style={{ margin: 0, color: '#6b7280' }}>
                                        BB84 protocol generates a secure quantum key between you and the server.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <span style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'var(--primary-100)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>3</span>
                                <div>
                                    <strong>Secure Vote Casting</strong>
                                    <p style={{ margin: 0, color: '#6b7280' }}>
                                        Your vote is encrypted with the quantum key and stored anonymously.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <span style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'var(--success-light)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>✓</span>
                                <div>
                                    <strong>Confirmation</strong>
                                    <p style={{ margin: 0, color: '#6b7280' }}>
                                        You receive an anonymous receipt. Your session is destroyed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage

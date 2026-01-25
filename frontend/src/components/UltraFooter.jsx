import { Link } from 'react-router-dom';

function UltraFooter() {
    const currentYear = new Date().getFullYear();

    const footerStyles = {
        footer: {
            background: 'linear-gradient(180deg, rgba(10, 14, 26, 0.95) 0%, rgba(0, 10, 20, 1) 100%)',
            borderTop: '1px solid rgba(0, 212, 255, 0.2)',
            padding: '3rem 0 2rem',
            position: 'relative',
            overflow: 'hidden'
        },
        glowLine: {
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), rgba(168, 85, 247, 0.5), transparent)'
        },
        footerGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem'
        },
        section: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        },
        sectionTitle: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#00d4ff',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        linkList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        },
        link: {
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        disclaimer: {
            background: 'rgba(20, 35, 60, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 200, 255, 0.15)',
            borderRadius: '12px',
            padding: '1.25rem',
            fontSize: '0.85rem',
            color: '#94a3b8',
            lineHeight: 1.7
        },
        divider: {
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent)',
            margin: '1.5rem 0'
        },
        bottomBar: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            textAlign: 'center'
        },
        creatorSection: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        },
        madeBy: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        creatorName: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
        },
        socialLinks: {
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
        },
        socialButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.2rem',
            background: 'rgba(20, 35, 60, 0.5)',
            border: '1px solid rgba(0, 200, 255, 0.3)',
            borderRadius: '8px',
            color: '#e0f2fe',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
        },
        copyright: {
            fontSize: '0.8rem',
            color: '#64748b',
            marginTop: '0.5rem'
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#22c55e',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        }
    };

    return (
        <footer style={footerStyles.footer}>
            <div style={footerStyles.glowLine}></div>

            <div className="container">
                {/* Footer Grid */}
                <div style={footerStyles.footerGrid}>
                    {/* About Section */}
                    <div style={footerStyles.section}>
                        <div style={footerStyles.sectionTitle}>
                            <span>🗳️</span> Q-Voting Ultra
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>
                            The world's first real-time, quantum-encrypted digital democracy platform.
                            Privacy-preserving, tamper-proof, and instantly verifiable.
                        </p>
                        <div style={footerStyles.badge}>
                            <span style={{ animation: 'pulse 1.5s infinite' }}>●</span>
                            Quantum Secured
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div style={footerStyles.section}>
                        <div style={footerStyles.sectionTitle}>
                            <span>🔗</span> Quick Links
                        </div>
                        <div style={footerStyles.linkList}>
                            <Link to="/" style={footerStyles.link}>🏠 Home</Link>
                            <Link to="/vote" style={footerStyles.link}>🗳️ Cast Vote</Link>
                            <Link to="/dashboard" style={footerStyles.link}>📊 Live Dashboard</Link>
                            <Link to="/attacks" style={footerStyles.link}>🧪 Attack Lab</Link>
                            <Link to="/verify" style={footerStyles.link}>🔍 Verify Vote</Link>
                        </div>
                    </div>

                    {/* Features */}
                    <div style={footerStyles.section}>
                        <div style={footerStyles.sectionTitle}>
                            <span>⚡</span> Key Features
                        </div>
                        <div style={footerStyles.linkList}>
                            <span style={footerStyles.link}>🔐 BB84 Quantum Protocol</span>
                            <span style={footerStyles.link}>📦 Immutable Ledger</span>
                            <span style={footerStyles.link}>🕵️ Zero-Knowledge Proofs</span>
                            <span style={footerStyles.link}>🛡️ Attack Simulation</span>
                            <span style={footerStyles.link}>🤖 Gemini AI Integration</span>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div style={footerStyles.section}>
                        <div style={footerStyles.sectionTitle}>
                            <span>⚙️</span> Tech Stack
                        </div>
                        <div style={footerStyles.linkList}>
                            <span style={footerStyles.link}>⚛️ React + Vite</span>
                            <span style={footerStyles.link}>🐍 FastAPI (Python)</span>
                            <span style={footerStyles.link}>🔬 Qiskit (Quantum)</span>
                            <span style={footerStyles.link}>🗄️ SQLite (WAL Mode)</span>
                            <span style={footerStyles.link}>🤖 Gemini 2.5 Flash</span>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div style={footerStyles.disclaimer}>
                    <strong style={{ color: '#fbbf24' }}>⚠️ Academic Simulation Notice:</strong>{' '}
                    This project is a high-fidelity academic simulation utilizing authentic cryptographic principles
                    and quantum computing concepts. It serves as a prototype designed for research, hackathons,
                    and defense/GovTech presentations. This application is not affiliated with any government body
                    and is intended solely for educational and demonstration purposes.
                </div>

                <div style={footerStyles.divider}></div>

                {/* Bottom Bar - Creator Credits */}
                <div style={footerStyles.bottomBar}>
                    <div style={footerStyles.creatorSection}>
                        <div style={footerStyles.madeBy}>
                            <span>✨</span> Made with 💙 by
                        </div>
                        <div style={footerStyles.creatorName}>V C Premchand Yadav</div>

                        <div style={footerStyles.socialLinks}>
                            <a
                                href="https://github.com/Premchandyadav369"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={footerStyles.socialButton}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
                                    e.currentTarget.style.borderColor = '#00d4ff';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 212, 255, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(20, 35, 60, 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 200, 255, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </a>
                            <a
                                href="https://www.linkedin.com/in/premchand-yadav-a785691a2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={footerStyles.socialButton}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                                    e.currentTarget.style.borderColor = '#a855f7';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(168, 85, 247, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(20, 35, 60, 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 200, 255, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    <p style={footerStyles.copyright}>
                        © {currentYear} Q-Voting Ultra. All rights reserved. | Built for the future of democratic transparency.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default UltraFooter;

import { Link } from 'react-router-dom'

function FeaturesPage() {
    const features = [
        {
            icon: '🔐',
            title: 'Quantum Key Distribution (BB84)',
            description: 'Uses the famous BB84 protocol to generate secure encryption keys through quantum mechanics principles.',
            traditional: 'RSA/AES keys can be broken by quantum computers',
            quantum: 'Quantum keys are theoretically unbreakable, even by quantum computers'
        },
        {
            icon: '👁️',
            title: 'Eavesdropping Detection',
            description: 'Any attempt to intercept the quantum channel introduces measurable errors, instantly alerting the system.',
            traditional: 'Interception can go undetected for months or years',
            quantum: 'Detection is instant and guaranteed by physics'
        },
        {
            icon: '👤',
            title: 'Complete Voter Anonymity',
            description: 'No link between voter identity and the vote cast. Session data is destroyed after voting.',
            traditional: 'Digital trails often exist between voter and vote',
            quantum: 'Quantum mechanics ensures true randomness and unlinkability'
        },
        {
            icon: '🔒',
            title: 'No-Cloning Theorem',
            description: 'Quantum states cannot be copied, ensuring each vote token is unique and cannot be duplicated.',
            traditional: 'Digital data can be copied infinitely',
            quantum: 'Votes cannot be duplicated due to quantum physics'
        },
        {
            icon: '🛡️',
            title: 'Tamper Detection',
            description: 'Cryptographic hashes and quantum verification detect any unauthorized modification to ballots.',
            traditional: 'Tampering may require forensic analysis to detect',
            quantum: 'Real-time detection through quantum state collapse'
        },
        {
            icon: '📊',
            title: 'Real-Time Results',
            description: 'Live election tracking with AI-powered insights and district-wise analysis.',
            traditional: 'Manual counting delays results by hours or days',
            quantum: 'Instant, secure tallying with live visualization'
        },
        {
            icon: '🤖',
            title: 'AI-Powered Insights',
            description: 'Gemini 2.5 Flash provides intelligent analysis of voting patterns and predictions.',
            traditional: 'Static reports without intelligent analysis',
            quantum: 'Dynamic AI insights with trend detection'
        },
        {
            icon: '🗺️',
            title: 'Interactive Map Dashboard',
            description: 'Drill-down map visualization for district and constituency-level results.',
            traditional: 'Basic tables and charts',
            quantum: 'Rich, interactive geospatial visualization'
        }
    ]

    return (
        <div className="container" style={{ padding: '48px 16px' }}>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    ✨ Q-Voting Features
                </h1>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.1rem',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    Discover how quantum cryptography revolutionizes election security
                    compared to traditional voting systems.
                </p>
            </div>

            {/* Feature Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
                marginBottom: '48px'
            }}>
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            padding: '24px',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                    >
                        <div style={{
                            fontSize: '2.5rem',
                            marginBottom: '12px'
                        }}>
                            {feature.icon}
                        </div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            marginBottom: '8px',
                            color: 'var(--text-main)'
                        }}>
                            {feature.title}
                        </h3>
                        <p style={{
                            color: 'var(--text-muted)',
                            marginBottom: '16px',
                            fontSize: '0.95rem'
                        }}>
                            {feature.description}
                        </p>

                        {/* Comparison */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            fontSize: '0.85rem'
                        }}>
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                padding: '12px'
                            }}>
                                <div style={{
                                    fontWeight: '600',
                                    color: '#ef4444',
                                    marginBottom: '4px'
                                }}>
                                    ❌ Traditional
                                </div>
                                <div style={{ color: 'var(--text-muted)' }}>
                                    {feature.traditional}
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '8px',
                                padding: '12px'
                            }}>
                                <div style={{
                                    fontWeight: '600',
                                    color: '#10b981',
                                    marginBottom: '4px'
                                }}>
                                    ✅ Quantum
                                </div>
                                <div style={{ color: 'var(--text-muted)' }}>
                                    {feature.quantum}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Comparison Table */}
            <div className="card" style={{
                background: 'var(--bg-card)',
                padding: '32px',
                borderRadius: '16px',
                marginBottom: '48px'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: 'var(--text-main)'
                }}>
                    📊 At-a-Glance Comparison
                </h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.95rem'
                    }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)' }}>Feature</th>
                                <th style={{ padding: '12px', textAlign: 'center', color: '#ef4444' }}>Traditional Voting</th>
                                <th style={{ padding: '12px', textAlign: 'center', color: '#10b981' }}>Q-Voting (Quantum)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Encryption</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>RSA / AES</td>
                                <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#10b981' }}>BB84 QKD</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Quantum-Safe</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>❌ No</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>✅ Yes</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Eavesdropping Detection</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>❌ Delayed</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>✅ Instant</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Vote Duplication</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>❌ Possible</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>✅ Impossible (No-Cloning)</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Real-Time Results</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>⚠️ Delayed</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>✅ Instant</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>AI Insights</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>❌ None</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>✅ Gemini 2.5 Flash</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center' }}>
                <Link
                    to="/vote"
                    className="btn btn-quantum btn-lg"
                    style={{
                        padding: '16px 32px',
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-gold))',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        textDecoration: 'none',
                        display: 'inline-block',
                        boxShadow: 'var(--glow-primary)'
                    }}
                >
                    🗳️ Experience Quantum Voting
                </Link>
            </div>
        </div>
    )
}

export default FeaturesPage

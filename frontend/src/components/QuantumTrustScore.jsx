import { useState, useEffect } from 'react';

/**
 * Quantum Trust Score™ Component
 * A single metric representing election health
 */
function QuantumTrustScore() {
    const [score, setScore] = useState(97.4);
    const [status, setStatus] = useState('EXEMPLARY');
    const [metrics, setMetrics] = useState({
        qkdEntropy: 98.7,
        attackFrequency: 0.02,
        ledgerIntegrity: 99.9,
        networkLatency: 12
    });

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate real-time score fluctuation
            const newEntropy = 96 + Math.random() * 3.5;
            const newIntegrity = 99.5 + Math.random() * 0.5;
            const newLatency = 8 + Math.random() * 10;
            const attackFreq = Math.random() * 0.1;

            // Calculate composite score
            const compositeScore = (
                (newEntropy * 0.3) +
                ((100 - attackFreq * 100) * 0.25) +
                (newIntegrity * 0.35) +
                ((100 - newLatency) * 0.1)
            ).toFixed(1);

            setMetrics({
                qkdEntropy: newEntropy.toFixed(1),
                attackFrequency: attackFreq.toFixed(3),
                ledgerIntegrity: newIntegrity.toFixed(1),
                networkLatency: newLatency.toFixed(0)
            });

            setScore(compositeScore);

            // Determine status
            if (compositeScore >= 95) setStatus('EXEMPLARY');
            else if (compositeScore >= 85) setStatus('OPTIMAL');
            else if (compositeScore >= 70) setStatus('STABLE');
            else setStatus('ALERT');
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        switch (status) {
            case 'EXEMPLARY': return 'var(--neon-green)';
            case 'OPTIMAL': return 'var(--neon-cyan)';
            case 'STABLE': return 'var(--neon-yellow)';
            default: return 'var(--neon-red)';
        }
    };

    const getScoreGradient = () => {
        const pct = score;
        if (pct >= 90) return 'linear-gradient(135deg, #22c55e, #00d4ff)';
        if (pct >= 75) return 'linear-gradient(135deg, #00d4ff, #a855f7)';
        if (pct >= 50) return 'linear-gradient(135deg, #fbbf24, #f97316)';
        return 'linear-gradient(135deg, #ef4444, #dc2626)';
    };

    return (
        <div className="quantum-trust-score" style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: '20px',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                background: `radial-gradient(circle, ${getStatusColor()}22 0%, transparent 70%)`,
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite',
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: '2px'
                }}>
                    QUANTUM TRUST SCORE™
                </h3>

                {/* Main Score Display */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        fontSize: '4rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: '900',
                        background: getScoreGradient(),
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1
                    }}>
                        {score}
                    </div>
                    <div style={{
                        fontSize: '1.5rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-display)'
                    }}>/ 100</div>
                </div>

                {/* Status Badge */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1.5rem',
                        background: `${getStatusColor()}22`,
                        border: `1px solid ${getStatusColor()}`,
                        borderRadius: '50px',
                        color: getStatusColor(),
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        letterSpacing: '2px'
                    }}>
                        STATUS: {status}
                    </span>
                </div>

                {/* Metrics Breakdown */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                }}>
                    <MetricItem
                        label="QKD Entropy"
                        value={`${metrics.qkdEntropy}%`}
                        icon="🔐"
                    />
                    <MetricItem
                        label="Attack Freq"
                        value={`${metrics.attackFrequency}/s`}
                        icon="🛡️"
                    />
                    <MetricItem
                        label="Ledger Integrity"
                        value={`${metrics.ledgerIntegrity}%`}
                        icon="📦"
                    />
                    <MetricItem
                        label="Network Latency"
                        value={`${metrics.networkLatency}ms`}
                        icon="📡"
                    />
                </div>
            </div>
        </div>
    );
}

function MetricItem({ label, value, icon }) {
    return (
        <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '0.75rem',
            borderRadius: '10px',
            textAlign: 'center'
        }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{icon}</div>
            <div style={{
                fontSize: '1.1rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--neon-cyan)',
                fontWeight: '700'
            }}>{value}</div>
            <div style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>{label}</div>
        </div>
    );
}

export default QuantumTrustScore;

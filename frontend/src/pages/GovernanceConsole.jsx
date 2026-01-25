import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

function GovernanceConsole() {
    const [metrics, setMetrics] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [pqcMode, setPqcMode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsRes, alertsRes, pqcRes] = await Promise.all([
                    axios.get('/api/security/metrics'),
                    axios.get('/api/security/governance/alerts'),
                    axios.get('/api/security/pqc/status')
                ]);
                setMetrics(metricsRes.data);
                setAlerts(alertsRes.data);
                setPqcMode(pqcRes.data);
            } catch (err) {
                console.error("Governance data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const togglePQC = async (mode) => {
        try {
            await axios.post('/api/security/pqc/toggle', { mode });
            const status = await axios.get('/api/security/pqc/status');
            setPqcMode(status.data);
        } catch (err) {
            console.error("PQC toggle failed", err);
        }
    };

    if (loading) return <div className="loading">Initializing Governance Console...</div>;

    return (
        <div className="page container-fluid" style={{ padding: '2rem' }}>
            <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2.4rem' }}>🧠 QUANTUM GOVERNANCE CONSOLE</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Super-Admin Election Oversight Dashboard</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="status-pill" style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid var(--primary-600)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span className="pulse" style={{ width: '8px', height: '8px', background: 'var(--primary-600)', borderRadius: '50%' }}></span>
                        AUTH LEVEL: SUPER-ADMIN
                    </div>
                </div>
            </div>

            <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {metrics.map(m => (
                    <div key={m.name} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{m.name}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>{m.value} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{m.unit}</span></div>
                        <div style={{
                            marginTop: '1rem',
                            fontSize: '0.7rem',
                            color: m.status === 'OPTIMAL' ? 'var(--success)' : 'var(--warning)',
                            fontWeight: 'bold'
                        }}>● {m.status}</div>
                    </div>
                ))}
            </div>

            <div className="main-governance-grid" style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '2rem'
            }}>
                {/* AI Observer & Migration */}
                <div className="left-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ height: '400px' }}>
                        <h4 style={{ marginBottom: '1rem' }}>QUANTUM ENTROPY HEALTH (24H)</h4>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={[
                                { t: '0h', v: 0.9992 }, { t: '4h', v: 0.9995 }, { t: '8h', v: 0.9991 },
                                { t: '12h', v: 0.9998 }, { t: '16h', v: 0.9994 }, { t: '20h', v: 0.9996 }, { t: '24h', v: 0.9999 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="t" stroke="var(--text-muted)" />
                                <YAxis domain={[0.999, 1.0]} stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ background: '#1B1D2A', border: '1px solid var(--glass-border)' }} />
                                <Area type="monotone" dataKey="v" stroke="var(--primary-600)" fill="rgba(125, 60, 152, 0.2)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card">
                        <h4 style={{ marginBottom: '1.5rem' }}>🔮 POST-QUANTUM MIGRATION ENGINE</h4>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Current Crypto Mode: <strong style={{ color: 'white' }}>{pqcMode?.details.name}</strong>
                                </p>
                                <div className="pqc-readiness" style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                        <span>Quantum Threat Readiness</span>
                                        <span style={{ color: 'var(--success)' }}>{pqcMode?.details.readiness}%</span>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${pqcMode?.details.readiness}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, var(--primary-600), var(--success))',
                                            transition: 'width 1s ease'
                                        }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => togglePQC('classical')}
                                        className={`btn btn-sm ${pqcMode?.mode === 'classical' ? 'btn-primary' : 'btn-secondary'}`}
                                    >Classical</button>
                                    <button
                                        onClick={() => togglePQC('hybrid')}
                                        className={`btn btn-sm ${pqcMode?.mode === 'hybrid' ? 'btn-primary' : 'btn-secondary'}`}
                                    >Hybrid (Recommended)</button>
                                    <button
                                        onClick={() => togglePQC('pqc')}
                                        className={`btn btn-sm ${pqcMode?.mode === 'pqc' ? 'btn-primary' : 'btn-secondary'}`}
                                    >Full PQC</button>
                                </div>
                            </div>
                            <div style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                border: '4px solid var(--glass-border)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SECURITY LEVEL</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{pqcMode?.details.level}</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--primary-600)' }}>Q-RESISTANT</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Observer & Alerts */}
                <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card">
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🤖 AI ELECTION OBSERVER
                        </h4>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--primary-600)' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                                "System integrity remains at 99.98%. Minor network jitter detected in Rayalaseema, but quantum channels are stable.
                                Voting surge in Guntur is consistent with historical patterns for this time slot."
                            </p>
                        </div>
                    </div>

                    <div className="card" style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '1rem' }}>🚨 ANOMALY & THREAT DETECTION</h4>
                        <div className="alerts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {alerts.alerts?.map((a, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            background: a.status === 'FLAGGED' ? 'var(--error)' : 'var(--warning)',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}>{a.status}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confidence: {(a.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{a.type.replace('_', ' ')}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {a.district || a.location || a.region}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '2rem' }}>
                            GENERATE INTEGRITY REPORT (PDF)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GovernanceConsole;

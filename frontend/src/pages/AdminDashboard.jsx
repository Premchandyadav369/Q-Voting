import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [electionType, setElectionType] = useState('MLA');
    const [results, setResults] = useState(null);
    const [partyResults, setPartyResults] = useState(null);
    const [quantumHealth, setQuantumHealth] = useState(null);
    const [error, setError] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState("AI Analyst is scanning voting patterns...");

    // IST Time formatter
    const formatTimeIST = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // AI Insight Generator (Mock)
    useEffect(() => {
        const insights = [
            "Analysis: Voter turnout in Srikakulam district is 15% higher than projected.",
            "Security Alert: 3 minor probe attempts detected on BB84 channel - Neutralized.",
            "Prediction: Current trend suggests a tight race in Vizag Urban constituencies.",
            "System Health: Quantum Key Distribution rate is optimal at 98% efficiency.",
            "Data Integrity: All block hashes verified against the immutable ledger."
        ];

        const interval = setInterval(() => {
            setAiAnalysis(insights[Math.floor(Math.random() * insights.length)]);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (selectedTab === 'results') {
            fetchResults();
        }
    }, [selectedTab, electionType]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [summaryRes, healthRes] = await Promise.all([
                axios.get('/api/results/dashboard/summary'),
                axios.get('/api/results/quantum/channel-health')
            ]);
            setSummary(summaryRes.data);
            setQuantumHealth(healthRes.data);
        } catch (err) {
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchResults = async () => {
        try {
            const [allRes, partyRes] = await Promise.all([
                axios.get(`/api/results/all/${electionType}`),
                axios.get(`/api/results/party-wise/${electionType}`)
            ]);
            setResults(allRes.data);
            setPartyResults(partyRes.data);
        } catch (err) {
            setError('Failed to load results');
        }
    };

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7'];

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner" style={{ width: '50px', height: '50px', borderWidth: '4px' }}></div>
                    <p style={{ marginTop: '1rem', color: 'var(--neon-cyan)', letterSpacing: '2px' }}>LOADING DATA...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem'
                }}>
                    ELECTION COMMAND CENTER
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Real-Time Quantum-Secure Election Monitoring
                </p>
                <div style={{
                    marginTop: '1rem',
                    display: 'inline-block',
                    padding: '0.5rem 1.5rem',
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid var(--neon-cyan)',
                    borderRadius: '20px',
                    color: 'var(--neon-cyan)'
                }}>
                    🕒 IST: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}
                </div>
            </div>

            {error && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid var(--neon-red)',
                    borderRadius: '8px',
                    color: 'var(--neon-red)',
                    textAlign: 'center'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* AI Analyst Bar */}
            <div className="glass-card" style={{
                marginBottom: '2rem',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                borderLeft: '4px solid var(--neon-purple)'
            }}>
                <div style={{
                    background: 'var(--neon-purple)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap'
                }}>
                    🤖 AI ANALYST
                </div>
                <div style={{
                    fontFamily: 'monospace',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    flex: 1
                }}>
                    {aiAnalysis}
                </div>
            </div>

            {/* Main Stats Grid */}
            {summary && (
                <div className="qsoc-grid" style={{ marginBottom: '3rem' }}>
                    <div className="glass-card qsoc-card">
                        <div className="qsoc-value">{summary.overview.total_votes.toLocaleString()}</div>
                        <div className="qsoc-label">TOTAL VOTES CAST</div>
                    </div>
                    <div className="glass-card qsoc-card">
                        <div className="qsoc-value" style={{ color: 'var(--neon-blue)' }}>{summary.mla_election.constituencies}</div>
                        <div className="qsoc-label">MLA CONSTITUENCIES</div>
                    </div>
                    <div className="glass-card qsoc-card">
                        <div className="qsoc-value" style={{ color: 'var(--neon-yellow)' }}>{summary.mp_election.constituencies}</div>
                        <div className="qsoc-label">MP CONSTITUENCIES</div>
                    </div>
                    <div className="glass-card qsoc-card">
                        <div className="qsoc-value" style={{
                            color: summary.quantum_security.status === 'SECURE' ? 'var(--neon-green)' : 'var(--neon-red)'
                        }}>
                            {summary.quantum_security.security_rate}%
                        </div>
                        <div className="qsoc-label">QUANTUM INTEGRITY</div>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: '1rem'
            }}>
                {['overview', 'results', 'quantum'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`btn ${selectedTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ minWidth: '150px' }}
                    >
                        {tab === 'overview' && '📋 DASHBOARD'}
                        {tab === 'results' && '📊 ELECTION DATA'}
                        {tab === 'quantum' && '⚛️ NETWORK STATUS'}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT - OVERVIEW */}
            {selectedTab === 'overview' && summary && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--neon-cyan)' }}>Voter Participation Trend</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { time: '08:00', votes: 1200 },
                                    { time: '10:00', votes: 4500 },
                                    { time: '12:00', votes: 15600 },
                                    { time: '14:00', votes: 28900 },
                                    { time: '16:00', votes: 45000 },
                                    { time: '18:00', votes: 67000 },
                                ]}>
                                    <defs>
                                        <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="time" stroke="var(--text-muted)" />
                                    <YAxis stroke="var(--text-muted)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'var(--neon-cyan)' }}
                                        labelStyle={{ color: 'var(--neon-cyan)' }}
                                    />
                                    <Area type="monotone" dataKey="votes" stroke="#00d4ff" fillOpacity={1} fill="url(#colorVotes)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--neon-purple)' }}>Constituency Status</h3>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Completed', value: 145 },
                                            { name: 'In Progress', value: 30 }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="var(--neon-green)" />
                                        <Cell fill="var(--neon-yellow)" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT - RESULTS */}
            {selectedTab === 'results' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <button className={`btn ${electionType === 'MLA' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setElectionType('MLA')}>MLA ASSEMBLY</button>
                        <button className={`btn ${electionType === 'MP' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setElectionType('MP')}>MP PARLIAMENT</button>
                    </div>

                    {partyResults && (
                        <div className="glass-card" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>PARTY VOTE SHARE</h3>
                            <div style={{ height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={partyResults.party_results} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                                        <XAxis type="number" stroke="var(--text-muted)" />
                                        <YAxis dataKey="party" type="category" width={100} stroke="var(--text-main)" />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#000', borderColor: 'var(--neon-cyan)' }}
                                        />
                                        <Bar dataKey="votes" fill="var(--neon-cyan)" radius={[0, 4, 4, 0]}>
                                            {partyResults.party_results.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {results && (
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem' }}>DETAILED CONSTITUENCY RESULTS</h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                                            <th style={{ padding: '1rem' }}>CONSTITUENCY</th>
                                            <th style={{ padding: '1rem' }}>DISTRICT</th>
                                            <th style={{ padding: '1rem' }}>TOTAL VOTES</th>
                                            <th style={{ padding: '1rem' }}>LEADING CANDIDATE</th>
                                            <th style={{ padding: '1rem' }}>PARTY</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.constituency_results.map((r, i) => (
                                            <tr key={r.constituency_id} style={{
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                                            }}>
                                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{r.constituency_name}</td>
                                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{r.district}</td>
                                                <td style={{ padding: '1rem' }}>{r.total_votes.toLocaleString()}</td>
                                                <td style={{ padding: '1rem', color: 'var(--neon-cyan)' }}>{r.winner?.candidate_name || '-'}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    {r.winner && (
                                                        <span className="badge" style={{
                                                            border: '1px solid var(--neon-purple)',
                                                            color: 'var(--neon-purple)',
                                                            padding: '0.25rem 0.5rem'
                                                        }}>
                                                            {r.winner.party}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT - QUANTUM */}
            {selectedTab === 'quantum' && quantumHealth && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                            {quantumHealth.channel_status === 'SECURE' ? '🛡️' : '⚠️'}
                        </div>
                        <h2 style={{
                            color: quantumHealth.channel_status === 'SECURE' ? 'var(--neon-green)' : 'var(--neon-red)',
                            marginBottom: '0.5rem'
                        }}>
                            SYSTEM {quantumHealth.channel_status}
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>Last Audit: {formatTimeIST(new Date())}</p>
                    </div>

                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Network Logs</h3>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {quantumHealth.recent_activity.map((log, i) => (
                                <div key={i} style={{
                                    padding: '0.75rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '4px',
                                    borderLeft: `3px solid ${log.secure ? 'var(--neon-green)' : 'var(--neon-red)'}`
                                }}>
                                    <span style={{ color: 'var(--text-muted)', marginRight: '1rem' }}>[{formatTimeIST(log.timestamp)}]</span>
                                    <span style={{ color: log.secure ? 'var(--neon-green)' : 'var(--neon-red)', fontWeight: 'bold', marginRight: '1rem' }}>
                                        {log.secure ? 'SECURE' : 'ALERT'}
                                    </span>
                                    <span>Error Rate: {log.error_rate}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;

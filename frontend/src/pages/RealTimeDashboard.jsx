import { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import AndhraPradeshMap from '../components/AndhraPradeshMap'

const PARTY_COLORS = {
    "TDP": "#FFEB3B",
    "YSRCP": "#1565C0",
    "JSP": "#E53935",
    "BJP": "#FF9933",
    "INC": "#00BCD4",
    "IND": "#9E9E9E",
    "KUTAMI": "#FFEB3B"
}

function RealTimeDashboard() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState(null)
    const [partyResults, setPartyResults] = useState({ mla: [], mp: [] })
    const [autoRefresh, setAutoRefresh] = useState(true)
    const [aiInsights, setAiInsights] = useState(null)
    const [loadingAi, setLoadingAi] = useState(false)
    const [qsocMetrics, setQsocMetrics] = useState({
        entropy: 98.7,
        fidelity: 99.2,
        decoherence: 0.03,
        threatLevel: 'LOW'
    })

    useEffect(() => {
        loadData()
        loadAiInsights()

        if (autoRefresh) {
            const interval = setInterval(() => {
                loadData()
                updateQSOC()
                if (Math.random() > 0.7) loadAiInsights()
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [autoRefresh])

    const loadData = async () => {
        try {
            const [summaryRes, mlaRes, mpRes] = await Promise.all([
                axios.get('/api/results/dashboard/summary'),
                axios.get('/api/results/party-wise/MLA'),
                axios.get('/api/results/party-wise/MP')
            ])
            setSummary(summaryRes.data)

            const processAlliance = (results) => {
                const allianceParties = ['TDP', 'JSP', 'BJP']
                let allianceVote = 0

                results.forEach(party => {
                    if (allianceParties.includes(party.party)) {
                        allianceVote += party.votes
                    }
                })

                if (allianceVote > 0) {
                    const totalVotes = results.reduce((acc, curr) => acc + curr.votes, 0)
                    const allianceObj = {
                        party: "KUTAMI",
                        color: "#FFEB3B",
                        votes: allianceVote,
                        percentage: totalVotes > 0 ? (allianceVote / totalVotes) * 100 : 0
                    }
                    return [allianceObj, ...results.filter(p => !allianceParties.includes(p.party))].sort((a, b) => b.votes - a.votes)
                }
                return results
            }

            setPartyResults({
                mla: processAlliance(mlaRes.data.party_results || []),
                mp: processAlliance(mpRes.data.party_results || [])
            })
            setLoading(false)
        } catch (err) {
            console.error('Failed to load data:', err)
            setLoading(false)
        }
    }

    const loadAiInsights = async () => {
        try {
            setLoadingAi(true)
            const response = await axios.get('/api/advanced/analytics/ai-insights')
            setAiInsights(response.data.insights)
            setLoadingAi(false)
        } catch (err) {
            console.error('Failed to load AI insights:', err)
            setLoadingAi(false)
        }
    }

    const updateQSOC = () => {
        setQsocMetrics({
            entropy: (97 + Math.random() * 2.5).toFixed(1),
            fidelity: (98.5 + Math.random() * 1.5).toFixed(1),
            decoherence: (0.01 + Math.random() * 0.04).toFixed(3),
            threatLevel: Math.random() > 0.9 ? 'MEDIUM' : 'LOW'
        })
    }

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <p style={{ color: 'var(--text-muted)' }}>Initializing Quantum Dashboard...</p>
            </div>
        )
    }

    return (
        <div style={{ background: 'var(--bg-space)', minHeight: '100vh' }}>
            {/* Header Bar */}
            <div className="container" style={{ padding: '2rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                            🗳️ Q-VOTING ULTRA — LIVE DASHBOARD
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Real-time voting data from Andhra Pradesh</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', background: autoRefresh ? 'rgba(34, 197, 94, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                            border: autoRefresh ? '1px solid var(--neon-green)' : '1px solid var(--text-muted)',
                            borderRadius: '20px', fontSize: '0.8rem'
                        }}>
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: autoRefresh ? 'var(--neon-green)' : 'var(--text-muted)',
                                animation: autoRefresh ? 'pulse 1.5s infinite' : 'none'
                            }} />
                            <span>{autoRefresh ? 'LIVE' : 'Paused'}</span>
                        </div>
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className="btn btn-secondary btn-sm"
                        >
                            {autoRefresh ? '⏸️' : '▶️'}
                        </button>
                    </div>
                </div>

                {/* QSOC Metrics */}
                <div className="qsoc-grid" style={{ marginBottom: '2rem' }}>
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
                        <div className="qsoc-label">⚛️ Decoherence</div>
                    </div>
                    <div className="glass-card qsoc-card">
                        <div className="qsoc-value" style={{ color: qsocMetrics.threatLevel === 'LOW' ? 'var(--neon-green)' : 'var(--neon-yellow)' }}>
                            {qsocMetrics.threatLevel}
                        </div>
                        <div className="qsoc-label">🚨 Threat Level</div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)' }}>
                            {summary?.overview?.total_votes?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Votes</div>
                    </div>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--neon-purple)' }}>
                            {summary?.mla_election?.votes_cast?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MLA Votes</div>
                    </div>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--neon-green)' }}>
                            {summary?.mp_election?.votes_cast?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MP Votes</div>
                    </div>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: summary?.quantum_security?.status === 'SECURE' ? 'var(--neon-green)' : 'var(--neon-yellow)' }}>
                            {summary?.quantum_security?.security_rate || 100}%
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quantum Security</div>
                    </div>
                </div>

                {/* AI Insights */}
                <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '3px solid var(--neon-purple)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>🤖</div>
                        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Gemini AI Election Insights</h3>
                        {loadingAi && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updating...</span>}
                    </div>
                    <div style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-main)' }}>
                        <ReactMarkdown>{aiInsights || 'Generating AI insights...'}</ReactMarkdown>
                    </div>
                </div>

                {/* Map and Party Results */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <AndhraPradeshMap />

                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>📊 Party Standing</h3>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>🏛️ MLA Election</h4>
                            {partyResults.mla.length > 0 ? (
                                partyResults.mla.slice(0, 5).map((party, i) => (
                                    <div key={party.party} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '8px', padding: '8px 12px',
                                        background: i === 0 ? `${party.color}20` : 'transparent',
                                        borderRadius: '8px', border: i === 0 ? `1px solid ${party.color}` : 'none'
                                    }}>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '4px',
                                            background: party.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: ['TDP', 'BJP', 'KUTAMI'].includes(party.party) ? '#000' : '#fff',
                                            fontWeight: '600', fontSize: '10px'
                                        }}>{i + 1}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{party.party}</div>
                                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px' }}>
                                                <div style={{ width: `${party.percentage}%`, height: '100%', background: party.color, borderRadius: '2px' }} />
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: '700', color: party.color, fontSize: '0.9rem' }}>
                                            {party.votes?.toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>No votes yet</div>
                            )}
                        </div>

                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>🇮🇳 MP Election</h4>
                            {partyResults.mp.length > 0 ? (
                                partyResults.mp.slice(0, 5).map((party, i) => (
                                    <div key={party.party} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '8px', padding: '8px 12px',
                                        background: i === 0 ? `${party.color}20` : 'transparent',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '4px',
                                            background: party.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: ['TDP', 'BJP', 'KUTAMI'].includes(party.party) ? '#000' : '#fff',
                                            fontWeight: '600', fontSize: '10px'
                                        }}>{i + 1}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{party.party}</div>
                                        </div>
                                        <div style={{ fontWeight: '700', color: party.color, fontSize: '0.9rem' }}>
                                            {party.votes?.toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>No votes yet</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RealTimeDashboard

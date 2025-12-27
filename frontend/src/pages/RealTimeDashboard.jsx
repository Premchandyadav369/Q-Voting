import { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import RealTimeMap from '../components/RealTimeMap'
import { useLanguage } from '../context/LanguageContext'

const PARTY_COLORS = {
    "TDP": "#FFEB3B",
    "YSRCP": "#1565C0",
    "JSP": "#E53935",
    "BJP": "#FF9933",
    "INC": "#00BCD4",
    "IND": "#9E9E9E"
}

function RealTimeDashboard() {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState(null)
    const [partyResults, setPartyResults] = useState({ mla: [], mp: [] })
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [autoRefresh, setAutoRefresh] = useState(true)
    const [aiInsights, setAiInsights] = useState(null)
    const [loadingAi, setLoadingAi] = useState(false)

    useEffect(() => {
        loadData()
        loadAiInsights()

        if (autoRefresh) {
            const interval = setInterval(() => {
                loadData()
                if (Math.random() > 0.7) loadAiInsights() // Refresh AI less frequently
            }, 10000)
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
            setPartyResults({
                mla: mlaRes.data.party_results || [],
                mp: mpRes.data.party_results || []
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

    const handleDistrictClick = (districtName, data) => {
        setSelectedDistrict({ name: districtName, ...data })
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading-container" style={{ minHeight: '400px' }}>
                    <div className="spinner"></div>
                    <span>{t('loading_dashboard') || 'Loading real-time dashboard...'}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1>🗳️ {t('dashboard_title') || 'Real-Time Election Dashboard'}</h1>
                    <p style={{ color: 'var(--neutral-600)' }}>
                        {t('dashboard_subtitle') || 'Live voting data from Andhra Pradesh'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', background: autoRefresh ? '#dcfce7' : '#f1f5f9',
                        borderRadius: '20px', fontSize: '14px'
                    }}>
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: autoRefresh ? '#22c55e' : '#9ca3af',
                            animation: autoRefresh ? 'pulse 2s infinite' : 'none'
                        }} />
                        <span>{autoRefresh ? (t('live') || 'LIVE') : (t('paused') || 'Paused')}</span>
                    </div>
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className="btn btn-sm btn-secondary"
                    >
                        {autoRefresh ? '⏸️' : '▶️'}
                    </button>
                    <button onClick={loadAiInsights} className="btn btn-sm btn-ghost" title="Refresh AI Insights">
                        🤖
                    </button>
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="card ai-card" style={{
                marginBottom: '24px',
                border: '1px solid var(--primary-200)',
                background: 'linear-gradient(135deg, #ffffff, #f0f9ff)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '24px' }}>🤖</div>
                    <h3 style={{ margin: 0 }}>Gemini AI {t('election_insights') || 'Election Insights'}</h3>
                    {loadingAi && <div className="spinner-sm"></div>}
                </div>
                <div className="ai-content" style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6' }}>
                    <ReactMarkdown>{aiInsights || 'Generating AI insights...'}</ReactMarkdown>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #1e3a5f, #2b4d7a)', color: 'white' }}>
                    <div className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>{t('total_votes') || 'Total Votes'}</div>
                    <div className="stat-value" style={{ fontSize: '2.5rem' }}>
                        {summary?.overview?.total_votes?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">MLA {t('votes') || 'Votes'}</div>
                    <div className="stat-value">{summary?.mla_election?.votes_cast?.toLocaleString() || 0}</div>
                    <div className="stat-change positive">{summary?.mla_election?.constituencies || 0} {t('constituencies') || 'constituencies'}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">MP {t('votes') || 'Votes'}</div>
                    <div className="stat-value">{summary?.mp_election?.votes_cast?.toLocaleString() || 0}</div>
                    <div className="stat-change positive">{summary?.mp_election?.constituencies || 0} {t('constituencies') || 'constituencies'}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">{t('quantum_security') || 'Quantum Security'}</div>
                    <div className="stat-value" style={{
                        color: summary?.quantum_security?.status === 'SECURE' ? '#22c55e' : '#f59e0b'
                    }}>
                        {summary?.quantum_security?.security_rate || 100}%
                    </div>
                </div>
            </div>

            {/* Map and Results */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', marginBottom: '24px' }}>
                <RealTimeMap onDistrictClick={handleDistrictClick} />

                {/* Party-wise Results */}
                <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>📊 {t('party_standing') || 'Party-wise Standing'}</h3>

                    <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '12px' }}>
                            🏛️ MLA Election
                        </h4>
                        {partyResults.mla.length > 0 ? (
                            partyResults.mla.slice(0, 5).map((party, i) => (
                                <div key={party.party} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    marginBottom: '8px', padding: '8px 12px',
                                    background: i === 0 ? `${party.color}20` : 'transparent',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '4px',
                                        background: party.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: ['TDP', 'BJP'].includes(party.party) ? '#000' : '#fff',
                                        fontWeight: '600', fontSize: '10px'
                                    }}>{i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600' }}>{party.party}</div>
                                        <div className="progress-bar" style={{ height: '6px', marginTop: '4px' }}>
                                            <div className="progress-fill" style={{ width: `${party.percentage}%`, background: party.color }} />
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700', color: party.color }}>
                                        {party.votes?.toLocaleString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--neutral-400)' }}>
                                {t('no_votes_yet') || 'No votes yet'}
                            </div>
                        )}
                    </div>

                    <div>
                        <h4 style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '12px' }}>
                            🇮🇳 MP Election
                        </h4>
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
                                        color: ['TDP', 'BJP'].includes(party.party) ? '#000' : '#fff',
                                        fontWeight: '600', fontSize: '10px'
                                    }}>{i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600' }}>{party.party}</div>
                                        <div className="progress-bar" style={{ height: '6px', marginTop: '4px' }}>
                                            <div className="progress-fill" style={{ width: `${party.percentage}%`, background: party.color }} />
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700', color: party.color }}>
                                        {party.votes?.toLocaleString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--neutral-400)' }}>
                                {t('no_votes_yet') || 'No votes yet'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .ai-card {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ai-card:hover {
            transform: translateY(-4px);
        }
        .spinner-sm {
            width: 16px;
            height: 16px;
            border: 2px solid #e2e8f0;
            border-top: 2px solid var(--primary-500);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}

export default RealTimeDashboard

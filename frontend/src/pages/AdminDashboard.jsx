import { useState, useEffect } from 'react'
import axios from 'axios'

function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState(null)
    const [selectedTab, setSelectedTab] = useState('overview')
    const [electionType, setElectionType] = useState('MLA')
    const [results, setResults] = useState(null)
    const [partyResults, setPartyResults] = useState(null)
    const [quantumHealth, setQuantumHealth] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    useEffect(() => {
        if (selectedTab === 'results') {
            fetchResults()
        }
    }, [selectedTab, electionType])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const [summaryRes, healthRes] = await Promise.all([
                axios.get('/api/results/dashboard/summary'),
                axios.get('/api/results/quantum/channel-health')
            ])
            setSummary(summaryRes.data)
            setQuantumHealth(healthRes.data)
        } catch (err) {
            setError('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    const fetchResults = async () => {
        try {
            const [allRes, partyRes] = await Promise.all([
                axios.get(`/api/results/all/${electionType}`),
                axios.get(`/api/results/party-wise/${electionType}`)
            ])
            setResults(allRes.data)
            setPartyResults(partyRes.data)
        } catch (err) {
            setError('Failed to load results')
        }
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading-container" style={{ minHeight: '400px' }}>
                    <div className="spinner"></div>
                    <span>Loading dashboard...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1>📊 Election Dashboard</h1>
                <p style={{ color: 'var(--neutral-600)' }}>
                    Real-time voting statistics and quantum security monitoring
                </p>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Stats Overview */}
            {summary && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Votes Cast</div>
                        <div className="stat-value">{summary.overview.total_votes}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">MLA Votes</div>
                        <div className="stat-value">{summary.mla_election.votes_cast}</div>
                        <div className="stat-change positive">
                            {summary.mla_election.constituencies} constituencies
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">MP Votes</div>
                        <div className="stat-value">{summary.mp_election.votes_cast}</div>
                        <div className="stat-change positive">
                            {summary.mp_election.constituencies} constituencies
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Quantum Security</div>
                        <div className="stat-value" style={{
                            color: summary.quantum_security.status === 'SECURE' ? 'var(--success)' : 'var(--warning)'
                        }}>
                            {summary.quantum_security.security_rate}%
                        </div>
                        <div className="stat-change">
                            <span className={`badge ${summary.quantum_security.status === 'SECURE' ? 'badge-success' : 'badge-warning'}`}>
                                {summary.quantum_security.status}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--neutral-200)', paddingBottom: '8px' }}>
                {['overview', 'results', 'quantum'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`btn ${selectedTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {tab === 'overview' && '📋 '}
                        {tab === 'results' && '📊 '}
                        {tab === 'quantum' && '⚛️ '}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {selectedTab === 'overview' && summary && (
                <div className="card">
                    <h3 style={{ marginBottom: '24px' }}>System Overview</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div style={{ padding: '16px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '14px', color: 'var(--neutral-500)' }}>Total Constituencies</div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{summary.overview.total_constituencies}</div>
                        </div>
                        <div style={{ padding: '16px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '14px', color: 'var(--neutral-500)' }}>Total Candidates</div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{summary.overview.total_candidates}</div>
                        </div>
                        <div style={{ padding: '16px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '14px', color: 'var(--neutral-500)' }}>Last Updated</div>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>
                                {new Date(summary.last_updated).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedTab === 'results' && (
                <div>
                    {/* Election Type Toggle */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                        <button
                            className={`btn ${electionType === 'MLA' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setElectionType('MLA')}
                        >
                            🏛️ MLA Results
                        </button>
                        <button
                            className={`btn ${electionType === 'MP' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setElectionType('MP')}
                        >
                            🇮🇳 MP Results
                        </button>
                    </div>

                    {/* Party-wise Results */}
                    {partyResults && (
                        <div className="card" style={{ marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '16px' }}>Party-wise Vote Share</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {partyResults.party_results.map((party, index) => (
                                    <div key={party.party} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '80px', fontWeight: '600' }}>{party.party}</div>
                                        <div style={{ flex: 1 }}>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${party.percentage}%`,
                                                        background: index === 0 ? 'var(--success)' : 'var(--primary-500)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ width: '100px', textAlign: 'right' }}>
                                            {party.votes} votes ({party.percentage}%)
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--neutral-50)', borderRadius: '8px' }}>
                                <strong>Total Votes:</strong> {partyResults.total_votes}
                            </div>
                        </div>
                    )}

                    {/* Constituency Results Table */}
                    {results && (
                        <div className="card">
                            <h3 style={{ marginBottom: '16px' }}>
                                Constituency-wise Results ({results.constituencies_with_votes}/{results.total_constituencies} counted)
                            </h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>Constituency</th>
                                            <th>District</th>
                                            <th>Votes</th>
                                            <th>Leading</th>
                                            <th>Party</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.constituency_results.slice(0, 20).map(r => (
                                            <tr key={r.constituency_id}>
                                                <td>{r.constituency_name}</td>
                                                <td>{r.district}</td>
                                                <td>{r.total_votes}</td>
                                                <td>{r.winner?.candidate_name || '-'}</td>
                                                <td>
                                                    {r.winner && (
                                                        <span className="badge badge-info">{r.winner.party}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {results.constituency_results.length > 20 && (
                                <p style={{ marginTop: '16px', color: 'var(--neutral-500)', fontSize: '14px' }}>
                                    Showing 20 of {results.constituency_results.length} constituencies
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {selectedTab === 'quantum' && quantumHealth && (
                <div className="card">
                    <h3 style={{ marginBottom: '24px' }}>⚛️ Quantum Channel Health</h3>

                    <div className="stats-grid" style={{ marginBottom: '24px' }}>
                        <div className="stat-card">
                            <div className="stat-label">Total Sessions</div>
                            <div className="stat-value">{quantumHealth.total_quantum_sessions}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Secure Sessions</div>
                            <div className="stat-value" style={{ color: 'var(--success)' }}>
                                {quantumHealth.secure_sessions}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Compromised</div>
                            <div className="stat-value" style={{ color: 'var(--warning)' }}>
                                {quantumHealth.compromised_sessions}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Eavesdrop Attempts</div>
                            <div className="stat-value" style={{ color: 'var(--error)' }}>
                                {quantumHealth.eavesdropping_attempts}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        padding: '24px',
                        background: quantumHealth.channel_status === 'SECURE' ? 'var(--success-light)' : 'var(--warning-light)',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
                            {quantumHealth.channel_status === 'SECURE' ? '🛡️' : '⚠️'}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '700' }}>
                            Channel Status: {quantumHealth.channel_status}
                        </div>
                        <div style={{ color: 'var(--neutral-600)' }}>
                            Security Rate: {quantumHealth.security_rate}%
                        </div>
                    </div>

                    {quantumHealth.recent_activity?.length > 0 && (
                        <div style={{ marginTop: '24px' }}>
                            <h4 style={{ marginBottom: '12px' }}>Recent Activity</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {quantumHealth.recent_activity.map((activity, index) => (
                                    <div key={index} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px', background: 'var(--neutral-50)', borderRadius: '8px'
                                    }}>
                                        <span className={`badge ${activity.secure ? 'badge-success' : 'badge-warning'}`}>
                                            {activity.secure ? '✓ Secure' : '⚠ Alert'}
                                        </span>
                                        <span style={{ flex: 1, fontSize: '14px' }}>
                                            Error Rate: {activity.error_rate}
                                        </span>
                                        <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>
                                            {new Date(activity.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            <div className="alert alert-warning" style={{ marginTop: '32px' }}>
                <span>⚠️</span>
                <span>
                    <strong>Academic Simulation:</strong> All data shown is simulated for demonstration purposes.
                    This is not affiliated with the Election Commission of India.
                </span>
            </div>
        </div>
    )
}

export default AdminDashboard

import { useState, useEffect } from 'react'
import axios from 'axios'

function LiveAnalytics() {
    const [loading, setLoading] = useState(true)
    const [analytics, setAnalytics] = useState(null)
    const [heatmap, setHeatmap] = useState(null)
    const [autoRefresh, setAutoRefresh] = useState(true)

    useEffect(() => {
        loadData()

        if (autoRefresh) {
            const interval = setInterval(loadData, 10000) // Refresh every 10 seconds
            return () => clearInterval(interval)
        }
    }, [autoRefresh])

    const loadData = async () => {
        try {
            const [analyticsRes, heatmapRes] = await Promise.all([
                axios.get('/api/advanced/analytics/realtime'),
                axios.get('/api/advanced/analytics/heatmap')
            ])
            setAnalytics(analyticsRes.data)
            setHeatmap(heatmapRes.data)
            setLoading(false)
        } catch (err) {
            console.error('Failed to load analytics:', err)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading-container" style={{ minHeight: '400px' }}>
                    <div className="spinner"></div>
                    <span>Loading live analytics...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1>📊 Live Election Analytics</h1>
                    <p style={{ color: 'var(--neutral-600)' }}>
                        Real-time voting statistics and predictions
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        <span>Auto-refresh</span>
                    </label>
                    <button onClick={loadData} className="btn btn-primary btn-sm">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Votes</div>
                    <div className="stat-value" style={{ color: 'var(--primary-600)' }}>
                        {analytics?.total_votes || 0}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Votes Per Hour</div>
                    <div className="stat-value">
                        {analytics?.turnout_prediction?.hourly_rate || 0}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Predicted Final</div>
                    <div className="stat-value" style={{ color: 'var(--success)' }}>
                        {analytics?.turnout_prediction?.predicted_final || 0}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Confidence</div>
                    <div className="stat-value">
                        {analytics?.turnout_prediction?.confidence || 0}%
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
                {/* District Heatmap */}
                <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>🗺️ District-wise Participation</h3>

                    {heatmap?.heatmap && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {heatmap.heatmap.map(district => (
                                <div key={district.district} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '120px', fontWeight: '500', fontSize: '14px' }}>
                                        {district.district}
                                    </div>
                                    <div style={{ flex: 1, height: '24px', background: 'var(--neutral-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${district.intensity * 100}%`,
                                                height: '100%',
                                                background: `linear-gradient(90deg, var(--primary-400), var(--primary-600))`,
                                                borderRadius: '4px',
                                                transition: 'width 0.5s',
                                                minWidth: district.votes > 0 ? '4px' : '0'
                                            }}
                                        />
                                    </div>
                                    <div style={{ width: '60px', textAlign: 'right', fontWeight: '600' }}>
                                        {district.votes}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Districts */}
                <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>🏆 Top Participating Districts</h3>

                    {analytics?.top_districts && (
                        <div>
                            {analytics.top_districts.length > 0 ? (
                                analytics.top_districts.map(([district, votes], index) => (
                                    <div key={district} style={{
                                        display: 'flex', alignItems: 'center', gap: '16px',
                                        padding: '12px', marginBottom: '8px',
                                        background: index === 0 ? 'var(--warning-light)' : 'var(--neutral-50)',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '50%',
                                            background: index === 0 ? 'var(--warning)' : 'var(--primary-500)',
                                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: '700'
                                        }}>
                                            {index + 1}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600' }}>{district}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>District</div>
                                        </div>
                                        <div style={{ fontWeight: '700', fontSize: '20px', color: 'var(--primary-600)' }}>
                                            {votes}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--neutral-400)' }}>
                                    No votes recorded yet
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Trend Prediction */}
            <div className="card" style={{ marginTop: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>📈 Turnout Prediction</h3>

                <div style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    textAlign: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '4px' }}>Current</div>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary-700)' }}>
                            {analytics?.turnout_prediction?.current_votes || 0}
                        </div>
                    </div>
                    <div style={{ fontSize: '32px', color: 'var(--neutral-300)' }}>→</div>
                    <div>
                        <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '4px' }}>Predicted</div>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--success)' }}>
                            {analytics?.turnout_prediction?.predicted_final || 0}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '4px' }}>Hours Left</div>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--warning)' }}>
                            {analytics?.turnout_prediction?.remaining_hours || 0}
                        </div>
                    </div>
                </div>

                <div className="alert alert-info" style={{ marginTop: '16px' }}>
                    <span>ℹ️</span>
                    <span>
                        Predictions are based on current voting rate with a decay factor applied.
                        Actual results may vary based on voter behavior patterns.
                    </span>
                </div>
            </div>

            {/* Last Updated */}
            <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--neutral-500)', fontSize: '14px' }}>
                Last updated: {analytics?.timestamp ? new Date(analytics.timestamp).toLocaleString() : 'N/A'}
            </div>
        </div>
    )
}

export default LiveAnalytics

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QSOCDashboard = () => {
    const [metrics, setMetrics] = useState([]);
    const [threats, setThreats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsRes, threatsRes] = await Promise.all([
                    axios.get('/api/security/metrics'),
                    axios.get('/api/security/threats')
                ]);
                setMetrics(metricsRes.data);
                setThreats(threatsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching QSOC data:', error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div style={{ color: 'var(--primary-300)', padding: '20px', textAlign: 'center', fontSize: '12px' }}>
            SYNCHRONIZING WITH QUANTUM HARDWARE...
        </div>
    );

    return (
        <div className="qsoc-dashboard" style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(20px)',
            marginBottom: '32px'
        }}>
            <h3 style={{
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '900',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                letterSpacing: '2px'
            }}>
                <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 10px #ef4444', animation: 'pulse 1s infinite' }}></span>
                QUANTUM SECURITY OPERATIONS CENTER (QSOC) - MONITORING ACTIVE
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {metrics.map((metric, idx) => (
                    <div key={idx} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ fontSize: '10px', color: 'var(--neutral-400)', fontWeight: '800', marginBottom: '8px', textTransform: 'uppercase' }}>{metric.name}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <div style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>{metric.value}</div>
                            <div style={{ fontSize: '10px', color: 'var(--primary-400)', fontWeight: '700' }}>{metric.unit}</div>
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '9px', fontWeight: '900', color: metric.status === 'OPTIMAL' ? '#22c55e' : '#eab308' }}>
                            ● {metric.status}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ color: 'white', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>NEUTRALIZED SECURITY ANOMALIES</h4>
                    <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700' }}>LIVE THREAT FEED</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {threats.map((threat, idx) => (
                        <div key={idx} style={{
                            background: 'rgba(239, 68, 68, 0.05)',
                            borderLeft: `3px solid ${threat.severity === 'CRITICAL' ? '#ef4444' : '#eab308'}`,
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '900', color: 'white' }}>{threat.type}</span>
                                    <span style={{ fontSize: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{threat.severity}</span>
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--neutral-400)' }}>{threat.description}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '9px', color: '#22c55e', fontWeight: '900', marginBottom: '2px' }}>{threat.status}</div>
                                <div style={{ fontSize: '8px', color: 'var(--neutral-500)' }}>{new Date(threat.timestamp).toLocaleTimeString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QSOCDashboard;

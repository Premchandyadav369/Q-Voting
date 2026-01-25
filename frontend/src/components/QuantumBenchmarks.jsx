import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuantumBenchmarks = () => {
    const [benchmarks, setBenchmarks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBenchmarks = async () => {
            try {
                const response = await axios.get('/api/advanced/quantum/benchmarks');
                setBenchmarks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch benchmarks:', error);
                setLoading(false);
            }
        };

        fetchBenchmarks();
        const interval = setInterval(fetchBenchmarks, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{ color: 'var(--neutral-500)', fontSize: '12px' }}>LOADING QUANTUM METRICS...</div>;
    if (!benchmarks) return null;

    return (
        <div className="card" style={{
            background: 'var(--bg-glass)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px',
            borderRadius: '16px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary-300)', fontWeight: '800' }}>
                    📡 LIVE QUANTUM BENCHMARKS
                </h3>
                <span style={{
                    fontSize: '10px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: '800'
                }}>QISKIT ACTIVE</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--primary-400)', marginBottom: '4px' }}>CIRCUIT DEPTH</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--white)' }}>{benchmarks.circuit_depth}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--primary-400)', marginBottom: '4px' }}>GATE COUNT</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--white)' }}>{benchmarks.gates.h + benchmarks.gates.x + benchmarks.gates.measure || 3}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--primary-400)', marginBottom: '4px' }}>QUANTUM FIDELITY</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffd700' }}>{(benchmarks.quantum_fidelity * 100).toFixed(1)}%</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--primary-400)', marginBottom: '4px' }}>EXECUTION TIME</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--white)' }}>{benchmarks.simulation_time_ms}ms</div>
                </div>
            </div>

            {benchmarks.ai_insight && (
                <div style={{
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    padding: '16px',
                    borderRadius: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🤖</span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-300)', letterSpacing: '1px' }}>GEMINI AI INSIGHT</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--neutral-300)', lineHeight: '1.5', fontStyle: 'italic' }}>
                        "{benchmarks.ai_insight}"
                    </p>
                </div>
            )}

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--neutral-600)' }}>
                    BACKEND: {benchmarks.backend.toUpperCase()} | SHOTS: {benchmarks.shots}
                </span>
            </div>
        </div>
    );
};

export default QuantumBenchmarks;

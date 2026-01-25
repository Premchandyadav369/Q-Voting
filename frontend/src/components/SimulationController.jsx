import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SimulationController = () => {
    const [numVoters, setNumVoters] = useState(10);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [progress, setProgress] = useState(0);

    // New states for multi-constituency
    const [mode, setMode] = useState('STATE-WIDE'); // 'STATE-WIDE' or 'TARGETED'
    const [allConstituencies, setAllConstituencies] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    useEffect(() => {
        fetchConstituencies();
    }, []);

    const fetchConstituencies = async (retryCount = 0) => {
        setFetchingData(true);
        setStatus(retryCount > 0 ? `Retrying connection... (${retryCount}/3)` : null);

        try {
            const [mlaRes, mpRes] = await Promise.all([
                axios.get('/api/voting/constituencies/MLA', { timeout: 8000 }),
                axios.get('/api/voting/constituencies/MP', { timeout: 8000 })
            ]);

            const mlaList = mlaRes.data.constituencies || [];
            const mpList = mpRes.data.constituencies || [];

            // Merge and sort
            const merged = [...mlaList, ...mpList]
                .sort((a, b) => a.name.localeCompare(b.name));

            setAllConstituencies(merged);
            setFetchingData(false);
            if (retryCount > 0) setStatus(null); // Clear retry message on success

        } catch (error) {
            console.error(`Failed to fetch constituencies (Attempt ${retryCount + 1}):`, error);

            if (retryCount < 3) {
                // Retry with backoff (2s, 4s, 6s)
                const delay = (retryCount + 1) * 2000;
                setTimeout(() => fetchConstituencies(retryCount + 1), delay);
            } else {
                setFetchingData(false);
                setStatus('Error: Could not load constituency data. Server might be busy simulating.');
            }
        }
    };

    const runSimulation = async () => {
        setLoading(true);
        setStatus('Initializing Quantum Sessions...');
        setProgress(10);

        // Dispatch Global Event for Ultra UI Synchronization
        window.dispatchEvent(new CustomEvent('VOTE_SURGE_STARTED', {
            detail: { volume: numVoters, mode: mode }
        }));

        try {
            const payload = {
                num_voters: parseInt(numVoters),
                district: "All State"
            };

            if (mode === 'TARGETED' && selectedIds.length > 0) {
                payload.constituency_ids = selectedIds;
            }

            const response = await axios.post('/api/advanced/simulate/batch', payload, {
                timeout: 60000 // 60s timeout for large batches
            });

            setProgress(100);
            setStatus(`Successfully simulated ${response.data.voters_simulated} voters! (${response.data.total_votes} votes cast)`);

            setTimeout(() => {
                setStatus(null);
                setLoading(false);
                setProgress(0);
            }, 5000);

        } catch (error) {
            console.error('Simulation failed:', error);
            setStatus('Error: Simulation failed. ' + (error.response?.data?.detail || ''));
            setLoading(false);
        }
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const filtered = allConstituencies.filter(c => {
        const search = searchTerm.toUpperCase();
        return (
            c.name.toUpperCase().includes(search) ||
            c.district.toUpperCase().includes(search) ||
            c.election_type.toUpperCase().includes(search)
        );
    });

    // Show top matches if search is empty but focused
    const displayList = searchTerm ? filtered : allConstituencies.slice(0, 50);

    return (
        <div className="card" style={{
            background: 'var(--bg-glass)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)'
        }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--primary-300)', fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '1px' }}>
                <span>🚀 ADVANCED SIMULATOR</span>
                {fetchingData && <span style={{ fontSize: '10px', color: 'var(--accent-blue)', animation: 'pulse 1.5s infinite' }}>LOADING DATA...</span>}
            </h3>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
                <button
                    onClick={() => { setMode('STATE-WIDE'); setShowDropdown(false); }}
                    style={{
                        padding: '10px 24px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', border: 'none',
                        background: mode === 'STATE-WIDE' ? 'var(--primary-500)' : 'transparent',
                        color: mode === 'STATE-WIDE' ? 'white' : '#64748b',
                        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: mode === 'STATE-WIDE' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                    }}
                >STATE-WIDE</button>
                <button
                    onClick={() => setMode('TARGETED')}
                    style={{
                        padding: '10px 24px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', border: 'none',
                        background: mode === 'TARGETED' ? 'var(--primary-500)' : 'transparent',
                        color: mode === 'TARGETED' ? 'white' : '#64748b',
                        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: mode === 'TARGETED' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                    }}
                >TARGETED</button>
            </div>

            {mode === 'TARGETED' && (
                <div style={{ marginBottom: '28px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--primary-300)', fontWeight: '800', letterSpacing: '0.5px' }}>
                            SELECT TARGET CONSTITUENCIES ({selectedIds.length})
                        </label>
                        {allConstituencies.length === 0 && !fetchingData && (
                            <button onClick={fetchConstituencies} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '10px', fontWeight: '800', cursor: 'pointer' }}>RETRY LOAD</button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="SEARCH NAME, DISTRICT, OR MLA/MP..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                                onFocus={() => setShowDropdown(true)}
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontSize: '14px',
                                    borderRadius: '14px',
                                    padding: '14px 18px',
                                    width: '100%',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease'
                                }}
                            />
                            {searchTerm && (
                                <span
                                    onClick={() => setSearchTerm('')}
                                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}
                                >✕</span>
                            )}
                        </div>
                    </div>

                    {showDropdown && (
                        <>
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                                onClick={() => setShowDropdown(false)}
                            />
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                                background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px',
                                maxHeight: '300px', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
                                padding: '10px', marginTop: '8px', scrollbarWidth: 'thin'
                            }}>
                                {allConstituencies.length === 0 && !fetchingData ? (
                                    <div style={{ padding: '30px', textAlign: 'center', color: '#f87171', fontSize: '13px', fontWeight: '600' }}>
                                        ⚠️ DATA NOT AVAILABLE. <br /> <span style={{ fontSize: '11px', opacity: 0.8 }}>PLEASE CHECK SERVER CONNECTION.</span>
                                    </div>
                                ) : displayList.length > 0 ? displayList.map(c => (
                                    <div
                                        key={`${c.election_type}-${c.id}`}
                                        onClick={() => toggleSelection(c.id)}
                                        style={{
                                            padding: '14px 18px', borderRadius: '10px', marginBottom: '4px', cursor: 'pointer',
                                            background: selectedIds.includes(c.id) ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: selectedIds.includes(c.id) ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '800', color: 'white' }}>{c.name}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{c.district.toUpperCase()} • <span style={{ color: 'var(--primary-400)', fontWeight: '700' }}>{c.election_type}</span></div>
                                        </div>
                                        {selectedIds.includes(c.id) && <div style={{ background: '#22c55e', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>✓</div>}
                                    </div>
                                )) : (
                                    <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>NO RESULTS FOUND</div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Selected Tags */}
                    {selectedIds.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
                            {allConstituencies.filter(c => selectedIds.includes(c.id)).slice(0, 12).map(c => (
                                <div key={c.id} style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#818cf8', padding: '8px 14px', borderRadius: '25px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}>
                                    {c.name}
                                    <span onClick={(e) => { e.stopPropagation(); toggleSelection(c.id); }} style={{ cursor: 'pointer', fontSize: '14px', opacity: 0.7, hover: { opacity: 1 } }}>×</span>
                                </div>
                            ))}
                            {selectedIds.length > 12 && <div style={{ color: '#64748b', fontSize: '12px', alignSelf: 'center', fontWeight: '700' }}>+{selectedIds.length - 12} MORE</div>}
                            <button onClick={() => setSelectedIds([])} style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '11px', fontWeight: '900', cursor: 'pointer', padding: '0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>RESET ALL</button>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--primary-300)', fontWeight: '900', marginBottom: '12px', letterSpacing: '0.5px' }}>
                        VOTER BATCH VOLUME
                    </label>
                    <select
                        className="form-select"
                        value={numVoters}
                        onChange={(e) => setNumVoters(e.target.value)}
                        disabled={loading}
                        style={{
                            width: '100%', background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                            borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: '700', outline: 'none'
                        }}
                    >
                        <option value="10">10 VOTERS</option>
                        <option value="100">100 VOTERS</option>
                        <option value="1000">1,000 VOTERS</option>
                        <option value="10000">10,000 VOTERS</option>
                        <option value="100000">100,000 VOTERS</option>
                    </select>
                </div>

                <button
                    onClick={runSimulation}
                    className="btn btn-quantum"
                    disabled={loading || (mode === 'TARGETED' && selectedIds.length === 0)}
                    style={{ flex: 1, marginTop: '24px', padding: '16px', borderRadius: '14px', fontSize: '14px', fontWeight: '900' }}
                >
                    {loading ? 'INITIATING BATCH...' : '🔥 RUN SIMULATION'}
                </button>
            </div>

            {loading && (
                <div style={{ marginTop: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--primary-300)', marginBottom: '10px', fontWeight: '900' }}>
                        <span>QUANTUM CHANNEL: STABLE</span>
                        <span>{progress}%</span>
                    </div>
                    <div style={{
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #6366f1, #a855f7, #6366f1)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s linear infinite',
                            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                    </div>
                </div>
            )}

            {status && (
                <div style={{
                    marginTop: '24px',
                    padding: '14px 20px',
                    background: status.includes('Error') ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                    border: `1px solid ${status.includes('Error') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                    borderRadius: '14px',
                    color: status.includes('Error') ? '#f87171' : '#4ade80',
                    fontSize: '13px',
                    fontWeight: '800',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {status.toUpperCase()}
                </div>
            )}
        </div>
    );
};

export default SimulationController;

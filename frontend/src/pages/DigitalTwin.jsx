import { useState, useEffect } from 'react';

function DigitalTwin() {
    const [currentTime, setCurrentTime] = useState(0); // 0 to 100% of election day
    const [isPlaying, setIsPlaying] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Mock election events for the twin
    const mockEvents = [
        { time: 5, type: 'POLLS_OPEN', label: 'Polls Open State-wide', details: 'All 175 MLA and 25 MP constituencies active.' },
        { time: 15, type: 'SURGE', label: 'Morning Surge: Vizag', details: 'Sudden 15% turnout increase in Visakhapatnam North.' },
        { time: 30, type: 'ATTACK', label: 'Eve Intercept Detected', details: 'Attempted eavesdropping on Quantum Channel 14 (Chittoor).' },
        { time: 32, type: 'MITIGATION', label: 'Automatic Channel Reroute', details: 'BB84 protocol discarded compromised keys; established new secure link.' },
        { time: 50, type: 'CRITICAL', label: 'Mid-Day Load Peak', details: 'System processing 50,000 votes/minute. WAL mode maintaining <5ms latency.' },
        { time: 70, type: 'SURGE', label: 'Evening Surge: Guntur', details: 'Rural turnout peaking in Sattenapalli and Vinukonda.' },
        { time: 90, type: 'POLLS_CLOSE', label: 'Voting Concluded', details: 'Final vote blocks being sealed with Quantum Signatures.' },
        { time: 100, type: 'AUDIT', label: 'Audit Chain Finalized', details: 'Merkle root published to public blockchain.' }
    ];

    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 500);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    useEffect(() => {
        // Find events that just happened
        const currentEvent = mockEvents.find(e => e.time === currentTime);
        if (currentEvent) {
            setEvents(prev => [currentEvent, ...prev].slice(0, 10));
            setSelectedEvent(currentEvent);
        }
    }, [currentTime]);

    const formatTime = (percent) => {
        const startHour = 7; // 7 AM
        const totalMinutes = percent * 7.2; // 12 hours * 60 / 100
        const h = Math.floor(startHour + totalMinutes / 60);
        const m = Math.floor(totalMinutes % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} AM/PM`;
    };

    return (
        <div className="page container">
            <div className="twin-header" style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>⏪ DIGITAL TWIN: ELECTION REPLAY</h1>
                <p style={{ color: 'var(--text-muted)' }}>High-fidelity forensic audit and educational playback of Election Day activity.</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}> {formatTime(currentTime)} </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => { setCurrentTime(0); setEvents([]); }}
                        >Reset</button>
                        <button
                            className={`btn btn-lg ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? '⏸ Pause Replay' : '▶ Start Replay'}
                        </button>
                    </div>
                </div>

                <div className="scrubber-container" style={{ position: 'relative', marginBottom: '3rem' }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                        style={{ width: '100%', height: '8px', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <div className="markers" style={{ position: 'absolute', width: '100%', top: '15px' }}>
                        {mockEvents.map((e, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                left: `${e.time}%`,
                                width: '2px',
                                height: '10px',
                                background: 'var(--primary-600)',
                                opacity: 0.5
                            }}></div>
                        ))}
                    </div>
                </div>

                <div className="twin-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Simulated Map Visual */}
                    <div style={{
                        height: '350px',
                        background: 'rgba(0,0,0,0.4)',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', opacity: 0.2 }}>🗺️</div>
                            <div style={{ color: 'var(--text-muted)' }}>REPLAY VISUALIZER</div>
                        </div>
                        {selectedEvent && selectedEvent.type === 'SURGE' && (
                            <div className="radar-pulse" style={{
                                position: 'absolute',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                border: '2px solid var(--primary-600)',
                                animation: 'pulse 2s infinite'
                            }}></div>
                        )}
                        {selectedEvent && selectedEvent.type === 'ATTACK' && (
                            <div style={{
                                position: 'absolute',
                                color: 'var(--error)',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                animation: 'blink 0.5s infinite'
                            }}>⚠️ THREAT DETECTED</div>
                        )}
                    </div>

                    {/* Timeline Feed */}
                    <div className="timeline-feed" style={{ height: '350px', overflowY: 'auto', paddingRight: '1rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>FORENSIC TIMELINE</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {events.map((e, i) => (
                                <div key={i} style={{
                                    padding: '0.8rem',
                                    background: i === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                                    borderLeft: `3px solid ${i === 0 ? 'var(--primary-600)' : 'var(--glass-border)'}`,
                                    borderRadius: '0 6px 6px 0'
                                }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatTime(e.time)}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{e.label}</div>
                                    {i === 0 && <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{e.details}</p>}
                                </div>
                            ))}
                            {events.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Start replay to see events...</div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '2rem', background: 'rgba(59, 130, 246, 0.05)' }}>
                <h3>🛡️ DISASTER-RESILIENT MODE (Simulated)</h3>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <p>
                            Q-Voting includes an <strong>Offline Buffer Engine</strong>. In the event of a total network collapse
                            at a polling station, votes are locally signed, time-locked, and stored in an encrypted Q-Vault.
                            As soon as connectivity is restored, the buffer is "poured" into the global ledger.
                        </p>
                    </div>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        border: '1px solid var(--success)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.2rem', color: 'var(--success)', fontWeight: 'bold' }}>BUF-00%</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LOCAL BUFFER CLEAR</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DigitalTwin;

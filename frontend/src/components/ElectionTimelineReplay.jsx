import { useState, useRef, useEffect } from 'react';

function ElectionTimelineReplay() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0); // 0 to 100
    const [speed, setSpeed] = useState(1);
    const [events, setEvents] = useState([]);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Mock Election Data - 24 Hour Cycle
    const TOTAL_HOURS = 24;

    useEffect(() => {
        // Generate mock events
        const mockEvents = [];
        for (let i = 0; i < 50; i++) {
            mockEvents.push({
                time: Math.random() * 100,
                type: Math.random() > 0.7 ? 'ATTACK' : 'VOTE_SPIKE',
                location: { x: Math.random() * 100, y: Math.random() * 100 },
                id: i
            });
        }
        setEvents(mockEvents.sort((a, b) => a.time - b.time));
    }, []);

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationRef.current);
        }
        return () => cancelAnimationFrame(animationRef.current);
    }, [isPlaying, currentTime, speed]);

    const animate = () => {
        setCurrentTime(prev => {
            if (prev >= 100) {
                setIsPlaying(false);
                return 100;
            }
            return prev + (0.1 * speed);
        });
        animationRef.current = requestAnimationFrame(animate);
    };

    const formatTime = (percent) => {
        const hour = Math.floor((percent / 100) * TOTAL_HOURS);
        const minute = Math.floor(((percent / 100) * TOTAL_HOURS * 60) % 60);
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };

    // Render Events on Timeline
    const activeEvents = events.filter(e => e.time <= currentTime && e.time > currentTime - 5);

    return (
        <div className="glass-card" style={{ padding: '2rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-main)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span>⏪</span> ELECTION TIMELINE REPLAY
                    {isPlaying && <span className="live-indicator" style={{
                        width: '10px',
                        height: '10px',
                        background: 'var(--neon-red)',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px var(--neon-red)'
                    }} />}
                </h3>
                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '1.5rem',
                    color: 'var(--neon-cyan)',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--neon-cyan)'
                }}>
                    {formatTime(currentTime)}
                </div>
            </div>

            {/* Visualizer Area */}
            <div style={{
                height: '300px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                {/* Grid Lines */}
                <div className="hero-grid" style={{ opacity: 0.3 }} />

                {/* Simulated Map / Activity Points */}
                {activeEvents.map(ev => (
                    <div key={ev.id} style={{
                        position: 'absolute',
                        left: `${ev.location.x}%`,
                        top: `${ev.location.y}%`,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: ev.type === 'ATTACK' ? 'var(--neon-red)' : 'var(--neon-green)',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 20px ${ev.type === 'ATTACK' ? 'var(--neon-red)' : 'var(--neon-green)'}`,
                        animation: 'pulse 0.5s infinite'
                    }} />
                ))}

                {/* Central "Ledger" Growth */}
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: `${currentTime}%`,
                    maxHeight: '100%',
                    background: 'linear-gradient(to top, rgba(0, 212, 255, 0.1), transparent)',
                    transition: 'height 0.1s linear',
                    borderTop: '2px solid var(--neon-cyan)'
                }} />
            </div>

            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr min-content', gap: '1.5rem', alignItems: 'center' }}>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn btn-primary"
                    style={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0, fontSize: '1.2rem' }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                {/* Timeline Slider */}
                <div style={{ position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentTime}
                        onChange={(e) => {
                            setCurrentTime(parseFloat(e.target.value));
                            if (isPlaying) setIsPlaying(false);
                        }}
                        style={{
                            width: '100%',
                            appearance: 'none',
                            height: '6px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    />
                    {/* Progress Bar Overlay */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '17px', // center vertically roughly
                        height: '6px',
                        width: `${currentTime}%`,
                        background: 'var(--gradient-primary)',
                        borderRadius: '3px',
                        pointerEvents: 'none'
                    }} />
                </div>

                <div style={{ display: 'flex', gap: '5px' }}>
                    {[1, 2, 5].map(s => (
                        <button
                            key={s}
                            onClick={() => setSpeed(s)}
                            style={{
                                background: speed === s ? 'var(--neon-cyan)' : 'transparent',
                                color: speed === s ? 'black' : 'var(--neon-cyan)',
                                border: '1px solid var(--neon-cyan)',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
            </div>

            {/* Event Log */}
            <div style={{
                marginTop: '1.5rem',
                height: '100px',
                overflowY: 'auto',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: '1rem'
            }}>
                {events.filter(e => e.time <= currentTime).slice(-5).reverse().map(e => (
                    <div key={e.id} style={{ marginBottom: '5px', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--text-bright)' }}>[{formatTime(e.time)}]</span>
                        {' '}
                        <span style={{ color: e.type === 'ATTACK' ? 'var(--neon-red)' : 'var(--neon-green)' }}>
                            {e.type === 'ATTACK' ? '⚠ ANOMALY DETECTED' : '✓ BLOCK SEALED'}
                        </span>
                        {' '}
                        at Sector {Math.floor(e.location.x)},{Math.floor(e.location.y)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ElectionTimelineReplay;

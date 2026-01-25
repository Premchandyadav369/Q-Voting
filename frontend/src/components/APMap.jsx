import React, { useState, useEffect } from 'react';

// Real 2024 Election Map of Andhra Pradesh with High-Tech Overlays
function APMap() {
    const [isSurging, setIsSurging] = useState(false);

    useEffect(() => {
        const handleSurge = () => {
            setIsSurging(true);
            setTimeout(() => setIsSurging(false), 5000);
        };

        window.addEventListener('VOTE_SURGE_STARTED', handleSurge);
        return () => window.removeEventListener('VOTE_SURGE_STARTED', handleSurge);
    }, []);

    return (
        <div className="ap-map-container" style={{
            position: 'relative',
            textAlign: 'center',
            marginBottom: '48px',
            padding: '20px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', borderRadius: '16px' }}>
                <img
                    src="/victory_map_2024.jpg"
                    alt="Andhra Pradesh 2024 Election Map"
                    style={{
                        maxWidth: '100%',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'filter 0.5s ease'
                    }}
                />

                {/* Quantum Scan Line */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--primary-400), transparent)',
                    boxShadow: '0 0 15px var(--primary-400)',
                    zIndex: 5,
                    animation: 'scanLine 4s linear infinite'
                }} />

                {/* Surge Overlays */}
                {isSurging && (
                    <>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
                            animation: 'pulseGlow 2s infinite',
                            zIndex: 4
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#4ade80',
                            fontSize: '40px',
                            fontWeight: '900',
                            letterSpacing: '8px',
                            zIndex: 10,
                            textShadow: '0 0 20px #4ade80',
                            pointerEvents: 'none',
                            animation: 'fadeInOut 2s infinite'
                        }}>LIVE SURGE ACTIVE</div>
                    </>
                )}
            </div>

            <div style={{
                marginTop: '16px',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: '900',
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            }}>
                <span style={{ color: 'var(--primary-400)' }}>[ 📡 ]</span>
                ANDHRA PRADESH 2024 ASSEMBLY VICTORY MAP - QUANTUM MONITORING ACTIVE
                <span style={{ color: 'var(--primary-400)' }}>[ 📡 ]</span>
            </div>

            <style>{`
                @keyframes scanLine {
                    0% { top: -2%; }
                    100% { top: 102%; }
                }
                @keyframes pulseGlow {
                    0% { opacity: 0.3; transform: scale(0.9); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                    100% { opacity: 0.3; transform: scale(0.9); }
                }
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default APMap;

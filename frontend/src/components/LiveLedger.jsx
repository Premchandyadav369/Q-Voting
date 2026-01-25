import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveLedger = () => {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const response = await axios.get('/api/security/ledger');
                setBlocks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ledger:', error);
                setLoading(false);
            }
        };

        fetchLedger();
        const interval = setInterval(fetchLedger, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <div className="live-ledger" style={{
            background: 'var(--bg-glass)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--primary-300)', fontSize: '14px', fontWeight: '900', letterSpacing: '1px' }}>
                    IMMUTABLE QUANTUM LEDGER (LIVE)
                </h3>
                <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: '800', animation: 'pulse 2s infinite' }}>CHAIN SYNCED 🔗</span>
            </div>

            <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                {blocks.map((block, idx) => (
                    <div key={idx} style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.03)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        animation: idx === 0 ? 'slideIn 0.5s ease-out' : 'none'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ color: 'var(--primary-400)', fontSize: '11px', fontWeight: '900' }}>#{block.block_id}</div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'white', fontFamily: 'monospace', fontWeight: '700' }}>{block.batch_hash}</div>
                                <div style={{ fontSize: '9px', color: 'var(--neutral-500)', marginTop: '2px' }}>{block.receipt_count} RECEIPTS SEALED AT {new Date(block.timestamp).toLocaleTimeString()}</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '9px', color: '#818cf8', fontWeight: '900', letterSpacing: '0.5px' }}>{block.quantum_seal}</div>
                            <div style={{ fontSize: '8px', color: '#22c55e', marginTop: '2px', fontWeight: '800' }}>VERIFIED</div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .live-ledger div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default LiveLedger;

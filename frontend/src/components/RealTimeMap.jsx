import { useState, useEffect } from 'react'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'

// AP Districts with SVG positioning
const DISTRICT_PATHS = {
    "Srikakulam": { cx: 370, cy: 45, r: 18 },
    "Vizianagaram": { cx: 340, cy: 70, r: 18 },
    "Visakhapatnam": { cx: 360, cy: 110, r: 22 },
    "East Godavari": { cx: 310, cy: 160, r: 22 },
    "West Godavari": { cx: 260, cy: 175, r: 20 },
    "Krishna": { cx: 210, cy: 200, r: 22 },
    "Guntur": { cx: 180, cy: 235, r: 24 },
    "Prakasam": { cx: 150, cy: 280, r: 22 },
    "Nellore": { cx: 130, cy: 340, r: 22 },
    "Chittoor": { cx: 120, cy: 400, r: 24 },
    "Kadapa": { cx: 90, cy: 320, r: 22 },
    "Kurnool": { cx: 60, cy: 240, r: 24 },
    "Anantapur": { cx: 50, cy: 330, r: 24 }
}

const PARTY_COLORS = {
    "TDP": "#FFEB3B",
    "YSRCP": "#1565C0",
    "JSP": "#E53935",
    "BJP": "#FF9933",
    "INC": "#00BCD4",
    "IND": "#9E9E9E",
    "default": "#E0E0E0"
}

function RealTimeMap({ onDistrictClick }) {
    const { t } = useLanguage()
    const [districtData, setDistrictData] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [constituencyResults, setConstituencyResults] = useState(null)
    const [loadingConstituencies, setLoadingConstituencies] = useState(false)
    const [autoRefresh, setAutoRefresh] = useState(true)
    const [electionType, setElectionType] = useState('MLA')

    useEffect(() => {
        loadMapData()

        if (autoRefresh) {
            const interval = setInterval(loadMapData, 10000)
            return () => clearInterval(interval)
        }
    }, [autoRefresh])

    const loadMapData = async () => {
        try {
            const response = await axios.get('/api/voting/realtime/district-map')
            const dataMap = {}
            for (const d of response.data.districts) {
                dataMap[d.district] = d
            }
            setDistrictData(dataMap)
            setLoading(false)
        } catch (err) {
            console.error('Failed to load map data:', err)
            setLoading(false)
        }
    }

    const loadDistrictDetail = async (districtName) => {
        try {
            setLoadingConstituencies(true)
            const response = await axios.get(`/api/results/district/${districtName}?election_type=${electionType}`)
            setConstituencyResults(response.data.results)
            setLoadingConstituencies(false)
        } catch (err) {
            console.error('Failed to load district details:', err)
            setLoadingConstituencies(false)
        }
    }

    const getDistrictColor = (districtName) => {
        const data = districtData[districtName]
        if (!data || !data.leading_party) return PARTY_COLORS.default
        return data.leading_color || PARTY_COLORS[data.leading_party] || PARTY_COLORS.default
    }

    const handleDistrictClick = (districtName) => {
        setSelectedDistrict(districtName)
        loadDistrictDetail(districtName)
        if (onDistrictClick) {
            onDistrictClick(districtName, districtData[districtName])
        }
    }

    // Effect to reload details when election type changes
    useEffect(() => {
        if (selectedDistrict) {
            loadDistrictDetail(selectedDistrict)
        }
    }, [electionType])

    return (
        <div className="card map-card" style={{ padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>🗺️ {t('live_map_title') || 'Real-Time AP District Map'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', background: 'var(--neutral-100)', borderRadius: '8px', padding: '4px' }}>
                        <button
                            onClick={() => setElectionType('MLA')}
                            className={`btn-sm ${electionType === 'MLA' ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ padding: '4px 12px' }}
                        >MLA</button>
                        <button
                            onClick={() => setElectionType('MP')}
                            className={`btn-sm ${electionType === 'MP' ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ padding: '4px 12px' }}
                        >MP</button>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        {t('live_updates') || 'Live Updates'}
                    </label>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* Map SVG */}
                <div style={{ flex: '1 1 400px', position: 'relative', minHeight: '450px' }}>
                    {loading ? (
                        <div className="loading-overlay"><div className="spinner"></div></div>
                    ) : (
                        <svg viewBox="0 0 420 450" style={{ width: '100%', height: 'auto' }}>
                            <rect x="0" y="0" width="420" height="450" fill="#f8fafc" rx="12" />
                            <path
                                d="M30,180 Q40,100 100,60 L200,30 Q300,20 380,50 L400,100 Q420,180 400,250 
                     L380,320 Q350,400 280,430 L180,450 Q80,440 40,380 L20,280 Q10,220 30,180 Z"
                                fill="#f1f5f9"
                                stroke="#cbd5e1"
                                strokeWidth="2"
                            />

                            {Object.entries(DISTRICT_PATHS).map(([name, pos]) => {
                                const data = districtData[name]
                                const color = getDistrictColor(name)
                                const isSelected = selectedDistrict === name

                                return (
                                    <g key={name} onClick={() => handleDistrictClick(name)} style={{ cursor: 'pointer' }}>
                                        <circle
                                            cx={pos.cx} cy={pos.cy} r={pos.r + (isSelected ? 6 : 0)}
                                            fill={color}
                                            stroke={isSelected ? "#1e293b" : "#64748b"}
                                            strokeWidth={isSelected ? "3" : "1.5"}
                                            className="map-district"
                                            style={{
                                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                filter: isSelected ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' : 'none',
                                                opacity: selectedDistrict && !isSelected ? 0.6 : 1
                                            }}
                                        />
                                        {data && data.total_votes > 10 && (
                                            <circle cx={pos.cx + 8} cy={pos.cy - 8} r="5" fill="#ef4444"
                                                style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                                        )}
                                        <text
                                            x={pos.cx}
                                            y={pos.cy + pos.r + 16}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fontWeight={isSelected ? "700" : "500"}
                                            fill={isSelected ? "#020617" : "#475569"}
                                            style={{ transition: 'all 0.3s' }}
                                        >
                                            {name}
                                        </text>
                                    </g>
                                )
                            })}
                        </svg>
                    )}
                </div>

                {/* Drill-down Detail Panel */}
                <div style={{ flex: '1 1 300px', background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                    {!selectedDistrict ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📍</div>
                            <h4>Select a district to see constituency-level results</h4>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <h2 style={{ margin: 0 }}>{selectedDistrict}</h2>
                                    <span style={{ fontSize: '14px', color: '#64748b' }}>{electionType} Election Results</span>
                                </div>
                                <button className="btn-ghost" onClick={() => setSelectedDistrict(null)}>✕</button>
                            </div>

                            {loadingConstituencies ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner"></div></div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                                    {constituencyResults?.map(constit => (
                                        <div key={constit.id} className="constituency-item" style={{
                                            padding: '12px',
                                            background: 'white',
                                            borderRadius: '12px',
                                            borderLeft: `6px solid ${constit.winner?.party_color || '#e2e8f0'}`,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}>
                                            <div style={{ fontWeight: '700', marginBottom: '4px' }}>{constit.name}</div>
                                            {constit.winner ? (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontSize: '13px' }}>
                                                        <span style={{ color: constit.winner.party_color, fontWeight: '600' }}>{constit.winner.party}</span>
                                                        <span style={{ color: '#64748b', marginLeft: '8px' }}>({constit.total_votes} {t('votes') || 'votes'})</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{t('awaiting_counts') || 'Awaiting counts...'}</div>
                                            )}
                                        </div>
                                    ))}
                                    {constituencyResults?.length === 0 && (
                                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No data for this district</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .map-district:hover {
                    filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2));
                }
                @keyframes ping {
                    75%, 100% { transform: scale(2); opacity: 0; }
                }
                .constituency-item {
                    transition: transform 0.2s;
                }
                .constituency-item:hover {
                    transform: translateX(4px);
                }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    )
}

export default RealTimeMap

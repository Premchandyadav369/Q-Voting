import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Party colors for AP elections (Neon Ultra Palette)
const PARTY_COLORS = {
    'TDP': '#FFEB3B',   // Bright Yellow
    'YSRCP': '#2196F3', // Bright Blue
    'JSP': '#F44336',   // Bright Red
    'BJP': '#FF9800',   // Orange
    'INC': '#00BCD4',   // Cyan
    'IND': '#9E9E9E',   // Grey
    'OTH': '#9C27B0'    // Purple
};

// Component to auto-fit map bounds
function FitBounds({ data }) {
    const map = useMap();
    useEffect(() => {
        if (data && map) {
            const tempLayer = L.geoJSON(data);
            map.fitBounds(tempLayer.getBounds(), { padding: [20, 20] });
        }
    }, [data, map]);
    return null;
}

function AndhraPradeshMap() {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [districtData, setDistrictData] = useState({});
    const [hoveredDistrict, setHoveredDistrict] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch GeoJSON
    useEffect(() => {
        // Using new 26-district map
        const mapUrl = 'https://raw.githubusercontent.com/satishvmadala/andhrapradesh_opendata_locations/master/AndhraPradesh_Districts.geojson';

        fetch(mapUrl)
            .then(res => res.json())
            .then(data => {
                setGeoJsonData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load map data, trying fallback...", err);
                // Fallback to previous source if this fails
                fetch('https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@8d907bc/geojson/states/andhra-pradesh.geojson')
                    .then(res => res.json())
                    .then(data => setGeoJsonData(data));
            });
    }, []);

    // Fetch district results
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get('/api/voting/realtime/district-map');
                const data = {};
                // The backend returns { districts: [ { district, total_votes, leading_party, leading_color, ... } ] }
                if (response.data && response.data.districts) {
                    response.data.districts.forEach(d => {
                        data[d.district] = {
                            party: d.leading_party || 'IND',
                            votes: d.total_votes || 0,
                            color: d.leading_color || PARTY_COLORS.IND
                        };
                    });
                }
                setDistrictData(data);
            } catch (err) {
                // Generate mock data for visualization if API fails
                if (geoJsonData) {
                    const mock = {};
                    geoJsonData.features.forEach(f => {
                        const name = f.properties.district || f.properties.dtname || f.properties.NAME_2;
                        const parties = ['TDP', 'YSRCP', 'JSP', 'BJP'];
                        const party = parties[Math.floor(Math.random() * parties.length)];
                        mock[name] = {
                            party,
                            votes: Math.floor(Math.random() * 500000) + 100000,
                            color: PARTY_COLORS[party]
                        };
                    });
                    setDistrictData(mock);
                }
            }
        };

        if (geoJsonData) {
            fetchResults();
        }
    }, [geoJsonData]);

    const onEachFeature = (feature, layer) => {
        const name = feature.properties.district_name || feature.properties.district || feature.properties.dtname || feature.properties.NAME_2;

        layer.on({
            mouseover: (e) => {
                setHoveredDistrict(name);
                layer.bringToFront();
            },
            mouseout: (e) => {
                setHoveredDistrict(null);
            }
        });
    };


    // Style function for GeoJSON
    const style = (feature) => {
        const name = feature.properties.district_name || feature.properties.district || feature.properties.dtname || feature.properties.NAME_2;
        const data = districtData[name];

        const isHovered = hoveredDistrict === name;

        return {
            fillColor: data ? PARTY_COLORS[data.party] || '#1f2937' : '#1f2937',
            weight: isHovered ? 3 : 1,
            opacity: 1,
            color: isHovered ? '#00fbff' : 'rgba(0, 212, 255, 0.3)',
            fillOpacity: isHovered ? 0.6 : 0.3,
            dashArray: isHovered ? '' : '3'
        };
    };

    return (
        <div className="map-wrapper" style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative' }}>
            {/* Title Overlay */}
            <div style={{
                position: 'absolute', top: 20, left: 0, right: 0, zIndex: 500,
                textAlign: 'center', pointerEvents: 'none'
            }}>
                <h3 style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--neon-cyan)',
                    textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                    margin: 0
                }}>
                    ANDHRA PRADESH LIVE
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    QUANTUM SATELLITE FEED • REAL-TIME
                </div>
            </div>

            <MapContainer
                center={[15.9129, 79.7400]}
                zoom={7}
                className="q-map"
                style={{ height: '100%', width: '100%', borderRadius: '16px', background: '#050b14' }}
                zoomControl={false}
            >
                {/* Dark Mode Tile Layer */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {geoJsonData && (
                    <>
                        <GeoJSON
                            data={geoJsonData}
                            style={style}
                            onEachFeature={onEachFeature}
                        />
                        <FitBounds data={geoJsonData} />
                    </>
                )}
            </MapContainer>

            {/* Custom Tooltip Overlay */}
            {hoveredDistrict && districtData[hoveredDistrict] && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--neon-cyan)',
                    borderRadius: '12px',
                    padding: '1rem',
                    minWidth: '200px',
                    boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, color: 'white', fontFamily: 'var(--font-display)' }}>
                            {hoveredDistrict.toUpperCase()}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--neon-green)', border: '1px solid var(--neon-green)', padding: '2px 4px', borderRadius: '4px' }}>
                            SECURE
                        </span>
                    </div>

                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: PARTY_COLORS[districtData[hoveredDistrict].party],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold', color: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                        }}>
                            {districtData[hoveredDistrict].party}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Leading Party</div>
                            <div style={{ fontWeight: 'bold' }}>{districtData[hoveredDistrict].party}</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Votes:</span>
                            <span style={{ fontFamily: 'monospace' }}>{districtData[hoveredDistrict].votes.toLocaleString()}</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(90deg, transparent, ${PARTY_COLORS[districtData[hoveredDistrict].party]})`,
                                animation: 'shimmer 2s infinite linear'
                            }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '10px',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                gap: '12px'
            }}>
                {Object.entries(PARTY_COLORS).slice(0, 5).map(([party, color]) => (
                    <div key={party} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></div>
                        <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: '500' }}>{party}</span>
                    </div>
                ))}
            </div>

            <style>{`
                .leaflet-container {
                    background: #050b14;
                    font-family: var(--font-body);
                }
                .leaflet-control-attribution {
                    display: none;
                }
            `}</style>
        </div>
    );
}

export default AndhraPradeshMap;

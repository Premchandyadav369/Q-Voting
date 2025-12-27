// Simplified SVG representation of Andhra Pradesh
function APMap() {
    return (
        <div className="ap-map">
            <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="apGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#1e3a5f', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: '#3366a0', stopOpacity: 0.3 }} />
                    </linearGradient>
                </defs>
                {/* Simplified AP outline */}
                <path
                    d="M50,150 Q60,80 120,60 L180,40 Q240,50 280,80 L320,120 Q350,160 340,200 L300,240 Q260,270 200,260 L140,250 Q80,240 60,200 Z"
                    fill="url(#apGradient)"
                    stroke="#1e3a5f"
                    strokeWidth="2"
                />
                {/* Districts dots */}
                <circle cx="280" cy="100" r="6" fill="#3366a0" opacity="0.6" />
                <circle cx="240" cy="130" r="6" fill="#3366a0" opacity="0.6" />
                <circle cx="200" cy="150" r="8" fill="#ff9933" opacity="0.8" />
                <circle cx="160" cy="180" r="6" fill="#3366a0" opacity="0.6" />
                <circle cx="120" cy="200" r="6" fill="#3366a0" opacity="0.6" />
                <circle cx="180" cy="100" r="6" fill="#3366a0" opacity="0.6" />
                <circle cx="100" cy="140" r="6" fill="#3366a0" opacity="0.6" />
                {/* Label */}
                <text x="200" y="290" textAnchor="middle" fill="#1e3a5f" fontSize="14" fontWeight="600">
                    ANDHRA PRADESH
                </text>
            </svg>
        </div>
    )
}

export default APMap

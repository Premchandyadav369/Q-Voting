function CandidateCard({ candidate, selected, onSelect }) {
    return (
        <div
            className={`candidate-card ${selected ? 'selected' : ''}`}
            onClick={() => onSelect(candidate.id)}
        >
            <div className="candidate-radio"></div>
            <div className="candidate-symbol">{candidate.symbol || '👤'}</div>
            <div className="candidate-info">
                <div className="candidate-name">{candidate.name}</div>
                <div className="candidate-party">
                    {candidate.party}
                    <span className="candidate-party-short" style={{ marginLeft: '8px' }}>
                        {candidate.party_short}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CandidateCard

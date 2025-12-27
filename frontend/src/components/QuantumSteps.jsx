function QuantumSteps({ steps }) {
    return (
        <div className="quantum-progress">
            <h3 style={{ marginBottom: '24px', color: 'white' }}>
                🔐 Quantum Key Distribution (BB84 Protocol)
            </h3>
            <div className="quantum-steps">
                {steps.map((step, index) => (
                    <div
                        key={step.step || index}
                        className={`quantum-step ${step.status}`}
                    >
                        <div className="quantum-step-icon">
                            {step.status === 'complete' ? '✓' :
                                step.status === 'active' ? '⟳' :
                                    step.status === 'warning' ? '⚠' : '○'}
                        </div>
                        <div className="quantum-step-content">
                            <div className="quantum-step-name">{step.name}</div>
                            <div className="quantum-step-desc">{step.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QuantumSteps

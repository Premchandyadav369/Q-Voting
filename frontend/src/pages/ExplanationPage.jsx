
import { Link } from 'react-router-dom'

function ExplanationPage() {
    return (
        <div className="container" style={{ padding: '64px 16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textTransform: 'uppercase'
                }}>
                    🧠 HOW Q-VOTING WORKS
                </h1>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.1rem',
                    maxWidth: '800px',
                    margin: '0 auto',
                    textTransform: 'uppercase'
                }}>
                    A TOP-TO-BOTTOM ARCHITECTURAL OVERVIEW OF OUR QUANTUM VOTING SYSTEM
                </p>
            </div>

            <div className="card" style={{ maxWidth: '1000px', margin: '0 auto', background: 'var(--bg-glass)', padding: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Step 1 */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'var(--accent-blue)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0,
                            boxShadow: '0 0 15px var(--accent-blue)'
                        }}>1</div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-main)' }}>DATA INGESTION & REAL-TIME INTEGRATION</h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                THE SYSTEM UTILIZES ORIGINAL 2024 ANDHRA PRADESH ELECTION RESULTS.
                                IT COVERS ALL 175 ASSEMBLY CONSTITUENCIES AND 25 PARLIAMENT CONSTITUENCIES.
                                REAL-TIME DATA INCLUDES CANDIDATE NAMES, PARTIES, VOTE COUNTS, AND VICTORY MARGINS.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'var(--accent-gold)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0,
                            boxShadow: '0 0 15px var(--accent-gold)'
                        }}>2</div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-main)' }}>QUANTUM SECURITY LAYER (THE CORE)</h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                BEFORE VOTING, THE BB84 PROTOCOL GENERATES A SECURE QUANTUM KEY.
                                ANY INTERCEPTION ATTEMPT COLLAPSES THE QUANTUM STATE, TRIGGERING AN INSTANT ALERT.
                                THE NO-CLONING THEOREM ENSURES THAT YOUR VOTE CANNOT BE COPIED OR TAMPERED WITH.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'var(--accent-blue)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0,
                            boxShadow: '0 0 15px var(--accent-blue)'
                        }}>3</div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-main)' }}>ANONYMOUS VOTE CASTING</h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                ONCE THE QUANTUM SESSION IS ESTABLISHED, YOUR VOTE IS ENCRYPTED AND STORED ANONYMOUSLY.
                                WE USE SIMULATED ZERO-KNOWLEDGE PROOFS TO VERIFY VOTE VALIDITY WITHOUT IDENTIFYING THE VOTER.
                                ALL SESSION DATA IS COMPLETELY PURGED ONCE THE RECEIPT IS GENERATED.
                            </p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: 'var(--accent-gold)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0,
                            boxShadow: '0 0 15px var(--accent-gold)'
                        }}>4</div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-main)' }}>AGGREGATION & AI ANALYTICS</h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                VOTES ARE AGGREGATED DYNAMICALLY FROM CONSTITUENCY TO DISTRICT TO STATE LEVELS.
                                OUR AI ENGINE (GEMINI) ANALYZES TRENDS AND PROVIDES PREDICTIVE INSIGHTS BASED ON HISTORICAL DATA.
                                THE INTERACTIVE DASHBOARD PROVIDES A VISUAL BREAKDOWN OF ALL RESULTS ACROSS ANDHRA PRADESH.
                            </p>
                        </div>
                    </div>

                </div>

                <div style={{ marginTop: '48px', textAlign: 'center' }}>
                    <Link to="/vote" className="btn btn-quantum btn-lg" style={{ textTransform: 'uppercase' }}>
                        🗳️ EXPERIENCE THE SYSTEM NOW
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ExplanationPage

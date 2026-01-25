import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UltraHeader from './components/UltraHeader'
import UltraFooter from './components/UltraFooter'
import UltraLandingPage from './pages/UltraLandingPage'
import DualVoterAuth from './pages/DualVoterAuth'
import DualBallotPage from './pages/DualBallotPage'
import QuantumProcess from './pages/QuantumProcess'
import Confirmation from './pages/Confirmation'
import AdminDashboard from './pages/AdminDashboard'
import AttackLab from './pages/AttackLab'
import AuditTrail from './pages/AuditTrail'
import LiveAnalytics from './pages/LiveAnalytics'
import RealTimeDashboard from './pages/RealTimeDashboard'
import ExplanationPage from './pages/ExplanationPage'
import ZKVerifyPortal from './pages/ZKVerifyPortal'
import GovernanceConsole from './pages/GovernanceConsole'
import DigitalTwin from './pages/DigitalTwin'

function App() {
    const [session, setSession] = useState(null)
    const [mlaConstituency, setMlaConstituency] = useState(null)
    const [mpConstituency, setMpConstituency] = useState(null)
    const [quantumResult, setQuantumResult] = useState(null)
    const [voteReceipt, setVoteReceipt] = useState(null)

    const handleLogout = () => {
        setSession(null)
        setMlaConstituency(null)
        setMpConstituency(null)
        setQuantumResult(null)
        setVoteReceipt(null)
    }

    return (
        <Router>
            <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <UltraHeader />
                <main style={{ flex: 1, paddingTop: '80px' }}>
                    <Routes>
                        {/* Ultra Landing */}
                        <Route path="/" element={<UltraLandingPage />} />
                        <Route path="/explanation" element={<ExplanationPage />} />

                        {/* Dual Voting Flow */}
                        <Route
                            path="/vote"
                            element={
                                <DualVoterAuth
                                    session={session}
                                    setSession={setSession}
                                    setMlaConstituency={setMlaConstituency}
                                    setMpConstituency={setMpConstituency}
                                />
                            }
                        />

                        <Route
                            path="/quantum"
                            element={
                                (session && mlaConstituency && mpConstituency) ? (
                                    <QuantumProcess
                                        session={session}
                                        constituency={mlaConstituency}
                                        setQuantumResult={setQuantumResult}
                                    />
                                ) : (
                                    <Navigate to="/vote" replace />
                                )
                            }
                        />

                        <Route
                            path="/ballot"
                            element={
                                (session && quantumResult?.channel_secure) ? (
                                    <DualBallotPage
                                        session={session}
                                        mlaConstituency={mlaConstituency}
                                        mpConstituency={mpConstituency}
                                        setVoteReceipt={setVoteReceipt}
                                    />
                                ) : (
                                    <Navigate to="/vote" replace />
                                )
                            }
                        />

                        <Route
                            path="/confirmation"
                            element={
                                voteReceipt ? (
                                    <Confirmation
                                        receipt={voteReceipt}
                                        onNewVote={handleLogout}
                                    />
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            }
                        />

                        {/* Admin & Advanced Features */}
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/dashboard" element={<RealTimeDashboard />} />
                        <Route path="/attacks" element={<AttackLab />} />
                        <Route path="/audit" element={<AuditTrail />} />
                        <Route path="/analytics" element={<LiveAnalytics />} />
                        <Route path="/verify" element={<ZKVerifyPortal />} />
                        <Route path="/governance" element={<GovernanceConsole />} />
                        <Route path="/digital-twin" element={<DigitalTwin />} />
                    </Routes>
                </main>
                <UltraFooter />
            </div>
        </Router>
    )
}

export default App

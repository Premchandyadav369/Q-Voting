import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import FeaturesPage from './pages/FeaturesPage'
import DualVoterAuth from './pages/DualVoterAuth'
import DualBallotPage from './pages/DualBallotPage'
import QuantumProcess from './pages/QuantumProcess'
import Confirmation from './pages/Confirmation'
import AdminDashboard from './pages/AdminDashboard'
import AttackSimulator from './pages/AttackSimulator'
import AuditTrail from './pages/AuditTrail'
import LiveAnalytics from './pages/LiveAnalytics'
import RealTimeDashboard from './pages/RealTimeDashboard'

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
            <div className="app">
                <Header session={session} onLogout={handleLogout} />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/features" element={<FeaturesPage />} />

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
                        <Route path="/attacks" element={<AttackSimulator />} />
                        <Route path="/audit" element={<AuditTrail />} />
                        <Route path="/analytics" element={<LiveAnalytics />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App

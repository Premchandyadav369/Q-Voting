import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme, themes } from '../context/ThemeContext'

function Header({ session, onLogout }) {
    const { language, changeLanguage, availableLanguages, t, loading } = useLanguage()
    const { theme, cycleTheme } = useTheme()

    if (loading) return null

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="header-brand">
                        <div className="header-logo">🗳️</div>
                        <div>
                            <div className="header-title">{t('title')}</div>
                            <div className="header-subtitle">Andhra Pradesh • Research Simulation</div>
                        </div>
                    </Link>
                    <nav className="header-nav">
                        <Link to="/">{t('home')?.toUpperCase() || 'HOME'}</Link>
                        <Link to="/features">✨ FEATURES</Link>
                        <Link to="/vote">🗳️ VOTE</Link>
                        <Link to="/verify">🔐 VERIFY</Link>
                        <Link to="/dashboard">🗺️ RADAR</Link>
                        <Link to="/governance">🧠 GOVERNANCE</Link>
                        <Link to="/digital-twin">⏪ REPLAY</Link>
                        <Link to="/analytics">📊 ANALYTICS</Link>
                        <Link to="/explanation">📖 DOCS</Link>

                        {/* Theme Picker Dropdown */}
                        <div className="theme-picker" style={{ marginLeft: '12px', display: 'flex', gap: '4px' }}>
                            {Object.entries(themes).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => setTheme(key)}
                                    title={config.name}
                                    style={{
                                        padding: '6px',
                                        borderRadius: '6px',
                                        border: theme === key ? '2px solid var(--primary-600)' : '1px solid var(--glass-border)',
                                        background: theme === key ? 'var(--primary-600)' : 'var(--bg-glass)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        transition: 'all 0.2s ease',
                                        opacity: theme === key ? 1 : 0.7
                                    }}
                                >
                                    {config.icon}
                                </button>
                            ))}
                        </div>

                        <div className="lang-selector" style={{ marginLeft: '8px' }}>
                            <select
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'var(--bg-glass)',
                                    color: 'var(--text-main)',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                {availableLanguages.map(lang => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.native}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {session && (
                            <button onClick={onLogout} className="btn-logout" style={{ marginLeft: '8px' }}>
                                {t('logout') || 'Logout'}
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header

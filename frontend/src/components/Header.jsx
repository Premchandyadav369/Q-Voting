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
                        <Link to="/">{t('home') || 'Home'}</Link>
                        <Link to="/features">✨ Features</Link>
                        <Link to="/vote">{t('start_voting') || 'Vote'}</Link>
                        <Link to="/dashboard">🗺️ {t('live_map') || 'Live Map'}</Link>
                        <Link to="/admin">{t('results') || 'Results'}</Link>
                        <Link to="/analytics">📊 {t('analytics') || 'Analytics'}</Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={cycleTheme}
                            className="theme-toggle-btn"
                            title={`Theme: ${themes[theme].name}`}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--bg-glass)',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {themes[theme].icon} {themes[theme].name}
                        </button>

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

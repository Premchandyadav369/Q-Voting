import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function UltraHeader() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <header className="ultra-header" style={{
            background: scrolled ? 'rgba(10, 14, 26, 0.95)' : 'rgba(10, 14, 26, 0.8)',
            boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none'
        }}>
            <div className="container">
                <Link to="/" className="logo">
                    <img src="/qvoting-logo.png" alt="Q-Voting Ultra" />
                    <span style={{
                        fontSize: '0.7rem',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                        marginLeft: '10px'
                    }}>v1.1</span>
                </Link>

                <div className="header-badges">
                    <span className="badge badge-verified">✦ Ultra Verified</span>
                    <span className="badge badge-quantum">⚛ Quantum Resistant</span>
                    <span className="badge badge-live">
                        <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            background: '#ef4444',
                            borderRadius: '50%',
                            animation: 'pulse 1.5s infinite',
                            marginRight: '6px'
                        }}></span>
                        Real-Time
                    </span>
                </div>

                <nav>
                    <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
                    <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Live Map</Link>
                    <Link to="/vote" className={isActive('/vote') ? 'active' : ''}>Vote</Link>
                    <Link to="/attacks" className={isActive('/attacks') ? 'active' : ''}>Attack Lab</Link>
                    <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Results</Link>
                    <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>Analytics</Link>
                </nav>
            </div>
        </header>
    );
}

export default UltraHeader;

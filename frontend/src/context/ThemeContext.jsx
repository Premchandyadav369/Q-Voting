import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Simplified 2-theme system as per user request
export const themes = {
    'quantum-dark': {
        name: 'Quantum Dark',
        icon: '🌙',
        primary: '#00d4ff',
        bg: '#0a0e1a'
    },
    'quantum-light': {
        name: 'Quantum Light',
        icon: '☀️',
        primary: '#3b82f6',
        bg: '#f8fafc'
    }
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('q-voting-theme');
        return saved || 'quantum-dark';
    });

    useEffect(() => {
        localStorage.setItem('q-voting-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'quantum-dark' ? 'quantum-light' : 'quantum-dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;

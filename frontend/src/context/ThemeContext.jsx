import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    'dark-royal': {
        name: 'Dark Royal',
        icon: '👑',
        primary: '#3b82f6',
        accent: '#f59e0b',
        bg: '#020617'
    },
    'ocean-gradient': {
        name: 'Ocean Gradient',
        icon: '🌊',
        primary: '#06b6d4',
        accent: '#8b5cf6',
        bg: '#0c1929'
    },
    'emerald-glow': {
        name: 'Emerald Glow',
        icon: '💎',
        primary: '#10b981',
        accent: '#f59e0b',
        bg: '#052e16'
    }
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('q-voting-theme');
        return saved || 'dark-royal';
    });

    useEffect(() => {
        localStorage.setItem('q-voting-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const cycleTheme = () => {
        const themeKeys = Object.keys(themes);
        const currentIndex = themeKeys.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setTheme(themeKeys[nextIndex]);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes }}>
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

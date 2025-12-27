import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('preferredLanguage') || 'en');
    const [translations, setTranslations] = useState({});
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLanguageData();
    }, [language]);

    const loadLanguageData = async () => {
        try {
            setLoading(true);
            const [transRes, langRes] = await Promise.all([
                axios.get(`/api/advanced/i18n/${language}`),
                axios.get('/api/advanced/i18n')
            ]);
            setTranslations(transRes.data.translations);
            setAvailableLanguages(langRes.data.languages);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load translations:', err);
            setLoading(false);
        }
    };

    const changeLanguage = (newLang) => {
        setLanguage(newLang);
        localStorage.setItem('preferredLanguage', newLang);
    };

    const t = (key) => {
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, availableLanguages, loading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

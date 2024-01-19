// LanguageContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const storedLanguage = localStorage.getItem('language');
    const [language, setLanguage] = useState(storedLanguage || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
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

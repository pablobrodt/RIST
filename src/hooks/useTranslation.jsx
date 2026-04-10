import React, { createContext, useContext, useState, useEffect } from 'react';

import ptBR from '../locales/pt-BR.json';
import enUS from '../locales/en-US.json';

const dictionaries = {
  'pt-BR': ptBR,
  'en-US': enUS
};

const LanguageContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('rist_locale') || 'pt-BR';
  });

  const setLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('rist_locale', langCode);
  };

  const translateText = (key, variables = {}) => {
    const dictionary = dictionaries[currentLanguage] || dictionaries['pt-BR'];
    let text = dictionary[key] || key;

    // Optional variable interpolation
    Object.keys(variables).forEach((varKey) => {
      text = text.replace(new RegExp(`{${varKey}}`, 'g'), variables[varKey]);
    });

    return text;
  };

  useEffect(() => {
    // Listen for storage changes if multiple tabs are open at the same time to sync them
    const handleStorageChange = (e) => {
      if (e.key === 'rist_locale' && e.newValue) {
        setCurrentLanguage(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);

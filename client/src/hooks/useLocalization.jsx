import { useState, useEffect, createContext, useContext } from 'react';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

const LocalizationContext = createContext();

const translations = {
  ar,
  en
};

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar'); // Default to Arabic
  const [translations_data, setTranslationsData] = useState(translations[language]);

  useEffect(() => {
    setTranslationsData(translations[language]);
    // Set document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations_data;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value === 'string' && params) {
      // Replace placeholders like {role} with actual values
      return value.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
    }
    
    return value || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LocalizationContext.Provider value={{ 
      language, 
      changeLanguage, 
      t,
      isRTL: language === 'ar'
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
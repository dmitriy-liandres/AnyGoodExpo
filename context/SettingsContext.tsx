// AnyGoodExpo/context/SettingsContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface SettingsContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  country: string;
  setCountry: (country: string) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use language and country codes (e.g., 'en' for English, 'il' for Israel)
  const [language, setLanguage] = useState('en');
  const [country, setCountry] = useState('il');

  return (
    <SettingsContext.Provider value={{ language, setLanguage, country, setCountry }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

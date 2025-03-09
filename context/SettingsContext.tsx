// AnyGoodExpo/context/SettingsContext.tsx
import React, { createContext, useContext, useState } from 'react';
import * as Localization from 'expo-localization';

interface SettingsContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  country: string;
  setCountry: (country: string) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use device default language (e.g., 'ru') and a default country (update as needed).
  const [language, setLanguage] = useState(Localization.locale.split('-')[0] || 'en');
  const [country, setCountry] = useState('il'); // Update default country if needed

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

import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type SettingsContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  country: string;
  setCountry: (country: string) => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  language: 'en',
  setLanguage: () => {},
  country: 'US',
  setCountry: () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState('en');
  const [country, setCountryState] = useState('US');

  useEffect(() => {
    const loadSettings = async () => {
      const storedLanguage = await SecureStore.getItemAsync('languageCode');
      if (storedLanguage) {
        setLanguageState(storedLanguage);
      }

      const storedCountry = await SecureStore.getItemAsync('countryCode');
      if (storedCountry) {
        setCountryState(storedCountry);
      }
    };

    loadSettings();
  }, []);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    await SecureStore.setItemAsync('languageCode', lang);
  };

  const setCountry = async (newCountry: string) => {
    setCountryState(newCountry);
    await SecureStore.setItemAsync('countryCode', newCountry);
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        country,
        setCountry,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => React.useContext(SettingsContext);

import React, { createContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

type SettingsContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  country: string;
  setCountry: (country: string) => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  language: 'en',
  setLanguage: () => {},
  country: 'us',
  setCountry: () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState('en');
  const [country, setCountryState] = useState('us');
  const {i18n } = useTranslation();

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
	i18n.changeLanguage(lang);
    await SecureStore.setItemAsync('languageCode', lang);
  };

  const setCountry = async (newCountry: string) => {
    setCountryState(newCountry.toLowerCase());
    await SecureStore.setItemAsync('countryCode', newCountry.toLowerCase());
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

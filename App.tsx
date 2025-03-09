// AnyGood/App.tsx
import './locales/i18n'; // This initializes i18next.
import React from 'react';
import RootNavigator from './navigation/RootNavigator';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  return (
    <SettingsProvider>
      <RootNavigator />
    </SettingsProvider>
  );
}

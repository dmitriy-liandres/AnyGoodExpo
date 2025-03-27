import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { colors, spacing } from '../styles/theme';
import { useTranslation } from 'react-i18next';
import { countryCodes } from '../data/countryCodes';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { language, setLanguage, country, setCountry } = useSettings();
  const { t, i18n } = useTranslation();

  const [tempLanguage, setTempLanguage] = useState(language);
  const [tempCountry, setTempCountry] = useState(country);

  function handleSave() {
    setLanguage(tempLanguage);
    setCountry(tempCountry);
    i18n.changeLanguage(tempLanguage);
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{t('languageLabel')}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tempLanguage}
          onValueChange={(value) => {
            setTempLanguage(value);
            i18n.changeLanguage(value);
          }}
          style={styles.picker}
		  itemStyle={styles.pickerItem}
          dropdownIconColor={Platform.OS === 'ios' ? '#000' : undefined}
        >
          <Picker.Item label="English" value="en" style={styles.pickerItem} />
          <Picker.Item label="עברית" value="he" style={styles.pickerItem} />
          <Picker.Item label="Русский" value="ru" style={styles.pickerItem} />
        </Picker>
      </View>

      <Text style={styles.label}>{t('countryLabel')}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tempCountry}
          onValueChange={(value) => setTempCountry(value)}
          style={styles.picker}
		  itemStyle={styles.pickerItem}
          dropdownIconColor={Platform.OS === 'ios' ? '#000' : undefined}
        >
          {countryCodes.map((code) => (
            <Picker.Item
              key={code}
              label={t(`country_${code}`)}
              value={code}
              style={styles.pickerItem}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button title={t('save')} onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.large,
  },
  label: {
    fontSize: 16,
    marginBottom: spacing.small,
    color: '#000', // Ensure visibility
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: spacing.medium,
    
  },
  picker: {
  },
  pickerItem: {
    fontSize: 16,
  },
  pickerItem: {
    color: '#000', // items in dropdown (iOS only)
  },
  buttonContainer: {
    marginTop: spacing.medium,
  },
});

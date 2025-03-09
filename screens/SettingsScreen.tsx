// AnyGoodExpo/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
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
	
		<Picker
		  selectedValue={tempLanguage}
		  onValueChange={(value) => {
			setTempLanguage(value);
			i18n.changeLanguage(value); // Immediately update the language
		  }}
		  style={styles.picker}
		>
		  <Picker.Item label="English" value="en" style= {{fontSize: 16 }}/>
		  <Picker.Item label="עברית" value="he" style= {{fontSize: 16 }}/>
		  <Picker.Item label="Русский" value="ru" style= {{fontSize: 16 }}/>
		</Picker>

		



      <Text style={styles.label}>{t('countryLabel')}</Text>
     <Picker
		  selectedValue={tempCountry}
		  onValueChange={(value) => setTempCountry(value)}
		  style={[styles.picker, { color: '#000' }]}  // set text color to black
		>
		  {countryCodes.map(code => (
			<Picker.Item key={code} label={t(`country_${code}`)} value={code} style= {{fontSize: 16 }}/>
		  ))}
	</Picker>

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
  },
  picker: {
    marginBottom: spacing.medium,
  },
  buttonContainer: {
    marginTop: spacing.medium,
  },
});

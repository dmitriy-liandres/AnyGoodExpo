// AnyGoodExpo/screens/StartScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../styles/theme';
import { useTranslation } from 'react-i18next';
import { login, generateFirstQuestion, InitialQuestionDTO, QuestionWithAnswerDTO } from '../services/chatGPTClient';
import { useSettings } from '../context/SettingsContext';
import * as Application from 'expo-application';
import RoundedButton from '../components/RoundedButton';

export default function StartScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { country, language } = useSettings();
  const [product, setProduct] = useState('');
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleStart() {
    // Validate that a product has been entered.
    if (!product.trim()) {
      setValidationError(t('noInput') || "Please enter a product name.");
      return;
    }
    // Clear any previous validation errors.
    setValidationError("");
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Retrieve the real device ID.
      let deviceId = "default_telephone";
      if (Platform.OS === 'android') {
        deviceId = Application.androidId || "default_telephone";
      } else if (Platform.OS === 'ios') {
        try {
          deviceId = await Application.getIosIdForVendorAsync();
        } catch (e) {
          deviceId = "default_telephone";
        }
      }

      const telephoneInfo = {
        telephoneId: deviceId,
        country,    // country code, e.g., "il"
        language,   // language code, e.g., "en"
      };

      await login(telephoneInfo);

      // Prepare generateFirstQuestion payload.
      const initialRequest: InitialQuestionDTO = {
        initialQuery: product,
        selectedCountryCode: country,
        selectedLanguageCode: language,
      };
      const questionData: QuestionWithAnswerDTO = await generateFirstQuestion(initialRequest);
      // Navigate to the Question screen.
      navigation.navigate('Question' as never, { product, questionData } as never);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const remainingProduct = 100 - product.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('startTitle')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('startPlaceholder')}
        value={product}
        onChangeText={(text) => { setProduct(text); if(validationError) setValidationError(""); }}
        maxLength={100}
      />
      <Text style={styles.remainingText}>{remainingProduct}/100</Text>
      {validationError ? (
        <Text style={styles.errorText}>{validationError}</Text>
      ) : null}
      {isSubmitting ? (
        <ActivityIndicator size="large" color={colors.button} style={{ marginVertical: spacing.medium }} />
      ) : (
        <RoundedButton title={t('startButton')} onPress={handleStart} disabled={isSubmitting} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    padding: spacing.large, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 18, 
    marginBottom: spacing.medium 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 4, 
    padding: spacing.small, 
    marginBottom: spacing.small 
  },
  remainingText: { 
    fontSize: 12, 
    color: '#888', 
    textAlign: 'right', 
    marginBottom: spacing.medium 
  },
  errorText: { 
    fontSize: 14, 
    color: 'red', 
    textAlign: 'center', 
    marginBottom: spacing.medium 
  },
});

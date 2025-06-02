// AnyGoodExpo/screens/StartScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../styles/theme';
import { useTranslation } from 'react-i18next';
import { login, generateFirstQuestion, InitialQuestionDTO, QuestionWithAnswerDTO } from '../services/chatGPTClient';
import { useSettings } from '../context/SettingsContext';
import * as Application from 'expo-application';
import RoundedButton from '../components/RoundedButton';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as Localization from 'expo-localization';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


export default function StartScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { country, language } = useSettings();
  const { setLanguage } = useSettings();
  const [product, setProduct] = useState('');
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(true);
  const generateDeviceId = async () => {
	  return await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		`${Date.now()}-${Math.random()}`
	  );
	};
	
  useEffect(() => {

    const loadLanguage = async () => {
      const storedLanguage = await SecureStore.getItemAsync('languageCode');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      } else {
        const systemLang = Localization.locale.split('-')[0];
        if (['en', 'he', 'ru'].includes(systemLang)) {
          setLanguage(systemLang);
        } else {
          setLanguage('en');
        }
      }
      setIsLoadingLanguage(false);
    };
	
	const loadCountry = async () => {
	  const storedCountry = await SecureStore.getItemAsync('countryCode');
	  if (storedCountry) {
		setCountry(storedCountry);
	  } else {
		const systemCountry = Localization.region;
		if (systemCountry) {
		  setCountry(systemCountry);
		} else {
		  setCountry('us');
		}
	  }
	};

    loadLanguage();
	loadCountry();
  }, []);
  
  if (isLoadingLanguage) {
    return null;
  }
  
  const loadDeviceId = async (): Promise<string> => {
	  let deviceId = await SecureStore.getItemAsync('device-id');
	  if (!deviceId) {
		deviceId = uuidv4();
		await SecureStore.setItemAsync('device-id', deviceId);
	  }
	  return deviceId;
  };

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
	  const deviceId = await loadDeviceId();
	  
      const telephoneInfo = {
        telephoneId: deviceId,
        country,    
        language,  
      };
	  telephoneInfo.telephoneId = await SecureStore.getItemAsync('device-id');

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
	  <View style={styles.helperContainer}>
        <Text style={styles.examplesText}>t('startExample')</Text>
        <Text style={styles.remainingText}>{remainingProduct}/100</Text>
      </View>
	  
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
    padding: spacing.large
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
  helperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  examplesText: {
    fontSize: 12,
    color: '#888',
    flex: 1,
    marginRight: 8,
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

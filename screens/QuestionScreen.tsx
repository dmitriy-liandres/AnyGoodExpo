// AnyGoodExpo/screens/QuestionScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../styles/theme';
import { useTranslation } from 'react-i18next';
import { generateNextQuestion, getProductRecommendations, GenerateQuestionRequestDTO, QuestionDTO, QuestionWithAnswerDTO } from '../services/chatGPTClient';
import RoundedButton from '../components/RoundedButton';

interface QuestionScreenRouteParams {
  product: string;
  questionData: QuestionDTO;
}

export default function QuestionScreen() {
  const route = useRoute<any>() as { params: QuestionScreenRouteParams };
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { product, questionData } = route.params;

  const [currentQuestion, setCurrentQuestion] = useState<QuestionDTO>(questionData);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, boolean>>({});
  const [freeText, setFreeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Combine selected answers and free text into a single array.
    const selected = Object.keys(selectedAnswers).filter(option => selectedAnswers[option]);
    const combinedAnswers = [...selected];
    if (freeText.trim().length > 0) {
      combinedAnswers.push(freeText.trim());
    }

    // Validation: if options exist and no answer is provided, show error.
    if (currentQuestion.options && currentQuestion.options.length > 0 && combinedAnswers.length === 0) {
      setValidationError(t('selectOrType'));
      setIsSubmitting(false);
      return;
    }
    setValidationError("");

    const answerDTO: QuestionWithAnswerDTO = {
      questionId: currentQuestion.questionId,
      answers: combinedAnswers,
    };

    const requestPayload: GenerateQuestionRequestDTO = {
      questionWithAnswers: answerDTO,
    };

    try {
      if (currentQuestion.last) {
        // Last question reached: call getProductRecommendations with the same payload.
        const recommendations = await getProductRecommendations(requestPayload);
        navigation.navigate('Results' as never, { product, recommendations, requestPayload } as never);
      } else {
        const newQuestion: QuestionDTO = await generateNextQuestion(requestPayload);
        setCurrentQuestion(newQuestion);
        setSelectedAnswers({});
        setFreeText('');
      }
    } catch (error: any) {
      setValidationError(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleAnswer(option: string) {
    setSelectedAnswers(prev => ({ ...prev, [option]: !prev[option] }));
    if (validationError) setValidationError("");
  }

  const remainingFreeText = 100 - freeText.length;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {currentQuestion.text || t('questionTitle', { product })}
      </Text>
      {currentQuestion.options.map(option => (
        <TouchableOpacity key={option} style={styles.checkboxContainer} onPress={() => toggleAnswer(option)}>
          <View style={[styles.checkbox, selectedAnswers[option] && styles.checked]} />
          <Text style={{ fontSize: 16 }}>{option}</Text>
        </TouchableOpacity>
      ))}
      {currentQuestion.allowFreeText && (
        <>
          <TextInput
            style={styles.freeTextInput}
            value={freeText}
            onChangeText={(text) => { setFreeText(text); if(validationError) setValidationError(""); }}
            placeholder={t('freeTextPlaceholder') || "Your answer..."}
            maxLength={100}
          />
          <Text style={styles.remainingText}>{remainingFreeText}/100</Text>
        </>
      )}
      {validationError ? (
        <Text style={styles.errorText}>{validationError}</Text>
      ) : null}
      {isSubmitting ? (
        <ActivityIndicator size="large" color={colors.button} style={{ marginVertical: spacing.medium }} />
      ) : (
        <RoundedButton title={t('nextButton')} onPress={handleSubmit} disabled={isSubmitting} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.large },
  question: { fontSize: 18, marginBottom: spacing.medium },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.small },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#777', marginRight: spacing.small },
  checked: { backgroundColor: '#777' },
  freeTextInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: spacing.small, marginBottom: spacing.small },
  remainingText: { fontSize: 12, color: '#888', textAlign: 'right', marginBottom: spacing.medium },
  errorText: { fontSize: 14, color: 'red', textAlign: 'center', marginBottom: spacing.medium },
});

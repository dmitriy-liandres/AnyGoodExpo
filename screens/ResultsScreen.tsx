// AnyGoodExpo/screens/ResultsScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../styles/theme';
import { useTranslation } from 'react-i18next';
import { getProductRecommendationsAdditional, ProductDTO, GenerateQuestionRequestDTO } from '../services/chatGPTClient';
import RoundedButton from '../components/RoundedButton';

export default function ResultsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();
  // Received from QuestionScreen: product, recommendations, and requestPayload.
  const { product, recommendations: initialRecommendations, requestPayload } = route.params as { 
    product: string; 
    recommendations: ProductDTO[]; 
    requestPayload: GenerateQuestionRequestDTO;
  };

  const [recommendations, setRecommendations] = useState<ProductDTO[]>(initialRecommendations || []);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function loadAdditionalRecommendations() {
    if (recommendations.length >= 10) return;
    setIsLoadingMore(true);
    try {
      const additional = await getProductRecommendationsAdditional(requestPayload);
      setRecommendations(prev => [...prev, ...additional]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleStartOver() {
    navigation.navigate('Start' as never);
  }

  const renderItem = ({ item }: { item: ProductDTO }) => (
    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.link)}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('resultsTitle', { product })}</Text>
      {recommendations.length > 0 ? (
        <FlatList
          data={recommendations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noResults}>{t('noResults', { product }) || "No recommendations found."}</Text>
      )}
      {isLoadingMore && (
        <ActivityIndicator size="large" color={colors.button} style={{ marginVertical: spacing.medium }} />
      )}
      <View style={styles.buttonsContainer}>
        <RoundedButton title={t('resultsLoadMore') || "Load More Recommendations"} onPress={loadAdditionalRecommendations} disabled={isLoadingMore || recommendations.length >= 10} />
        <RoundedButton title={t('startOver') || "Start Over"} onPress={handleStartOver} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.medium },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: spacing.medium },
  card: { backgroundColor: '#FFF', padding: spacing.medium, marginBottom: spacing.small, borderRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: spacing.small },
  cardDescription: { fontSize: 14, color: '#333' },
  noResults: { fontSize: 16, textAlign: 'center', marginVertical: spacing.medium, color: '#666' },
  buttonsContainer: { marginTop: spacing.medium },
});

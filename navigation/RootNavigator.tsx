// AnyGoodExpo/navigation/RootNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import StartScreen from '../screens/StartScreen';
import QuestionScreen from '../screens/QuestionScreen';
import ResultsScreen from '../screens/ResultsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2196F3' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={({ navigation }) => ({
            headerTitle: t('appName'), // Localized application name
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 15 }}
              >
                {/* Replace the icon with your localized version if needed */}
                <Image
                  source={require('../assets/drawable/ic_settings.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{
            headerTitle: t('appName'),
          }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            headerTitle: t('appName'),
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerTitle: t('settings'), // Localized "Settings"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

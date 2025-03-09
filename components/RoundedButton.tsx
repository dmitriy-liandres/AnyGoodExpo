// AnyGoodExpo/components/RoundedButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { colors, spacing } from '../styles/theme';

interface RoundedButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export default function RoundedButton({ title, onPress, disabled }: RoundedButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.button,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderRadius: 25, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.small,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});

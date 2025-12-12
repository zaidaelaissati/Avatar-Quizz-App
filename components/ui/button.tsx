// components/ui/Button.tsx
import React, { ReactNode } from "react";
import { Pressable, Text, StyleProp, ViewStyle, StyleSheet } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>; // <-- style optioneel toegevoegd
}

export const Button = ({ onPress, children, style }: ButtonProps) => (
  <Pressable onPress={onPress} style={[styles.button, style]}>
    <Text>{children}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
});

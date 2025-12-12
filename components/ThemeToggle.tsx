// components/ThemeToggle.tsx
import React, { useContext } from "react";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { ThemeContext } from "@/context/ThemeContext";

const THEME_ICONS = {
  light: "🌞",
  dark: "🌙",
};

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      onPress={toggleTheme}
      style={{
        height: 36,
        width: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 16,
      }}
    >
      <Icon name={THEME_ICONS[theme]} />
    </Button>
  );
};

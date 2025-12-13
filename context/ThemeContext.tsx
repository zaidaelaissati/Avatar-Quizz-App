// context/ThemeContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme; //mijn huidige thema
  toggleTheme: () => void; //functie om te togglen
}
//default functie
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light', // de standaartd thema
  toggleTheme: () => {}, //geeft leeg terug
});

export default function AppThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appTheme'); // lokaal opgeslagen thema ophalen
        if (storedTheme === 'dark' || storedTheme === 'light') {
          setTheme(storedTheme); //de opgeslagen thema laden
        }
      } catch (err) {
        console.log('Error loading theme:', err);
      }
    };
    loadTheme();
  }, []);
//togglen tussen de themas
  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('appTheme', newTheme); //thema setten in de storarge 
    } catch (err) {
      console.log('Error saving theme:', err);
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

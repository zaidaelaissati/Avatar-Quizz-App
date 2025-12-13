import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Character } from '../types';
import { ThemeContext } from '@/context/ThemeContext';

const CharacterDetail = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useLocalSearchParams<{ id: string }>(); //haalt url paramameter op, destructuring →  pakt alleen de id eruit vb /profile?id=aang , id === "42" // of "aang"
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // kleuren light/dark mode
  const colors = {
    bg: theme === 'light' ? '#f8f4e9' : '#121212',
    card: theme === 'light' ? '#fff8f0' : '#1e1e1e',
    textPrimary: theme === 'light' ? '#2b3a67' : '#eee',
    textSecondary: theme === 'light' ? '#555' : '#ccc',
    accent: theme === 'light' ? '#b22222' : '#ff9999',
    border: theme === 'light' ? '#e2c79c' : '#444',
    shadow: '#000',
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch('https://sampleapis.assimilate.be/avatar/characters');
        const data: Character[] = await response.json();
        const found = data.find((c) => c.id.toString() === id); //zoek character op basis van id
        setCharacter(found || null);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);

  // Toon loading
  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
        <Text style={[styles.loading, { color: colors.textPrimary }]}>Loading...</Text>
      </View>
    );
  }

  // Toon error
  if (error) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
        <Text style={[styles.loading, { color: colors.accent }]}>Er is iets fout gegaan</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
        <Text style={[styles.loading, { color: colors.accent }]}>Character niet gevonden</Text>
      </View>
    );
  }

  const renderDetail = (label: string, value: any) => {
    if (!value || value === "NA") return null;
    const formatted = Array.isArray(value) ? value.join(', ') : value; //kijkt of het value een array is, zo ja voeg ze samen met een ,komma
    return (
      <Text style={[styles.infoText, { color: colors.textSecondary }]}>
        <Text style={[styles.label, { color: colors.accent }]}>{label}: </Text>
        {formatted}
      </Text>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* afbeelding */}
      <Image 
        source={{ uri: character.image }} 
        style={[styles.avatarImage, { borderColor: colors.accent }]} 
        resizeMode="contain" 
      />

      {/* naam */}
      <Text style={[styles.nameText, { color: colors.accent }]}>{character.name}</Text>

      {/* bio */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Bio</Text>
        {renderDetail("Alternative Names", character.bio?.alternativeNames)}
        {renderDetail("Nationality", character.bio?.nationality)}
        {renderDetail("Ethnicity", character.bio?.ethnicity)}
        {renderDetail("Ages", character.bio?.ages)}
        {renderDetail("Born", character.bio?.born)}
        {renderDetail("Died", character.bio?.died)}
      </View>

      {/* Personal info */}
      {character.personalInformation && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Personal Information</Text>
          {renderDetail("Love Interest", character.personalInformation.loveInterest)}
          {renderDetail("Weapons of Choice", character.personalInformation.weaponsOfChoice)}
          {renderDetail("Fighting Styles", character.personalInformation.fightingStyles)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loading: { fontSize: 18 },
  avatarImage: { width: '100%', height: 300, borderRadius: 12, marginBottom: 20, borderWidth: 2 },
  nameText: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  section: { padding: 15, borderRadius: 12, borderWidth: 2, marginBottom: 20, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { fontWeight: 'bold' },
  infoText: { fontSize: 15, marginBottom: 6 },
});

export default CharacterDetail;

import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface Character {
  id: number;
  name: string;
  image: string;
  bio: {
    alternativeNames?: string[] | string;
    nationality?: string;
    ethnicity?: string;
    ages?: string[] | string;
    born?: string;
    died?: string[] | string;
  };
  personalInformation?: {
    loveInterest?: string;
    weaponsOfChoice?: string[] | string;
    fightingStyles?: string[] | string;
  };
}

const CharacterDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      const response = await fetch('https://sampleapis.assimilate.be/avatar/characters');
      const data: Character[] = await response.json();
      const found = data.find((c) => c.id.toString() === id);
      setCharacter(found || null);
    };
    fetchCharacter();
  }, [id]);

  if (!character)
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );

  const renderDetail = (label: string, value: any) => {
    if (!value || value === "NA") return null;

    const formatted = Array.isArray(value) ? value.join(', ') : value;

    return (
      <Text style={styles.infoText}>
        <Text style={styles.label}>{label}: </Text>
        {formatted}
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* IMAGE */}
      <Image source={{ uri: character.image }} style={styles.avatarImage} resizeMode="contain" />

      {/* NAME */}
      <Text style={styles.nameText}>{character.name}</Text>

      {/* BIO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bio</Text>

        {renderDetail("Alternative Names", character.bio?.alternativeNames)}
        {renderDetail("Nationality", character.bio?.nationality)}
        {renderDetail("Ethnicity", character.bio?.ethnicity)}
        {renderDetail("Ages", character.bio?.ages)}
        {renderDetail("Born", character.bio?.born)}
        {renderDetail("Died", character.bio?.died)}
      </View>

      {/* PERSONAL INFORMATION */}
      {character.personalInformation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {renderDetail("Love Interest", character.personalInformation.loveInterest)}
          {renderDetail("Weapons of Choice", character.personalInformation.weaponsOfChoice)}
          {renderDetail("Fighting Styles", character.personalInformation.fightingStyles)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0e6d2',
    padding: 15,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    fontSize: 18,
    color: '#444',
  },
  avatarImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#8b0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff8f0',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2c79c',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b3a67',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#8b0000',
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
});

export default CharacterDetail;

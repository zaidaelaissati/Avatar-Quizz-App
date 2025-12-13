import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ThemeContext } from '@/context/ThemeContext';

// TypeScript Interface voor een enkel personage (gebaseerd op mogelijke API response)
export interface Character {
  id: string;
  name: string;
  image: string; // URL naar de afbeelding
}

// Interface voor de props van dit scherm (momenteel leeg)
interface CharactersScreenProps {}

const CharactersScreen = (props: CharactersScreenProps) => {
  const { theme } = useContext(ThemeContext);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // kleuren vr light/darkmode
  const colors = {
    bg: theme === 'light' ? '#f8f4e9' : '#121212',
    card: theme === 'light' ? '#fff' : '#1e1e1e',
    textPrimary: theme === 'light' ? '#2b3a67' : '#e0e0e0',
    textSecondary: theme === 'light' ? '#555' : '#aaa',
    border: theme === 'light' ? '#dcd2b0' : '#3a79a5',
    shadow: '#000',
    loading: theme === 'light' ? '#2b3a67' : '#eee',
    retryBg: theme === 'light' ? '#2e8b57' : '#3a9a76',
  };

  // Functie om data op te halen via de GET request
  const fetchCharacters = async () => {
    const API_URL = 'https://sampleapis.assimilate.be/avatar/characters';
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); //checlen op errors
      const data: Character[] = await response.json();
      setCharacters(data);
      await AsyncStorage.setItem('avatar_characters', JSON.stringify(data)); //charachterls lokaal opgeslagen
    } catch (err: any) {
      setError(`Failed to fetch characters: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const renderItem = ({ item }: { item: Character }) => {
    // checlen of er een image is, en lege spaties wegwerken 
    // als er wel image is dan haal item.Image op van api
    //zo niet dan toont die image van internet met tekst no image
    const imageUrl =
      item.image && item.image.trim() !== ''
        ? item.image
        : 'https://dummyimage.com/100x100/cccccc/000000.png&text=NO+IMG';

    return (
      <Pressable
        style={[
          styles.characterCard,
          { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow },
        ]}
        onPress={() => {
          router.push({ pathname: '/character/[id]', params: { id: item.id } });
        }}>
        <Image
          style={[styles.avatarImage, { borderColor: colors.textPrimary }]}
          source={{ uri: imageUrl }}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={[styles.nameText, { color: colors.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            klik voor meer informatie
          </Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.loading} />
        <Text style={[styles.loadingText, { color: colors.loading }]}>Loading Avatars...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>{error}</Text>
        <Pressable
          style={[styles.retryButton, { backgroundColor: colors.retryBg }]}
          onPress={fetchCharacters}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={[styles.headerText, { color: colors.textPrimary }]}>Avatar Characters</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  center: { justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 15, paddingBottom: 40 },
  headerText: { fontSize: 26, fontWeight: '900', marginBottom: 20, textAlign: 'center' },
  characterCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
    borderWidth: 2,
    backgroundColor: '#ccc',
  },
  textContainer: { flex: 1 },
  nameText: { fontSize: 20, fontWeight: '800' },
  detailText: { fontSize: 14, marginTop: 4, fontStyle: 'italic' },
  loadingText: { fontSize: 16, marginTop: 10 },
  errorText: { textAlign: 'center', marginBottom: 10 },
  retryButton: { padding: 10, borderRadius: 6 },
  retryButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default CharactersScreen;

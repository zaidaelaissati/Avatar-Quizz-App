import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, Pressable } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
// async storage installatie npx expo install @react-native-async-storage/async-storage
// TypeScript Interface voor een enkel personage (gebaseerd op mogelijke API response)
interface Character {
  id: string;
  name: string;
  image: string; // URL naar de afbeelding
}

// Interface voor de props van dit scherm (momenteel leeg)
interface CharactersScreenProps {}

// Component definitie in de gevraagde stijl
const CharactersScreen = (props: CharactersScreenProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Functie om data op te halen via de GET request
  const fetchCharacters = async () => {
    // De API URL is nu binnen de functie gedefinieerd, zoals gevraagd.
    const API_URL = 'https://sampleapis.assimilate.be/avatar/characters'; 
    
    try {
      setLoading(true);
      setError(null);
      
      // De fetch roep gebruikt de API_URL
      const response = await fetch(API_URL); 
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Character[] = await response.json();
    
      // Filter karakters zonder naam of foto (voor een cleanere UI)
      // const cleanedData = data.filter(c => c.name && c.photoUrl);
      // setCharacters(cleanedData);

      setCharacters(data);

      // Projectvereiste: Opslaan in AsyncStorage (Caching)
      await AsyncStorage.setItem('avatar_characters', JSON.stringify(data));

    } catch (err: any) {
      setError(`Failed to fetch characters: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []); // Run alleen bij de eerste mount

  // Functie om de item van de FlatList te renderen
  const renderItem = ({ item }: { item: Character }) => {
 const imageUrl = item.image && item.image.trim() !== '' 
    ? item.image 
    : 'https://via.placeholder.com/100x100?text=NO+IMG';

      return(
  //dynamische route gelinkt met on push
    
<Pressable
  style={styles.characterCard}
  onPress={() => {
    router.push({
      pathname: '/character/[id]',
      params: { id: item.id },
    });
  }}
>

<Image 
        style={styles.avatarImage} 
        source={{ uri: imageUrl }} // ✅ GEBRUIK HIER DE BEREKENDE imageUrl
        resizeMode="cover"  // Zorgt dat de afbeelding past in de 60x60 ruimte
        key={item.id}     // Voeg een unieke key toe voor betrouwbaarheid
      />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.detailtext}>
          klik voor meer informatie
        </Text>
      </View>
    </Pressable>
      
    )
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading Avatars...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchCharacters}>
           <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.headerText}>Avatar Characters</Text>}
      />
      <Text style={styles.screenLabel}>Avatars</Text>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//     paddingTop: 50,
//   },
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingHorizontal: 15,
//     paddingBottom: 40,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     marginTop: 10,
//     color: '#333',
//     textAlign: 'center',
//   },
//   characterCard: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   avatarImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 5,
//     marginRight: 15,
//     backgroundColor: '#ccc',
//   },
//   textContainer: {
//     flex: 1,
//   },
//   nameText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333',
//   },
//   detailtext: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 2,
//   },
//   screenLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     paddingBottom: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     backgroundColor: '#f9f9f9',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#4a90e2',
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   retryButton: {
//     backgroundColor: '#4a90e2',
//     padding: 10,
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   }
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0e6d2', // zacht, "Aang"-achtig parchment kleur
    paddingTop: 50,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#2b3a67', // diepblauw, Water Tribe vibe
    textAlign: 'center',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  characterCard: {
    flexDirection: 'row',
    backgroundColor: '#fff8f0', // lichte parchment achtergrond
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2c79c', // zand/earth vibes
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // ronde avatars
    marginRight: 15,
    backgroundColor: '#ccc',
    borderWidth: 2,
    borderColor: '#2b3a67', // water tribe accent
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#b22222', // Fire Nation accent
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailtext: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    fontStyle: 'italic',
  },
  screenLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e8b57', // Earth Kingdom groen
    textAlign: 'center',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#c2b280',
    backgroundColor: '#f0e6d2',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2b3a67',
  },
  errorText: {
    color: '#b22222',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#2e8b57',
    padding: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});


export default CharactersScreen;
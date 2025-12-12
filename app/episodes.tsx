import React, { useState, useEffect, useContext } from 'react';
import { 
    StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable, TextInput, ScrollView 
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { ThemeContext } from '@/context/ThemeContext';

interface Episode {
    id: number;
    Season: string; 
    NumInSeason: string; 
    Title: string;
    OriginalAirDate: string;
    Description?: string; 
}

const SEASONS = ['1', '2', '3'];

const SEASON_DATA: { [key: string]: { color: string, icon: string } } = {
    '1': { color: '#3a79a5', icon: 'water' },
    '2': { color: '#5a9235', icon: 'leaf-circle' },
    '3': { color: '#a53335', icon: 'fire' },
    'All': { color: '#ffcc66', icon: 'hexagon-multiple' }
};

const EpisodesScreen = () => {
    const { theme } = useContext(ThemeContext);
    const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedSeason, setSelectedSeason] = useState<string | 'All'>('All');

    const colors = {
        bg: theme === 'light' ? '#f8f4e9' : '#121212',
        text: theme === 'light' ? '#333' : '#eee',
        card: theme === 'light' ? '#fff' : '#222',
        inputBg: theme === 'light' ? '#fff' : '#1f1f1f',
        inputBorder: theme === 'light' ? '#c2b280' : '#555',
        noResults: theme === 'light' ? '#a53335' : '#ff6666',
    };

    const fetchEpisodes = async () => {
        const API_URL = 'https://sampleapis.assimilate.be/avatar/episodes';
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Episode[] = await response.json();

            data.sort((a, b) => {
                const seasonA = parseInt(a.Season);
                const seasonB = parseInt(b.Season);
                const numA = parseInt(a.NumInSeason);
                const numB = parseInt(b.NumInSeason);
                return seasonA !== seasonB ? seasonA - seasonB : numA - numB;
            });

            setAllEpisodes(data);
            await AsyncStorage.setItem('avatar_episodes', JSON.stringify(data));
        } catch (err: any) {
            setError(`Failed to fetch episodes: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEpisodes(); }, []);

    const getFilteredEpisodes = (): Episode[] => {
        let list = allEpisodes;
        if (selectedSeason !== 'All') list = list.filter(ep => ep.Season === selectedSeason);
        if (searchText.trim() !== '') {
            const lower = searchText.toLowerCase();
            list = list.filter(ep => ep.Title.toLowerCase().includes(lower) || (ep.Description?.toLowerCase() || '').includes(lower));
        }
        return list;
    };

    const filteredEpisodes = getFilteredEpisodes();

    const renderItem = ({ item }: { item: Episode }) => {
        const seasonData = SEASON_DATA[item.Season] || { color: '#555', icon: 'help-circle' };
        return (
            <Pressable style={[styles.episodeCard, { backgroundColor: colors.card, borderColor: seasonData.color }]}>
                <View style={[styles.seasonIndicator, { backgroundColor: seasonData.color }]}>
                    <MaterialCommunityIcons name={seasonData.icon as any} size={30} color="#fff" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.titleText, { color: seasonData.color }]}>{`S${item.Season} E${item.NumInSeason}: ${item.Title}`}</Text>
                    <Text style={[styles.airDateText, { color: colors.text }]}>Aired: {item.OriginalAirDate}</Text>
                    {item.Description && <Text style={[styles.descriptionText, { color: colors.text }]} numberOfLines={2}>{item.Description}</Text>}
                </View>
            </Pressable>
        );
    };

    const renderHeader = () => (
        <View>
            <Text style={[styles.headerText, { color: colors.text }]}>Avatar: De Legende van de Afleveringen</Text>
            <TextInput
                style={[styles.searchInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                placeholder="Zoek titel of beschrijving..."
                placeholderTextColor={theme === 'light' ? '#a0a0a0' : '#aaa'}
                value={searchText}
                onChangeText={setSearchText}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.seasonButtonsWrapper}>
                {['All', ...SEASONS].map(season => {
                    const data = SEASON_DATA[season];
                    const isActive = selectedSeason === season;
                    return (
                        <Pressable
                            key={season}
                            style={[
                                styles.seasonButton,
                                isActive && { backgroundColor: data.color, borderColor: data.color }
                            ]}
                            onPress={() => setSelectedSeason(season)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name={data.icon as any} size={14} color={isActive ? '#fff' : data.color} style={{ marginRight: 5 }} />
                                <Text style={{ color: isActive ? '#fff' : data.color, fontWeight: 'bold' }}>{season === 'All' ? 'Alle Boeken' : `Boek ${season}`}</Text>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
            {filteredEpisodes.length === 0 && !loading && <Text style={{ color: colors.noResults, textAlign: 'center', marginTop: 20 }}>Geen afleveringen gevonden.</Text>}
        </View>
    );

    if (loading) return (
        <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
            <ActivityIndicator size="large" color={SEASON_DATA['2'].color} />
            <Text style={{ color: colors.text }}>Afleveringen aan het Laden...</Text>
        </View>
    );

    if (error) return (
        <View style={[styles.container, styles.center, { backgroundColor: colors.bg }]}>
            <Text style={{ color: colors.text }}>{error}</Text>
            <Pressable style={[styles.retryButton, { backgroundColor: SEASON_DATA['2'].color }]} onPress={fetchEpisodes}>
                <Text style={{ color: '#fff' }}>Probeer Opnieuw</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <FlatList
                data={filteredEpisodes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    center: { justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingHorizontal: 15, paddingBottom: 40 },
    headerText: { fontSize: 26, fontWeight: '900', marginBottom: 20, textAlign: 'center' },
    searchInput: { padding: 12, borderRadius: 8, borderWidth: 2, marginBottom: 15, fontSize: 16 },
    seasonButtonsWrapper: { flexDirection: 'row', marginBottom: 15 },
    seasonButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, backgroundColor: '#fff', borderWidth: 2 },
    episodeCard: { flexDirection: 'row', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center', borderWidth: 2, elevation: 3 },
    seasonIndicator: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    textContainer: { flex: 1 },
    titleText: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
    airDateText: { fontSize: 14, marginBottom: 4 },
    descriptionText: { fontSize: 12 },
    retryButton: { padding: 10, borderRadius: 6 },
});
export default EpisodesScreen;

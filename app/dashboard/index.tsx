import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";

const DashboardScreen = () => {
  const { loading, logout } = useSupabase();
  const { theme } = useContext(ThemeContext);
  const { name, avatar } = useUser(); 

  const [lastScore, setLastScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number | null>(null);
  const [lastQuizDate, setLastQuizDate] = useState<string | null>(null);

  const loadScore = async () => {
    try {
      const data = await AsyncStorage.getItem("lastQuizScore");
      if (data) {
        const parsed = JSON.parse(data);
        setLastScore(parsed.score);
        setMaxScore(parsed.maxScore);
        setLastQuizDate(new Date(parsed.date).toLocaleDateString());
      }
    } catch (error) {
      console.log("Error loading quiz score:", error);
    }
  };

  useEffect(() => {
    loadScore();
  }, []);

  // Theme kleuren
  const bgColor = theme === "light" ? "#f8f4e9" : "#1c1b1a";
  const cardBg = theme === "light" ? "#fff" : "#2a2928";
  const textColor = theme === "light" ? "#333" : "#eee";
  const scoreColor = "#a43c23ff";
  const infoBg = theme === "light" ? "#ded2ca" : "#3a3837";
  const infoBorder = theme === "light" ? "#917c6e" : "#bba799";

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <Text style={{ color: textColor }}>Loading Supabase user...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 120 }}>
        {/* Welcome message */}
        <Text style={[styles.title, { color: textColor }]}>
          Welcome, {name}!
        </Text>

        {/* Score Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: cardBg,
              borderColor: theme === "light" ? "#e0e0e0" : "#444",
            },
          ]}
        >
          <Text style={[styles.scoreTitle, { color: textColor }]}>Score</Text>
          <Text
            style={[styles.scoreValue, { color: scoreColor, width: "100%", textAlign: "center" }]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            {lastScore !== null && maxScore !== null
              ? `${lastScore} / ${maxScore}`
              : `Nog geen quiz gespeeld`}
          </Text>
        </View>

        {/* Last Quiz Info */}
        {lastQuizDate && (
          <View
            style={[styles.infoBox, { backgroundColor: infoBg, borderLeftColor: infoBorder }]}
          >
            <Text style={[styles.infoText, { color: textColor }]}>
              Last quiz: {lastQuizDate}
            </Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="../characters" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Characters</Text>
            </Pressable>
          </Link>

          <Link href="/episodes" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Episodes</Text>
            </Pressable>
          </Link>

          <Link href="/quizz" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Quiz</Text>
            </Pressable>
          </Link>
        </View>

        {/* Logout */}
        <Pressable onPress={logout} style={{ marginTop: 16, alignSelf: "center" }}>
          <Text style={{ color: "#DC2626", fontWeight: "bold" }}>Logout</Text>
        </Pressable>
      </ScrollView>

      {/* onderaan Navbar */}
      <View style={[styles.navbar, { backgroundColor: theme === "light" ? "#fff" : "#222" }]}>
        <Link href="../characters" asChild>
          <Pressable style={styles.element}>
            <Image source={require("../../assets/images/water.png")} style={styles.elementImg} />
            <Text style={[styles.elementLabel, { color: textColor }]}>Character</Text>
          </Pressable>
        </Link>

        <Link href="/episodes" asChild>
          <Pressable style={styles.element}>
            <Image source={require("../../assets/images/aarde.png")} style={styles.elementImg} />
            <Text style={[styles.elementLabel, { color: textColor }]}>Episodes</Text>
          </Pressable>
        </Link>

        <Link href="/quizz" asChild>
          <Pressable style={styles.element}>
            <Image source={require("../../assets/images/vuur.png")} style={styles.elementImg} />
            <Text style={[styles.elementLabel, { color: textColor }]}>Quizz</Text>
          </Pressable>
        </Link>
{/*maps */}
<Link href="../map" asChild>
  <Pressable style={styles.element}>
    <Image
      source={require("../../assets/images/mapLogo.png")} // je eigen map icon
      style={styles.elementImg}
    />
    <Text style={[styles.elementLabel, { color: textColor }]}>Map</Text>
  </Pressable>
</Link>

  {/*user acc */}
        <Link href="/user" asChild>
          <Pressable style={styles.element}>
            <Image
              source={avatar ? { uri: avatar } : require("../../assets/images/lucht.png")}
              style={[styles.elementImg, { borderRadius: 16 }]}
            />
            <Text style={[styles.elementLabel, { color: textColor }]}>User Page</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 60 : 50,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "900", 
    marginVertical: 16 
  },
  card: {
    padding: 30,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
    marginBottom: 25,
    borderWidth: 1,
    elevation: 3,
  },
  scoreTitle: { 
    fontSize: 18, 
    fontWeight: "500" 
  },
  scoreValue: { 
    fontSize: 52, 
    fontWeight: "900",
  },
  infoBox: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 40,
    width: "85%",
    alignItems: "center",
    borderLeftWidth: 4,
  },
  infoText: { 
    fontSize: 14, 
    fontWeight: "500" 
  },
  buttonContainer: {
    width: "85%",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 17,
    color: "#333",
    fontWeight: "600",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#888",
  },
  element: { 
    alignItems: "center", 
    flex: 1 
  },
  elementImg: { 
    width: 36,
    height: 36, 
    marginBottom: 4, 
    borderRadius: 18,
    resizeMode: "cover",
  },
  elementLabel: { 
    fontSize: 12, 
    fontWeight: "600" 
  },
  welcomeAvatar: {
    width: 160,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#0284C7",
  },
});

export default DashboardScreen;

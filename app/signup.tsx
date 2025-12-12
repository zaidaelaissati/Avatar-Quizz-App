import { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";

const SignupScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { signup } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const register = async () => {
    if (password !== passwordRepeat) {
      alert("Wachtwoorden komen niet overeen");
      return;
    }
    try {
      await signup(email, password);
      router.replace("/login");
      alert("Controleer je mailbox om je e-mail te verifiëren.");
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Dynamische kleuren
  const bgColor = theme === "light" ? "#E0F7FA" : "#111"; 
  const cardBg = theme === "light" ? "rgba(255,255,255,0.85)" : "#222";
  const textColor = theme === "light" ? "#000" : "#fff";
  const labelColor = theme === "light" ? "#0284C7" : "#93C5FD"; 
  const inputBg = theme === "light" ? "#fff" : "#333";
  const placeholderColor = theme === "light" ? "#555" : "#aaa";
  const borderColor = theme === "light" ? "#0284C7" : "#16A34A"; 
  const buttonBg = theme === "light" ? "#0284C7" : "#16A34A"; 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bgColor }}>
      <View style={styles.container}>
        <Card style={[styles.card, { backgroundColor: cardBg }]}>
          <CardHeader style={{ alignItems: "center", marginBottom: 8 }}>
            <CardTitle style={[styles.title, { color: textColor }]}>Avatar Register</CardTitle>
            <CardDescription style={{ color: textColor, textAlign: "center" }} />
          </CardHeader>

          <CardContent style={{ gap: 24 }}>
            <View style={{ gap: 8 }}>
              <Label style={{ fontWeight: "700", color: labelColor }}>Email</Label>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="aang@airnomads.com"
                placeholderTextColor={placeholderColor}
                style={{
                  backgroundColor: inputBg,
                  color: textColor,
                  borderWidth: 2,
                  borderColor: borderColor,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Label style={{ fontWeight: "700", color: labelColor }}>Wachtwoord</Label>
              <Input
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={placeholderColor}
                style={{
                  backgroundColor: inputBg,
                  color: textColor,
                  borderWidth: 2,
                  borderColor: borderColor,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Label style={{ fontWeight: "700", color: labelColor }}>Herhaal Wachtwoord</Label>
              <Input
                value={passwordRepeat}
                onChangeText={setPasswordRepeat}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={placeholderColor}
                style={{
                  backgroundColor: inputBg,
                  color: textColor,
                  borderWidth: 2,
                  borderColor: borderColor,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              />
            </View>

            <Button onPress={register} style={{ backgroundColor: buttonBg }}>
              <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>REGISTER</Text>
            </Button>

            <Separator style={{ backgroundColor: theme === "light" ? "#9CA3AF" : "#555", height: 1 }} />

            <Text style={{ textAlign: "center", color: textColor }}>
              Al een Avatar?{" "}
              <Pressable onPress={() => router.replace("/login")}>
                <Text style={{ color: "#DC2626", textDecorationLine: "underline", fontWeight: "700" }}>Keer terug naar Login</Text>
              </Pressable>
            </Text>

            <View style={styles.elementsRow}>
              <View style={styles.element}>
                <Text style={[styles.elementIcon, { color: "#0284C7" }]}>💨</Text>
                <Text style={[styles.elementLabel, { color: textColor }]}>Air</Text>
              </View>
              <View style={styles.element}>
                <Text style={[styles.elementIcon, { color: "#16A34A" }]}>🌿</Text>
                <Text style={[styles.elementLabel, { color: textColor }]}>Earth</Text>
              </View>
              <View style={styles.element}>
                <Text style={[styles.elementIcon, { color: "#EF4444" }]}>🔥</Text>
                <Text style={[styles.elementLabel, { color: textColor }]}>Fire</Text>
              </View>
              <View style={[styles.element]}>
                <Text style={[styles.elementIcon, { color: "#3B82F6" }]}>💧</Text>
                <Text style={[styles.elementLabel, { color: textColor }]}>Water</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: { width: "100%", maxWidth: 384, borderRadius: 16, padding: 16 },
  title: { fontSize: 32, fontWeight: "900" },
  elementsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, paddingHorizontal: 8 },
  element: { alignItems: "center", flex: 1 },
  elementIcon: { fontSize: 32, marginBottom: 4 },
  elementLabel: { fontWeight: "600", fontSize: 12 },
});

export default SignupScreen;

import React, { useEffect, useContext } from "react";
import { View, Text, TextInput, Image, Pressable, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useUser } from "@/context/UserContext";
import { ThemeContext } from "@/context/ThemeContext";

export default function UserPage() {
  const { name, setName, avatar, setAvatar } = useUser();
  const { theme } = useContext(ThemeContext);

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  useEffect(() => {
    if (!status?.granted) requestPermission();
  }, []);

  const pickImage = async () => {
    Haptics.selectionAsync();

    if (!status?.granted) {
      Alert.alert(
        "Permission Required",
        "We need access to your photos to change your profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAvatar(result.assets[0].uri);
    }
  };

  const saveChanges = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Saved", "Your profile has been updated!");
  };

  // Theme kleuren
  const colors = {
    bg: theme === "light" ? "#f8f4e9" : "#1c1b1a",
    text: theme === "light" ? "#333" : "#eee",
    inputBg: theme === "light" ? "#fff" : "#2a2928",
    inputBorder: theme === "light" ? "#ddd" : "#555",
    buttonBg: theme === "light" ? "#914122ff" : "#0d6efd",
    buttonText: "#fff",
    avatarBorder: theme === "light" ? "#aa9086ff" : "#0d6efd",
    changeAvatar: theme === "light" ? "#914122ff" : "#0d6efd",
    placeholder: theme === "light" ? "#999" : "#aaa",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable onPress={pickImage} style={styles.avatarWrapper}>
        <Image
          source={{
            uri: avatar ?? "https://avatar-placeholder.iran.liara.run/public/boy?random=1",
          }}
          style={[styles.avatar, { borderColor: colors.avatarBorder }]}
        />
        <Text style={[styles.changeAvatar, { color: colors.changeAvatar }]}>
          Change Avatar
        </Text>
      </Pressable>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Display Name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <Pressable style={[styles.saveBtn, { backgroundColor: colors.buttonBg }]} onPress={saveChanges}>
        <Text style={[styles.saveText, { color: colors.buttonText }]}>Save Changes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  avatarWrapper: { alignItems: "center", marginBottom: 30 },
  avatar: { width: 140, height: 140, borderRadius: 100, borderWidth: 4 },
  changeAvatar: { marginTop: 10, fontWeight: "600" },
  field: { marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: { padding: 14, borderRadius: 10, borderWidth: 1 },
  saveBtn: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: "center" },
  saveText: { fontSize: 16, fontWeight: "600" },
});

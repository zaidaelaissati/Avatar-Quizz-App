// app/index.tsx
import React from "react";
import { ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";

export default function Screen() {
  const { initializing, session } = useSupabase();

  if (initializing) return <ActivityIndicator style={{ flex: 1 }} />;
// tootn spinner, als jet initialiseert
  if (session) return <Redirect href="/dashboard" />; //als er al sessie bezig is , als user al is ingelogd, redirecten naar dashboard
  return <Redirect href="/login" />; //zo niet ingelogd redidcrect nr loginpagina
}

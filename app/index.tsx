// app/index.tsx
import React from "react";
import { ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";

export default function Screen() {
  const { initializing, session } = useSupabase();

  if (initializing) return <ActivityIndicator style={{ flex: 1 }} />;

  if (session) return <Redirect href="/dashboard" />;
  return <Redirect href="/login" />;
}

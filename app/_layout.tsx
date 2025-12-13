import React, { useContext } from "react";
import SupabaseProvider from "@/context/SupabaseContext";
import AppThemeProvider, { ThemeContext } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext"; // <-- importeren
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <AppThemeProvider>
        <UserProvider> 
          <InnerLayout />
        </UserProvider>
      </AppThemeProvider>
    </SupabaseProvider>
  );
}

function InnerLayout() {
  const { theme } = useContext(ThemeContext);
{/*  headerricht themetoggle, zorgt er voor dzt in alle paginas rechts in header ik de themetoggle te zien krijg , zit in rootlayout dus alle paginas kan zien*/}
  return (
    
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ 
    headerRight: () => <ThemeToggle />, 
  }}>
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            headerRight: () => <ThemeToggle />,
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: "Registreren",
            headerRight: () => <ThemeToggle />,
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerRight: () => <ThemeToggle />,
          }}
        />
        <Stack.Screen name="index" options={{ headerShown: true }} />
      </Stack>
      <PortalHost />
    </>
  );
}

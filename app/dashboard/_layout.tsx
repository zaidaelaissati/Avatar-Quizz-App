import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemeToggle } from "@/components/ThemeToggle";

const DashboardLayout = () => {
    return (
        <Tabs>
            {/* <Tabs.Screen name="index" options={{title: "Map", tabBarIcon: ({size, color}) => <FontAwesome name="map-marker" size={size} color={color} />}}/> */}
            {/* <Tabs.Screen name="add" options={{title: "Add Restaurant", tabBarIcon: ({size, color}) => <Ionicons name="restaurant" size={size} color={color} />}}/> */}

             <Tabs
      screenOptions={{
        headerRight: () => <ThemeToggle />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="add" options={{ title: "Add" }} />
    </Tabs>
        </Tabs>
    )
}

export default DashboardLayout;
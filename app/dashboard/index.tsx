import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/SupabaseContext";
import MapView, { Marker } from "react-native-maps";

const MapScreen = () => {
    const { logout } = useSupabase();

    return (
        <View className="flex-1">
            <Button onPress={() => logout()}><Text>Logout</Text></Button>

            <MapView style={{flex: 1}}>
                <Marker coordinate={{
                    latitude: 50.11,
                    longitude: 2
                }} title="Ergens in frankrijk"/>
            </MapView>
        </View>
    )
}

export default MapScreen;
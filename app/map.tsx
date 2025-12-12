import React, { useState } from "react";
import { View, Image, Text, StyleSheet, Modal, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";


interface Store {
  name: string;
  latitude: number;
  longitude: number;
  element: "fire" | "water" | "earth" | "air";
  address: string;
  rating: number;

}

// voorbeeld winkels, die avatar merch verkopen
const merchStores: Store[] = [
  {
    name: "Akiba Station",
    latitude: 51.21622,
    longitude: 4.42149,
    element: "fire",
    address: "Pelikaanstraat 3, 2018 Antwerpen, Belgium",
    rating: 4.5,
  },
  {
    name: "Mekanik Strip",
    latitude: 51.22232,
    longitude: 4.40360,
    element: "water",
    address: "Sint-Jacobsmarkt 73, 2000 Antwerpen, Belgium",
    rating: 4.0,
  },
  {
    name: "Game Mania (Sint-Jacobsmarkt)",
    latitude: 51.22031,
    longitude: 4.41145,
    element: "earth",
    address: "Sint-Jacobsmarkt 36, 2000 Antwerpen, Belgium",
    rating: 4.2,
  },
  {
    name: "Pop Culture Store",
    latitude: 51.21994,
    longitude: 4.40112,
    element: "air",
    address: "Nationalestraat 5, 2000 Antwerpen, Belgium",
    rating: 4.3,
  },
];

//enkele icoontjes die getoond worden markers uit images pakken
const iconMap  = {
  fire: require("../assets/images/vuur.png"),
  water: require("../assets/images/water.png"),
  earth: require("../assets/images/aarde.png"),
  air: require("../assets/images/lucht.png"),
};

export default function MapScreen() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  return (
    <View style={{ flex: 1 }}>
      {/* voor iphone */}
      <MapView
        style={{ flex: 1 }}
       region={{
          latitude: 51.219447,
          longitude: 4.402464,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {merchStores.map((s) => (
          <Marker
            key={s.name}
            coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            onPress={() => setSelectedStore(s)}
          >
            <Image
              source={iconMap[s.element]}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>

      {/* Info Card Modal */}
{selectedStore && (
  <Modal
    animationType="slide"
    transparent
    visible={!!selectedStore}
    onRequestClose={() => setSelectedStore(null)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <Text style={styles.storeName}>{selectedStore.name}</Text>
        <Text style={styles.storeInfo}>{selectedStore.address}</Text>
        <Text style={styles.storeInfo}>Rating: {selectedStore.rating} ⭐</Text>

        <Pressable
          onPress={() => setSelectedStore(null)}
          style={styles.closeButton}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
  },

  storeName: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  storeInfo: { fontSize: 16, marginBottom: 4, textAlign: "center" },
  closeButton: {
    backgroundColor: "#0284C7",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
});

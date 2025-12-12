import { Store } from "./types";

// voorbeeld winkels, die avatar merch verkopen
export const merchStores: Store[] = [
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
export const iconMap  = {
  fire: require("../assets/images/vuur.png"),
  water: require("../assets/images/water.png"),
  earth: require("../assets/images/aarde.png"),
  air: require("../assets/images/lucht.png"),
};
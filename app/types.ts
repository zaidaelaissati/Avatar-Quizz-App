export interface Character {
  id: number;
  name: string;
  image: string;
  bio: {
    alternativeNames?: string[] | string;
    nationality?: string;
    ethnicity?: string;
    ages?: string[] | string;
    born?: string;
    died?: string[] | string;
  };
  personalInformation?: {
    loveInterest?: string;
    weaponsOfChoice?: string[] | string;
    fightingStyles?: string[] | string;
  };
}

export interface Episode {
    id: number;
    Season: string; 
    NumInSeason: string; 
    Title: string;
    OriginalAirDate: string;
    Description?: string; 
}
export interface Store {
  name: string;
  latitude: number;
  longitude: number;
  element: "fire" | "water" | "earth" | "air";
  address: string;
  rating: number;

}


import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSupabase } from "@/context/SupabaseContext";

interface IUserContext {
  name: string;
  setName: (name: string) => void;
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
}

export const UserContext = createContext<IUserContext>({
  name: "Aang",
  setName: () => {},
  avatar: null,
  setAvatar: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSupabase();
  const user = session?.user;

  const [name, setName] = useState("Aang");
  const [avatar, setAvatar] = useState<string | null>(null);

  //  KEY PER USER
  const storageKey = user ? `userProfile:${user.id}` : null; // als er user is, pak je de profiel vn die user

  // LOAD profile when user changes
  useEffect(() => {
    const load = async () => {
      if (!storageKey) {
        setName("Aang");
        setAvatar(null);
        return;
      }

      const saved = await AsyncStorage.getItem(storageKey);

      if (saved) {
        const p = JSON.parse(saved);
        setName(p.name ?? "Aang");
        setAvatar(p.avatar ?? null);
      } else {
        // new user → reset defaults
        setName("Aang");
        setAvatar(null);
      }
    };

    load();
  }, [storageKey]);

  // SAVE als er veranderingen gebeuren
  useEffect(() => {
    const save = async () => {
      if (!storageKey) return;

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({ name, avatar })
      );
    };

    save();
  }, [name, avatar, storageKey]);

  return (
    <UserContext.Provider value={{ name, setName, avatar, setAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

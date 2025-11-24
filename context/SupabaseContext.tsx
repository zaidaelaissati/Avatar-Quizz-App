import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useState } from "react";

interface SupabaseContextProps {
    session: Session | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loggingIn: boolean;
    initializing: boolean;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

const SupabaseProvider = ({children} : { children: ReactNode}) => {
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const [initializing, setInitializing] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);

    const login = async() => {

    }

    const logout = async() => {

    }

    return (
        <SupabaseContext.Provider value={{loggingIn, initializing, session, login, logout}}>

        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext);

    if (context === undefined) {
        throw new Error("useSupabase must be used within an SupabaseProvider");
    }

    return context;
}

export default SupabaseProvider
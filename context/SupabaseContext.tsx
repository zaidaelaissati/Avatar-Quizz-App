import { createContext, ReactNode, useContext } from "react";

interface SupabaseContextProps {

}

const SupabaseContext = createContext<SupabaseContextProps>({});

const SupabaseProvider = ({children} : { children: ReactNode}) => {


    return (
        <SupabaseContext.Provider value={{}}>

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
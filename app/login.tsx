import { SignInForm } from "@/components/sign-in-form";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

const LoginScreen = () => {
    return (
        <View className="flex-1 justify-center items-center">
            <SignInForm/>
        </View>
    )
}

export default LoginScreen;
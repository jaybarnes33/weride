import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import axios from "axios";
import { createURL } from "@/utils/api";
import { useRoute } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Colors from "@/constants/Colors";

const Auth = () => {
  const { back } = useRouter();
  const { navigate } = useNavigation();
  const route = useRoute();

  const { screen } = route.params as { screen: string };
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleContinue = async () => {
    try {
      setLoading(true);
      if ((screen === "Register" && !form.name) || !form.phone) {
        return setError("Please fill all fields");
      }
      const { data } = await axios.post(createURL("/api/auth/"), form);
      console.log(data);
      //@ts-ignore
      navigate("Otp", { id: data.id });
    } catch (error: any) {
      console.log(JSON.stringify(error));
      setError(error.message ?? "Could not request OTP");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="px-4 pt-8 space-y-4">
      <TouchableOpacity className="absolute top-10 z-50 mx-5" onPress={back}>
        <ArrowLeftIcon color={Colors.light.primary} />
      </TouchableOpacity>
      {error && (
        <View className="bg-red-900 w-full items-center">
          <Text className="text-white">{error}</Text>
        </View>
      )}
      <Text className="font-bold text-xl">
        Please provide your details to continue
      </Text>
      {screen !== "Login" && (
        <View className="space-y-2">
          <Text className="font-semibold">Name</Text>
          <TextInput
            onChangeText={(name) => setForm({ ...form, name })}
            placeholder="John Doe"
            className=" p-2 border border-neutral-400 rounded h-10"
          />
        </View>
      )}
      <View className="space-y-2">
        <Text className="font-semibold">Phone</Text>
        <View className="flex-row items-center p-2 border border-neutral-400 rounded h-10">
          <Text className="text-gray-500">🇬🇭 +233 </Text>
          <TextInput
            onChangeText={(phone) => setForm({ ...form, phone })}
            placeholder="1234567890"
            className="h-full flex-1"
          />
        </View>
      </View>
      <TouchableOpacity
        className="bg-primary rounded-lg p-4 flex-row items-center justify-center"
        disabled={
          loading || (screen === "Register" && !form.name) || !form.phone
        }
        onPress={handleContinue}
      >
        <Text className="text-center text-white">Continue</Text>
        {loading && <ActivityIndicator />}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Auth;

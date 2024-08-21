import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/Input";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { createURL } from "@/utils/api";
import { useRoute } from "@react-navigation/native";
import { storeTokens } from "@/utils";
const Otp = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { navigate } = useRouter();
  const [form, setForm] = useState({
    otp: "",
    loading: false,
    error: "",
  });

  async function handleNext() {
    try {
      setForm((prev) => ({ ...prev, loading: false }));
      const { otp } = form;
      const { data } = await axios.post(createURL(`/api/auth/otp/${id}`), {
        otp,
        id,
      });
      await storeTokens(data);
      navigate("(tabs)");
    } catch (error) {
      console.log(error);
      setForm((prev) => ({ ...prev, error: "An error occured" }));
    } finally {
      setForm((prev) => ({ ...prev, loading: false }));
    }
  }
  return (
    <SafeAreaView className="px-4 space-y-4">
      <Text className="font-bold my-2">Enter the OTP</Text>
      <Input
        placeholder="OTP"
        value={form.otp}
        onChangeText={(text) => setForm((prev) => ({ ...prev, otp: text }))}
      />
      <TouchableOpacity
        className="bg-primary rounded-lg p-4 flex-row items-center justify-center"
        onPress={handleNext}
      >
        <Text className="text-center text-white">Let's go!!</Text>
        {form.loading && <ActivityIndicator />}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Otp;

import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { getTokens } from "@/utils";

const index = () => {
  const { navigate } = useNavigation();

  // useEffect(() => {
  //   (async () => {
  //     const tokens = await getTokens();
  //     if (tokens?.accessToken?.length! > 0) {
  //       //@ts-expect-error assignment of string to never
  //       navigate("(tabs)");
  //     }
  //   })();
  // }, []);
  return (
    <SafeAreaView className="flex-1  pt-10 px-4">
      <View className="my-auto space-y-4">
        <Image
          source={require("@/assets/images/car.png")}
          className="mx-auto"
        />
        <Text className="text-center font-bold text-3xl ">
          Get to your destination quickly
        </Text>
        <Text className="text-center ">
          Request a ride get picked up by a nearby community driver
        </Text>
        <TouchableOpacity
          className="bg-primary rounded-lg p-4"
          //@ts-expect-error assignment of string to never
          onPress={() => navigate("Auth", { screen: "Login" })}
        >
          <Text className="text-center text-white">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-primary rounded-lg p-4"
          //@ts-expect-error assignment of string to never
          onPress={() => navigate("Auth", { screen: "Register" })}
        >
          <Text className="text-center text-white">Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default index;

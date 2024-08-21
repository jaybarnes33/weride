import { View, Text, Image, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import RideLocations from "@/components/Main/RideLocations";
import Banner from "@/components/Main/Banner";
import Header from "@/components/Layout/Header";
import RideHistory from "@/components/Main/RideHistory";

const Page = () => {
  return (
    <SafeAreaView className="flex-1 space-y-4  bg-neutral-50">
      <View className="space-y-4">
        <Header />
        <RideLocations />

        <Banner />
        <RideHistory />
      </View>
    </SafeAreaView>
  );
};

export default Page;

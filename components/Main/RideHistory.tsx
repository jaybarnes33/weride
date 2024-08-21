import { View, Text } from "react-native";
import React from "react";

const RideHistory = () => {
  return (
    <View className="px-4">
      <Text className="text-neutral-800 text-xl font-bold tracking-wide">
        Ride History
      </Text>
      <View className="my-2">
        <Text className="text-red-500 tracking-wide text-base bg-red-50 p-2">
          No rides yet
        </Text>
      </View>
    </View>
  );
};

export default RideHistory;

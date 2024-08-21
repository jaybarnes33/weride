import { View, Text } from "react-native";
import React from "react";

const Activity = () => {
  return (
    <View className="px-4">
      <Text className="font-bold text-xl">Activity</Text>
      <View className="bg-orangeFade mt-2 items-center p-3">
        <Text className="text-red-500">No recent activity</Text>
      </View>
    </View>
  );
};

export default Activity;

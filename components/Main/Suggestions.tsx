import { View, Text, Image } from "react-native";
import React from "react";

const Suggestions = () => {
  const data = [
    { name: "Ride", image: require("@/assets/images/ride.png") },
    { name: "Package", image: require("@/assets/images/package.png") },
    { name: "Reserve", image: require("@/assets/images/reserve.png") },
  ];
  return (
    <View className="bg-white">
      <Text className="font-bold text-xl p-3">Suggestions</Text>
      <View className="flex-row space-x-4">
        {data.map((item, index) => (
          <View key={index} className="flex-1 bg-white p-4 rounded-lg">
            <View className="bg-neutral-100 rounded-lg p-3">
              <Image source={item.image} className="mx-auto" />
            </View>
            <Text className="text-center  mt-2">{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Suggestions;

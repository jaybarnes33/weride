import { View, Text, Image } from "react-native";
import React from "react";

const Cars = () => {
  const data = [
    { name: "Taxi", image: "🚕" },
    { name: "Car", image: "🚘" },
  ];
  return (
    <View className="px-4">
      <Text className="text-xl font-sans font-semibold">Select A Car</Text>
      <View className="flex-row space-x-5 mt-2">
        {data.map((item, index) => (
          <View
            className="items-center space-y-1 bg-orangeFade  w-24 h-24 justify-center rounded-3xl"
            key={index}
          >
            <View>
              <Text className="text-5xl">{item.image}</Text>
            </View>
            <Text>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Cars;

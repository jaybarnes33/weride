import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const Banner = () => {
  return (
    <View className="bg-primary relative flex-row my-3 mt-7  p-3 py-6">
      <View className=" space-y-3">
        <Text className="text-xl w-3/4  font-bold text-white">
          Make your life much easier
        </Text>
        <Text className="text-white w-3/4">
          Order now & get 30% off on your first ride
        </Text>
        <TouchableOpacity className="bg-white w-2/5 px-2 py-1 mt-3 rounded-lg">
          <Text className="text-sm py-1 text-center font-semibold text-primary ">
            Order Now
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        className=" absolute right-0 -top-12  object-contain"
        source={require("@/assets/images/man.png")}
      />
      <Image
        className="absolute top-0 right-0  w-full h-full object-contain"
        source={require("@/assets/images/mask.png")}
      />
    </View>
  );
};

export default Banner;

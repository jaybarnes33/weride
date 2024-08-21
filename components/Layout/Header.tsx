import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { BellIcon } from "react-native-heroicons/outline";
import Colors from "@/constants/Colors";
import useUser from "@/hooks/useUser";
import { getImageUrl } from "@/utils";

const Header = () => {
  const { user } = useUser();
  return (
    <View className="px-4 flex-row justify-between">
      <View className="flex-row items-center space-x-2">
        <Image
          source={{ uri: getImageUrl(user?.avatar as string) }}
          className="h-9 w-9 rounded-full"
        />
        <View>
          <Text className="text-gray-400 text-xs">Good day</Text>
          <Text className="text-base font-semibold -mt-1">{user?.name}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <BellIcon
          className="h-6 w-6 text-gray-500"
          color={Colors.light.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

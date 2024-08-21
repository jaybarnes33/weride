import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { ReactNode } from "react";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { router } from "expo-router";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { HomeModernIcon } from "react-native-heroicons/outline";
import { HomeModernIcon as HomeSolid } from "react-native-heroicons/solid";
import { Home2, Profile, Activity, People } from "iconsax-react-native/";
import Colors from "@/constants/Colors";
const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const icons: Record<string, [ReactNode, ReactNode]> = {
    index: [
      <Home2 size={22} color="gray" />,
      <Home2 size={22} color={"white"} variant="Bold" />,
    ],
    referrals: [
      <People size={22} color="gray" />,
      <People size={22} color={"white"} variant="Bold" />,
    ],
    account: [
      <Profile size={22} color="gray" />,
      <Profile size={22} color={"white"} variant="Bold" />,
    ],
    activity: [
      <Activity size={22} color="gray" />,
      <Activity variant="Bold" color={"white"} />,
    ],
  };

  return (
    <View className="bg-white   shadow py-2 px-4 fixed">
      <View className="flex-row h-16 items-center">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: "center" }}
            >
              {!isFocused ? (
                icons[route.name]?.at(0)
              ) : (
                <View className="relative flex-row items-center space-x-2 p-1 px-2 bg-primary py-2 rounded  scale-110">
                  {icons[route.name]?.at(1)}
                  <Text className="capitalize text-xs text-orange-50">
                    {route.name.replace("index", "home")}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;

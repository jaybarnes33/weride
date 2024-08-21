import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Account from "@/components/Main/Account";

const account = () => {
  return (
    <SafeAreaView>
      <Account />
    </SafeAreaView>
  );
};

export default account;

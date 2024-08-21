import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import GooglePlacesInput from "../PlacesInput";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocation } from "@/context/Location";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { useNavigation } from "expo-router";

const RideLocations = () => {
  const [pickup, setPickup] = React.useState<GooglePlaceDetail>();
  const [dropoff, setDropoff] = React.useState<GooglePlaceDetail>();
  const { location } = useLocation();
  const { navigate } = useNavigation();
  const geocode = async () => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.EXPO_PUBLIC_MAPS_KEY}`
      );
      const data = await res.json();

      setPickup(data.results[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    geocode();
  }, [location]);

  return (
    <View className="grid my-3 px-4 border border-gray-200 bg-neutral-100 mb-5 py-4">
      <View>
        <Text className="text-primary text-base">
          Where do you want to go today?{" "}
        </Text>
        <View className="flex-row space-x-2 mt-4">
          <Image source={require("@/assets/images/locations-side.png")} />
          <View className="flex-1 justify-between">
            <GooglePlacesInput
              value={pickup?.formatted_address as string}
              label="Pickup"
              onSelect={(data) => setPickup(data.details)}
              left={<Feather name="search" />}
            />
            <GooglePlacesInput
              label="Destination"
              value={dropoff?.formatted_address as string}
              isEdit={true}
              onSelect={(data) => {
                setDropoff(data.details);
                navigate(
                  //@ts-ignore
                  "ride",
                  { pickup: pickup, dropoff: data.details }
                );
              }}
              left={<Feather name="search" />}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default RideLocations;

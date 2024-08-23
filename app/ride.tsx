import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useLocation } from "@/context/Location";

import MapView, { Marker, Polyline } from "react-native-maps";

import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, MapPinIcon } from "react-native-heroicons/outline";
import Colors from "@/constants/Colors";

import { RideRequest } from "@/types/ride";

const Ride = () => {
  const { location, setLocation } = useLocation();
  const [start, setStart] = useState(false);

  const { back } = useRouter();
  const { details } = useRoute().params as { details: RideRequest };

  const { dropoffLocation, pickupLocation } = details;

  const [directions, setDirections] = useState([]);

  useEffect(() => {
    if (location && dropoffLocation) {
      const origin = `${location.longitude},${location.latitude}`;
      const destination = start
        ? `${dropoffLocation.longitude},${dropoffLocation.latitude}`
        : `${pickupLocation.longitude},${pickupLocation.latitude}`;
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?geometries=geojson&access_token=${process.env.EXPO_PUBLIC_MAPBOX}&steps=true`
      )
        .then(async (response) => {
          const data = await response.json();
          return data;
        })
        .then((data) => {
          const route = data.routes[0].geometry.coordinates;
          setDirections(
            route.map((coord: [number, number]) => ({
              latitude: coord[1],
              longitude: coord[0],
            }))
          );
        })
        .catch((e) => console.log(e));
    }
  }, [dropoffLocation, pickupLocation]);

  return (
    <View className="relative flex-1">
      <TouchableOpacity className="absolute top-10 z-50 mx-5" onPress={back}>
        <ArrowLeftIcon color={Colors.light.primary} />
      </TouchableOpacity>
      <MapView
        className="h-[85vh]"
        camera={{
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          pitch: 0.3,
          heading: 0,
          altitude: 1000,
          zoom: 20,
        }}
      >
        {location && (
          <Marker coordinate={location}>
            <TouchableOpacity className="h-10 w-10 bg-white items-center justify-center shadow rounded-full">
              <MapPinIcon color={Colors.dark.primary} />
            </TouchableOpacity>
          </Marker>
        )}
        {directions.length > 0 && (
          <Polyline
            strokeWidth={8}
            coordinates={directions}
            fillColor={Colors.light.primary}
            strokeColor={Colors.light.primary}
          />
        )}
        {pickupLocation && (
          <Marker
            coordinate={{
              latitude: pickupLocation.latitude,
              longitude: pickupLocation.longitude,
            }}
          >
            <TouchableOpacity className="h-10 w-10 bg-primary items-center justify-center shadow rounded-full">
              <MapPinIcon color={"white"} />
            </TouchableOpacity>
          </Marker>
        )}
        {start && dropoffLocation && (
          <Marker
            coordinate={{
              latitude: dropoffLocation.latitude,
              longitude: dropoffLocation.longitude,
            }}
          >
            <TouchableOpacity className="h-10 w-10 bg-primary items-center justify-center shadow rounded-full">
              <MapPinIcon color={"white"} />
            </TouchableOpacity>
          </Marker>
        )}
      </MapView>
      <View className=" w-full h-[15vh] p-3 bg-white space-y-2">
        <Text className="text-xl font-bold">Ride Details</Text>
        <View className="space-x-3  ">
          <Text>
            Waiting for {details.driver.name} to pick you up at{" "}
            {details.pickupLocation.placeName}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Ride;

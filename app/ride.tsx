import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useLocation } from "@/context/Location";

import MapView, { Marker, Polyline } from "react-native-maps";

import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
} from "react-native-heroicons/outline";
import Colors from "@/constants/Colors";

import { RideRequest } from "@/types/ride";
import { useWebSocket } from "@/socket/SocketContext";

const Ride = () => {
  const { location, setLocation } = useLocation();
  const [start, setStart] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [complete, setComplete] = useState(false);
  const { back } = useRouter();
  const { details } = useRoute().params as { details: RideRequest };

  const { dropoffLocation, pickupLocation } = details;

  const [directions, setDirections] = useState([]);
  const { webSocketManager } = useWebSocket();
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

  useEffect(() => {
    webSocketManager.getSocket()?.on("driver-arrived", (data) => {
      console.log("Driver arrived", data);
      setArrived(true);
    });
    webSocketManager.getSocket()?.on("ride-started", (data) => {
      console.log("Ride started", data);
      setArrived(false);
      setStart(true);
    });
    webSocketManager.getSocket()?.on("ride-completed", (data) => {
      console.log("Ride completed", data);
      setStart(false);
      setComplete(true);
    });
  }, [webSocketManager]);
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
        <TouchableOpacity className="absolute right-5 bg-orangeFade w-8 h-8 items-center justify-center rounded-full">
          <PhoneIcon color={Colors.dark.primary} />
        </TouchableOpacity>
        <View className="space-x-3  ">
          {!arrived && !start && !complete && (
            <Text>
              {details.driver.name} is on the way, please wait for them to
              arrive{" "}
            </Text>
          )}
          {arrived && (
            <Text>
              Your driver has arrived, please proceed to the pickup location
            </Text>
          )}
          {complete && (
            <View>
              <Text>
                You have arrived at your destination, thanks for riding with us.
                You will be charged GH₵{details.price.toFixed(2)}
              </Text>
            </View>
          )}
          {start && !complete && (
            <Text>Trip started, please buckle up and enjoy the ride</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Ride;

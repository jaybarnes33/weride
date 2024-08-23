import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  TextInput,
} from "react-native";

import { useLocation } from "@/context/Location";

import MapView, { LatLng, Marker, Polyline } from "react-native-maps";

import { useRoute } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  UsersIcon,
} from "react-native-heroicons/outline";

import Colors from "@/constants/Colors";
import CountdownTimer from "@/components/Main/Countdown";
import axios from "axios";
import { createURL } from "@/utils/api";
import useUser from "@/hooks/useUser";
import { RideRequest } from "@/types/ride";
import { useWebSocket } from "@/socket/SocketContext";

const Ride = () => {
  const { location, setLocation } = useLocation();
  const { user } = useUser();
  const { navigate } = useNavigation();
  const types = [
    {
      name: "Shared",
      wait: "10 - 15mins",
      image: "🚕",
      price: 5,
    },
    {
      name: "Comfort",
      wait: "5 - 10mins",
      price: 15,
      image: "🚗",
    },
    {
      name: "Express",
      wait: "5 - 10mins",
      price: 20,
      image: "🚙",
    },
  ];
  const { back } = useRouter();

  const [request, setRequest] = useState<RideRequest>();
  const [directions, setDirections] = useState([]);
  const [rideType, setRideType] = useState<(typeof types)[0]>();
  const [showShared, setShowShared] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requesting, setRequesting] = useState(false);
  const { pickup, dropoff } = useRoute().params as {
    pickup: GooglePlaceDetail;
    dropoff: GooglePlaceDetail;
  };

  const handleRideType = async (type: (typeof types)[0]) => {
    if (type.name === "Shared") {
      showShared ? setShowShared(false) : setShowShared(true);
      if (!showShared) {
        return;
      }
    } else {
      setShowShared(false);
      setRideType(type);
    }
    await requestRide(type.price);
    setTimeout(() => {
      setRideType(undefined);
    }, 300000);
  };

  const cancelRide = async () => {
    try {
      setRequesting(true);
      await axios.put(createURL(`/api/requests/${request?._id}`), {
        status: "cancelled",
      });
      setRideType(undefined);
      setSuccess("Ride cancelled successfully");
    } catch (error: any) {
      setError(error.response.data?.message);
    } finally {
      setRequesting(false);
    }
  };

  const requestRide = async (price: number) => {
    try {
      setRequesting(true);
      const { data } = await axios.post(createURL("/api/requests/"), {
        pickupLocation: {
          latitude: pickup.geometry.location.lat,
          longitude: pickup.geometry.location.lng,
          placeName: pickup.name ?? pickup.formatted_address,
        },
        passenger: user?._id,
        dropoffLocation: {
          latitude: dropoff.geometry.location.lat,
          longitude: dropoff.geometry.location.lng,
          placeName: dropoff.name ?? dropoff.formatted_address,
        },

        price,
      });
      setRequest(data);
    } catch (error: any) {
      setRideType(undefined);
      setError(error.response.data?.message);
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    if (location && dropoff) {
      const origin = `${location.longitude},${location.latitude}`;
      const destination = `${dropoff.geometry.location.lng},${dropoff.geometry.location.lat}`;
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
  }, [dropoff]);

  const generateRandomPosition = (baseLocation: LatLng) => {
    const radius = 0.01; // Adjust the radius as needed
    const randomAngle = Math.random() * 2 * Math.PI;
    const randomRadius = Math.random() * radius;
    const offsetX = randomRadius * Math.cos(randomAngle);
    const offsetY = randomRadius * Math.sin(randomAngle);
    return {
      latitude: baseLocation.latitude + offsetY,
      longitude: baseLocation.longitude + offsetX,
    };
  };

  const [carPositions, setCarPositions] = useState(
    Array.from({ length: 5 }, () =>
      generateRandomPosition({
        latitude: pickup.geometry.location.lat,
        longitude: pickup.geometry.location.lng,
      })
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCarPositions((prevPositions) =>
        prevPositions.map((pos) => generateRandomPosition(location))
      );
    }, 3000); // Update positions every 3 seconds

    return () => clearInterval(interval);
  }, [location]);

  const { webSocketManager } = useWebSocket();

  webSocketManager?.getSocket()?.on("driver-assigned", (data) => {
    //@ts-expect-error assignment of string to never
    navigate("ride", { details: data });
  });
  return (
    <View className="relative flex-1">
      <TouchableOpacity className="absolute top-10 z-50 mx-5" onPress={back}>
        <ArrowLeftIcon color={Colors.light.primary} />
      </TouchableOpacity>
      <MapView
        style={{ flex: 1 }}
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
        {carPositions.map((pos, index) => (
          <Marker key={index} coordinate={pos} title={`Car ${index + 1}`}>
            <Text style={{ fontSize: 24 }}>
              {index % 2 === 0 ? "🚕" : "🚙"}
            </Text>
          </Marker>
        ))}
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
        {dropoff && (
          <Marker
            coordinate={{
              latitude: dropoff.geometry.location.lat,
              longitude: dropoff.geometry.location.lng,
            }}
          >
            <TouchableOpacity className="h-10 w-10 bg-primary items-center justify-center shadow rounded-full">
              <MapPinIcon color={"white"} />
            </TouchableOpacity>
          </Marker>
        )}
      </MapView>
      {error && (
        <View className="absolute top-40 p-4 w-screen">
          <View className="bg-white items-center py-3 px-2">
            <ExclamationCircleIcon size={40} color="red" />
            <Text className="text-xl">{error}</Text>
            <TouchableOpacity
              className="mt-2 bg-red-500 py-2 items-center w-full"
              onPress={() => setError("")}
            >
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {success && (
        <View className="absolute top-40 p-4 w-screen">
          <View className="bg-white items-center py-3 px-2">
            <CheckCircleIcon size={40} color="green" />
            <Text className="text-xl text-neutral-500">{success}</Text>
            <TouchableOpacity
              className="mt-2 bg-green-500 py-2 items-center w-full"
              onPress={() => setSuccess("")}
            >
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View className="absolute bottom-0 w-full space-y-4">
        <View className="p-3 mx-4 bg-white space-x-3 flex-row items-center">
          <TouchableOpacity className="h-9 w-9 bg-primary items-center justify-center shadow rounded-full">
            <MapPinIcon color={"white"} />
          </TouchableOpacity>
          <Text className="text-xs">
            {pickup.name ?? pickup.formatted_address} -{" "}
            {dropoff.name ?? dropoff.formatted_address}
          </Text>
        </View>
        {!rideType?.name && !showShared && !error?.length ? (
          <View className="bg-white mx-4  z-50 p-5   rounded-xl">
            <Text className="font-bold text-xl">Select Ride Type</Text>

            {types.map((type, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRideType(type)}
              >
                <View className="flex-row  space-x-4 justify-between items-center mt-3">
                  <Text className="text-4xl">{type.image}</Text>
                  <View>
                    <Text className="font-bold">{type.name}</Text>
                    <Text className="text-gray-400">{type.wait} wait</Text>
                  </View>
                  <Text className="font-bold text-base">
                    GH₵{type.price.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          !showShared &&
          !error?.length && (
            <Animated.View className=" mx-4  p-4 bottom-60 bg-white">
              <View className="flex-row items-center justify-between space-x-2">
                <Text className="text-base text-primary">
                  Waiting for a driver
                </Text>

                <CountdownTimer />
              </View>
              <Text className="text-neutral-500">
                Please wait as we connect you to a driver
              </Text>
              <TouchableOpacity
                className="bg-primary p-3 rounded-lg mt-3"
                onPress={() => cancelRide()}
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          )
        )}

        {showShared && (
          <View className="bg-white mx-4 p-5 rounded-xl">
            <Text className="font-bold text-xl">
              How many people are riding?
            </Text>
            <View className="flex-row items-center mt-3">
              <UsersIcon color={Colors.dark.background} />
              <TextInput
                defaultValue="1"
                className="bg-orangeFade m-2 w-8  h-8 text-center"
              />
            </View>
            <TouchableOpacity
              className="bg-primary p-3 rounded-lg mt-3"
              onPress={() => handleRideType(types[0])}
            >
              <Text className="text-white text-center">Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Ride;

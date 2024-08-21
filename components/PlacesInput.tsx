import useGooglePlaces from "@/hooks/googlePlaces";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import clsx from "clsx";
import React, { ReactNode, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
const GooglePlacesInput = ({
  label,
  onSelect,
  left,
  value,
  isEdit = false,
}: {
  label?: string;
  onSelect: (data: {
    data: GooglePlaceData;
    details: GooglePlaceDetail;
  }) => void;
  left: ReactNode;
  value: string;
  isEdit?: boolean;
}) => {
  const [edit, setEdit] = useState(false);
  const { places, loading, searchQuery, setSearchQuery } = useGooglePlaces();

  useEffect(() => {
    setEdit(isEdit);
  }, [isEdit]);

  return (
    <>
      <View className="flex-row  h-10 items-center p-2 mb-2 ">
        <View className="mx-2 flex-1">
          {edit ? (
            <TextInput
              placeholder={label}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
              }}
            />
          ) : (
            <View className="space-y-2">
              <TouchableOpacity onPress={() => setEdit(true)}>
                <Text className="text-gray-400">{label}</Text>
                <View className="flex-row  space-x-2 items-center">
                  <Text>{value}</Text>

                  <FontAwesome name="pencil" size={10} color={"gray"} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            className={clsx([
              !searchQuery.length && !places.length && "hidden",
            ])}
            onPress={() => {
              setSearchQuery("");
            }}
          >
            <MaterialCommunityIcons name="close" size={20} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {places && places?.length ? (
          places.map((place) => (
            <TouchableOpacity
              key={place.data.place_id}
              className="flex-row gap-3 items-center py-3 border-gray-200 border-b "
              onPress={() => {
                onSelect(place);
                setSearchQuery("");
              }}
            >
              <MaterialCommunityIcons name="clock" size={20} />
              <View className="flex-1 space-y-1">
                <Text className="font-bold ">
                  {place.data.structured_formatting.main_text}
                </Text>
                <Text className="text-neutral-500">
                  {place.data.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text
            className={clsx([(!searchQuery.length || loading) && "hidden"])}
          >
            Place not found
          </Text>
        )}
      </View>
    </>
  );
};

export default GooglePlacesInput;

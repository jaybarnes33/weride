import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { removeTokens } from "@/utils";
import { useNavigation } from "expo-router";
import useUser from "@/hooks/useUser";
import { uploadFile } from "@/utils/uploadFile";
import { makeSecuredRequest } from "@/utils/makeSecuredRequest";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "iconsax-react-native";
import { CameraIcon } from "react-native-heroicons/outline";
import { Image } from "expo-image";
const Account = () => {
  const { navigate } = useNavigation();

  const { user } = useUser();
  const [form, setForm] = React.useState({
    name: user?.name,
    email: user?.email,
  });
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [loading, setLoading] = React.useState(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleLogout = async () => {
    await removeTokens();
    //@ts-expect-error assignment of string to never
    navigate("Auth", { screen: "Login" });
  };

  useEffect(() => {
    setForm({
      name: user?.name,
      email: user?.email,
    });
  }, [user]);

  const handleFormSubmit = async () => {
    try {
      setLoading(true);

      const { data: file, error } = await uploadFile(image!, user?._id);
      if (file || !image?.base64) {
        const { data } = await makeSecuredRequest(`/api/users/${user?._id}`, {
          method: "PUT",
          body: JSON.stringify({
            ...form,
            avatar: file?.fullPath ?? undefined,
          }),
        });
      }
      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="px-4 bg-white py-5">
      <Text className="text-xl font-bold">Account</Text>

      <TouchableOpacity
        className="items-center justify-center"
        onPress={pickImage}
      >
        {!image?.uri ? (
          <CameraIcon className="w-10 h-10" />
        ) : (
          <Image
            className="w-10 h-10 rounded-full"
            source={{ uri: image?.uri }}
          />
        )}
        <Text>Change Avatar</Text>
      </TouchableOpacity>

      <View className="mt-5">
        <Text className="font-semibold">Name</Text>
        <TextInput
          defaultValue={user?.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
          className="text-base"
          placeholder="John Doe"
        />
      </View>
      <View className="mt-5">
        <Text className="font-semibold">Email</Text>
        <TextInput
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
          className="text-base"
          placeholder="Email"
          defaultValue={user?.email}
        />
      </View>

      <TouchableOpacity
        onPress={handleFormSubmit}
        className="bg-primary rounded-lg p-4 mt-5 flex-row justify-center items-center"
      >
        <Text className="text-center text-white">Save</Text>
        {loading && <ActivityIndicator />}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text className="text-primary mt-5">Logout</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Account;

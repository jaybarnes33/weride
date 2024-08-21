import * as SecureStore from "expo-secure-store";

export const storeTokens = async (data: {
  accessToken: string;
  refreshToken: string;
}) => {
  try {
    await SecureStore.setItemAsync("accessTokenClient", data.accessToken);
    await SecureStore.setItemAsync("refreshTokenClient", data.refreshToken);
    console.log("Tokens stored successfully");
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

export const removeTokens = async () => {
  try {
    await SecureStore.deleteItemAsync("accessTokenClient");
    await SecureStore.deleteItemAsync("refreshTokenClient");
    console.log("Tokens removed successfully");
  } catch (error) {
    console.error("Error removing tokens:", error);
  }
};

export const getTokens = async () => {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      await SecureStore.getItemAsync("accessTokenClient"),
      await SecureStore.getItemAsync("refreshTokenClient"),
    ]);
    console.log([accessToken, refreshToken]);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error fetching tokens:", error);
  }
};

export const getImageUrl = (url: string) => {
  const path = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${url}`;
  console.log(path);
  return path;
};

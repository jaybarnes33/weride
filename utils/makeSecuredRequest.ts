import * as SecureStore from "expo-secure-store";
import { createURL, refreshAccessToken, verifyToken } from "./api";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

const getTokens = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> => {
  const accessToken = await SecureStore.getItemAsync("accessTokenClient");
  const refreshToken = await SecureStore.getItemAsync("refreshTokenClient");

  return { accessToken, refreshToken };
};

const setTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  await SecureStore.setItemAsync("accessTokenClient", accessToken);
  await SecureStore.setItemAsync("refreshTokenClient", refreshToken);
};

export const makeSecuredRequest = async (
  path: string,
  options: RequestOptions = {}
): Promise<any> => {
  const tokens = await getTokens();

  const url = createURL(path);

  // Verify the current access token
  const isAccessTokenValid = tokens.accessToken
    ? await verifyToken(tokens.accessToken)
    : false;

  let accessToken = tokens.accessToken;

  if (!isAccessTokenValid && tokens.refreshToken) {
    // If the access token is not valid, attempt to refresh it
    const newAccessToken = await refreshAccessToken(tokens.refreshToken);

    if (newAccessToken) {
      accessToken = newAccessToken;
      await setTokens(newAccessToken, tokens.refreshToken); // save new access token to secure storage
    } else {
      throw new Error("Unable to refresh access token");
    }
  }

  // Add the Authorization header to the request
  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    "x-auth-token": accessToken as string,
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("Request failed: " + response.status);
    }
  } catch (error) {
    console.log({ error });
    console.log(error);
  }
};

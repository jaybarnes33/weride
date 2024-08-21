export const API_URL =
  // process.env.NODE_ENV === "development"
  //   ? "http://172.20.10.2:8001/api/v1"
  "http://localhost:8000";

/** Creates a complete URL to the API
 * @param path The path to the API endpoint. For example, `/users/login`
 */
export function createURL(path: string) {
  return `${API_URL}${path}`;
}

export const verifyToken = async (token: string) => {
  const url = createURL("/api/auth/");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  });

  const json = await response.text();
  console.log(json);

  if (response.ok) {
    return true;
  }

  return false;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const url = createURL("/api/auth/refresh/");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (response.ok) {
    const json = await response.json();
    console.log(json);
    return json.accessToken;
  }

  return null;
};

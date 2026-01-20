import axios, { isAxiosError } from "axios";

// Expo only exposes env vars prefixed with EXPO_PUBLIC_ to the JS bundle.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  // This will show up in the Metro logs if the env var isn't wired correctly.
  console.warn(
    "EXPO_PUBLIC_API_BASE_URL is not set. Network requests from the app will fail."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const username = payload.email.split("@")[0];

  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  try {
    const response = await api.post("/auth/register", {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      username,
    });

    return response.data;
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message =
        (error.response?.data as any)?.message ??
        error.message ??
        "Registration failed";
      throw new Error(message);
    }

    throw new Error("Registration failed");
  }
}


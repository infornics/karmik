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

export async function loginUser(payload: { email: string; password: string }) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  try {
    const response = await api.post("/auth/login", {
      email: payload.email,
      password: payload.password,
    });

    return response.data;
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message =
        (error.response?.data as any)?.message ??
        error.message ??
        "Login failed";
      throw new Error(message);
    }

    throw new Error("Login failed");
  }
}

export async function addKarmaEntry(type: "good" | "bad", token: string) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  try {
    const response = await api.post(
      "/auth/karma",
      { type },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message =
        (error.response?.data as any)?.message ??
        error.message ??
        "Unable to add karma entry";
      throw new Error(message);
    }

    throw new Error("Unable to add karma entry");
  }
}

export async function fetchKarmaHistory(token: string) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  try {
    const response = await api.get("/auth/karma", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as {
      history: Array<{
        id: string;
        type: "good" | "bad";
        points: number;
        createdAt: string;
      }>;
      today: { good: number; bad: number; points: number };
    };
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message =
        (error.response?.data as any)?.message ??
        error.message ??
        "Unable to fetch karma history";
      throw new Error(message);
    }

    throw new Error("Unable to fetch karma history");
  }
}

export async function resetTodayKarma(token: string) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  try {
    const response = await api.delete("/auth/karma/today", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (isAxiosError(error)) {
      const message =
        (error.response?.data as any)?.message ??
        error.message ??
        "Unable to reset karma";
      throw new Error(message);
    }

    throw new Error("Unable to reset karma");
  }
}

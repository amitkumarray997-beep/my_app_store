import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Android emulator → host machine localhost
// For physical device: replace with your machine's LAN IP e.g. http://192.168.1.x:5000
const BASE_URL = "https://nonmonarchally-countrified-freeda.ngrok-free.dev";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from secure storage on every request
client.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { }
  return config;
});

// Global response error logging
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.error || err.message;
    console.warn("[API Error]", msg);
    return Promise.reject(err);
  }
);

export default client;

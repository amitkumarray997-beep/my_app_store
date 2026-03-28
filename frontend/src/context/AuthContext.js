import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import client from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // bootstrapping

  // On app start: restore session from secure storage
  useEffect(() => {
    const restore = async () => {
      try {
        const saved = await SecureStore.getItemAsync("jwt");
        const savedUser = await SecureStore.getItemAsync("user");
        if (saved && savedUser) {
          setToken(saved);
          setUser(JSON.parse(savedUser));
        }
      } catch { }
      setLoading(false);
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await client.post("/auth/login", { email, password });
    await SecureStore.setItemAsync("jwt", data.token);
    await SecureStore.setItemAsync("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(async (email, password, username) => {
    const { data } = await client.post("/auth/signup", { email, password, username });
    await SecureStore.setItemAsync("jwt", data.token);
    await SecureStore.setItemAsync("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync("jwt");
    await SecureStore.deleteItemAsync("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

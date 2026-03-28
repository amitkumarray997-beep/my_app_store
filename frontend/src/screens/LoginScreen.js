import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StatusBar
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) return setError("Please enter your email and password.");
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.error || "We couldn't log you in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>

          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={36} color="#D97757" />
            </View>
            <Text style={styles.title}>At <Text style={styles.titleAlt}>Peace</Text></Text>
            <Text style={styles.subtitle}>Welcome to an oasis of curated software.</Text>
          </View>

          <View style={styles.form}>
            {error && (
              <View style={styles.errorBox}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#D97706" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.disabledBtn]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Sign In</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupText}>New around here? <Text style={styles.signupHighlight}>Create an account</Text></Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAF9F6" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 32 },
  header: { alignItems: "center", marginBottom: 48 },
  logoCircle: {
    width: 80, height: 80,
    borderRadius: 40, backgroundColor: "#FFFFFF",
    justifyContent: "center", alignItems: "center", marginBottom: 24,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  title: { color: "#334155", fontSize: 40, fontWeight: "300", letterSpacing: -1 },
  titleAlt: { fontWeight: "800", color: "#D97757" },
  subtitle: { color: "#64748B", fontSize: 15, marginTop: 8, fontWeight: "400", textAlign: "center", lineHeight: 22 },
  form: { gap: 16 },
  errorBox: {
    backgroundColor: "#FEF3C7",
    padding: 16, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 12,
  },
  errorText: { color: "#B45309", fontSize: 14, fontWeight: "500", flex: 1 },
  inputContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16, paddingHorizontal: 16,
    borderWidth: 1, borderColor: "#F1F5F9",
    shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 8, elevation: 1
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: "#334155", paddingVertical: 18, fontSize: 16 },
  loginBtn: {
    marginTop: 16, borderRadius: 16, backgroundColor: "#D97757",
    paddingVertical: 20, alignItems: "center",
    shadowColor: "#D97757", shadowOpacity: 0.15, shadowRadius: 10, elevation: 4
  },
  loginText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },
  disabledBtn: { opacity: 0.7 },
  signupLink: { marginTop: 16, alignItems: "center" },
  signupText: { color: "#64748B", fontSize: 15 },
  signupHighlight: { color: "#D97757", fontWeight: "700" },
});

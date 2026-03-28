import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StatusBar
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    if (!form.email || !form.username || !form.password) 
      return setError("All fields are required to begin.");
      
    setLoading(true);
    setError(null);
    try {
      await signup(form.email, form.password, form.username);
    } catch (err) {
      setError(err?.response?.data?.error || "We couldn't register your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
             <Ionicons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.header}>
             <Text style={styles.title}>Join <Text style={styles.titleAlt}>Us</Text></Text>
             <Text style={styles.subtitle}>Start your journey towards curated software.</Text>
          </View>

          <View style={styles.form}>
            {error && (
               <View style={styles.errorBox}>
                 <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#D97706" />
                 <Text style={styles.errorText}>{error}</Text>
               </View>
            )}

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor="#94A3B8"
                value={form.username}
                onChangeText={t => setForm({...form, username: t})}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#94A3B8"
                value={form.email}
                onChangeText={t => setForm({...form, email: t})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="shield-lock-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Secure Password"
                placeholderTextColor="#94A3B8"
                value={form.password}
                onChangeText={t => setForm({...form, password: t})}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.loginBtn, loading && styles.disabledBtn]} 
              onPress={handleSignup} 
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Create Account</Text>}
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAF9F6" },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center", marginBottom: 24, marginTop: 24 },
  scroll: { flexGrow: 1, padding: 32 },
  header: { marginBottom: 40 },
  title: { color: "#334155", fontSize: 40, fontWeight: "300", letterSpacing: -1 },
  titleAlt: { fontWeight: "800", color: "#D97757" },
  subtitle: { color: "#64748B", fontSize: 16, marginTop: 8, fontWeight: "400", lineHeight: 24 },
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
    marginTop: 24, borderRadius: 16, backgroundColor: "#D97757", 
    paddingVertical: 20, alignItems: "center",
    shadowColor: "#D97757", shadowOpacity: 0.15, shadowRadius: 10, elevation: 4
  },
  loginText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },
  disabledBtn: { opacity: 0.7 },
});

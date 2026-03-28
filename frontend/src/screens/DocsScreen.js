import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function DocsScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
           <MaterialCommunityIcons name="book-open-page-variant" size={32} color="#D97757" />
           <Text style={styles.title}>Documentation</Text>
           <Text style={styles.subtitle}>Guide to using the At Peace Store platform.</Text>
        </View>

        <View style={styles.card}>
           <Text style={styles.sectionTitle}>For Users</Text>
           <Text style={styles.paragraph}>
             Welcome to a serene application marketplace. All apps are verified using our automated ML safety checks to ensure a secure and calming experience. Tap on any app to read more or download its package.
           </Text>
           <Text style={styles.paragraph}>
             Your session is persistently secured and locally encrypted.
           </Text>
        </View>

        <View style={styles.card}>
           <Text style={styles.sectionTitle}>For Developers</Text>
           <Text style={styles.paragraph}>
             To publish an app, navigate to the Dev Portal. Provide an accurate name, description, and the exact physical filename of the APK you plan to upload via the CLI.
           </Text>
           <View style={styles.codeBlock}>
             <Text style={styles.codeText}>POST /apps/publish</Text>
             <Text style={styles.codeText}>POST /upload (multipart/form-data)</Text>
           </View>
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAF9F6" },
  scroll: { padding: 32, paddingBottom: 60 },
  header: { marginBottom: 40, marginTop: 40 },
  title: { fontSize: 32, fontWeight: "700", color: "#334155", marginTop: 16, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: "#94A3B8", marginTop: 6, lineHeight: 24 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#475569", marginBottom: 12 },
  paragraph: { fontSize: 15, color: "#64748B", lineHeight: 24, marginBottom: 16 },
  codeBlock: { backgroundColor: "#F1F5F9", padding: 16, borderRadius: 12 },
  codeText: { fontFamily: "monospace", color: "#475569", fontSize: 13, marginBottom: 4 },
});

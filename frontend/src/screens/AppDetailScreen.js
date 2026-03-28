import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, Linking, 
  ScrollView, Dimensions, StatusBar
} from "react-native";
import { MaterialCommunityIcons, Ionicons, Entypo } from "@expo/vector-icons";
import client from "../api/client";

const { width } = Dimensions.get("window");

export default function AppDetailScreen({ route, navigation }) {
  const { app } = route.params;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Stream APK from backend
      const url = `${client.defaults.baseURL}/apps/download/${app.apk}`;
      await Linking.openURL(url);
    } catch {
      alert("Failed to initiate download. Check server/URL.");
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Minimal Hero Header */}
        <View style={styles.hero}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
             <Ionicons name="arrow-back" size={24} color="#334155" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.iconLarge}>
              <Text style={styles.iconText}>{app.name[0].toUpperCase()}</Text>
            </View>
            
            <View style={styles.titleArea}>
              <Text style={styles.name}>{app.name}</Text>
              <Text style={styles.dev}>{app.developer}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, styles.catBadge]}>
                   <Text style={styles.badgeText}>{app.category || "App"}</Text>
                </View>
                {app.safe && (
                  <View style={[styles.badge, styles.safeBadge]}>
                     <MaterialCommunityIcons name="shield-check" size={12} color="#166534" />
                     <Text style={[styles.badgeText, styles.safeText]}> Verified</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Action Board */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
             <Text style={styles.statVal}>{app.downloads}</Text>
             <Text style={styles.statLabel}>Downloads</Text>
          </View>
          <View style={styles.vLine} />
          <View style={styles.statItem}>
             <Text style={styles.statVal}>{app.version}</Text>
             <Text style={styles.statLabel}>Version</Text>
          </View>
        </View>

        {/* Visual Content */}
        <View style={styles.content}>
           <Text style={styles.sectionTitle}>Overview</Text>
           <Text style={styles.description}>{app.description}</Text>

           <View style={styles.featureGrid}>
             <View style={styles.feature}>
               <Ionicons name="leaf-outline" size={20} color="#D97757" />
               <Text style={styles.featureText}>Lightweight & Fast</Text>
             </View>
             <View style={styles.feature}>
               <Ionicons name="lock-closed-outline" size={20} color="#D97757" />
               <Text style={styles.featureText}>Platform Secured</Text>
             </View>
           </View>
        </View>

      </ScrollView>

      {/* Persistent Download Bar */}
      <View style={styles.actionArea}>
        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} disabled={downloading}>
           <View style={styles.flatBtn}>
              {downloading ? (
                 <Text style={styles.btnText}>Retrieving...</Text>
              ) : (
                <>
                  <MaterialCommunityIcons name="cloud-download-outline" size={22} color="#fff" style={{marginRight: 10}} />
                  <Text style={styles.btnText}>Get {app.name}</Text>
                </>
              )}
           </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAF9F6" },
  scroll: { paddingBottom: 120 },
  hero: { 
    paddingTop: 60, 
    paddingBottom: 30, 
    paddingHorizontal: 24, 
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 20, elevation: 5,
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center", marginBottom: 24 },
  headerInfo: { flexDirection: "row", alignItems: "center" },
  iconLarge: { 
    width: 90, height: 90, borderRadius: 28, 
    backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center", 
    marginRight: 20, borderWidth: 1, borderColor: "#E2E8F0"
  },
  iconText: { color: "#475569", fontSize: 40, fontWeight: "600" },
  titleArea: { flex: 1 },
  name: { color: "#334155", fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  dev: { color: "#64748B", fontSize: 15, marginTop: 4, fontWeight: "500" },
  badgeRow: { flexDirection: "row", marginTop: 12, gap: 10 },
  badge: { 
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, 
    backgroundColor: "#F1F5F9", flexDirection: "row", alignItems: "center" 
  },
  safeBadge: { backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#DCFCE7" },
  badgeText: { color: "#64748B", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  safeText: { color: "#166534" },
  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    backgroundColor: "#FFFFFF", 
    margin: 24, borderRadius: 20, padding: 20,
    shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 10, elevation: 1
  },
  statItem: { alignItems: "center" },
  statVal: { color: "#334155", fontSize: 20, fontWeight: "800" },
  statLabel: { color: "#94A3B8", fontSize: 12, marginTop: 4, fontWeight: "600", textTransform: "uppercase" },
  vLine: { width: 1, height: "100%", backgroundColor: "#F1F5F9" },
  content: { paddingHorizontal: 24 },
  sectionTitle: { color: "#94A3B8", fontSize: 13, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 },
  description: { color: "#475569", fontSize: 16, lineHeight: 28, marginBottom: 32, fontWeight: "400" },
  featureGrid: { marginBottom: 20, gap: 16 },
  feature: { 
    flexDirection: "row", alignItems: "center", gap: 14, 
    backgroundColor: "#FFFFFF", padding: 18, borderRadius: 16,
    shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 10, elevation: 1
  },
  featureText: { color: "#475569", fontSize: 15, fontWeight: "600" },
  actionArea: { 
    position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: 34,
    backgroundColor: "#FAF9F6",
  },
  downloadBtn: { borderRadius: 20, overflow: "hidden", shadowColor: "#D97757", shadowOpacity: 0.2, shadowRadius: 15, elevation: 5 },
  flatBtn: { backgroundColor: "#D97757", paddingVertical: 22, alignItems: "center", flexDirection: "row", justifyContent: "center", borderRadius: 20 },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700", letterSpacing: 0.5 },
});

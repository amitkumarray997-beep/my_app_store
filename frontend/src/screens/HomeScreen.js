import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  TextInput, TouchableOpacity, RefreshControl, StatusBar,
} from "react-native";
import { MaterialCommunityIcons, Ionicons, Entypo } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import AppCard from "../components/AppCard";
import client from "../api/client";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const cache = useRef(null);

  const fetchApps = useCallback(async (query = "", force = false) => {
    if (!force && cache.current && !query) {
      setApps(cache.current);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const params = query ? { search: query } : {};
      const { data } = await client.get("/apps", { params });
      setApps(data);
      if (!query) cache.current = data;
    } catch {
      setError("Failed to load apps. Is the backend running?");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  useEffect(() => {
    if (!search.trim()) { fetchApps(); return; }
    const timer = setTimeout(() => fetchApps(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search, fetchApps]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cache.current = null;
    fetchApps("", true);
  }, [fetchApps]);

  const renderItem = useCallback(
    ({ item }) => <AppCard item={item} onPress={(app) => navigation.navigate("AppDetail", { app })} />,
    [navigation]
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Calm Minimalist Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
             <Text style={styles.greeting}>Good morning,</Text>
             <Text style={styles.username}>{user?.username ?? "Explorer"}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
             <MaterialCommunityIcons name="logout" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.titleRow}>
          <Text style={styles.title}>Browse <Text style={styles.titleStore}>Apps</Text></Text>
        </View>

        {/* Refined Search Bar */}
        <View style={styles.searchContainer}>
           <Ionicons name="search" size={20} color="#94A3B8" />
           <TextInput
             style={styles.search}
             placeholder="Find something peaceful..."
             placeholderTextColor="#94A3B8"
             value={search}
             onChangeText={setSearch}
           />
           {search.length > 0 && (
             <TouchableOpacity onPress={() => setSearch("")}>
               <Entypo name="circle-with-cross" size={18} color="#CBD5E1" />
             </TouchableOpacity>
           )}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D97757" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="cloud-alert" size={50} color="#CBD5E1" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => { setLoading(true); fetchApps("", true); }} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={apps}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D97757" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
               <MaterialCommunityIcons name="magnify-close" size={50} color="#E2E8F0" />
               <Text style={styles.emptyText}>Nothing found.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAF9F6" },
  header: { 
    paddingTop: 60, 
    paddingBottom: 16, 
    paddingHorizontal: 24,
    backgroundColor: "#FAF9F6"
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  greeting: { color: "#94A3B8", fontSize: 13, fontWeight: "500", textTransform: "uppercase", letterSpacing: 1 },
  username: { color: "#334155", fontSize: 22, fontWeight: "700", marginTop: 2 },
  logoutBtn: { backgroundColor: "#F1F5F9", borderRadius: 20, padding: 12 },
  titleRow: { marginBottom: 20 },
  title: { color: "#334155", fontSize: 36, fontWeight: "300", letterSpacing: -1 },
  titleStore: { fontWeight: "700" },
  searchContainer: {
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "#FFFFFF", 
    borderRadius: 20, 
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1, borderColor: "#F1F5F9",
    shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 10, elevation: 2,
  },
  search: { flex: 1, color: "#334155", fontSize: 16, marginLeft: 10, fontWeight: "400" },
  list: { padding: 24, paddingBottom: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  errorText: { color: "#64748B", fontSize: 14, textAlign: "center", maxWidth: 280, marginTop: 8 },
  retryBtn: { backgroundColor: "#D97757", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  retryText: { color: "#fff", fontWeight: "600" },
  emptyContainer: { flex: 1, marginTop: 80, alignItems: "center", gap: 12 },
  emptyText: { color: "#94A3B8", fontSize: 16, fontWeight: "500" },
});

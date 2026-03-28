import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AppCard = memo(({ item, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(item)} activeOpacity={0.7}>
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconPlaceholder}>
          <Text style={styles.iconText}>{item.name?.[0]?.toUpperCase() ?? "?"}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.developer} numberOfLines={1}>{item.developer}</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}><Text style={styles.tagText}>{item.category || "General"}</Text></View>
            {item.safe && (
              <View style={[styles.tag, styles.safeTag]}>
                <MaterialCommunityIcons name="shield-check" size={10} color="#D97757" />
                <Text style={[styles.tagText, styles.safeText]}> Safe</Text>
              </View>
            )}
          </View>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
      </View>

      <View style={styles.footer}>
        <View style={styles.statLine}>
          <MaterialCommunityIcons name="download-outline" size={14} color="#94A3B8" />
          <Text style={styles.stat}>{item.downloads ?? 0}</Text>
        </View>
        <Text style={styles.version}>{item.version || "1.0.0"}</Text>
      </View>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  card: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center" },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  iconText: { color: "#475569", fontSize: 26, fontWeight: "500" },
  info: { flex: 1 },
  name: { color: "#334155", fontSize: 18, fontWeight: "700", letterSpacing: -0.2 },
  developer: { color: "#94A3B8", fontSize: 13, marginTop: 4, fontWeight: "500" },
  tagRow: { flexDirection: "row", marginTop: 8, gap: 8 },
  tag: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9"
  },
  safeTag: { backgroundColor: "#fff7ed", borderColor: "#ffedd5" },
  tagText: { color: "#64748B", fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  safeText: { color: "#c2410c" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statLine: { flexDirection: "row", alignItems: "center", gap: 6 },
  stat: { color: "#64748B", fontSize: 13, fontWeight: "500" },
  version: { color: "#94A3B8", fontSize: 12, fontWeight: "500" },
});

export default AppCard;

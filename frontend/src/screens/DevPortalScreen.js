import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, 
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function DevPortalScreen({ navigation }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", description: "", category: "Productivity", version: "1.0.0" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stepText, setStepText] = useState("");
  
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/vnd.android.package-archive", "*/*"], 
        copyToCacheDirectory: true
      });
      if (result.canceled) return;
      const picked = result.assets[0];
      if (!picked.name.endsWith('.apk')) {
        Alert.alert("Invalid File", "Please select a valid .apk file.");
        return;
      }
      setFile(picked);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not select file.");
    }
  };

  const clearForm = () => {
    setForm({ name: "", description: "", category: "Productivity", version: "1.0.0" });
    setFile(null);
  };

  const handlePublish = async () => {
    if (!form.name || !form.description || !file) {
      return Alert.alert("Missing Requirements", "Please provide a name, description, and select an APK file.");
    }
    setLoading(true);
    try {
      // Step 1: Upload the APK
      setStepText("Uploading package...");
      const formData = new FormData();
      formData.append("apk", {
        uri: Platform.OS === "android" ? file.uri : file.uri.replace("file://", ""),
        name: file.name,
        type: file.mimeType || "application/vnd.android.package-archive"
      });

      const uploadRes = await client.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const generatedFilename = uploadRes.data.filename;

      // Step 2: Publish App Record
      setStepText("Scanning & Publishing...");
      await client.post("/apps/publish", { 
        ...form, 
        apk: generatedFilename 
      });

      Alert.alert("Success", "Your application has been published successfully.");
      clearForm();
      navigation.navigate("Browse");
    } catch (err) {
      Alert.alert("Publish Failed", err?.response?.data?.error || err.message || "An error occurred.");
    } finally {
      setLoading(false);
      setStepText("");
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="cube-send" size={32} color="#D97757" />
            </View>
            <Text style={styles.title}>Developer Space</Text>
            <Text style={styles.subtitle}>Upload and publish your package.</Text>
          </View>

          <View style={styles.formCard}>
             <Text style={styles.label}>Application Name</Text>
             <TextInput 
               style={styles.input} 
               placeholder="e.g. Zen Meditation" 
               placeholderTextColor="#a1a1aa" 
               value={form.name} onChangeText={t => setForm({...form, name: t})} 
             />

             <Text style={styles.label}>Description</Text>
             <TextInput 
               style={[styles.input, styles.textArea]} 
               placeholder="Describe your app capabilities..." 
               placeholderTextColor="#a1a1aa"
               multiline 
               numberOfLines={4}
               value={form.description} onChangeText={t => setForm({...form, description: t})} 
             />

             <Text style={styles.label}>App Package (.APK)</Text>
             <TouchableOpacity style={styles.filePicker} onPress={handlePickFile} activeOpacity={0.7}>
               {file ? (
                  <View style={styles.fileSelected}>
                    <MaterialCommunityIcons name="android" size={24} color="#D97757" />
                    <View style={styles.fileInfo}>
                       <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                       <Text style={styles.fileSize}>{(file.size / (1024*1024)).toFixed(2)} MB</Text>
                    </View>
                    <TouchableOpacity onPress={() => setFile(null)}>
                       <MaterialCommunityIcons name="close-circle" size={20} color="#a1a1aa" />
                    </TouchableOpacity>
                  </View>
               ) : (
                  <View style={styles.fileEmpty}>
                    <MaterialCommunityIcons name="cloud-upload-outline" size={32} color="#D97757" />
                    <Text style={styles.filePrompt}>Tap to select an APK file</Text>
                  </View>
               )}
             </TouchableOpacity>

             <View style={styles.row}>
               <View style={styles.flexHalf}>
                 <Text style={styles.label}>Category</Text>
                 <TextInput 
                   style={styles.input} 
                   value={form.category} onChangeText={t => setForm({...form, category: t})} 
                 />
               </View>
               <View style={styles.flexHalf}>
                 <Text style={styles.label}>Version</Text>
                 <TextInput 
                   style={styles.input} 
                   value={form.version} onChangeText={t => setForm({...form, version: t})} 
                 />
               </View>
             </View>

             <TouchableOpacity style={[styles.submitBtn, loading && styles.disabledBtn]} onPress={handlePublish} disabled={loading}>
                {loading ? (
                   <View style={styles.loadingRow}>
                      <ActivityIndicator color="#FAF9F6" />
                      <Text style={styles.submitText}>{stepText}</Text>
                   </View>
                ) : (
                   <Text style={styles.submitText}>Publish Application</Text>
                )}
             </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FAF9F6" },
  scroll: { padding: 24, paddingBottom: 60, marginTop: 40 },
  header: { marginBottom: 32 },
  iconCircle: { width: 64, height: 64, borderRadius: 20, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  title: { fontSize: 32, fontWeight: "600", color: "#27272a", letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: "#71717a", marginTop: 4 },
  formCard: { backgroundColor: "#FFFFFF", padding: 24, borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 15, elevation: 2 },
  label: { fontSize: 13, fontWeight: "600", color: "#52525b", marginBottom: 8, marginTop: 16, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { backgroundColor: "#fafafa", borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, padding: 16, fontSize: 16, color: "#3f3f46" },
  textArea: { height: 100, textAlignVertical: "top" },
  filePicker: { backgroundColor: "#fdfbf9", borderWidth: 1, borderColor: "#e4e4e7", borderStyle: "dashed", borderRadius: 12, padding: 20 },
  fileEmpty: { alignItems: "center", gap: 10 },
  filePrompt: { color: "#71717a", fontWeight: "500" },
  fileSelected: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e4e4e7" },
  fileInfo: { flex: 1, marginLeft: 12 },
  fileName: { color: "#27272a", fontWeight: "600", fontSize: 14 },
  fileSize: { color: "#71717a", fontSize: 12, marginTop: 2 },
  row: { flexDirection: "row", gap: 16 },
  flexHalf: { flex: 1 },
  submitBtn: { backgroundColor: "#D97757", borderRadius: 16, padding: 18, alignItems: "center", marginTop: 32 },
  disabledBtn: { opacity: 0.8 },
  submitText: { color: "#FAF9F6", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 12 }
});

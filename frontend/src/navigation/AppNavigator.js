import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import AppDetailScreen from "../screens/AppDetailScreen";
import DocsScreen from "../screens/DocsScreen";
import DevPortalScreen from "../screens/DevPortalScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabOptions = ({ route }) => ({
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    height: 90,
    paddingTop: 10,
  },
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    if (route.name === "Browse") iconName = focused ? "compass" : "compass-outline";
    else if (route.name === "Docs") iconName = focused ? "book-open-page-variant" : "book-open-page-variant-outline";
    else if (route.name === "Portal") iconName = focused ? "code-tags" : "code-tags";
    
    return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
  },
  tabBarActiveTintColor: "#D97757",
  tabBarInactiveTintColor: "#CBD5E1",
});

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen name="Browse" component={HomeScreen} />
      <Tab.Screen name="Docs" component={DocsScreen} />
      <Tab.Screen name="Portal" component={DevPortalScreen} />
    </Tab.Navigator>
  );
}

const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: "#FAF9F6" },
  animationEnabled: true,
};

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#D97757" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="AppDetail" component={AppDetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: "#FAF9F6", justifyContent: "center", alignItems: "center" },
});

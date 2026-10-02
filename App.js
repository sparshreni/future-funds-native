import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { View, Text, StyleSheet } from 'react-native';

// Icons
import { Home, LayoutDashboard, ScrollText, TrendingUp, CreditCard, Library, User } from 'lucide-react-native';


// Context
import { UserProvider } from './src/context/UserContext';
import { ToastProvider } from './src/context/ToastContext';

// Theme
import { COLORS } from './src/constants/theme';

// Components
import AIAgentBubble from './src/components/AIAgentBubble';

// Screens (Placeholders for now)

import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import QuizScreen from './src/screens/QuizScreen';
import InvestingScreen from './src/screens/InvestingScreen';
import CreditScreen from './src/screens/CreditScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Placeholder screens if actual ones not built yet
const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgDark }}>
    <Text style={{ color: COLORS.textPrimary }}>{name} - Coming Soon</Text>
  </View>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.primaryLight,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
          tabBarLabel: 'Dashboard'
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ScrollText color={color} size={size} />,
          tabBarLabel: 'Learn'
        }}
      />

      <Tab.Screen
        name="Investing"
        component={InvestingScreen}
        options={{
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
          tabBarLabel: 'Invest'
        }}
      />
      <Tab.Screen
        name="Credit"
        component={CreditScreen}
        options={{
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
          tabBarLabel: 'Credit'
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
          tabBarLabel: 'Read'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const appTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: COLORS.bgDark,
      primary: COLORS.primary,
      card: COLORS.bgMedium,
      text: COLORS.textPrimary,
      border: COLORS.border,
      notification: COLORS.primaryLight,
    },
  };

  return (
    <SafeAreaProvider>
      <UserProvider>
        <ToastProvider>
          <NavigationContainer theme={appTheme}>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
          <AIAgentBubble />
        </ToastProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

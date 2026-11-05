import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppProvider, useApp } from './src/state/AppState';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen, LearnScreen, SavedScreen, ProgressScreen, ProfileScreen } from './src/screens/MainScreens';
import { LessonScreen, QuizScreen } from './src/screens/LessonScreens';
import type { RootStackParamList, TabParamList } from './src/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const { colors } = useApp();
  const iconNames: Record<keyof TabParamList, string> = {
    Home: 'home', Learn: 'library', Saved: 'bookmark', Progress: 'stats-chart', Profile: 'person',
  };
  return <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { backgroundColor: colors.tab, borderTopColor: colors.border, height: 66, paddingTop: 6, paddingBottom: 7 },
    tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600' },
    tabBarIcon: ({ focused, color, size }) => <Ionicons name={(iconNames[route.name] + (focused ? '' : '-outline')) as any} size={size} color={color} />,
  })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Learn" component={LearnScreen} />
    <Tab.Screen name="Saved" component={SavedScreen} />
    <Tab.Screen name="Progress" component={ProgressScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>;
}
function Root() {
  const { colors, isDark, loading, session } = useApp();
  if (loading) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!session) return <AuthScreen />;
  const base = isDark ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, primary: colors.primary, background: colors.bg, card: colors.card, text: colors.text, border: colors.border } };
  return <NavigationContainer theme={theme}>
    <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
    </Stack.Navigator>
  </NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider><AppProvider><Root /></AppProvider></SafeAreaProvider>;
}

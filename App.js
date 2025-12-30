import React, { useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// --- CONTEXTOS ---
import { AuthProvider, AuthContext } from "./components/Contexts/AuthContext";
import { ThemeProvider } from "./components/Contexts/ThemeContext";
import { SettingsProvider } from "./components/Contexts/SettingsContext"; 
import { FavoritesProvider } from "./components/Contexts/FavoritesContext";
import { EmotionsProvider } from "./components/Contexts/EmotionsContext"; 
import { DailyProvider } from "./components/Contexts/DailyContext"; 
import { RemindersProvider } from "./components/Contexts/RemindersContext";

// --- PANTALLAS DE LA APP ---
import CalendarEmotions from "./components/Screens/CalendarEmotions";
import Settings from "./components/Screens/Settings";
import Start from "./components/Screens/Start";
import DailyEntries from "./components/Screens/DailyPages/DailyEntries";
import DailyPage from "./components/Screens/DailyPages/DailyPage";
import Phrases from "./components/Screens/Phrases/Phrases";
import PhrasesFavorite from "./components/Screens/Phrases/PhrasesFavorite";
import RemindersForm from "./components/Screens/Reminders/RemindersForm";
import RemindersList from "./components/Screens/Reminders/RemindersList";

// --- PANTALLAS DE AUTENTICACIÓN ---
import WelcomeScreen from './components/Screens/Auth/WelcomeScreen';
import LoginOptionsScreen from './components/Screens/Auth/LoginOptionsScreen';
// --- LÍNEA CORREGIDA ---
import SignUpScreen from './components/Screens/Auth/SignUpScreen';
import EmailLoginScreen from './components/Screens/Auth/EmailLoginScreen';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, // Deprecated but widely used fallback
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true, // New API
      shouldShowList: true,   // New API
    }),
});

const Stack = createStackNavigator();

// Navegador para la app principal (usuario logueado)
const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'card' }}>
        <Stack.Screen name="Start" component={Start} />
        {/* ... el resto de tus pantallas ... */}
        <Stack.Screen name="Settings" component={Settings} options={{ presentation: 'modal' }} />
        <Stack.Screen name="CalendarEmotions" component={CalendarEmotions} />
        <Stack.Screen name="Phrases" component={Phrases} />
        <Stack.Screen name="PhrasesFavorite" component={PhrasesFavorite} />
        <Stack.Screen name="DailyEntries" component={DailyEntries} />
        <Stack.Screen name="DailyPage" component={DailyPage} />
        <Stack.Screen name="RemindersList" component={RemindersList} />
        <Stack.Screen name="RemindersForm" component={RemindersForm} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
);

// Navegador para la autenticación (usuario NO logueado)
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
    </Stack.Navigator>
);

// Componente que decide qué navegador mostrar
const AppNavigator = () => {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {userToken ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};


// Componente principal que envuelve todo
const App = () => (
    <AuthProvider>
        <ThemeProvider>
            <SettingsProvider>
                <FavoritesProvider>
                    <EmotionsProvider> 
                        <DailyProvider> 
                            <RemindersProvider> 
                                <PaperProvider>
                                    <StatusBar style="auto" translucent={true} />
                                    <AppNavigator />
                                </PaperProvider>
                            </RemindersProvider>
                        </DailyProvider>
                    </EmotionsProvider> 
                </FavoritesProvider>
            </SettingsProvider> 
        </ThemeProvider>
    </AuthProvider>
);

export default App;

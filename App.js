import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

/* SCREENS */
import CalendarEmotions from "./components/Screens/CalendarEmotions";
import QuickNotes from "./components/Screens/QuickNotes";
import Settings from "./components/Screens/Settings";
import Start from "./components/Screens/Start";

// DAILY PAGES
import DailyEntries from "./components/Screens/DailyPages/DailyEntries";
import DailyPage from "./components/Screens/DailyPages/DailyPage";

// PHRASES
import Phrases from "./components/Screens/Phrases/Phrases";
import PhrasesFavorite from "./components/Screens/Phrases/PhrasesFavorite";

// REMINDERS
import RemindersForm from "./components/Screens/Reminders/RemindersForm";
import RemindersList from "./components/Screens/Reminders/RemindersList";

// CONTEXTS
import { ThemeProvider } from "./components/Contexts/ThemeContext";
import { SettingsProvider } from "./components/Contexts/SettingsContext"; 
import { FavoritesProvider } from "./components/Contexts/FavoritesContext";
import { EmotionsProvider } from "./components/Contexts/EmotionsContext";
import { DailyProvider } from "./components/Contexts/DailyContext";
import { RemindersProvider } from "./components/Contexts/RemindersContext";

const Stack = createStackNavigator();

const App = () => (
    <ThemeProvider>
        <SettingsProvider>
        <FavoritesProvider>
        <EmotionsProvider> 
        <DailyProvider> 
        <RemindersProvider> 
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Start" component={Start} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="QuickNotes" component={QuickNotes} />
                    <Stack.Screen name="CalendarEmotions" component={CalendarEmotions} />
                    <Stack.Screen name="Phrases" component={Phrases} />
                    <Stack.Screen name="PhrasesFavorite" component={PhrasesFavorite} />
                    <Stack.Screen name="DailyEntries" component={DailyEntries} />
                    <Stack.Screen name="DailyPage" component={DailyPage} />
                    <Stack.Screen name="RemindersList" component={RemindersList} />
                    <Stack.Screen name="RemindersForm" component={RemindersForm} />
                </Stack.Navigator>
            </NavigationContainer>
        </RemindersProvider>
        </DailyProvider>
        </EmotionsProvider> 
        </FavoritesProvider>
        </SettingsProvider> 
    </ThemeProvider>
);
export default App;

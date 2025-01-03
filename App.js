import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

// PANTALLAS
import Start from "./components/Screens/Start";
import Settings from "./components/Screens/Settings";
import CalendarEmotions from "./components/Screens/CalendarEmotions";
import Phrases from "./components/Screens/Phrases/Phrases";
import PhrasesFavorite from "./components/Screens/Phrases/PhrasesFavorite";
import DailyEntries from "./components/Screens/DailyPages/DailyEntries";
import NewDailyPage from "./components/Screens/DailyPages/NewDailyPage";
import DetailsDailyPage from "./components/Screens/DailyPages/DetailsDailyPage";
import RemindersForm from "./components/Screens/Reminders/RemindersForm";
import RemindersList from "./components/Screens/Reminders/RemindersList";
import CustomDatePicker from "./components/Elements/CustomDatePicker";

// CONTEXT
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
                    <Stack.Screen name="CalendarEmotions" component={CalendarEmotions} />
                    <Stack.Screen name="Phrases" component={Phrases} />
                    <Stack.Screen name="PhrasesFavorite" component={PhrasesFavorite} />
                    <Stack.Screen name="DailyEntries" component={DailyEntries} />
                    <Stack.Screen name="NewDailyPage" component={NewDailyPage} />
                    <Stack.Screen name="DetailsDailyPage" component={DetailsDailyPage} />
                    <Stack.Screen name="RemindersList" component={RemindersList} />
                    <Stack.Screen name="RemindersForm" component={RemindersForm} />
                    <Stack.Screen name="CustomDatePicker" component={CustomDatePicker} />
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

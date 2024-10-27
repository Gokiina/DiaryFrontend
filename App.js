import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

// PANTALLAS
import Start from "./components/Screens/Start";
import Ajustes from "./components/Screens/Ajustes";
import CalendarEstados from "./components/Screens/CalendarEstados";
import ListFrases from "./components/Screens/ListFrases";
import ListFrasesFav from "./components/Screens/ListFrasesFav";
import ListAgenda from "./components/Screens/ListAgenda";
import PaginaDiarioNueva from "./components/Screens/PaginasDiario/PaginaDiarioNueva";
import PaginaDiarioDetalles from "./components/Screens/PaginasDiario/PaginaDiarioDetalles";

// CONTEXT
import { ThemeProvider } from "./components/Contexts/ThemeContext";
import { SettingsProvider } from "./components/Contexts/SettingsContext"; // Importar el contexto
import { FavoritesProvider } from "./components/Contexts/FavoritesContext";
import { EmotionsProvider } from "./components/Contexts/EmotionsContext";
import { DiarioProvider } from "./components/Contexts/DiarioContext";

const Stack = createStackNavigator();

const App = () => (
    <ThemeProvider>
        <SettingsProvider>
        <FavoritesProvider>
        <EmotionsProvider> 
        <DiarioProvider> 
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Start" component={Start} />
                    <Stack.Screen name="Ajustes" component={Ajustes} />
                    <Stack.Screen name="CalendarEstados" component={CalendarEstados} />
                    <Stack.Screen name="ListFrases" component={ListFrases} />
                    <Stack.Screen name="ListFrasesFav" component={ListFrasesFav} />
                    <Stack.Screen name="ListAgenda" component={ListAgenda} />
                    <Stack.Screen name="PaginaDiarioNueva" component={PaginaDiarioNueva} />
                    <Stack.Screen name="PaginaDiarioDetalles" component={PaginaDiarioDetalles} />
                </Stack.Navigator>
            </NavigationContainer>
        </DiarioProvider>
        </EmotionsProvider> 
        </FavoritesProvider>
        </SettingsProvider> 
    </ThemeProvider>
);
export default App;

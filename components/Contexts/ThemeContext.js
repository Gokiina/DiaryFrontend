import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem("isDarkMode");
                if (storedTheme !== null) {
                    setIsDarkMode(JSON.parse(storedTheme));
                }
            } catch (error) {
                console.error("Error loading theme:", error);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        try {
            await AsyncStorage.setItem("isDarkMode", JSON.stringify(newTheme));
        } catch (error) {
            console.error("Error saving theme:", error);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

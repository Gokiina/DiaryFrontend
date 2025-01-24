import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext();

export const useFavorites = () => {
    return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem("favorites");
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error("Error al cargar los favoritos:", error);
            }
        };

        loadFavorites();
    }, []);

    useEffect(() => {
        const saveFavorites = async () => {
            try {
                await AsyncStorage.setItem(
                    "favorites",
                    JSON.stringify(favorites)
                );
            } catch (error) {
                console.error("Error al guardar los favoritos:", error);
            }
        };

        saveFavorites();
    }, [favorites]);

    const toggleFavorite = (id) => {
        setFavorites(currentFavorites => {
            if (currentFavorites.includes(id)) {
                return currentFavorites.filter(favId => favId !== id);
            } else {
                const newFavorites = currentFavorites.slice();
                newFavorites.push(id);
                return newFavorites;
            }
        });
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
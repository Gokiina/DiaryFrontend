import React, { createContext, useState, useContext, useMemo, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const FavoritesContext = createContext();
// AÑADIDO: Nueva URL para la API de favoritos del usuario
const API_BASE_URL = "https://diarybackend-txxw.onrender.com/api/user/favorites";

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const { userToken } = useContext(AuthContext);

    const fetchFavorites = async () => {
        if (!userToken) return;
        try {
            const response = await fetch(API_BASE_URL, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!response.ok) throw new Error("Failed to fetch favorites");
            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const toggleFavorite = async (phraseId) => {
        if (!userToken) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${phraseId}`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (!response.ok) throw new Error("Failed to toggle favorite");
            const data = await response.json();
            // El backend ahora devuelve la lista actualizada de favoritos
            setFavorites(data);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };
    
    // Carga los favoritos cuando el usuario inicia sesión
    useEffect(() => {
        if (userToken) {
            fetchFavorites();
        } else {
            // Si el usuario cierra sesión, limpia los favoritos
            setFavorites([]);
        }
    }, [userToken]);

    // --- ESTA ES LA CORRECCIÓN CLAVE ---
    // Memoizamos el valor del contexto para evitar el bucle infinito de renderizado.
    const contextValue = useMemo(() => ({
        favorites,
        toggleFavorite,
        fetchFavorites
    }), [favorites]);

    return (
        <FavoritesContext.Provider value={contextValue}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);

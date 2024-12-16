import React, { createContext, useState, useContext } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => {
    return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]); 

    const toggleFavorite = (id) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(id)) {
                return prevFavorites.filter((favId) => favId !== id); 
            } else {
                return [...prevFavorites, id]; 
            }
        });
    };

    const removeFavorite = (id) => {
        setFavorites((prevFavorites) => {
            return prevFavorites.filter((favId) => favId !== id); 
        });
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

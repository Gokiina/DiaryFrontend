import React, { createContext, useState, useContext } from "react";
// AÑADIDO: Importamos el contexto de autenticación para obtener el token
import { AuthContext } from "./AuthContext";

const EmotionsContext = createContext();
const URL_EMOTIONS = "https://diarybackend-txxw.onrender.com/api/emotions";

export const EmotionsProvider = ({ children }) => {
    const [emotions, setEmotions] = useState({});
    // AÑADIDO: Obtenemos el token del AuthContext
    const { userToken } = useContext(AuthContext);

    const fetchEmotions = async () => {
        // AÑADIDO: Si no hay token, no hacemos la petición
        if (!userToken) return;

        try {
            // AÑADIDO: Cabecera de autorización con el token JWT
            const response = await fetch(URL_EMOTIONS, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setEmotions({});
                    return;
                }
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const text = await response.text();
            if (!text) {
                setEmotions({});
                return;
            }

            const data = JSON.parse(text);
            const emotionsMap = data.reduce((acc, { date, emotion }) => {
                acc[date] = emotion;
                return acc;
            }, {});
            setEmotions(emotionsMap);
        } catch (error) {
            console.error("Error al cargar emociones:", error);
        }
    };

    const saveEmotion = async (date, emotion) => {
        if (!userToken) return;

        try {
            const response = await fetch(URL_EMOTIONS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${userToken}` // AÑADIDO
                },
                body: JSON.stringify({ date, emotion }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Backend error: ${errorText}`);
            }

            setEmotions(currentEmotions => ({
                ...currentEmotions,
                [date]: emotion,
            }));
        } catch (error) {
            console.error("Error al guardar la emoción:", error);
        }
    };

    return (
        <EmotionsContext.Provider
            value={{ emotions, fetchEmotions, saveEmotion }}
        >
            {children}
        </EmotionsContext.Provider>
    );
};

export const useEmotions = () => useContext(EmotionsContext);

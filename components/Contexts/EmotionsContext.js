import React, { createContext, useState, useContext } from "react";

const EmotionsContext = createContext();
const URL_EMOTIONS = "http://localhost:8080/api/emotions";

export const EmotionsProvider = ({ children }) => {
    const [emotions, setEmotions] = useState({});

    const fetchEmotions = async () => {
        try {
            const response = await fetch(URL_EMOTIONS);
            const data = await response.json();
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
        try {
            const response = await fetch(URL_EMOTIONS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date, emotion }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error al guardar la emoción:", errorText);
                throw new Error(`Backend error: ${errorText}`);
            }

            setEmotions(currentEmotions => {
                const newEmotions = Object.assign({}, currentEmotions);
                newEmotions[date] = emotion;
                return newEmotions;
            });
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
import React, { createContext, useState, useContext } from "react";

const EmotionsContext = createContext();

export const EmotionsProvider = ({ children }) => {
    const [emotions, setEmotions] = useState({}); // Almacena emociones por fecha

    const fetchEmotions = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/emotions");
            const data = await response.json();
            const emotionsMap = data.reduce((acc, { date, emotion }) => {
                acc[date] = emotion;
                return acc;
            }, {});
            setEmotions(emotionsMap); // Actualizar emociones en el estado
        } catch (error) {
            console.error("Error al cargar emociones:", error);
        }
    };

    const saveEmotion = async (date, emotion) => {
        try {
            const response = await fetch("http://localhost:8080/api/emotions", {
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
    
            setEmotions((prev) => ({
                ...prev,
                [date]: emotion,
            }));
        } catch (error) {
            console.error("Error al guardar la emoción:", error);
        }
    };

    return (
        <EmotionsContext.Provider value={{ emotions, fetchEmotions, saveEmotion }}>
            {children}
        </EmotionsContext.Provider>
    );
};

export const useEmotions = () => useContext(EmotionsContext);

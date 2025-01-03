import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import dayjs from "dayjs"; 

export const EmojiRow = ({ selected, onSelectEmoji }) => {
    const today = dayjs().format("YYYY-MM-DD");  // Aquí defines "today"

    // Función para manejar el cambio de emoción
    const handleEmojiPress = async (emoji) => {
        setSelected(emoji);
        try {
            const response = await fetch(`http://localhost:8080/api/emotions/${today}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            console.log(`Respuesta del servidor:`, response);
    
            if (!response.ok) {
                throw new Error(`Error al obtener la emoción: ${response.status} ${response.statusText}`);
            }
    
            const data = response.status !== 204 ? await response.json() : null; // Manejar código 204
            console.log("Datos recibidos:", data);
    
            if (data) {
                await updateEmotion(today, emoji);
            } else {
                await createEmotion(today, emoji);
            }
        } catch (error) {
            console.error("Error al obtener la emoción:", error);
        }
    };
    
    

    // Función para crear una nueva emoción
    const createEmotion = async (date, emotion) => {
        try {
            await fetch("http://localhost:8080/api/emotions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date, emotion }),
            });
        } catch (error) {
            console.error("Error al crear la emoción:", error);
        }
    };

    // Función para actualizar la emoción existente
    const updateEmotion = async (date, emotion) => {
        try {
            await fetch(`http://localhost:8080/api/emotions/${date}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date, emotion }),
            });
        } catch (error) {
            console.error("Error al actualizar la emoción:", error);
        }
    };

    return (
        <View style={styles.emojiRow}>
            {["😁", "🙂", "😕", "🙁", "😖"].map((emoji, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.emojiSet}
                    onPress={() => onSelectEmoji(emoji)}
                >
                    <Text style={styles.emoji}>{emoji}</Text>
                    <Text
                        style={
                            selected === emoji
                                ? styles.emojiTextSelect
                                : styles.emojiTextUnS
                        }
                    >
                        {emoji === "😁"
                            ? "Increíble"
                            : emoji === "🙂"
                            ? "Bien"
                            : emoji === "😕"
                            ? "Meh"
                            : emoji === "🙁"
                            ? "Mal"
                            : "Horrible"}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    /*
    return (
        <View style={styles.emojiRow}>
            {["😁", "🙂", "😕", "🙁", "😖"].map((emoji) => (
                <TouchableOpacity key={emoji} onPress={() => onSelectEmoji(emoji)}>
                    <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );*/
};

const styles = StyleSheet.create({
    emojiRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        fontSize: 24,
    },
    emojiSet: {
        flexDirection: "column",
        alignItems: "center",
    },
    emojiTextSelect: {
        marginTop: 10,
        color: "rgb(0, 122, 255)",
        fontSize: 12,
    },
    emojiTextUnS: {
        marginTop: 10,
        color: "white",
        fontSize: 12,
    },
});

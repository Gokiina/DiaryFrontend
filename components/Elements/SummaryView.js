import React, { useState, useContext, useEffect } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";

const SummaryView = ({ emotions, isDarkMode }) => {
    const getMostFrequentEmotion = () => {
        const emotionsCount = Object.values(emotions).reduce((acc, emotion) => {
            acc[emotion] = (acc[emotion] || 0) + 1;
            return acc;
        }, {});
        
        return Object.entries(emotionsCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "😊";
    };

    const getMessage = (emoji) => {
        const messages = {
            "😁": "Este mes te has sentido mayormente increíble\n¡Sigue haciendo las cosas tal y como las haces! ¡Enhorabuena!",
            "🙂": "Este mes te has sentido generalmente bien\n¡Continúa con ese ánimo positivo!",
            "😕": "Este mes has tenido sentimientos mezclados\nRecuerda que cada día es una nueva oportunidad",
            "🙁": "Este mes ha sido algo difícil\nNo dudes en buscar apoyo cuando lo necesites",
            "😖": "Este mes ha sido complicado\nRecuerda que siempre hay luz al final del túnel"
        };
        return messages[emoji] || messages["😊"];
    };

    const dominantEmoji = getMostFrequentEmotion();

    return (
        <View style={[
            styles.summaryContainer,
            {
                backgroundColor: isDarkMode ? "rgba(36, 43, 72, 1)" : "rgba(248, 255, 255, 1)",
                padding: 20,
                borderRadius: 15,
                width: '90%',
                alignSelf: 'center',
                marginTop: 40
            }
        ]}>
            <Text style={[
                styles.summaryTitle,
                { color: isDarkMode ? "#FFFFFF" : "#000000" }
            ]}>
                ⭐ RESUMEN
            </Text>
            
            <View style={styles.circleContainer}>
                <View style={styles.emojiCircle}>
                    <Text style={styles.emojiText}>{dominantEmoji}</Text>
                </View>
            </View>
            
            <Text style={[
                styles.summaryMessage,
                { color: isDarkMode ? "#FFFFFF" : "#666666" }
            ]}>
                {getMessage(dominantEmoji)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    summaryContainer: {
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20,
    },
    circleContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    emojiCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#e0e0e0',
    },
    emojiText: {
        fontSize: 30,
    },
    summaryMessage: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    }
});

export default SummaryView;
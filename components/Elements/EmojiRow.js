import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { useTheme } from "../Contexts/ThemeContext";

export const EmojiRow = ({ selected, onSelectEmoji }) => {
    const { isDarkMode } = useTheme();

    // Texto visible en ambos modos: gris oscuro en light, gris claro en dark
    const unselectedColor = isDarkMode ? "#EBEBF5" : "#3C3C43";

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
                        style={{
                            marginTop: 10,
                            fontSize: 12,
                            fontWeight: selected === emoji ? "600" : "400",
                            color: selected === emoji ? "#007AFF" : unselectedColor
                        }}
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
};

const styles = StyleSheet.create({
    emojiRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    emojiSet: {
        flexDirection: "column",
        alignItems: "center",
    },
    emoji: {
        fontSize: 18,
    }
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const EmojiRow = ({ selected, onSelectEmoji }) => {
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
        fontSize: 13,
    },
    emojiTextUnS: {
        marginTop: 10,
        color: "white",
        fontSize: 13,
    },
});

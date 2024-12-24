import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { EmotionsContext } from "../Contexts/EmotionsContext"; 
import dayjs from "dayjs";

export class EmojiRow extends Component {

    static contextType = EmotionsContext;

    state = {
        selected: null, 
    };

    handleEmojiPress = (emoji) => {
        const currentDate = dayjs().format("YYYY-MM-DD"); 
        this.setState({ selected: emoji });
        
        const { registerEmotion } = this.context; 
        registerEmotion(currentDate, emoji); 
    };

    render() {
        const { selected } = this.state;

        return (
            <View style={styles.emojiRow}>
                {["😁", "🙂", "😕", "🙁", "😖"].map((emoji, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.emojiSet}
                        onPress={() => this.handleEmojiPress(emoji)}
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
    }
}





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

import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../Contexts/ThemeContext";

const Separator = () => {
    const { isDarkMode } = useTheme();

    return (
        <View
            style={[isDarkMode ? styles.SeparatorN : styles.Separator]}
        ></View>
    );
};

const styles = StyleSheet.create({
    Separator: {
        height: 1,
        backgroundColor: "#f3f3f3",
        marginVertical: 1,
    },
    SeparatorN: {
        height: 1,
        backgroundColor: "#545456",
        marginVertical: 1,
    },
});

export default Separator;

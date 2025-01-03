import React, { useState } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useEmotions } from "../Contexts/EmotionsContext";
import SummaryView from "../Elements/SummaryView";
import dayjs from "dayjs";

import CustomDatePicker from "../Elements/CustomDatePicker";
// Fondos
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// Iconos
const flecha = require("../../assets/IconosTexto/flecha.png");
const mind = require("../../assets/IconosTexto/mind.png");
const staroflife = require("../../assets/IconosTexto/staroflife.png");

const CalendarEmotions = (props) => {
    const { isDarkMode } = useTheme();
    const { emotions, saveEmotion } = useEmotions();
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const markedDates = Object.keys(emotions).reduce((acc, date) => {
        acc[date] = { selected: true, selectedColor: "yellow" };
        return acc;
    }, {});

    const emojisForDates = Object.keys(emotions).reduce((acc, date) => {
        acc[date] = emotions[date].emoji;
        return acc;
    }, {});

    const handleEmojiSelect = (emoji) => {
        saveEmotion(selectedDate, emoji);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            >
                <View style={styles.lineaVolver}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Start")}
                    >
                        <Text
                            style={{
                                color: isDarkMode ? "#FFFFFF" : "#007AFF",
                                fontSize: 18,
                            }}
                        >
                            <Image
                                source={flecha}
                                style={[
                                    styles.iconoTexto,
                                    {
                                        tintColor: isDarkMode
                                            ? "white"
                                            : "#007AFF",
                                    },
                                ]}
                            />
                            Volver
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.lineaTitulo}>
                    <Image
                        source={mind}
                        style={[
                            styles.iconoTitulo,
                            {
                                tintColor: isDarkMode
                                    ? "white"
                                    : "rgba(27, 31, 38, 0.72)",
                            },
                        ]}
                    />
                    <Text
                        style={[
                            styles.titulo,
                            { color: isDarkMode ? "#FFFFFF" : "#000" },
                        ]}
                    >
                        ESTADO
                    </Text>
                </View>

                <CustomDatePicker
                    style={styles.calendar}
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                        setSelectedDate(date);
                        selectEmoji(date);
                    }}
                    markedDates={markedDates}
                    emojis={emojisForDates}
                />

                <SummaryView emotions={emotions} isDarkMode={isDarkMode} />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerCalendar: {
        marginTop: 150,
        borderRadius: 12,
        padding: 20,
        backgroundColor: "yellow",
    },
    calendar: {
        marginTop: 150,
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.3,
        backgroundColor: "green",
    },
    backGround: {
        flex: 1,
        alignItems: "center",
        resizeMode: "cover",
        justifyContent: "center",
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 0,
        marginBottom: 0,
    },
    lineaTitulo: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        position: "absolute",
        top: 100,
        justifyContent: "center",
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    lineaTitulo2: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        padding: 10,
    },
    iconoTitulo: {
        width: 18,
        height: 16,
        marginRight: 10,
        marginTop: 0,
        marginBottom: 0,
    },
    iconoTitulo2: {
        width: 12,
        height: 15,
        marginBottom: 10,
    },

    card: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
        paddingHorizontal: 15,
        width: "92%",
        position: "absolute",
        bottom: 50,
    },
    fila: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    recordatorioContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    timeButton: {
        backgroundColor: "rgba(120, 120, 128, 0.12)",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 7,
        alignItems: "center",
        marginRight: 20,
    },
    timeText: {
        fontSize: 17,
        color: "#007AFF",
    },

    iconoTexto: {
        width: 18,
        height: 16,
    },

    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    pickerContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
    },
    dayContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
    },
    dayText: {
        fontSize: 18,
    },
    summaryContainer: {
        marginTop: 40,
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.3,
    },
    summaryTitle: {
        fontSize: 13,
        fontWeight: "bold",
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 14,
        marginBottom: 10,
        color: "#999999",
        paddingTop: 20,
    },
    highlight: {
        fontWeight: "bold",
    },
    emojiSummary: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    emojiCount: {
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 10,
    },
});

export default CalendarEmotions;

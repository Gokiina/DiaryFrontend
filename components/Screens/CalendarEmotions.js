import React, { useState, useCallback } from "react";
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
import CustomDatePicker from "../Elements/CustomDatePicker";
import dayjs from "dayjs";

const ASSETS = {
    backgrounds: {
        light: require("../../assets/Imag/Wallpaper/Wallpaper.jpg"),
        dark: require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg")
    },
    icons: {
        arrow: require("../../assets/IconosTexto/flecha.png"),
        mind: require("../../assets/IconosTexto/mind.png"),
        starOfLife: require("../../assets/IconosTexto/staroflife.png")
    }
};

const Header = ({ onBack, isDarkMode }) => (
    <View style={styles.lineaVolver}>
        <TouchableOpacity onPress={onBack}>
            <Text style={[styles.headerText, { color: isDarkMode ? "#FFFFFF" : "#007AFF" }]}>
                <Image
                    source={ASSETS.icons.arrow}
                    style={[styles.iconoTexto, { tintColor: isDarkMode ? "white" : "#007AFF" }]}
                />
                Volver
            </Text>
        </TouchableOpacity>
    </View>
);

const Title = ({ isDarkMode }) => (
    <View style={styles.lineaTitulo}>
        <Image
            source={ASSETS.icons.mind}
            style={[
                styles.iconoTitulo,
                { tintColor: isDarkMode ? "white" : "rgba(27, 31, 38, 0.72)" }
            ]}
        />
        <Text style={[styles.titulo, { color: isDarkMode ? "#FFFFFF" : "#000" }]}>
            ESTADO
        </Text>
    </View>
);

const CalendarEmotions = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { emotions, saveEmotion } = useEmotions();
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getMarkedDates = useCallback(() => {
        return Object.keys(emotions).reduce((acc, date) => {
            acc[date] = { selected: true, selectedColor: "yellow" };
            return acc;
        }, {});
    }, [emotions]);

    const getEmojisForDates = useCallback(() => {
        return Object.keys(emotions).reduce((acc, date) => {
            acc[date] = emotions[date].emoji;
            return acc;
        }, {});
    }, [emotions]);

    const handleDateSelect = useCallback((date) => {
        setSelectedDate(date);
    }, []);

    const handleBack = useCallback(() => {
        navigation.navigate("Start");
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light}
                style={styles.backGround}
            >
                <Header onBack={handleBack} isDarkMode={isDarkMode} />
                <Title isDarkMode={isDarkMode} />

                <CustomDatePicker
                    style={styles.calendar}
                    selectedDate={selectedDate}
                    onSelectDate={handleDateSelect}
                    markedDates={getMarkedDates()}
                    emojis={getEmojisForDates()}
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
    backGround: {
        flex: 1,
        alignItems: "center",
        resizeMode: "cover",
        justifyContent: "center",
    },
    calendar: {
        marginTop: 150,
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.3,
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 18,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
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
    iconoTitulo: {
        width: 18,
        height: 16,
        marginRight: 10,
    },
    iconoTexto: {
        width: 18,
        height: 16,
    },
    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
    }
});

export default CalendarEmotions;
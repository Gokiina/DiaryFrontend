import React, { useState } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { Switch } from "react-native-paper";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";


//  CONTEXTS
import { useTheme } from "../Contexts/ThemeContext"; 

// Wallpaper
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// ICONOS DE TEXTO
const flecha = require("../../assets/IconosTexto/flecha.png");
const mind = require("../../assets/IconosTexto/mind.png");
const staroflife = require("../../assets/IconosTexto/staroflife.png");

const CalendarEmotions = (props) => {
    const { isDarkMode, toggleTheme } = useTheme(); 
    const [darkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);


    const [selectedEmojis, setSelectedEmojis] = useState({});
    const [date, setDate] = useState(dayjs());

    const DarkModeSwitch = (value) => {
        setDarkModeEnabled(value);
        toggleTheme();
    };

    const selectEmoji = (day) => {

        const selectedEmoji = "😁"; 


        setSelectedEmojis({
            ...selectedEmojis,
            [day.dateString]: selectedEmoji,
        });
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

                {/* Título Estado */}
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
                            {
                                color: isDarkMode ? "#FFFFFF" : "#000",
                            },
                        ]}
                    >
                        {" "}
                        ESTADO
                    </Text>
                </View>

                {/*Contenido */}
                <View style={styles.containerCalendar}>
                    {/* Calendario */}
                    <View
                        style={[
                            styles.calendar,
                            {
                                backgroundColor: isDarkMode
                                    ? "rgba(36, 43, 72, 1)"
                                    : "rgba(248, 255, 255, 1)",
                            },
                        ]}
                    >
                        <DateTimePicker
                            mode="range"
                            date={date}
                            onChange={(params) => setDate(params.date)}
                            firstDayOfWeek={1}
                            headerButtonsPosition="right"
                            headerButtonColor="rgba(0, 122, 255, 1)"

                            todayContainerStyle={{
                                borderWidth: 0,
                            }}
                            calendarTextStyle={{
                                fontSize: 20,
                                color: isDarkMode ? "white" : "black",
                            }}
                            weekDaysContainerStyle={{
                                borderColor: 0,
                            }}
                            weekDaysTextStyle={{
                                color: isDarkMode
                                    ? "white"
                                    : "rgba(60, 60, 67, 0.3)",

                                textTransform: "uppercase",
                            }}
                            todayTextStyle={{
                                color: isDarkMode ? "white" : "black",
                            }}
                            headerTextStyle={{
                                color: isDarkMode ? "white" : "black",
                            }}
                        />
                    </View>

                    {/* Resumen */}
                    <View
                        style={[
                            styles.summaryContainer,
                            {
                                backgroundColor: isDarkMode
                                    ? "rgba(36, 43, 72, 1)"
                                    : "rgba(248, 255, 255, 1)",
                            },
                        ]}
                    >
                        <View style={styles.lineaTitulo2}>
                        <Image
                                source={staroflife}
                                style={[
                                    styles.iconoTitulo2,
                                    {
                                        tintColor: isDarkMode
                                            ? "white"
                                            : "rgba(27, 31, 38, 0.72)",
                                    },
                                ]}
                                
                                
                            />
                            <Text
                            style={[
                                styles.summaryTitle,
                                {
                                    color: isDarkMode
                                        ? "#FFFFFF"
                                        : "black",
                                },
                            ]}
                        
                            >
                                {" "}
                                RESUMEN
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.summaryText,
                                {
                                    color: isDarkMode ? "white" : "#999999",
                                },
                            ]}
                        >
                            Este mes te has sentido mayormente{" "}
                            <Text style={styles.highlight}>increíble</Text>.
                            ¡Sigue haciendo las cosas tal y como las haces!
                            ¡Enhorabuena!
                        </Text>
                        <View style={styles.emojiSummary}>
                            <Text style={styles.emoji}>😁</Text>
                            <Text
                                style={[
                                    styles.emojiCount,
                                    {
                                        color: isDarkMode ? "white" : "black",
                                    },
                                ]}
                            >
                                8
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: isDarkMode
                                ? "#2C2C2E"
                                : "rgba(255, 255, 255, 0.9)",
                        },
                    ]}
                >
                </View>
                
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerCalendar: {
        borderRadius: 12,
        padding: 20,
    },
    calendar: {
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.3,
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
        marginTop: 80,
        marginBottom: 20,
    },
    lineaTitulo: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 10,
        padding: 10,
    },
    lineaTitulo2: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        padding: 15,
    },
    iconoTitulo: {
        width: 18,
        height: 16,
        marginTop: 80,
        marginBottom: 20,
    },
    iconoTitulo2: {
        width: 12,
        height: 15,
        marginBottom: 10,
    },

    card: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
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
        borderRadius: 10,
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
        borderRadius: 10,
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
        borderRadius: 20,
        padding: 15,
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

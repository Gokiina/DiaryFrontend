import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import dayjs from "dayjs";
import { useTheme } from "../Contexts/ThemeContext";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";
const flecha = require("../../assets/IconosTexto/flecha.png");
const flecha2 = require("../../assets/IconosTexto/flecha2.png");

const CustomDatePicker = ({ selectedDate, onSelectDate }) => {
    const [emotions, setEmotions] = useState({});
    const [currentMonth, setCurrentMonth] =useState(dayjs().locale('es'));
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(true);

    // Cargar emociones desde la base de datos cuando el componente se monte
    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/emotions");
                const data = await response.json();
                const emotionsMap = data.reduce((acc, emotion) => {
                    acc[emotion.date] = emotion.emotion;
                    return acc;
                }, {});
                setEmotions(emotionsMap);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar las emociones:", error);
                setLoading(false);
            }
        };
        fetchEmotions();
    }, []);
    const handleMonthChange = (direction) => {
        setCurrentMonth(currentMonth.add(direction, "month"));
    };
    dayjs.extend(weekday);
    dayjs.extend(weekOfYear);
    dayjs.extend(localeData);
    dayjs.extend(utc);
    dayjs.locale("es");

    const daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    const markedDates = Object.keys(emotions); // Fechas con emociones registradas

    const generateCalendarDays = () => {
        const startOfMonth = currentMonth.startOf('month');
        const endOfMonth = currentMonth.endOf('month');
        const startOfCalendar = startOfMonth.startOf('week');
        const endOfCalendar = endOfMonth.endOf('week');
    
        const days = [];
        let currentDate = startOfCalendar;
    
        while (currentDate.isBefore(endOfCalendar) || currentDate.isSame(endOfCalendar, "day")) {
            const formattedDate = currentDate.format("YYYY-MM-DD");
            const isCurrentMonth = currentDate.isSame(currentMonth, "month");
            const emoji = markedDates.includes(formattedDate) ? emotions[formattedDate] : null;
    
            days.push({
                date: currentDate,
                isCurrentMonth,
                emoji: isCurrentMonth ? emoji : null,
            });
    
            currentDate = currentDate.add(1, "day");
        }
    
        return days;
    };
    
    const renderItem = ({ item }) => (
        <View
            style={[
                styles.dayContainer,
                !item.isCurrentMonth && styles.emptyDay,
            ]}
        >
            {item.emoji ? (
                <Text style={styles.emoji}>{item.emoji}</Text>
            ) : (
                <Text
                    style={[
                        item.isCurrentMonth ? styles.dayText : styles.emptyDayText,
                        item.date.isSame(selectedDate, "day") && styles.selectedDayText,
                    ]}
                >
                    {item.isCurrentMonth ? item.date.date() : ""}
                </Text>
            )}
        </View>
    );

    return (
        <View style={[
            styles.calendarWrapper,
            {
                backgroundColor: isDarkMode ? "#242B48" : "#fff",
            }
        ]}>
            {/* Encabezado con mes y año */}
            <View style={styles.header}>
            <Text style={[
                    styles.monthText,
                    { color: isDarkMode ? "#FFFFFF" : "#333" }
                ]}>
                    {currentMonth.format("MMMM YYYY")}
                </Text>
                <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                    <Image
                        source={flecha}
                        style={[styles.navButton, { width: 18, height: 16 }, { tintColor: isDarkMode ? "#FFFFFF" : "#007AFF" }]}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMonthChange(1)}>
                    <Image
                        source={flecha2}
                        style={[styles.navButton, { width: 18, height: 16 }, { tintColor: isDarkMode ? "#FFFFFF" : "#007AFF" }]}
                    />
                </TouchableOpacity>
            </View>

            {/* Encabezado con los días de la semana */}
            <View style={styles.weekRow}>
                {daysOfWeek.map((day) => (
                    <Text key={day} style={[
                        styles.weekDayText,
                        { color: isDarkMode ? "#FFFFFF" : "#999999" }
                    ]}>
                        {day}
                    </Text>
                ))}
            </View>

            {/* Calendario */}
            <FlatList
                data={generateCalendarDays()}
                numColumns={7}
                renderItem={({ item }) => (
                    <View style={[
                        styles.dayContainer,
                        !item.isCurrentMonth && styles.emptyDay,
                    ]}>
                        {item.emoji ? (
                            <Text style={styles.emoji}>{item.emoji}</Text>
                        ) : (
                            <Text style={[
                                item.isCurrentMonth ? styles.dayText : styles.emptyDayText,
                                item.date.isSame(selectedDate, "day") && styles.selectedDayText,
                                { color: isDarkMode ? "#FFFFFF" : "#000" }
                            ]}>
                                {item.isCurrentMonth ? item.date.date() : ""}
                            </Text>
                        )}
                    </View>
                )}
                keyExtractor={(item, index) =>
                    item.date ? item.date.format("YYYY-MM-DD") : `empty-${index}`
                }
                columnWrapperStyle={styles.row}
                extraData={[emotions, isDarkMode]}
            />
        </View>
    );
};



const styles = StyleSheet.create({
    calendarWrapper: {
        marginTop: 70, // Reducido para que el calendario se acerque a la parte inferior
        padding: 20, // Menos padding para hacer el calendario más compacto
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 2, // Sombra para Android
        shadowColor: "#000", // Sombra para iOS
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 7 },
        shadowRadius: 4,
        width: 360,
        maxHeight: 360, // Ajustar la altura máxima del calendario
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    navButton: {
        fontSize: 18,
        color: "#007AFF",
        fontWeight: "bold"
    },
    monthText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333", paddingLeft: 7
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    weekDayText: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        width: 40,
        paddingTop: 5
    },
    row: {
        justifyContent: "space-between",
    },
    dayContainer: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    emptyDay: {
        backgroundColor: "transparent",
    },

    dayText: {
        fontSize: 20,
        color: "#000",
    },
    emptyDayText: {
        fontSize: 16,
        color: "red", // Color gris claro para días vacíos
    },
    emoji: {
        fontSize: 20, // Aumentar el tamaño de los emojis para destacarlos

    },
});

export default CustomDatePicker;

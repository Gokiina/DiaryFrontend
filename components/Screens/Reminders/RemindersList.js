import React, { useState, useRef, useCallback, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

const ASSETS = {
    backgrounds: {
        light: require("../../../assets/Imag/Wallpaper/Wallpaper.jpg"),
        dark: require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg"),
    },
    icons: {
        arrow: require("../../../assets/IconosTexto/flecha.png"),
        plusCircle: require("../../../assets/IconosTexto/plusCircle2.png"),
        trash: require("../../../assets/IconosTexto/trash.png"),
        flag: require("../../../assets/IconosTexto/flag.png"),
        pencil: require("../../../assets/IconosTexto/pencil.png"),
        eye: require("../../../assets/IconosTexto/eye.png"),
        eyeSlash: require("../../../assets/IconosTexto/eyeSlash.png"),
    },
};

const API_URL = "http://localhost:8080/api/reminders";

const ReminderList = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const [reminders, setReminders] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
    const openSwipeableRef = useRef(null);
    const swipeableRefs = useRef({});

    const apiActions = useMemo(() => ({
        fetchReminders: async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();

                const processedData = data.map(reminder => {
                    return {
                        id: reminder.id,
                        title: reminder.title,
                        completed: reminder.completed,
                        flagged: reminder.flagged,
                        date: reminder.date ? reminder.date.toString() : null,
                        time: reminder.time ? reminder.time.toString() : null,
                        notes: reminder.notes,
                        url: reminder.url
                    };
                });

                const sortedData = processedData.sort((a, b) => Number(a.completed) - Number(b.completed));
                const filteredData = showCompleted ? sortedData : sortedData.filter(item => !item.completed);
                setReminders(filteredData);
            } catch (error) {
                console.error("Error fetching reminders:", error);
            }
        },

        deleteReminder: async (id) => {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Network response was not ok");
                apiActions.fetchReminders();
            } catch (error) {
                console.error("Error deleting reminder:", error);
            }
        },

        toggleCompleted: async (id) => {
            try {
                const response = await fetch(`${API_URL}/${id}/complete`, { method: "PATCH" });
                if (!response.ok) throw new Error("Network response was not ok");

                setReminders(function(previousReminders) {
                    const updatedReminders = previousReminders.map(function(reminder) {
                        if (reminder.id === id) {
                            return {
                                id: reminder.id,
                                title: reminder.title,
                                completed: !reminder.completed,
                                flagged: reminder.flagged,
                                date: reminder.date,
                                time: reminder.time,
                                notes: reminder.notes,
                                url: reminder.url
                            };
                        }
                        return reminder;
                    }).sort(function(a, b) {
                        return Number(a.completed) - Number(b.completed);
                    });
    
                    return updatedReminders;
                });

                setTimeout(apiActions.fetchReminders, 300);
            } catch (error) {
                console.error("Error toggling reminder:", error);
            }
        },
    }), [showCompleted]);

    useFocusEffect(
        useCallback(() => {
            apiActions.fetchReminders();
        }, [showCompleted])
    );

    const closeAllSwipeables = useCallback(() => {
        Object.values(swipeableRefs.current).forEach(ref => ref?.close?.());
        openSwipeableRef.current = null;
    }, []);

    const handleNavigation = useCallback((route, params) => {
        closeAllSwipeables();
        
        const navigationParams = {
            onSave: apiActions.fetchReminders
        };
    
        if (params) {
            navigationParams.reminder = params.reminder;
        }
    
        navigation.navigate(route, navigationParams);
    }, [navigation]);

    const ReminderItem = useCallback(({ item }) => {
        const RightActions = () => (
            <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => {
                    apiActions.deleteReminder(item.id);
                    openSwipeableRef.current = null;
                }}
            >
                <View style={styles.eliminarContainer}>
                    <Image source={ASSETS.icons.trash} style={styles.iconoTrash} />
                    <Text style={styles.textoEliminar}>Eliminar</Text>
                </View>
            </TouchableOpacity>
        );

        return (
            <Swipeable
                ref={ref => {
                    swipeableRefs.current[item.id] = ref;
                }}
                renderRightActions={RightActions}
                rightThreshold={50}
                onSwipeableWillOpen={() => {
                    if (openSwipeableRef.current && openSwipeableRef.current !== swipeableRefs.current[item.id]) {
                        openSwipeableRef.current.close();
                    }
                    openSwipeableRef.current = swipeableRefs.current[item.id];
                }}
            >
                <TouchableOpacity
                    style={[
                        styles.reminderItem,
                        {
                            backgroundColor: isDarkMode ? "rgba(155, 160, 180, 0.90)" : "rgba(255, 255, 255, 0.9)",
                            opacity: item.completed ? 0.7 : 1,
                        },
                    ]}
                    onPress={() => handleNavigation("RemindersForm", { reminder: item })}
                >
                    <TouchableOpacity
                        style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
                        onPress={() => apiActions.toggleCompleted(item.id)}
                    >
                        {item.completed && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                    <View style={styles.reminderContent}>
                        <Text
                            style={[
                                styles.reminderText,
                                {
                                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "#2C2C2E",
                                    textDecorationLine: item.completed ? "line-through" : "none",
                                },
                            ]}
                        >
                            {item.title}
                        </Text>
                        {item.flagged && (
                            <Image
                                source={ASSETS.icons.flag}
                                style={[styles.flagIcon, { tintColor: isDarkMode ? "rgb(6, 48, 103)" : "#007AFF" }]}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    }, [isDarkMode]);

    const FloatingButton = useCallback(() => (
        <TouchableOpacity onPress={() => setShowCompleted(!showCompleted)}>
            <Image
                source={showCompleted ? ASSETS.icons.eyeSlash : ASSETS.icons.eye}
                style={[styles.floatingButton, { tintColor: isDarkMode ? "white" : "rgb(7, 20, 35)" }]}
            />
        </TouchableOpacity>
    ), [showCompleted, isDarkMode]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light}
                style={styles.backGround}
            >
                <View style={styles.lineaVolver}>
                    <TouchableOpacity onPress={() => handleNavigation("Start")}>
                        <Text style={{ color: isDarkMode ? "#FFFFFF" : "#007AFF", fontSize: 17 }}>
                            <Image
                                source={ASSETS.icons.arrow}
                                style={[styles.iconoTexto, { tintColor: isDarkMode ? "white" : "#007AFF" }]}
                            />
                            Volver
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.lineaTitulo}>
                    <Image
                        source={ASSETS.icons.pencil}
                        style={[styles.iconoTitulo, { tintColor: isDarkMode ? "white" : "black" }]}
                    />
                    <Text style={[styles.titulo, { color: isDarkMode ? "#FFFFFF" : "#000" }]}>
                        PROPÓSITOS
                    </Text>
                </View>

                <TouchableOpacity onPress={() => handleNavigation("RemindersForm")}>
                    <Image
                        source={ASSETS.icons.plusCircle}
                        style={[
                            styles.iconoAdd,
                            {
                                tintColor: isDarkMode ? "rgb(7, 20, 35)" : "white",
                                backgroundColor: isDarkMode ? "white" : null,
                            },
                        ]}
                    />
                </TouchableOpacity>

                <View style={styles.card}>
                    <FlatList
                        data={reminders}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <ReminderItem item={item} />}
                        style={styles.listContainer}
                    />
                </View>
                <FloatingButton />
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
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 80,
        marginBottom: 20,
    },
    iconoTitulo: {
        width: 25,
        height: 19,
        marginTop: 80,
        marginBottom: 20,
        marginRight: 5,
    },
    lineaTitulo: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 10,
        padding: 10,
    },
    card: {
        borderRadius: 10,
        width: "100%",
        position: "absolute",
        bottom: 30,
        top: 150,
        paddingHorizontal: 10,
    },
    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    reminderItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        padding: 15,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "rgb(179, 179, 179)",
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxCompleted: {
        backgroundColor: "rgb(179, 179, 179)",
    },
    checkmark: {
        color: "white",
        fontSize: 16,
    },
    reminderContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    reminderText: {
        fontSize: 17,
    },
    flagIcon: {
        width: 15,
        height: 15,
    },
    botonEliminar: {
        backgroundColor: "#FF6B6B",
        justifyContent: "center",
        alignItems: "center",
        width: 105,
        borderRadius: 20,
        marginVertical: 5,
    },
    eliminarContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    textoEliminar: {
        color: "white",
        fontSize: 14,
        marginLeft: 10,
    },
    iconoAdd: {
        width: 30,
        height: 30,
        top: -330,
        right: -150,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 20,
        elevation: 50,
    },
    iconoTexto: {
        width: 18,
        height: 16,
    },
    iconoTrash: {
        width: 13,
        height: 17,
        tintColor: "white",
    },
    listContainer: {
        paddingVertical: 5,
        marginHorizontal: 10,
    },
    floatingButton: {
        position: "absolute",
        bottom: -360,
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 19,
        right: -170,
    },
});

export default ReminderList;

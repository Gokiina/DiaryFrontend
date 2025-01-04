import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
    FlatList,
} from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { Linking } from "react-native";
import { Alert } from "react-native";

// Wallpaper - Replace with your actual wallpaper assets
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// Icons - Replace with your actual icon assets
const flecha = require("../../assets/IconosTexto/flecha.png");
const plus = require("../../assets/IconosTexto/plusCircle2.png");
const trash = require("../../assets/IconosTexto/trash.png");

const iconList = require("../../assets/Imag/Iconos/List.png");
const iconDaily = require("../../assets/Imag/Iconos/Daily.png");
const iconCalendar = require("../../assets/Imag/Iconos/Calendar.png");

const { width } = Dimensions.get("window");

const QuickNotes = (props) => {
    const { isDarkMode } = useTheme();
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const API_BASE_URL = "http://localhost:8080/api/notes";
    const [isAddingNote, setIsAddingNote] = useState(false);

    const openCalendar = () => {
        Linking.openURL("calshow://");
    };

    const hasEmptyNotes = useCallback(() => {
        return notes.some(
            (note) => !note.textNote || note.textNote.trim() === ""
        );
    }, [notes]);

    const fetchAllNotes = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error("Error al obtener las notas");
            }
            const data = await response.json();
            const formattedData = data.map((note) => ({
                ...note,
                textNote: note.textNote || "",
            }));
            setNotes(formattedData);
        } catch (error) {
            console.error("Error al cargar las notas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllNotes();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAllNotes();
            return () => {};
        }, [])
    );

    const handleAddNote = async () => {
        if (hasEmptyNotes()) {
            Alert.alert(
                "Nota vacía",
                "Por favor complete la nota actual antes de crear una nueva.",
                [{ text: "OK" }]
            );
            return;
        }

        setIsAddingNote(true);
        try {
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    textNote: "",
                }),
            });

            if (!response.ok) {
                throw new Error("Error al crear la nota");
            }

            const newNote = await response.json();
            await fetchAllNotes();

            setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }, 100);
        } catch (error) {
            console.error("Error al crear la nota:", error);
        } finally {
            setIsAddingNote(false);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Error al eliminar la nota");
            }
            await fetchAllNotes();
        } catch (error) {
            console.error("Error al eliminar la nota:", error);
        }
    };

    const handleUpdateNote = async (id, content) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    textNote: content,
                }),
            });
            if (!response.ok) {
                throw new Error("Error al actualizar la nota");
            }

            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === id ? { ...note, textNote: content } : note
                )
            );
        } catch (error) {
            console.error("Error al actualizar la nota:", error);
        }
    };

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / width);
        setCurrentIndex(index);
    };

    const renderPaginationDots = () => {
        return (
            <View style={styles.paginationContainer}>
                {notes.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            {
                                backgroundColor:
                                    currentIndex === index
                                        ? isDarkMode
                                            ? "white"
                                            : "black"
                                        : "#D3D3D3",
                            },
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Start")}
                        style={styles.backButton}
                    >
                        <Image
                            source={flecha}
                            style={[
                                styles.iconoTexto,
                                { tintColor: isDarkMode ? "white" : "#007AFF" },
                            ]}
                        />
                        <Text
                            style={{
                                color: isDarkMode ? "#FFFFFF" : "#007AFF",
                                fontSize: 18,
                            }}
                        >
                            Volver
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddNote}
                    >
                        <Image
                            source={plus}
                            style={[
                                styles.iconoAdd,
                                {
                                    tintColor: isDarkMode
                                        ? "rgb(7, 20, 35)"
                                        : "white",
                                    backgroundColor: isDarkMode
                                        ? "white"
                                        : null,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <Text style={styles.loadingText}>Cargando notas...</Text>
                ) : (
                    <View style={styles.noteContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={notes}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.noteWrapper}>
                                    <View style={styles.noteCard}>
                                        <TextInput
                                            style={styles.noteText}
                                            multiline
                                            value={item.textNote || ""}
                                            onChangeText={(text) => {
                                                const updatedNotes = notes.map(
                                                    (n) =>
                                                        n.id === item.id
                                                            ? {
                                                                  ...n,
                                                                  textNote:
                                                                      text,
                                                              }
                                                            : n
                                                );
                                                setNotes(updatedNotes);
                                                handleUpdateNote(item.id, text);
                                            }}
                                            placeholder="Tareas de clase..."
                                            placeholderTextColor="#666"
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={[
                                            styles.deleteButton,
                                            {
                                                backgroundColor: isDarkMode
                                                    ? "#FF6B6B"
                                                    : "white",
                                            },
                                        ]}
                                        onPress={() =>
                                            handleDeleteNote(item.id)
                                        }
                                    >
                                        <Image
                                            source={trash}
                                            style={[
                                                styles.iconoTrash,
                                                {
                                                    tintColor: isDarkMode
                                                        ? "white"
                                                        : "#FF6B6B",
                                                },
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.deleteButtonText,
                                                {
                                                    color: isDarkMode
                                                        ? "white"
                                                        : "#FF6B6B",
                                                },
                                            ]}
                                        >
                                            Eliminar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {renderPaginationDots()}
                    </View>
                )}

                <View id="dock" style={styles.dock}>
                    <TouchableOpacity
                        onPress={() =>
                            props.navigation.navigate("RemindersList")
                        }
                    >
                        <Image source={iconList} style={styles.iconStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            props.navigation.navigate("DailyEntries")
                        }
                    >
                        <Image source={iconDaily} style={styles.iconStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openCalendar}>
                        <Image source={iconCalendar} style={styles.iconStyle} />
                    </TouchableOpacity>
                </View>
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
        resizeMode: "cover",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconoTexto: {
        width: 18,
        height: 16,
        marginRight: 5,
    },
    noteContainer: {
        flex: 1,
        marginTop: 90,
        marginBottom: 120,
    },
    noteWrapper: {
        width: width,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    noteCard: {
        width: width - 40,
        height: width - 40,
        backgroundColor: "#FFE4B5",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    noteText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        textAlignVertical: "top",
    },
    deleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteButtonText: {
        fontSize: 15,
        marginLeft: 5,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        marginBottom: 110,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    navButton: {
        padding: 10,
    },
    navIcon: {
        width: 24,
        height: 24,
        opacity: 0.6,
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#666",
    },
    iconoTrash: {
        width: 13,
        height: 17,
    },
    iconStyle: {
        width: 60,
        height: 60,
    },
    dock: {
        position: "absolute",
        bottom: 40,
        left: "5%",
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        borderRadius: 40,
        zIndex: 1000,
    },
    iconoAdd: {
        width: 30,
        height: 30,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 20,
        elevation: 50,
        marginRight: 10,
    },
});

export default QuickNotes;

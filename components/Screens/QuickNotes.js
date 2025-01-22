import React, { useState, useCallback, useRef } from "react";
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
    Alert,
    Linking
} from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { Platform } from 'react-native';
const { width } = Dimensions.get("window");
const API_BASE_URL = "http://localhost:8080/api/notes";

const ASSETS = {
    backgrounds: {
        light: require("../../assets/Imag/Wallpaper/Wallpaper.jpg"),
        dark: require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg")
    },
    icons: {
        arrow: require("../../assets/IconosTexto/flecha.png"),
        plus: require("../../assets/IconosTexto/plusCircle2.png"),
        trash: require("../../assets/IconosTexto/trash.png"),
        list: require("../../assets/Imag/Iconos/List.png"),
        daily: require("../../assets/Imag/Iconos/Daily.png"),
        calendar: require("../../assets/Imag/Iconos/Calendar.png")
    }
};

const noteService = {
    async fetchNotes() {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();
        return data.map(note => ({ ...note, textNote: note.textNote || "" }));
    },

    async createNote() {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ textNote: "" })
        });
        if (!response.ok) throw new Error("Failed to create note");
        return response.json();
    },

    async updateNote(id, content) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, textNote: content })
        });
        if (!response.ok) throw new Error("Failed to update note");
    },

    async deleteNote(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete note");
    }
};

const PaginationDots = ({ currentIndex, totalDots, isDarkMode }) => (
    <View style={styles.paginationContainer}>
        {Array.from({ length: totalDots }).map((_, index) => (
            <View
                key={index}
                style={[
                    styles.paginationDot,
                    {
                        backgroundColor: currentIndex === index
                            ? isDarkMode ? "white" : "black"
                            : "#D3D3D3"
                    }
                ]}
            />
        ))}
    </View>
);

const NoteCard = ({ note, onUpdate, onDelete, isDarkMode }) => (
    <View style={styles.noteWrapper}>
        <View style={styles.noteCard}>
        <TextInput
                style={styles.noteText}
                multiline
                value={note.textNote}
                onChangeText={(text) => onUpdate(note.id, text)}
                placeholder="Tareas de clase..."
                placeholderTextColor="#666"
                // Configuración específica para caracteres especiales
                autoCapitalize="none"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                // Importante para iOS: permite el teclado completo
                textContentType="none"
                // Asegura que se use el teclado del sistema
                secureTextEntry={false}
                contextMenuHidden={false}
                // Para mejor manejo del texto multilínea
                textAlignVertical="top"
                maxLength={1000}
                // Desactiva cualquier formato automático que pueda interferir
                spellCheck={true}
                autoComplete="off"
            />
        </View>
        <TouchableOpacity
            style={[styles.deleteButton, {
                backgroundColor: isDarkMode ? "#FF6B6B" : "white"
            }]}
            onPress={() => onDelete(note.id)}
        >
            <Image
                source={ASSETS.icons.trash}
                style={[styles.iconoTrash, {
                    tintColor: isDarkMode ? "white" : "#FF6B6B"
                }]}
            />
            <Text style={[styles.deleteButtonText, {
                color: isDarkMode ? "white" : "#FF6B6B"
            }]}>
                Eliminar
            </Text>
        </TouchableOpacity>
    </View>
);

const Dock = ({ navigation }) => (
    <View style={styles.dock}>
        <TouchableOpacity onPress={() => navigation.navigate("RemindersList")}>
            <Image source={ASSETS.icons.list} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("DailyEntries")}>
            <Image source={ASSETS.icons.daily} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("calshow://")}>
            <Image source={ASSETS.icons.calendar} style={styles.iconStyle} />
        </TouchableOpacity>
    </View>
);

const QuickNotes = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const fetchNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            const fetchedNotes = await noteService.fetchNotes();
            setNotes(fetchedNotes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        fetchNotes();
    }, []));

    const handleAddNote = useCallback(async () => {
        if (notes.some(note => !note.textNote?.trim())) {
            Alert.alert("Nota vacía", "Por favor complete la nota actual antes de crear una nueva.");
            return;
        }

        try {
            await noteService.createNote();
            await fetchNotes();
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error("Error creating note:", error);
        }
    }, [notes, fetchNotes]);

    const handleUpdateNote = useCallback(async (id, content) => {
        try {
            await noteService.updateNote(id, content);
            setNotes(prev => prev.map(note =>
                note.id === id ? { ...note, textNote: content } : note
            ));
        } catch (error) {
            console.error("Error updating note:", error);
        }
    }, []);

    const handleDeleteNote = useCallback(async (id) => {
        try {
            await noteService.deleteNote(id);
            await fetchNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    }, [fetchNotes]);

    const handleScroll = useCallback((event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        setCurrentIndex(Math.round(contentOffset / width));
    }, []);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light}
                style={styles.backGround}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Start")}
                        style={styles.backButton}
                    >
                        <Image
                            source={ASSETS.icons.arrow}
                            style={[styles.iconoTexto, {
                                tintColor: isDarkMode ? "white" : "#007AFF"
                            }]}
                        />
                        <Text style={{
                            color: isDarkMode ? "#FFFFFF" : "#007AFF",
                            fontSize: 18
                        }}>
                            Volver
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddNote}
                    >
                        <Image
                            source={ASSETS.icons.plus}
                            style={[styles.iconoAdd, {
                                tintColor: isDarkMode ? "rgb(7, 20, 35)" : "white",
                                backgroundColor: isDarkMode ? "white" : null
                            }]}
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
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <NoteCard
                                    note={item}
                                    onUpdate={handleUpdateNote}
                                    onDelete={handleDeleteNote}
                                    isDarkMode={isDarkMode}
                                />
                            )}
                        />
                        <PaginationDots
                            currentIndex={currentIndex}
                            totalDots={notes.length}
                            isDarkMode={isDarkMode}
                        />
                    </View>
                )}

                <Dock navigation={navigation} />
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
        width,
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

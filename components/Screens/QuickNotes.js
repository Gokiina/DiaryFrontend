import React, { useState, useCallback, useRef, useContext } from "react"; // AÑADIDO: useContext
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
import { AuthContext } from "../Contexts/AuthContext"; // AÑADIDO: Importar AuthContext
const { width } = Dimensions.get("window");
const API_BASE_URL = "https://diarybackend-txxw.onrender.com/api/notes";
import ASSETS from '../Constants/ASSETS';

// MODIFICADO: El servicio ahora acepta el token como argumento en cada función
const noteService = {
    async fetchNotes(token) {
        const response = await fetch(API_BASE_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();
        return data.map(note => ({
            ...note,
            textNote: note.textNote === undefined || note.textNote === null ? "" : note.textNote,
        }));
    },

    async createNote(token) {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ textNote: "" })
        });
        if (!response.ok) throw new Error("Failed to create note");
        return response.json();
    },

    async updateNote(id, content, token) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ id, textNote: content })
        });
        if (!response.ok) throw new Error("Failed to update note");
    },

    async deleteNote(id, token) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
            headers: { 'Authorization': `Bearer ${token}` }
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
                autoCapitalize="none"
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                textContentType="none"
                secureTextEntry={false}
                contextMenuHidden={false}
                textAlignVertical="top"
                maxLength={1000}
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
                source={ASSETS.icons.general.trash}
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
            <Image source={ASSETS.icons.navigation.list} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("DailyEntries")}>
            <Image source={ASSETS.icons.navigation.daily} style={styles.iconStyle} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(Platform.OS === 'ios' ? 'calshow://' : 'content://com.android.calendar/time/')}>
            <Image source={ASSETS.icons.navigation.calendar} style={styles.iconStyle} />
        </TouchableOpacity>
    </View>
);

const QuickNotes = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { userToken } = useContext(AuthContext); // AÑADIDO: Obtener el token
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const fetchNotes = useCallback(async () => {
        if (!userToken) return; // AÑADIDO: No hacer nada si no hay token
        try {
            setIsLoading(true);
            const fetchedNotes = await noteService.fetchNotes(userToken); // AÑADIDO: Pasar el token
            setNotes(fetchedNotes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]); // AÑADIDO: userToken como dependencia

    useFocusEffect(useCallback(() => {
        fetchNotes();
    }, [fetchNotes]));

    const handleAddNote = useCallback(async () => {
        if (!userToken) return; // AÑADIDO: No hacer nada si no hay token
        if (notes.some(note => !note.textNote || note.textNote.trim() === "")) {
            Alert.alert("Nota vacía", "Por favor complete la nota actual antes de crear una nueva.");
            return;
        }

        try {
            await noteService.createNote(userToken); // AÑADIDO: Pasar el token
            await fetchNotes();
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error("Error creating note:", error);
        }
    }, [notes, fetchNotes, userToken]); // AÑADIDO: userToken como dependencia

    const handleUpdateNote = useCallback(async (id, content) => {
        if (!userToken) return; // AÑADIDO: No hacer nada si no hay token
        try {
            // Optimistic update
            setNotes(prev =>
                prev.map(note => note.id === id ? { ...note, textNote: content } : note)
            );
            await noteService.updateNote(id, content, userToken); // AÑADIDO: Pasar el token
        } catch (error) {
            console.error("Error updating note:", error);
            // Revert on error if needed
        }
    }, [userToken]); // AÑADIDO: userToken como dependencia

    const handleDeleteNote = useCallback(async (id) => {
        if (!userToken) return; // AÑADIDO: No hacer nada si no hay token
        try {
            await noteService.deleteNote(id, userToken); // AÑADIDO: Pasar el token
            await fetchNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    }, [fetchNotes, userToken]); // AÑADIDO: userToken como dependencia

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
                            source={ASSETS.icons.general.arrow}
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
                            source={ASSETS.icons.general.plusCircle}
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
    container: { flex: 1, },
    backGround: { flex: 1, resizeMode: "cover", },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 60, },
    backButton: { flexDirection: "row", alignItems: "center", },
    iconoTexto: { width: 18, height: 16, marginRight: 5, },
    noteContainer: { flex: 1, marginTop: 90, marginBottom: 120, },
    noteWrapper: { width, alignItems: "center", paddingHorizontal: 20, },
    noteCard: { width: width - 40, height: width - 40, backgroundColor: "#FFE4B5", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, },
    noteText: { flex: 1, fontSize: 16, color: "#333", textAlignVertical: "top", },
    deleteButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 20, marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", },
    deleteButtonText: { fontSize: 15, marginLeft: 5, },
    paginationContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 20, marginBottom: 110, },
    paginationDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4, },
    loadingText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#666", },
    iconoTrash: { width: 13, height: 17, },
    iconStyle: { width: 60, height: 60, },
    dock: { position: "absolute", bottom: 40, left: "5%", width: "90%", flexDirection: "row", justifyContent: "space-around", alignItems: "center", padding: 15, backgroundColor: "rgba(0, 0, 0, 0.08)", borderRadius: 40, zIndex: 1000, },
    iconoAdd: { width: 30, height: 30, shadowOpacity: 0.5, shadowRadius: 10, borderRadius: 20, elevation: 50, marginRight: 10, },
});

export default QuickNotes;

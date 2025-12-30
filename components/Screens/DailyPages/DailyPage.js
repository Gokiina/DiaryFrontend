import React, { useState, useContext, useCallback, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
    Image
} from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { DailyContext } from "../../Contexts/DailyContext";
import { AuthContext } from "../../Contexts/AuthContext";
import ASSETS from '../../Constants/ASSETS';

const API_URL = "https://diarybackend-txxw.onrender.com/api/diary";

const formatDate = (date) => {
    const d = new Date(date);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    // Ajustar manualmente para minúsculas si es necesario, aunque toLocaleDateString suele hacerlo bien en es-ES
    // El usuario pide "Domingo 21 de diciembre".
    // weekday devuelve "domingo", month "diciembre".
    // Podemos capitalizar la primera letra del día.
    const dateString = d.toLocaleDateString('es-ES', options);
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
};

// Servicio simplificado para manejar la lógica de la API
const dailyService = {
    async createEntry(token, entry) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(entry)
        });
        if (!response.ok) throw new Error("Failed to save entry");
        return response.json();
    },
    async updateEntry(token, entry) {
        const response = await fetch(`${API_URL}/${entry.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(entry)
        });
        if (!response.ok) throw new Error("Failed to update entry");
        return response.json();
    }
};

const DailyPage = ({ navigation, route }) => {
    const { isDarkMode } = useTheme();
    const { userToken } = useContext(AuthContext);
    const { agregarEntrada, actualizarEntrada } = useContext(DailyContext);
    
    const initialEntry = route.params?.entrada;
    
    // Estados
    const [text, setText] = useState(initialEntry?.content || "");
    const [lastSavedText, setLastSavedText] = useState(initialEntry?.content || "");
    const [entry, setEntry] = useState(initialEntry); // Mantiene la entrada actual (con ID si existe)
    const [isSaving, setIsSaving] = useState(false);

    // Ref para el debounce
    const timeoutRef = useRef(null);
    const inputRef = useRef(null);

    const handleBack = () => {
        navigation.goBack();
    };

    // Auto-focus al montar
    useEffect(() => {
        if (!initialEntry) {
            const timer = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [initialEntry]);

    // Función de guardado
    const saveToBackend = async (contentToSave) => {
        if (!contentToSave.trim() || contentToSave === lastSavedText || !userToken) return;

        setIsSaving(true);
        try {
            if (entry && entry.id) {
                // Actualizar existente
                const updatedData = { ...entry, content: contentToSave };
                await dailyService.updateEntry(userToken, updatedData);
                actualizarEntrada(updatedData); // Actualizar contexto
                setLastSavedText(contentToSave);
            } else {
                // Crear nueva
                const newEntryData = {
                    date: new Date().toISOString(),
                    content: contentToSave
                };
                const savedEntry = await dailyService.createEntry(userToken, newEntryData);
                setEntry(savedEntry); // Guardamos la entrada creada con su ID
                agregarEntrada(savedEntry); // Actualizar contexto
                setLastSavedText(contentToSave);
            }
        } catch (error) {
            console.error("Auto-save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Manejador de cambio de texto con debounce
    const handleTextChange = (newText) => {
        setText(newText);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            saveToBackend(newText);
        }, 1000); // Guardar después de 1 segundo de inactividad
    };

    // Limpiar timeout al desmontar
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            // Opcional: Guardar al salir si hay cambios pendientes?
            // saveToBackend(text); // Puede ser arriesgado si el componente se desmonta antes de terminar
        };
    }, []);

    const themeStyles = {
        bg: isDarkMode ? "#000" : "#fff",
        text: isDarkMode ? "#fff" : "#000",
        date: isDarkMode ? "#888" : "#888",
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.bg }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Image source={ASSETS.icons.general.arrow} style={[styles.backIcon, { tintColor: '#E0A800' }]} />
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
                {isSaving && <Text style={styles.savingText}>Guardando...</Text>}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                <Text style={[styles.dateText, { color: themeStyles.date }]}>
                    {formatDate(entry ? entry.date : new Date())}
                </Text>

                <TextInput
                    ref={inputRef}
                    style={[styles.editor, { color: themeStyles.text }]}
                    multiline
                    placeholder="Empieza a escribir..."
                    placeholderTextColor="#666"
                    value={text}
                    onChangeText={handleTextChange}
                    textAlignVertical="top"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: Platform.OS === 'android' ? 60 : 0, // Aumentado margen superior aún más
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        width: 18,
        height: 18,
        marginRight: 4,
    },
    backButtonText: {
        fontSize: 17,
        color: '#E0A800',
        fontWeight: '600',
    },
    savingText: {
        fontSize: 12,
        color: '#888',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    editor: {
        flex: 1,
        fontSize: 17,
        lineHeight: 24,
        paddingBottom: 20,
    }
});

export default DailyPage;

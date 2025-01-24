import React, { useState, useContext, useCallback } from "react";
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Alert
} from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { DailyContext } from "../../Contexts/DailyContext";
import LinedTextInput from "../../Elements/LinedTextInput";

const API_URL = "http://localhost:8080/api/diary";

const ASSETS = {
    backgrounds: {
        light: require("../../../assets/Imag/Wallpaper/Wallpaper.jpg"),
        dark: require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg")
    },
    icons: {
        circleFill: require("../../../assets/IconosTexto/circleFill.png")
    }
};

const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
};

const dailyService = {
    async createEntry(entry) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entry)
        });

        if (!response.ok) {
            throw new Error("Failed to save entry");
        }

        return response.json();
    }
};

const SaveButton = ({ onPress, isDarkMode }) => (
    <TouchableOpacity style={styles.iconoAdd} onPress={onPress}>
        <Image
            source={ASSETS.icons.circleFill}
            style={[
                styles.iconoAdd,
                {
                    tintColor: isDarkMode ? "rgb(239, 239, 239)" : "white"
                }
            ]}
        />
    </TouchableOpacity>
);

const DailyPage = ({ navigation, route }) => {
    const { isDarkMode } = useTheme();
    const { agregarEntrada, actualizarEntrada } = useContext(DailyContext);
    
    const initialEntry = route.params?.entrada;
    const isEditing = !!initialEntry;
    
    const [text, setText] = useState(initialEntry?.content || "");
    const [fecha] = useState(initialEntry?.date ? new Date(initialEntry.date) : new Date());

    const handleTextChange = useCallback((newText) => {
        setText(newText);
    }, []);

    const saveEntry = useCallback(async () => {
        if (!text.trim()) {
            navigation.goBack();
            return;
        }
    
        try {
            if (isEditing) {
                const updatedEntry = {
                    id: initialEntry.id,
                    date: initialEntry.date,
                    content: text
                };
                actualizarEntrada(updatedEntry);
            } else {
                const newEntry = {
                    date: new Date().toISOString(),
                    content: text
                };
                
                const savedEntry = await dailyService.createEntry(newEntry);
                agregarEntrada(savedEntry);
            }
            navigation.goBack();
        } catch (error) {
            console.error("Error saving entry:", error);
            Alert.alert(
                "Error",
                isEditing 
                    ? "No se pudo actualizar la entrada. Por favor, inténtalo de nuevo."
                    : "No se pudo guardar la entrada. Por favor, verifica tu conexión e inténtalo de nuevo.",
                [{ text: "OK" }]
            );
        }
    }, [text, isEditing, initialEntry, navigation, actualizarEntrada, agregarEntrada]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ImageBackground
                    style={[
                        styles.backGround,
                        {
                            backgroundColor: isDarkMode
                                ? "rgb(204, 204, 204)"
                                : "white"
                        }
                    ]}
                >
                    <Text style={styles.fecha}>
                        {initialEntry 
                            ? formatDate(initialEntry.date)
                            : formatDate(fecha)
                        }
                    </Text>

                    <LinedTextInput
                        isDarkMode={isDarkMode}
                        multiline
                        placeholder="Escribe tu entrada aquí..."
                        placeholderTextColor="#888"
                        onChangeText={handleTextChange}
                        value={text}
                    />

                    <SaveButton 
                        onPress={saveEntry}
                        isDarkMode={isDarkMode}
                    />
                </ImageBackground>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backGround: {
        flex: 1,
        alignItems: "center",
    },
    fecha: {
        fontSize: 18,
        paddingTop: 60,
        paddingBottom: 5,
        color: "black",
        textAlign: "center",
        marginVertical: 10,
        fontWeight: "bold",
    },
    iconoAdd: {
        width: 25,
        height: 25,
        position: "absolute",
        top: 35,
        right: 20,
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 2 },
    }
});

export default DailyPage;
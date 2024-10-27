import React, { useState, useContext } from "react";
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { DiarioContext } from "../../Contexts/DiarioContext";

// Wallpapers e Iconos
const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const flecha = require("../../../assets/IconosTexto/flecha.png");
const pencil = require("../../../assets/IconosTexto/pencil.png");
const saveIcon = require("../../../assets/IconosTexto/save.png"); // Icono de guardar

const PaginaDiarioDetalles = (props) => {
    const { isDarkMode } = useTheme();
    const { entradas, actualizarEntrada } = useContext(DiarioContext);
    const { entrada } = props.route.params;

    const [text, setText] = useState(entrada.text); // Estado local para el texto
    const [editMode, setEditMode] = useState(false); // Estado para manejar si estamos en modo edición o no

    // Función para guardar la entrada
    const saveEntry = () => {
        const nuevaEntrada = {
            ...entrada,
            text, // Actualizamos solo el texto
        };

        actualizarEntrada(nuevaEntrada); // Aseguramos que actualizamos en el contexto

        // Desactivar el modo edición y actualizar el texto en la misma pantalla
        setEditMode(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <ImageBackground
                        source={isDarkMode ? backGroundBlack : backGround}
                        style={styles.backGround}
                    >
                        {/* Botón Volver */}
                        <View style={styles.lineaVolver}>
                            <TouchableOpacity onPress={() => props.navigation.goBack()}>
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

                            {/* Botón para editar o guardar */}
                            <TouchableOpacity
                                style={styles.iconoEdit}
                                onPress={() => {
                                    if (editMode) {
                                        saveEntry(); // Guardar si estamos en modo edición
                                    } else {
                                        setEditMode(true); // Entrar en modo edición si no lo estamos
                                    }
                                }}
                            >
                                <Image
                                    source={editMode ? saveIcon : pencil} // Mostrar icono de guardar o editar según el estado
                                    style={[
                                        styles.iconoEdit,
                                        { tintColor: isDarkMode ? "white" : "black", width: editMode ?  25 : 40, height: editMode ? 30 : 30},
                                    ]}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Mostramos la entrada o el TextInput */}
                        <View
                            style={[
                                styles.card,
                                {
                                    backgroundColor: isDarkMode
                                        ? "rgba(155, 160, 180, 0.90)"
                                        : "rgba(255, 255, 255, 0.9)",
                                    color: isDarkMode ? "white" : "black",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.fecha,
                                    { color: isDarkMode ? "white" : "black" },
                                ]}
                            >
                                {entrada.date} - {entrada.time}
                            </Text>

                            {editMode ? (
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        { color: isDarkMode ? "white" : "black" },
                                    ]}
                                    multiline
                                    value={text}
                                    onChangeText={setText}
                                />
                            ) : (
                                <Text
                                    style={[
                                        styles.texto,
                                        { color: isDarkMode ? "white" : "black" },
                                    ]}
                                >
                                    {text}
                                </Text>
                            )}
                        </View>
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    card: {
        borderRadius: 10,
        width: "93%",
        paddingHorizontal: 10,
        padding: 20,
        marginTop: 70,
    },
    fecha: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    texto: {
        fontSize: 16,
        color: "#333",
    },
    textInput: {
        fontSize: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
    },
    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
    },
    iconoTexto: {
        width: 18,
        height: 16,
    },
    iconoEdit: {
        width: 40,
        height: 30,
        position: "absolute",
        top: 0,
        right: -140,
    },
});

export default PaginaDiarioDetalles;

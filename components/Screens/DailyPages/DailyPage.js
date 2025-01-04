import React, { useState, useContext } from "react";
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
} from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { DailyContext } from "../../Contexts/DailyContext";
import LinedTextInput from "../../Elements/LinedTextInput";
import { Alert } from "react-native";

const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const circleFill = require("../../../assets/IconosTexto/circleFill.png");

const URL_DAILY = "http://localhost:8080/api/diary";

const DailyPage = (props) => {
    const { isDarkMode } = useTheme();
    const { agregarEntrada, actualizarEntrada } = useContext(DailyContext);
    
    // Verificar si estamos editando una entrada existente
    const isEditing = props.route.params?.entrada;
    const initialEntry = isEditing ? props.route.params.entrada : null;
    
    const [text, setText] = useState(initialEntry?.content || "");
    const [fecha] = useState(initialEntry?.date ? new Date(initialEntry.date) : new Date());

    const formattedDate = initialEntry
        ? `${initialEntry.date.split("T")[0].split("-").reverse().join(".")}`
        : `${fecha.getDate().toString().padStart(2, "0")}.${(
              fecha.getMonth() + 1
          ).toString().padStart(2, "0")}.${fecha.getFullYear()}`;

    const saveEntry = async () => {
        if (text.trim() === "") {
            props.navigation.goBack();
            return;
        }

        if (isEditing) {
            // Actualizar entrada existente
            const nuevaEntrada = {
                ...initialEntry,
                content: text,
            };
            actualizarEntrada(nuevaEntrada);
            props.navigation.goBack();
        } else {
            // Crear nueva entrada
            const nuevaPagina = {
                date: new Date().toISOString(),
                content: text,
            };
            
            try {
                const response = await fetch(URL_DAILY, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nuevaPagina),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Página de diario guardada con éxito:", data);
                    agregarEntrada(data);
                    props.navigation.goBack();
                } else {
                    console.error("Error al guardar la página:", response.statusText);
                    alert("Hubo un problema al guardar la página. Inténtalo de nuevo.");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                alert("Error de conexión. Verifica que el servidor esté en funcionamiento.");
            }
        }
    };

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
                                : "white",
                        },
                    ]}
                >
                    <Text style={styles.fecha}>
                        {formattedDate}
                    </Text>

                    <LinedTextInput
                        isDarkMode={isDarkMode}
                        multiline={true}
                        placeholder="Escribe tu entrada aquí..."
                        placeholderTextColor="#888"
                        onChangeText={(newText) => {
                            console.log("Texto actualizado:", newText);
                            setText(newText);
                        }}
                        value={text}
                    />

                    <TouchableOpacity
                        style={styles.iconoAdd}
                        onPress={saveEntry}
                    >
                        <Image
                            source={circleFill}
                            style={[
                                styles.iconoAdd,
                                {
                                    tintColor: isDarkMode
                                        ? "rgb(239, 239, 239)"
                                        : "white",
                                },
                            ]}
                        />
                    </TouchableOpacity>
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
    },
});

export default DailyPage;
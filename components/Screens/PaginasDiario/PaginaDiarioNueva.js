import React, { useState, useContext } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { DiarioContext } from "../../Contexts/DiarioContext"; // Contexto para almacenar las entradas
import { useTheme } from "../../Contexts/ThemeContext"; // Contexto de tema

// ICONOS
const backGround = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
//const linea = require("../../../assets/Imag/Wallpaper/lineas.png");
const circleFill = require("../../../assets/IconosTexto/circleFill.png"); // Botón de guardar similar al botón de "agregar"

const PaginaDiarioNueva = (props) => {
    const { isDarkMode } = useTheme(); // Usamos el contexto para manejar el tema
    const [text, setText] = useState(""); // Estado para almacenar el texto de la entrada
    const { agregarEntrada } = useContext(DiarioContext); // Función para agregar la entrada en el contexto
    const [fecha] = useState(new Date()); // Estado para la fecha y hora actual
    const formattedDate = `${fecha.getDate().toString().padStart(2, "0")}.${(
        fecha.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}.${fecha.getFullYear()}`;
    const formattedTime = `${fecha
        .getHours()
        .toString()
        .padStart(2, "0")}:${fecha.getMinutes().toString().padStart(2, "0")}`;

    // Función para guardar la entrada
    const saveEntry = () => {
        if (text.trim() === "") {
            // Si el texto está vacío, simplemente regresa sin guardar
            props.navigation.goBack();
            return;
        }

        const nuevaEntrada = {
            id: Date.now(),
            date: formattedDate,
            time: formattedTime,
            text: text,
        };

        agregarEntrada(nuevaEntrada); // Agregar entrada al contexto

        // Volver a la lista de entradas
        props.navigation.navigate("ListAgenda");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ImageBackground
                    source={isDarkMode ? backGroundBlack : backGround}
                    style={styles.backGround}
                >
                    {/* Fecha de la entrada */}
                    <Text style={[
                            styles.fecha,
                            { color: isDarkMode ? "white" : "black" }, // Ajuste del color del icono
                        ]}>{formattedDate}</Text>

                    {/* Campo de texto */}
                    <TextInput
                        style={[
                            styles.textInput,
                            { backgroundColor: isDarkMode ? "#2C2C2E" : "white", color: isDarkMode ? "white" : "black" }, // Ajuste del color del icono
                        ]}
                        multiline={true}
                        placeholder="Escribe tu entrada aquí..."
                        placeholderTextColor="#888"
                        onChangeText={(text) => setText(text)}
                        value={text}
                    />

                    {/* Botón Circle Fill para guardar */}
                    <TouchableOpacity style={styles.iconoAdd} onPress={saveEntry}>
                        <Image
                            source={circleFill}
                            style={[
                                styles.iconoAdd,
                                { tintColor: isDarkMode ? "black" : "white" }, // Ajuste del color del icono
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
    textInput: {
        width: "93%",
        flex: 1,
        fontSize: 18,
        //backgroundColor: "transparent", // Hacer transparente el fondo para ver las líneas
        
        borderRadius: 10, // Sin bordes redondeados
        color: "#333",
        textAlignVertical: "top", // Alinea el texto al principio al escribir
        marginTop: 5,
        paddingHorizontal: 10, // Reduce el padding horizontal
        lineHeight: 24, // Ajusta la altura de línea para que coincida con las líneas de fondo
    },
    fecha: {
        fontSize: 18,
        paddingTop: 60,
        paddingBottom: 5,
        color: "#666",
        textAlign: "center",
        marginVertical: 10,
        fontWeight: "bold",
    },
    iconoAdd: {
        width: 25, // Ajusta el tamaño del icono para que sea similar
        height: 25,
        position: "absolute",
        top: 30, // Ubica el botón en la parte superior derecha
        right: 20, // Margen hacia la derecha
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 20,
        elevation: 50, // Sombra en Android
    },
});

export default PaginaDiarioNueva;

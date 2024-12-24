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
import { DailyContext } from "../../Contexts/DailyContext";
import { useTheme } from "../../Contexts/ThemeContext";

// ICONOS
const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
//const linea = require("../../../assets/Imag/Wallpaper/lineas.png");
const circleFill = require("../../../assets/IconosTexto/circleFill.png");

const NewDailyPage = (props) => {
    const { isDarkMode } = useTheme();
    const [text, setText] = useState("");
    const { agregarEntrada } = useContext(DailyContext);
    const [fecha] = useState(new Date());

    // Resto del código del componente...

    const formattedDate = `${fecha.getDate().toString().padStart(2, "0")}.${(
        fecha.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}.${fecha.getFullYear()}`;
    const formattedTime = `${fecha
        .getHours()
        .toString()
        .padStart(2, "0")}:${fecha.getMinutes().toString().padStart(2, "0")}`;


    const saveEntry = async () => {
        if (text.trim() === "") {
            props.navigation.goBack();
            return;
        }

        const nuevaPagina = {
            date: new Date().toISOString(),
            content: text,
        };
        console.log("Datos enviados al servidor:", nuevaPagina);
        try {
            const response = await fetch("http://localhost:8080/api/diary", {
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
                        { color: isDarkMode ? "white" : "black" },
                    ]}>{formattedDate}</Text>

                    {/* Campo de texto */}
                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                backgroundColor: isDarkMode ? "#2C2C2E" : "white",
                                color: isDarkMode ? "white" : "black",
                            },
                        ]}
                        multiline={true}
                        placeholder="Escribe tu entrada aquí..."
                        placeholderTextColor="#888"
                        onChangeText={(text) => {
                            console.log("Texto actualizado:", text);
                            setText(text);
                        }}
                        value={text}
                    />


                    {/* Botón Circle Fill para guardar */}
                    <TouchableOpacity style={styles.iconoAdd} onPress={saveEntry}>
                        <Image
                            source={circleFill}
                            style={[
                                styles.iconoAdd,
                                { tintColor: isDarkMode ? "black" : "white" },
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
        //backgroundColor: "transparent", 

        borderRadius: 10,
        color: "#333",
        textAlignVertical: "top",
        marginTop: 5,
        padding: 20,
        lineHeight: 24,
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
        width: 25,
        height: 25,
        position: "absolute",
        top: 35,
        right: 20,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 20,
        elevation: 50,
    },
});

export default NewDailyPage;

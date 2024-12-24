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
import { DailyContext } from "../../Contexts/DailyContext";

// Wallpapers e Iconos
const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const flecha = require("../../../assets/IconosTexto/flecha.png");
const pencil = require("../../../assets/IconosTexto/pencil2.png");
const saveIcon = require("../../../assets/IconosTexto/save.png");

const DetailsDailyPage = (props) => {
    const { isDarkMode } = useTheme();
    const { actualizarEntrada } = useContext(DailyContext);
    const { entrada } = props.route.params;

    const [text, setText] = useState(entrada.content || "");
    const [editMode, setEditMode] = useState(false);

    const saveEntry = () => {
        const nuevaEntrada = {
            ...entrada,
            content: text,
        };
        actualizarEntrada(nuevaEntrada);
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
                        {/* Botón de volver */}
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

                            <TouchableOpacity
                                style={styles.iconoEdit}
                                onPress={() => {
                                    if (editMode) {
                                        saveEntry();
                                    } else {
                                        setEditMode(true);
                                    }
                                }}
                            >
                                <Image
                                    source={editMode ? saveIcon : pencil}
                                    style={[
                                        styles.iconoEdit,
                                        {
                                            tintColor: isDarkMode ? "white" : "black",
                                            width: editMode ? 25 : 30,
                                            height: 30,
                                        },
                                    ]}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Fecha de la entrada */}
                        <Text
                            style={[
                                styles.fecha,
                                { color: isDarkMode ? "white" : "black" },
                            ]}
                        >
                            {entrada.date
                                ? `${entrada.date.split("T")[0].split("-").reverse().join(".")}`
                                : "Sin fecha"}
                        </Text>

                        {/* Tarjeta de texto */}
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
        justifyContent: "center",
        resizeMode: "cover",
    },
    card: {
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
        fontWeight: "bold",// Asegura que esté por encima del contenido
    },
    texto: {
        fontSize: 16,
        paddingTop: 5,
        color: "#333",
    },
    textInput: {
        width: "100%",
        fontSize: 16,
        backgroundColor: "transparent",
        color: "#333",
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

export default DetailsDailyPage;

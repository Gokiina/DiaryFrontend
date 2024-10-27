import React, { useState, useContext } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    Modal,
} from "react-native";
import { Title, Switch } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as LocalAuthentication from "expo-local-authentication";

//  CONTEXTS
import { useTheme } from "../Contexts/ThemeContext"; // Importamos el hook del tema
import { SettingsContext } from "../Contexts/SettingsContext";

import Separador from "../Elements/Separador";

// Wallpaper
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// ICONOS DE TEXTO
const flecha = require("../../assets/IconosTexto/flecha.png");
const mind = require("../../assets/IconosTexto/mind.png");

const Base = (props) => {
    const { isDarkMode, toggleTheme } = useTheme(); // Usamos el contexto para manejar el tema

    const [darkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);
    const [showPicker, setShowPicker] = useState(false);
    const {
        faceIdEnabled,
        setFaceIdEnabled,
        record,
        setRecord,
        time,
        setTime,
    } = useContext(SettingsContext);

    const authenticateWithFaceID = async () => {
        const isBiometricAvailable =
            await LocalAuthentication.hasHardwareAsync();
        if (!isBiometricAvailable) {
            alert(
                "Error. Este dispositivo no soporta autenticación biométrica."
            );
            return;
        }

        const supportedTypes =
            await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
            !supportedTypes.includes(
                LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
            )
        ) {
            alert("Error. Este dispositivo no soporta Face ID.");
            return;
        }

        const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isBiometricEnrolled) {
            alert(
                "Error. No hay datos biométricos guardados en este dispositivo."
            );
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Autenticación requerida",
            cancelLabel: "Cancelar",
            fallbackLabel: "Usar contraseña",
        });

        if (result.success) {
            setFaceIdEnabled(true); // Activa Face ID si la autenticación es exitosa
            alert("Autenticación con Face ID exitosa.");
        } else {
            setFaceIdEnabled(false); // Desactiva Face ID si falla
            alert("Error, autenticación fallida.");
        }
    };

    // Función para manejar el cambio en el switch de Face ID
    const FaceIDSwitch = (value) => {
        if (value) {
            authenticateWithFaceID();
        } else {
            setFaceIdEnabled(false); // Desactivar Face ID
        }
    };

    // Función para manejar el toggle del Dark Mode
    const DarkModeSwitch = (value) => {
        setDarkModeEnabled(value);
        toggleTheme();
    };
    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowPicker(Platform.OS === "ios"); // Para iOS
        setTime(currentTime);
    };

    // Función para mostrar la hora en formato 12 horas con AM/PM
    const formatTime = (time) => {
        let hours = time.getHours();
        const minutes = time.getMinutes();
        const suffix = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12; // Convierte la hora a formato 12 horas
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${formattedMinutes} ${suffix}`;
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            >
                <View style={styles.lineaVolver}>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Start")}
                    >
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
                </View>

                {/* Título Ajustes */}
                <View style={styles.lineaTitulo}>
                <Image
                                source={mind}
                                style={[styles.iconoTitulo, { tintColor: isDarkMode ? "white" : "black" }]} />
                            <Text style={[
                            styles.titulo,
                            {
                                color: isDarkMode ? "#FFFFFF" : "#000",
                            },
                        ]}> ESTADO</Text>
                            </View>

                <View style={[
                        styles.card,
                        {
                            backgroundColor: isDarkMode
                                ? "#2C2C2E"
                                : "rgba(255, 255, 255, 0.9)",
                        },
                    ]}>
                    
                    {/* Opción de Modo Nocturno */}
                    <View style={styles.fila}>
                        <Text
                            style={{
                                color: isDarkMode ? "#FFFFFF" : "#333",
                                fontSize: 18,
                            }}
                        >
                            Modo nocturno
                        </Text>
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={DarkModeSwitch}
                            color={"#30D158"}
                        />
                    </View>
                    
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
        alignItems: "center",
        resizeMode: "cover",
        justifyContent: "center",
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 80,
        marginBottom: 20,
        color: "#000",
    },
    lineaTitulo: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 10,
        padding: 10,
    },
    iconoTitulo: {
        width: 18,
        height: 16,
        marginTop: 80,
        marginBottom: 20,
    },
    
    card: {
        borderRadius: 10,
        paddingHorizontal: 15,
        width: "92%",
        position: "absolute",
        bottom: 50,
    },
    fila: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },

    recordatorioContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    timeButton: {
        backgroundColor: "rgba(120, 120, 128, 0.12)",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 7,
        alignItems: "center",
        marginRight: 20,
    },
    timeText: {
        fontSize: 17,
        color: "#007AFF",
    },

    iconoTexto: {
        width: 18,
        height: 16,
    },
    
    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
    },
    pickerContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
    },
});

// Exportamos solo Ajustes
export default Base;

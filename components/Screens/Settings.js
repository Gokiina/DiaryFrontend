import React, { useState, useContext, useEffect } from "react";
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
import * as Notifications from "expo-notifications";

// CONTEXTS
import { useTheme } from "../Contexts/ThemeContext";
import { SettingsContext } from "../Contexts/SettingsContext";

import Separator from "../Elements/Separator";

// Wallpaper
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// ICONOS DE TEXTO
const flecha = require("../../assets/IconosTexto/flecha.png");

const Settings = (props) => {
    const { isDarkMode, toggleTheme } = useTheme();
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

    // MODO NOCHE
    const DarkModeSwitch = (value) => {
        setDarkModeEnabled(value);
        toggleTheme();
    };

    // RECORDATORIO
    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setTime(currentTime);

        if (record) {
            scheduleNotification(currentTime);
        }

        setShowPicker(false);
    };

    const toggleReminder = (value) => {
        setRecord(value);

        if (value && !showPicker) {
            setShowPicker(true);
        } else if (!value) {
            console.log("Recordatorio desactivado.");
        }
    };

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
                alert("Se requieren permisos para mostrar notificaciones.");
            }
        };
        requestPermissions();
    }, []);

    const formatTime = (time) => {
        let hours = time.getHours();
        const minutes = time.getMinutes();
        const suffix = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${formattedMinutes} ${suffix}`;
    };

    const scheduleNotification = async (time) => {
        const now = new Date();
        const triggerTime = new Date(time);

        if (
            triggerTime.getHours() < now.getHours() ||
            (triggerTime.getHours() === now.getHours() &&
                triggerTime.getMinutes() <= now.getMinutes())
        ) {
            triggerTime.setDate(triggerTime.getDate() + 1);
        }

        console.log("Programando notificación para:", triggerTime);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hora de relax 🧘🏻",
                body: "¿Qué tal si escribes sobre tu día?",
                sound: true,
            },
            trigger: triggerTime,
        });

        alert(
            `Notificación programada para las ${triggerTime.toLocaleTimeString(
                "es-ES",
                { hour: "2-digit", minute: "2-digit" }
            )}`
        );
    };





    // FACE ID
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
            setFaceIdEnabled(true);
            alert("Autenticación con Face ID exitosa.");
        } else {
            setFaceIdEnabled(false);
            alert("Error, autenticación fallida.");
        }
    };

    const FaceIDSwitch = (value) => {
        if (value) {
            authenticateWithFaceID();
        } else {
            setFaceIdEnabled(false);
        }
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
                                color: isDarkMode ? "white" : "#007AFF",
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

                <Title
                    style={[
                        styles.titulo,
                        {
                            color: isDarkMode ? "#FFFFFF" : "#000",
                        },
                    ]}
                >
                    Ajustes
                </Title>

                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: isDarkMode
                                ? "#2C2C2E"
                                : "rgba(255, 255, 255, 0.9)",
                        },
                    ]}
                >
                    <View style={styles.fila}>
                        <Text
                            style={{
                                color: isDarkMode ? "#FFFFFF" : "#333",
                                fontSize: 18,
                            }}
                        >
                            Recordatorio
                        </Text>

                        <View style={styles.recordatorioContainer}>
                            <TouchableOpacity
                                onPress={() => setShowPicker(true)}
                                style={styles.timeButton}
                            >
                                <Text style={styles.timeText}>
                                    {formatTime(time)}
                                </Text>
                            </TouchableOpacity>

                            <Switch
                                value={record}
                                onValueChange={toggleReminder}
                                color={"#30D158"}
                            />

                            <Modal
                                transparent={true}
                                visible={showPicker}
                                animationType="fade"
                                onRequestClose={() => setShowPicker(false)}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.pickerContainer}>
                                        <DateTimePicker
                                            value={time}
                                            mode="time"
                                            display={Platform.OS === "ios" ? "spinner" : "default"}
                                            themeVariant="light"
                                            onChange={onTimeChange}
                                        />
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => setShowPicker(false)}
                                        >
                                            <Text
                                                style={styles.closeButtonText}
                                            >
                                                Cerrar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View>
                    <Separator />

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
                    <Separator />

                    <View style={styles.fila}>
                        <Text
                            style={{
                                color: isDarkMode ? "#FFFFFF" : "#333",
                                fontSize: 18,
                            }}
                        >
                            Face ID
                        </Text>
                        <Switch
                            value={faceIdEnabled}
                            onValueChange={FaceIDSwitch}
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
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 80,
        marginBottom: 20,
        position: "absolute",
        top: 10,
        left: 10,
        padding: 10,
    },
    card: {
        borderRadius: 10,
        paddingHorizontal: 15,
        width: "92%",
        position: "absolute",
        top: 150,
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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

export default Settings;

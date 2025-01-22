import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    Modal,
    Alert,
} from "react-native";
import { Title, Switch } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as LocalAuthentication from "expo-local-authentication";
import * as Notifications from 'expo-notifications';
import { useTheme } from "../Contexts/ThemeContext";
import { SettingsContext } from "../Contexts/SettingsContext";
import Separator from "../Elements/Separator";

const ASSETS = {
    backgrounds: {
        light: require("../../assets/Imag/Wallpaper/Wallpaper.jpg"),
        dark: require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg"),
    },
    icons: {
        arrow: require("../../assets/IconosTexto/flecha.png"),
    },
};

const NOTIFICATION_CONFIG = {
    title: "Hora de relax 🧘🏻",
    body: "¿Qué tal si escribes sobre tu día?",
    sound: true,
};

const Settings = ({ navigation }) => {
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
    } = React.useContext(SettingsContext);

    const themeStyles = useMemo(() => ({
        text: {
            color: isDarkMode ? "#FFFFFF" : "#333",
            fontSize: 18,
        },
        card: {
            backgroundColor: isDarkMode ? "#2C2C2E" : "rgba(255, 255, 255, 0.9)",
        },
        title: {
            color: isDarkMode ? "#FFFFFF" : "#000",
        },
        icon: {
            tintColor: isDarkMode ? "white" : "#007AFF",
        },
        backButton: {
            color: isDarkMode ? "white" : "#007AFF",
            fontSize: 18,
        },
    }), [isDarkMode]);

    useEffect(() => {
        const initializeNotifications = async () => {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                }),
            });

            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permiso requerido", "Se requieren permisos para mostrar notificaciones.");
            }
        };

        initializeNotifications();
    }, []);

    const formatTime = useCallback((time) => {
        const hours = time.getHours() % 12 || 12;
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const suffix = time.getHours() >= 12 ? "PM" : "AM";
        return `${hours}:${minutes} ${suffix}`;
    }, []);
    const handleTimeButtonPress = useCallback(() => {
        setShowPicker(true);
    }, []);
    const scheduleNotification = useCallback(async (time) => {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();

            const triggerDate = new Date();
            triggerDate.setHours(time.getHours());
            triggerDate.setMinutes(time.getMinutes());
            triggerDate.setSeconds(0);
            triggerDate.setMilliseconds(0);
            const now = new Date();
            if (triggerDate <= now) {
                triggerDate.setDate(triggerDate.getDate() + 1);
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    ...NOTIFICATION_CONFIG,
                    title: `${NOTIFICATION_CONFIG.title}`,
                },
                trigger: triggerDate,
            });

            console.log('Current time:', now.toString());
            console.log('Notification scheduled for:', triggerDate.toString());

            
        } catch (error) {
            console.error('Error scheduling notification:', error);
            Alert.alert("Error", "No se pudo programar la notificación");
        }
    }, []);

    const handleTimeChange = useCallback(
        (event, selectedTime) => {
            const currentTime = selectedTime || time;
            setTime(currentTime);
            setShowPicker(false);
        },
        [time, setTime]
    );

    const handleReminderToggle = useCallback(
        (value) => {
            if (value) {
                setRecord(true);
                scheduleNotification(time);
                Alert.alert(
                    "Recordatorio activado",
                    `El recordatorio se ha activado a las ${formatTime(time)}`
                );
            } else {
                setRecord(false);
                Notifications.cancelAllScheduledNotificationsAsync();
                Alert.alert("Recordatorio desactivado", "Las notificaciones han sido canceladas");
            }
        },
        [setRecord, time, scheduleNotification, formatTime]
    );

    const handleDarkModeToggle = useCallback((value) => {
        setDarkModeEnabled(value);
        toggleTheme();
    }, [toggleTheme]);

    const handleFaceID = useCallback(async (value) => {
        if (!value) {
            setFaceIdEnabled(false);
            return;
        }

        try {
            const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
            const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
            const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!isBiometricAvailable) {
                throw new Error("Este dispositivo no soporta autenticación biométrica.");
            }

            if (!supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                throw new Error("Este dispositivo no soporta Face ID.");
            }

            if (!isBiometricEnrolled) {
                throw new Error("No hay datos biométricos guardados en este dispositivo.");
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Autenticación requerida",
                cancelLabel: "Cancelar",
                fallbackLabel: "Usar contraseña",
            });

            if (result.success) {
                setFaceIdEnabled(true);
                Alert.alert("Éxito", "Autenticación con Face ID exitosa.");
            } else {
                throw new Error("Autenticación fallida.");
            }
        } catch (error) {
            setFaceIdEnabled(false);
            Alert.alert("Error", error.message);
        }
    }, [setFaceIdEnabled]);

    const SettingRow = useCallback(({ label, value, onValueChange, rightComponent }) => (
        <>
            <View style={styles.fila}>
                <Text style={themeStyles.text}>{label}</Text>
                {rightComponent || (
                    <Switch
                        value={value}
                        onValueChange={onValueChange}
                        color="#30D158"
                    />
                )}
            </View>
            <Separator />
        </>
    ), [themeStyles]);

    const TimePicker = useCallback(() => (
        <Modal
            transparent
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
                        onChange={handleTimeChange}
                        is24Hour={false}
                        locale="en-US"
                    />
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowPicker(false)}
                    >
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    ), [showPicker, time, handleTimeChange]);


    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light}
                style={styles.backGround}
            >
                <View style={styles.lineaVolver}>
                    <TouchableOpacity onPress={() => navigation.navigate("Start")}>
                        <Text style={themeStyles.backButton}>
                            <Image
                                source={ASSETS.icons.arrow}
                                style={[styles.iconoTexto, themeStyles.icon]}
                            />
                            Volver
                        </Text>
                    </TouchableOpacity>
                </View>

                <Title style={[styles.titulo, themeStyles.title]}>
                    Ajustes
                </Title>

                <View style={[styles.card, themeStyles.card]}>
                    <SettingRow
                        label="Recordatorio diario"
                        value={record}
                        onValueChange={handleReminderToggle}
                        rightComponent={
                            <View style={styles.recordatorioContainer}>
                                <TouchableOpacity
                                    onPress={handleTimeButtonPress}
                                    style={styles.timeButton}
                                >
                                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                                </TouchableOpacity>
                                <Switch
                                    value={record}
                                    onValueChange={handleReminderToggle}
                                    color="#30D158"
                                />
                            </View>
                        }
                    />



                    <SettingRow
                        label="Modo nocturno"
                        value={darkModeEnabled}
                        onValueChange={handleDarkModeToggle}
                    />
                    <SettingRow
                        label="Face ID"
                        value={faceIdEnabled}
                        onValueChange={handleFaceID}
                    />
                </View>
                <TimePicker />
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
    closeButton: {
        marginTop: 10,
        padding: 10,
    },
    closeButtonText: {
        color: "#007AFF",
        fontSize: 16,
    },
});

export default Settings;
import React, { useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Switch,
    Platform,
    ImageBackground,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RemindersContext } from "../../Contexts/RemindersContext";
import { useTheme } from "../../Contexts/ThemeContext";

// Wallpapers e Iconos
const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const flecha = require("../../../assets/IconosTexto/flecha.png");
const saveIcon = require("../../../assets/IconosTexto/save.png");

const ReminderForm = ({ reminderToEdit, navigation }) => {
    const { addReminder, updateReminder } = useContext(RemindersContext);
    const { isDarkMode } = useTheme();

    const [formData, setFormData] = useState({
        id: reminderToEdit?.id || "",
        title: reminderToEdit?.title || "",
        notes: reminderToEdit?.textReminder || "",
        url: reminderToEdit?.url || "",
        date: reminderToEdit?.date || null,
        time: reminderToEdit?.time || null,
        flagged: reminderToEdit?.flagged || false,
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (reminderToEdit) {
            updateReminder(formData);
        } else {
            addReminder(formData);
        }
        navigation.goBack();
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleChange("date", selectedDate);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            handleChange("time", selectedTime);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground
                    source={isDarkMode ? backGroundBlack : backGround}
                    style={styles.background}
                >
                    <View style={styles.headerRow}>

                        <TouchableOpacity onPress={() => navigation.navigate("RemindersList")}>
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
                        <TouchableOpacity onPress={handleSave}>
                        <Text
                                style={{
                                    color: isDarkMode ? "#FFFFFF" : "#007AFF",
                                    fontSize: 18,
                                }}
                            >
                                Hecho
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={[
                            styles.titulo,
                            { color: isDarkMode ? "#FFFFFF" : "#000" },
                        ]}
                    >
                        {" "}
                        Detalles
                    </Text>
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: isDarkMode
                                    ? "rgba(155, 160, 180, 0.90)"
                                    : "rgba(255, 255, 255, 0.9)",
                            },
                        ]}
                    >
                        <TextInput
                            style={[styles.textInput, { color: isDarkMode ? "white" : "black" }]}
                            placeholder="Título"
                            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                            value={formData.title}
                            onChangeText={(value) => handleChange("title", value)}
                        />

                        <TextInput
                            style={[styles.textArea, { color: isDarkMode ? "white" : "black" }]}
                            placeholder="Notas"
                            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                            value={formData.notes}
                            onChangeText={(value) => handleChange("notes", value)}
                            multiline
                        />

                        <TextInput
                            style={[styles.textInput, { color: isDarkMode ? "white" : "black" }]}
                            placeholder="URL (opcional)"
                            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                            value={formData.url}
                            onChangeText={(value) => handleChange("url", value)}
                        />

                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.selectorText}>
                                {formData.date ? formData.date.toLocaleDateString() : "Seleccionar Fecha"}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.date || new Date()}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={styles.selectorText}>
                                {formData.time ? formData.time.toLocaleTimeString() : "Seleccionar Hora"}
                            </Text>
                        </TouchableOpacity>

                        {showTimePicker && (
                            <DateTimePicker
                                value={formData.time || new Date()}
                                mode="time"
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )}

                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Señalar</Text>
                            <Switch
                                value={formData.flagged}
                                onValueChange={(value) => handleChange("flagged", value)}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        resizeMode: "cover",
    }, titulo: {
        fontSize: 15,
        fontWeight: "bold",
        marginTop: 80,
        marginBottom: 20,
        color: "#000", top: -150,
    },
    lineaTitulo: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: 10,
        padding: 10,
    },
    headerRow: {
        position: "absolute",
        top: 60,
        left: 10,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    icon: {
        width: 25,
        height: 25,
    }, iconoTexto: {
        width: 18,
        height: 16,
    },
    card: {
        borderRadius: 10,
        width: "93%",
        paddingHorizontal: 10,
        paddingVertical: 20,        top: -130,
    },
    textInput: {
        fontSize: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    textArea: {
        fontSize: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        height: 100,
        textAlignVertical: "top",
        marginBottom: 15,
    },
    selectorButton: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: "#E4E4E4",
        marginBottom: 15,
        alignItems: "center",
    },
    selectorText: {
        fontSize: 16,
        color: "#555",
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    switchLabel: {
        fontSize: 16,
        color: "#333",
    },
});

export default ReminderForm;

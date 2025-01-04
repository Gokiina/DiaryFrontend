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
    Linking,
    ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../Contexts/ThemeContext";

const URL_REMINDERS = "http://localhost:8080/api/reminders";

// Importar imágenes
const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const flecha = require("../../../assets/IconosTexto/flecha.png");
const bandera = require("../../../assets/Imag/Apple/Bandera.png");
const calendario = require("../../../assets/Imag/Apple/Calendario.png");
const reloj = require("../../../assets/Imag/Apple/Reloj.png");
const ReminderForm = ({ navigation, route }) => {
    const { isDarkMode } = useTheme();
    const reminderToEdit = route.params?.reminder;

    const [formData, setFormData] = useState({
        id: reminderToEdit?.id || null,
        title: reminderToEdit?.title || "",
        notes: reminderToEdit?.notes || "",
        url: reminderToEdit?.url || "",
        date: reminderToEdit?.date
            ? `${new Date(reminderToEdit.date)
                  .getDate()
                  .toString()
                  .padStart(2, "0")}/${(
                  new Date(reminderToEdit.date).getMonth() + 1
              )
                  .toString()
                  .padStart(2, "0")}/${new Date(
                  reminderToEdit.date
              ).getFullYear()}`
            : null,
        time: reminderToEdit?.time || null,
        flagged: reminderToEdit?.flagged || false,
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleSave = async () => {
        try {
            // Convertir la fecha a formato YYYY-MM-DD
            const [day, month, year] = formData.date.split("/");
            const isoDate = `${year}-${month}-${day}`;

            const reminderData = {
                ...formData,
                date: isoDate, // Asegúrate de que el backend espera este formato
                time: formData.time || null,
            };

            const method = reminderToEdit ? "PUT" : "POST";
            const url = reminderToEdit
                ? `${URL_REMINDERS}/${reminderToEdit.id}`
                : URL_REMINDERS;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reminderData),
            });

            if (!response.ok) {
                throw new Error("Error al guardar el recordatorio");
            }

            navigation.goBack();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleUrlPress = async () => {
        if (formData.url) {
            const url = formData.url.startsWith("http")
                ? formData.url
                : `https://${formData.url}`;
            try {
                await Linking.openURL(url);
            } catch (error) {
                console.error("Error opening URL:", error);
            }
        }
    };
    const handleDatePress = () => {
        if (Platform.OS === "ios") {
            setShowDatePicker(true);
        } else {
            setShowDatePicker(true);
        }
    };

    const handleTimePress = () => {
        if (Platform.OS === "ios") {
            setShowTimePicker(true);
        } else {
            setShowTimePicker(true);
        }
    };
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = `${selectedDate
                .getDate()
                .toString()
                .padStart(2, "0")}/${(selectedDate.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${selectedDate.getFullYear()}`;
            setFormData((prev) => ({ ...prev, date: formattedDate }));
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const formattedTime = `${selectedTime
                .getHours()
                .toString()
                .padStart(2, "0")}:${selectedTime
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
            setFormData((prev) => ({ ...prev, time: formattedTime }));
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Image
                            source={flecha}
                            style={[
                                styles.iconoTexto,
                                { tintColor: isDarkMode ? "white" : "#007AFF" },
                            ]}
                        />
                        <Text
                            style={[
                                styles.cancelButton,
                                { color: isDarkMode ? "white" : "#007AFF" },
                            ]}
                        >
                            Volver
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: isDarkMode ? "white" : "#000" },
                        ]}
                    >
                        Detalles
                    </Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text
                            style={[
                                styles.doneButton,
                                { color: isDarkMode ? "white" : "#007AFF" },
                            ]}
                        >
                            Hecho
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
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
                            style={[
                                styles.titleInput,
                                { color: isDarkMode ? "white" : "#000" },
                            ]}
                            value={formData.title}
                            onChangeText={(text) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    title: text,
                                }))
                            }
                            placeholder="Tomar 2l de agua"
                            placeholderTextColor={
                                isDarkMode
                                    ? "#rgba(255, 255, 255, 0.6)"
                                    : "#999"
                            }
                        />
                        <View style={styles.separator} />

                        <TextInput
                            style={[
                                styles.notesInput,
                                { color: isDarkMode ? "white" : "#000" },
                            ]}
                            value={formData.notes}
                            onChangeText={(text) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    notes: text,
                                }))
                            }
                            placeholder="Notas"
                            placeholderTextColor={
                                isDarkMode
                                    ? "#rgba(255, 255, 255, 0.6)"
                                    : "#999"
                            }
                            multiline
                        />
                        <View style={styles.separator} />

                        <TouchableOpacity onPress={handleUrlPress}>
                            <TextInput
                                style={[
                                    styles.urlInput,
                                    {
                                        color: isDarkMode
                                            ? "#64B5F6"
                                            : "#007AFF",
                                    },
                                ]}
                                value={formData.url}
                                onChangeText={(text) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        url: text,
                                    }))
                                }
                                placeholder="URL"
                                placeholderTextColor={
                                    isDarkMode
                                        ? "#rgba(255, 255, 255, 0.6)"
                                        : "#999"
                                }
                            />
                        </TouchableOpacity>
                    </View>

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
                        <TouchableOpacity
                            style={styles.optionRow}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <View style={styles.optionLeft}>
                                <Image
                                    source={calendario}
                                    style={styles.optionIcon}
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            color: isDarkMode
                                                ? "white"
                                                : "#000",
                                        },
                                    ]}
                                >
                                    Fecha
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.optionValue,
                                    {
                                        color: isDarkMode
                                            ? "#64B5F6"
                                            : "#007AFF",
                                    },
                                ]}
                            >
                                {formData.date || "Sin fecha"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity
                            style={styles.optionRow}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <View style={styles.optionLeft}>
                                <Image
                                    source={reloj}
                                    style={styles.optionIcon}
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            color: isDarkMode
                                                ? "white"
                                                : "#000",
                                        },
                                    ]}
                                >
                                    Hora
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.optionValue,
                                    {
                                        color: isDarkMode
                                            ? "#64B5F6"
                                            : "#007AFF",
                                    },
                                ]}
                            >
                                {formData.time || "Sin hora"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <View style={styles.optionRow}>
                            <View style={styles.optionLeft}>
                                <Image
                                    source={bandera}
                                    style={styles.optionIcon}
                                />
                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            color: isDarkMode
                                                ? "white"
                                                : "#000",
                                        },
                                    ]}
                                >
                                    Señalar
                                </Text>
                            </View>
                            <Switch
                                value={formData.flagged}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        flagged: value,
                                    }))
                                }
                                trackColor={{
                                    false: "#767577",
                                    true: "#34C759",
                                }}
                                ios_backgroundColor="#767577"
                            />
                        </View>
                    </View>
                </ScrollView>

                {showDatePicker && (
                    <View style={styles.datePickerContainer}>
                        <DateTimePicker
                            value={
                                formData.date
                                    ? new Date(
                                          `${formData.date
                                              .split("/")
                                              .reverse()
                                              .join("-")}T00:00:00`
                                      )
                                    : new Date()
                            }
                            mode="date"
                            display="spinner" // Spinner estilo iOS
                            onChange={onDateChange}
                        />
                    </View>
                )}

                {showTimePicker && (
                    <View style={styles.timePickerContainer}>
                        <DateTimePicker
                            value={
                                formData.time
                                    ? new Date(`2000-01-01T${formData.time}`)
                                    : new Date()
                            }
                            mode="time"
                            display="spinner" // Spinner estilo iOS
                            onChange={onTimeChange}
                            is24Hour={true} // Forzar formato 24 horas
                        />
                    </View>
                )}
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
        resizeMode: "cover",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconoTexto: {
        width: 18,
        height: 16,
        marginRight: 5,
    },
    cancelButton: {
        fontSize: 17,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
    },
    doneButton: {
        fontSize: 17,
        fontWeight: "600",
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        borderRadius: 20,
        marginBottom: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    titleInput: {
        fontSize: 17,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    notesInput: {
        fontSize: 17,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 100,
        textAlignVertical: "top",
    },
    urlInput: {
        fontSize: 17,
        paddingHorizontal: 16,
        paddingVertical: 12,
        textDecorationLine: "underline",
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#C6C6C8",
        marginLeft: 16,
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionIcon: {
        width: 40,
        height: 40,
        marginRight: 5,
    },
    optionText: {
        fontSize: 17,
    },
    optionValue: {
        fontSize: 17,
    },
    datePickerContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        //backgroundColor: isDarkMode ? '#000' : '#fff',
        padding: 20,
    },
    datePicker: {
        width: "100%",
    },
});

export default ReminderForm;

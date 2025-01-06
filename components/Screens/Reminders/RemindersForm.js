import React, { useState, useCallback, useMemo } from "react";
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
    Modal,
    Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../Contexts/ThemeContext";

const ASSETS = {
    backGround: require("../../../assets/Imag/Wallpaper/Wallpaper.jpg"),
    backGroundBlack: require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg"),
    flecha: require("../../../assets/IconosTexto/flecha.png"),
    bandera: require("../../../assets/Imag/Apple/Bandera.png"),
    calendario: require("../../../assets/Imag/Apple/Calendario.png"),
    reloj: require("../../../assets/Imag/Apple/Reloj.png"),
};

const Header = ({ isDarkMode, onBack, onSave }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Image
                source={ASSETS.flecha}
                style={[styles.iconoTexto, { tintColor: isDarkMode ? "white" : "#007AFF" }]}
            />
            <Text style={[styles.cancelButton, { color: isDarkMode ? "white" : "#007AFF" }]}>
                Volver
            </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? "white" : "#000" }]}>
            Detalles
        </Text>
        <TouchableOpacity onPress={onSave}>
            <Text style={[styles.doneButton, { color: isDarkMode ? "white" : "#007AFF" }]}>
                Hecho
            </Text>
        </TouchableOpacity>
    </View>
);

const CustomModal = ({ visible, onClose, onConfirm, children }) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={onClose}
        >
            <View style={styles.pickerModal}>
                <View style={styles.pickerHeader}>
                    <TouchableOpacity style={styles.pickerButton} onPress={onClose}>
                        <Text style={styles.pickerButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pickerButton} onPress={onConfirm}>
                        <Text style={styles.pickerButtonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pickerContent}>
                    {children}
                </View>
            </View>
        </TouchableOpacity>
    </Modal>
);

const ReminderForm = ({ navigation, route }) => {
    const { isDarkMode } = useTheme();
    const reminderToEdit = route.params?.reminder;

    const [formData, setFormData] = useState({
        id: reminderToEdit?.id || null,
        title: reminderToEdit?.title || "",
        notes: reminderToEdit?.notes || "",
        url: reminderToEdit?.url || "",
        date: reminderToEdit?.date || null,
        time: reminderToEdit?.time || null,
        flagged: reminderToEdit?.flagged || false,
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [tempDate, setTempDate] = useState(
        formData.date ? new Date(formData.date) : new Date()
    );
    const [tempTime, setTempTime] = useState(
        formData.time ? new Date(`2000-01-01T${formData.time}`) : new Date()
    );

    const URL_REMINDERS = useMemo(() => 
        formData.id
            ? `http://localhost:8080/api/reminders/${formData.id}`
            : "http://localhost:8080/api/reminders",
        [formData.id]
    );

    const formatDisplayDate = useCallback((dateString) => {
        if (!dateString) return "Sin fecha";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) throw new Error("Invalid date");
            return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Fecha inválida";
        }
    }, []);

    const formatDisplayTime = useCallback((timeString) => {
        if (!timeString) return "Sin hora";
        try {
            const [hours, minutes] = timeString.split(":");
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString("es", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }).toLowerCase();
        } catch (error) {
            return "Sin hora";
        }
    }, []);

    const handleSave = useCallback(async () => {
        if (!formData.title.trim()) {
            setTitleError(true);
            return;
        }

        try {
            const reminderData = {
                ...formData,
                title: formData.title.trim(),
                notes: formData.notes?.trim() || "",
                url: formData.url?.trim() || "",
                completed: false,
            };

            const response = await fetch(URL_REMINDERS, {
                method: formData.id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reminderData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar el recordatorio");
            }

            if (route?.params?.onSave) {
                route.params.onSave();
            }

            navigation.goBack();
        } catch (error) {
            console.error("Error detallado:", error);
            Alert.alert("Error", `No se pudo guardar el recordatorio: ${error.message}`);
        }
    }, [formData, URL_REMINDERS, navigation, route?.params?.onSave]);

    const handleUrlPress = useCallback(async () => {
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
    }, [formData.url]);

    const renderDateTimeControls = () => (
        <>
            <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setShowDatePicker(true)}
            >
                <View style={styles.optionLeft}>
                    <Image source={ASSETS.calendario} style={styles.optionIcon} />
                    <Text style={[styles.optionText, { color: isDarkMode ? "white" : "#000" }]}>
                        Fecha
                    </Text>
                </View>
                <Text style={[styles.optionValue, { color: isDarkMode ? "#64B5F6" : "#007AFF" }]}>
                    {formatDisplayDate(formData.date)}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setShowTimePicker(true)}
            >
                <View style={styles.optionLeft}>
                    <Image source={ASSETS.reloj} style={styles.optionIcon} />
                    <Text style={[styles.optionText, { color: isDarkMode ? "white" : "#000" }]}>
                        Hora
                    </Text>
                </View>
                <Text style={[styles.optionValue, { color: isDarkMode ? "#64B5F6" : "#007AFF" }]}>
                    {formatDisplayTime(formData.time)}
                </Text>
            </TouchableOpacity>
        </>
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? ASSETS.backGroundBlack : ASSETS.backGround}
                style={styles.backGround}
            >
                <Header
                    isDarkMode={isDarkMode}
                    onBack={() => navigation.goBack()}
                    onSave={handleSave}
                />

                <ScrollView style={styles.content}>
                    <View style={[styles.card, {
                        backgroundColor: isDarkMode ? "rgba(155, 160, 180, 0.90)" : "rgba(255, 255, 255, 0.9)",
                    }]}>
                        <TextInput
                            style={[styles.titleInput, { color: isDarkMode ? "white" : "#000" }]}
                            value={formData.title}
                            onChangeText={(text) => {
                                setTitleError(false);
                                setFormData(prev => ({ ...prev, title: text }));
                            }}
                            placeholder="Tomar 2l de agua"
                            placeholderTextColor={isDarkMode ? "rgba(255, 255, 255, 0.6)" : "#999"}
                        />
                        {titleError && (
                            <Text style={styles.errorText}>El título es obligatorio</Text>
                        )}

                        <View style={styles.separator} />

                        <TextInput
                            style={[styles.notesInput, { color: isDarkMode ? "white" : "#000" }]}
                            value={formData.notes}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                            placeholder="Notas"
                            placeholderTextColor={isDarkMode ? "rgba(255, 255, 255, 0.6)" : "#999"}
                            multiline
                        />

                        <View style={styles.separator} />

                        <TouchableOpacity onPress={handleUrlPress}>
                            <TextInput
                                style={[styles.urlInput, { color: isDarkMode ? "#64B5F6" : "#007AFF" }]}
                                value={formData.url}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, url: text }))}
                                placeholder="URL"
                                placeholderTextColor={isDarkMode ? "rgba(255, 255, 255, 0.6)" : "#999"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.card, {
                        backgroundColor: isDarkMode ? "rgba(155, 160, 180, 0.90)" : "rgba(255, 255, 255, 0.9)",
                    }]}>
                        {renderDateTimeControls()}

                        <View style={styles.separator} />

                        <View style={styles.optionRow}>
                            <View style={styles.optionLeft}>
                                <Image source={ASSETS.bandera} style={styles.optionIcon} />
                                <Text style={[styles.optionText, { color: isDarkMode ? "white" : "#000" }]}>
                                    Señalar
                                </Text>
                            </View>
                            <Switch
                                value={formData.flagged}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, flagged: value }))}
                                trackColor={{ false: "#767577", true: "#34C759" }}
                                ios_backgroundColor="#767577"
                            />
                        </View>
                    </View>
                </ScrollView>

                <CustomModal
                    visible={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    onConfirm={() => {
                        setFormData(prev => ({ 
                            ...prev, 
                            date: tempDate.toISOString().split('T')[0] 
                        }));
                        setShowDatePicker(false);
                    }}
                >
                    <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(_, selectedDate) => setTempDate(selectedDate || tempDate)}
                        locale="es-ES"
                        textColor="black"
                    />
                </CustomModal>

                <CustomModal
                    visible={showTimePicker}
                    onClose={() => setShowTimePicker(false)}
                    onConfirm={() => {
                        const hours = tempTime.getHours();
                        const minutes = tempTime.getMinutes();
                        setFormData(prev => ({ 
                            ...prev, 
                            time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}` 
                        }));
                        setShowTimePicker(false);
                    }}
                >
                    <DateTimePicker
                        value={tempTime}
                        mode="time"
                        display="spinner"
                        onChange={(_, selectedTime) => setTempTime(selectedTime || tempTime)}
                        is24Hour={false}
                        locale="en-US"
                        textColor="black"
                    />
                </CustomModal>
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
        padding: 16,
        borderRadius: 20,
        marginVertical: 1,
        backgroundColor: "transparent",
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
        padding: 20,
    },
    datePicker: {
        width: "100%",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        marginLeft: 17,
    },
    pickerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e5e5",
    },
    datePickerContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    timePickerContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    titleError: {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        borderRadius: 20,
        padding: 2,
        marginTop: 5,
    },
    pickerButton: {
        padding: 5,
    },
    pickerButtonText: {
        fontSize: 16,
        color: "#007AFF",
    },
    pickerContent: {
        padding: 15,
        color: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    pickerModal: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingBottom: Platform.OS === "ios" ? 20 : 0,
    },
});

export default React.memo(ReminderForm);

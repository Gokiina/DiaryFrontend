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
        textReminder: reminderToEdit?.textReminder || "",
        url: reminderToEdit?.url || "",
    });

    const [editMode, setEditMode] = useState(!!reminderToEdit);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      if (editMode) {
          updateReminder(formData); // Actualizar recordatorio
      } else {
          addReminder(formData); // Agregar nuevo recordatorio
      }
      navigation.goBack(); // Regresar a la lista
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
                        {/* Línea de volver */}
                        <View style={styles.lineaVolver}>
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
                        </View>

                        {/* Formulario */}
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
                            <TextInput
                                style={[
                                    styles.textInput,
                                    { color: isDarkMode ? "white" : "black" },
                                ]}
                                placeholder="Título"
                                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                                value={formData.title}
                                onChangeText={(value) => handleChange("title", value)}
                                editable={editMode}
                            />

                            <TextInput
                                style={[
                                    styles.textArea,
                                    { color: isDarkMode ? "white" : "black" },
                                ]}
                                placeholder="Descripción del recordatorio"
                                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                                multiline
                                value={formData.textReminder}
                                onChangeText={(value) => handleChange("textReminder", value)}
                                editable={editMode}
                            />

                            <TextInput
                                style={[
                                    styles.textInput,
                                    { color: isDarkMode ? "white" : "black" },
                                ]}
                                placeholder="URL (opcional)"
                                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                                value={formData.url}
                                onChangeText={(value) => handleChange("url", value)}
                                editable={editMode}
                            />

                            <TouchableOpacity
                                style={styles.botonGuardar}
                                onPress={() => {
                                    if (editMode) {
                                        handleSave();
                                    } else {
                                        setEditMode(true);
                                    }
                                }}
                            >
                                <Image
                                    source={saveIcon}
                                    style={[
                                        styles.iconoGuardar,
                                        {
                                            tintColor: isDarkMode ? "black" : "white",
                                        },
                                    ]}
                                />
                                <Text style={styles.textoBotonGuardar}>
                                    {editMode ? "Guardar" : "Editar"}
                                </Text>
                            </TouchableOpacity>
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
        resizeMode: "cover",
        justifyContent: "center",
    },
    card: {
        borderRadius: 10,
        width: "93%",
        paddingHorizontal: 10,
        padding: 20,
        marginTop: 70,
    },
    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
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
    botonGuardar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    iconoTexto: {
        width: 18,
        height: 16,
    },
    iconoGuardar: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    textoBotonGuardar: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
    },
});

export default ReminderForm;

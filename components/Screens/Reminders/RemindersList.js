import React, { useContext, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ImageBackground,
} from "react-native";
import { RemindersContext } from "../../Contexts/RemindersContext";
import { useTheme } from "../../Contexts/ThemeContext";
import { Swipeable } from "react-native-gesture-handler";

// Wallpapers y Iconos
const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const flecha = require("../../../assets/IconosTexto/flecha.png");
const trash = require("../../../assets/IconosTexto/trash.png");
const plusIcon = require("../../../assets/IconosTexto/plusCircle2.png");

const ReminderList = ({ navigation }) => {
    const { reminders, deleteReminder } = useContext(RemindersContext);
    const { isDarkMode } = useTheme();

    const renderRightActions = (id) => (
        <TouchableOpacity
            style={styles.botonEliminar}
            onPress={() => deleteReminder(id)}
        >
            <View style={styles.eliminarContainer}>
                <Image source={trash} style={styles.iconoTrash} />
                <Text style={styles.textoEliminar}>Eliminar</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <TouchableOpacity
                style={[
                    styles.entrada,
                    {
                        backgroundColor: isDarkMode
                            ? "rgba(155, 160, 180, 0.90)"
                            : "rgba(255, 255, 255, 0.9)",
                    },
                ]}
                onPress={() =>
                    navigation.navigate("RemindersForm", {
                        reminderToEdit: item,
                    })
                }

            >
                <Text
                    style={[
                        styles.fecha,
                        {
                            color: isDarkMode
                                ? "rgba(255, 255, 255, 0.9)"
                                : "#2C2C2E",
                        },
                    ]}
                >
                    {item.date
                        ? `${item.date.split("T")[0].split("-").reverse().join(".")}`
                        : "Sin fecha"}
                </Text>
                <Text
                    style={[
                        styles.texto,
                        {
                            color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "#2C2C2E",
                        },
                    ]}
                >
                    {item.title}
                </Text>
            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            ><View style={styles.lineaTitulo}>
                    <Text
                        style={[
                            styles.titulo,
                            { color: isDarkMode ? "#FFFFFF" : "#000" },
                        ]}
                    >
                        {" "}
                        Lista de propósitos
                    </Text>
                </View>
                {/* Botón Volver */}
                <View style={styles.lineaVolver}>
                    <TouchableOpacity onPress={() => navigation.navigate("Start")}>
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
                                    { tintColor: isDarkMode ? "white" : "#007AFF" },
                                ]}
                            />
                            Volver
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Botón para agregar un nuevo recordatorio */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("RemindersForm")}
                >
                    <Image
                        source={plusIcon}
                        style={[
                            styles.iconoAdd,
                            { tintColor: isDarkMode ? "black" : "white" },
                        ]}
                    />
                </TouchableOpacity>

                {/* Lista de recordatorios */}
                <View style={styles.card}>
                    <FlatList
                        data={reminders}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />
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
    }, titulo: {
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
    card: {
        borderRadius: 10,
        width: "98%",
        position: "absolute",
        bottom: 50,
        top: 120,
        paddingHorizontal: 10, marginTop: 20,
    },
    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
    },
    entrada: {
        borderRadius: 25,
        padding: 15,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    fecha: {
        fontSize: 16,
        fontWeight: "bold",
    },
    texto: {
        fontSize: 14,
    },
    botonEliminar: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderRadius: 20,
        marginVertical: 5,
    },
    textoEliminar: {
        color: "white",
        fontSize: 14,
    },
    iconoAdd: {
        width: 25,
        height: 25,
        top: -330,
        right: -150,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 20,
        elevation: 50,
    },
    iconoTexto: {
        width: 18,
        height: 16,
    },
    iconoTrash: {
        width: 13,
        height: 17,
        tintColor: "white",
    },
});

export default ReminderList;


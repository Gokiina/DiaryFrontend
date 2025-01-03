import React, { useState, useEffect, useRef, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
} from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useFavorites } from "../Contexts/FavoritesContext";
import { useEmotions } from "../Contexts/EmotionsContext";
import { EmojiRow } from "../Elements/EmojiRow";

import dayjs from "dayjs";
import { Linking } from "react-native";

// Wallpaper
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// ICONOS
const iconNotes = require("../../assets/Imag/Iconos/Notes.png");
const iconSettings = require("../../assets/Imag/Iconos/Settings.png");

const iconList = require("../../assets/Imag/Iconos/List.png");
const iconDaily = require("../../assets/Imag/Iconos/Daily.png");
const iconCalendar = require("../../assets/Imag/Iconos/Calendar.png");

// ICONOS DE TEXTO
const mind = require("../../assets/IconosTexto/mind.png");
const sun = require("../../assets/IconosTexto/sun.png");

const Start = (props) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { favorites } = useFavorites();
    const [favoritePhrase, setFavoritePhrase] = useState(null);
    const API_BASE_URL_PHRASES = "http://localhost:8080/api/phrases";
    const API_BASE_URL_CALENDAR = "http://localhost:8080/api/emotions";
    const favoritesRef = useRef([]);
    const { emotions, fetchEmotions, saveEmotion } = useEmotions();
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    const today = dayjs().format("YYYY-MM-DD");
    const openCalendar = () => {
        Linking.openURL("calshow://");
    };

    useEffect(() => {
        const loadEmotions = async () => {
            await fetchEmotions(); // Obtener emociones del backend
            if (emotions[today]) {
                setSelectedEmoji(emotions[today]); // Establecer emoción del día actual
            }
        };

        loadEmotions();
    }, [emotions, today]); // Solo depende de la fecha actual

    const handleEmojiSelect = async (emoji) => {
        await saveEmotion(today, emoji); // Guardar en el backend
        setSelectedEmoji(emoji); // Actualizar emoción seleccionada
    };

    useEffect(() => {
        const fetchFavoritePhrases = async () => {
            try {
                const response = await fetch(API_BASE_URL_PHRASES);
                const allPhrases = await response.json();

                const favoritePhrases = allPhrases.filter((phrase) =>
                    favorites.includes(phrase.id)
                );

                if (favoritePhrases.length > 0) {
                    const randomPhrase =
                        favoritePhrases[
                            Math.floor(Math.random() * favoritePhrases.length)
                        ].phrase;
                    setFavoritePhrase(randomPhrase);
                } else {
                    setFavoritePhrase(
                        "No puedes controlar el viento, pero sí puedes ajustar las velas."
                    );
                }
            } catch (error) {
                console.error("Error fetching favorite phrases:", error);
                setFavoritePhrase(
                    "No puedes controlar el viento, pero sí puedes ajustar las velas."
                );
            }
        };

        fetchFavoritePhrases();
    }, [favorites]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            >
                <TouchableOpacity
                    style={styles.iconNotes}
                    onPress={() => alert("Botón notas presionado!")}
                >
                    <Image source={iconNotes} style={styles.iconStyle} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconSettings}
                    onPress={() => props.navigation.navigate("Settings")}
                >
                    <Image source={iconSettings} style={styles.iconStyle} />
                </TouchableOpacity>

                <View
                    id="Estado"
                    style={[
                        styles.standEstado,
                        {
                            backgroundColor: isDarkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(0, 0, 0, 0.08)",
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() =>
                            props.navigation.navigate("CalendarEmotions")
                        }
                    >
                        <View style={styles.lineaTitulo}>
                            <Image
                                source={mind}
                                style={[
                                    styles.iconoTexto,
                                    {
                                        tintColor: isDarkMode
                                            ? "white"
                                            : "rgba(27, 31, 38, 0.72)",
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.divisor,
                                    {
                                        color: isDarkMode
                                            ? "white"
                                            : "rgba(27, 31, 38, 0.72)",
                                    },
                                ]}
                            >
                                {" "}
                                |{" "}
                            </Text>
                            <Text
                                style={[
                                    styles.titulo,
                                    {
                                        color: isDarkMode
                                            ? "white"
                                            : "rgba(27, 31, 38, 0.72)",
                                    },
                                ]}
                            >
                                ESTADO
                            </Text>
                        </View>
                        <Text
                            style={[
                                styles.textoEstado,
                                {
                                    color: isDarkMode
                                        ? "white"
                                        : "rgb(153, 153, 153)",
                                },
                            ]}
                        >
                            Recuerda registrar cómo te encuentras hoy
                        </Text>
                    </TouchableOpacity>

                    <EmojiRow
                        selected={selectedEmoji} // Pasamos el emoji seleccionado
                        onSelectEmoji={handleEmojiSelect} // Maneja la selección del emoji
                    />
                </View>

                <TouchableOpacity
                    id="Frase"
                    style={[
                        styles.standFrase,
                        {
                            backgroundColor: isDarkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(0, 0, 0, 0.08)",
                        },
                    ]}
                    onPress={() => props.navigation.navigate("Phrases")}
                >
                    <View style={styles.lineaTitulo}>
                        <Image
                            source={sun}
                            style={[
                                styles.iconoTexto,
                                {
                                    tintColor: isDarkMode
                                        ? "white"
                                        : "rgba(27, 31, 38, 0.72)",
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.divisor,
                                {
                                    color: isDarkMode
                                        ? "white"
                                        : "rgba(27, 31, 38, 0.72)",
                                },
                            ]}
                        >
                            {" "}
                            |{" "}
                        </Text>
                        <Text
                            style={[
                                styles.titulo,
                                {
                                    color: isDarkMode
                                        ? "white"
                                        : "rgba(27, 31, 38, 0.72)",
                                },
                            ]}
                        >
                            FRASE
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.textoFrase,
                            {
                                color: isDarkMode
                                    ? "white"
                                    : "rgb(153, 153, 153)",
                            },
                        ]}
                    >
                        {favoritePhrase
                            ? favoritePhrase
                            : "No puedes controlar el viento, pero sí puedes ajustar las velas."}
                    </Text>
                </TouchableOpacity>

                <View id="dock" style={styles.dock}>
                    <TouchableOpacity
                        onPress={() =>
                            props.navigation.navigate("RemindersList")
                        }
                    >
                        <Image source={iconList} style={styles.iconStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            props.navigation.navigate("DailyEntries")
                        }
                    >
                        <Image source={iconDaily} style={styles.iconStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openCalendar}>
                        <Image source={iconCalendar} style={styles.iconStyle} />
                    </TouchableOpacity>
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
    iconNotes: {
        position: "absolute",
        top: 50,
        left: 10,
        padding: 10,
    },
    iconSettings: {
        position: "absolute",
        top: 50,
        right: 0,
        padding: 10,
        marginRight: 10,
    },
    iconStyle: {
        width: 60,
        height: 60,
    },

    standEstado: {
        borderRadius: 20,
        padding: 18,
        width: "90%",
        position: "absolute",
        top: 150,
    },
    lineaTitulo: {
        flexDirection: "row",
        paddingLeft: 5,
        alignItems: "center",
    },
    titulo: {
        fontSize: 17,
        fontWeight: "bold",
        fontFamily: "SF Pro",
    },
    divisor: {
        fontSize: 16,
        fontFamily: "SF Pro",
    },
    textoEstado: {
        fontSize: 15,
        marginBottom: 20,
        marginTop: 5,
        marginLeft: 5,
        fontFamily: "SF Pro",
    },

    standFrase: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 20,
        width: "90%",
        position: "absolute",
        top: 290,
    },
    textoFrase: {
        fontSize: 15,
        fontFamily: "SF Pro",
        marginLeft: 5,
        marginTop: 5,
    },
    dock: {
        position: "absolute",
        bottom: 40,
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        borderRadius: 40,
    },
    iconoTexto: {
        width: 18,
        height: 16,
    },
});

export default Start;

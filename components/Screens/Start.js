import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
    Linking,
} from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useFavorites } from "../Contexts/FavoritesContext";
import { useEmotions } from "../Contexts/EmotionsContext";
import { EmojiRow } from "../Elements/EmojiRow";
import dayjs from "dayjs";

const ASSETS = {
    backgrounds: {
        light: require("../../assets/Imag/Wallpaper/Wallpaper.jpg"),
        dark: require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg"),
    },
    icons: {
        notes: require("../../assets/Imag/Iconos/Notes.png"),
        settings: require("../../assets/Imag/Iconos/Settings.png"),
        list: require("../../assets/Imag/Iconos/List.png"),
        daily: require("../../assets/Imag/Iconos/Daily.png"),
        calendar: require("../../assets/Imag/Iconos/Calendar.png"),
        mind: require("../../assets/IconosTexto/mind.png"),
        sun: require("../../assets/IconosTexto/sun.png"),
    },
};

const API_URL = "http://localhost:8080/api/phrases";
const DEFAULT_PHRASE = "No puedes controlar el viento, pero sí puedes ajustar las velas.";

const Start = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { favorites } = useFavorites();
    const { emotions, fetchEmotions, saveEmotion } = useEmotions();
    const [favoritePhrase, setFavoritePhrase] = useState(DEFAULT_PHRASE);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    
    const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

    const themeStyles = useMemo(() => ({
        stand: {
            backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.08)",
        },
        text: {
            color: isDarkMode ? "white" : "rgba(27, 31, 38, 0.72)",
        },
        subText: {
            color: isDarkMode ? "white" : "rgba(27, 31, 38, 0.6)",
        },
        icon: {
            tintColor: isDarkMode ? "white" : "rgba(27, 31, 38, 0.72)",
        },
    }), [isDarkMode]);

    const handleNavigation = useCallback((screen) => {
        navigation.navigate(screen);
    }, [navigation]);

    const openCalendar = useCallback(() => {
        Linking.openURL("calshow://");
    }, []);

    const handleEmojiSelect = useCallback(async (emoji) => {
        await saveEmotion(today, emoji);
        setSelectedEmoji(emoji);
    }, [today, saveEmotion]);

    useEffect(() => {
        const loadEmotions = async () => {
            await fetchEmotions();
            if (emotions[today]) {
                setSelectedEmoji(emotions[today]);
            }
        };

        loadEmotions();
    }, [fetchEmotions, emotions, today]);

    useEffect(() => {
        const fetchFavoritePhrases = async () => {
            try {
                const response = await fetch(API_URL);
                const allPhrases = await response.json();
                
                const favoritePhrases = allPhrases.filter(phrase => 
                    favorites.includes(phrase.id)
                );

                if (favoritePhrases.length > 0) {
                    const randomPhrase = favoritePhrases[
                        Math.floor(Math.random() * favoritePhrases.length)
                    ].phrase;
                    setFavoritePhrase(randomPhrase);
                }
            } catch (error) {
                console.error("Error fetching favorite phrases:", error);
                setFavoritePhrase(DEFAULT_PHRASE);
            }
        };

        fetchFavoritePhrases();
    }, [favorites]);

    const HeaderIcon = useCallback(({ style, icon, onPress }) => (
        <TouchableOpacity style={style} onPress={onPress}>
            <Image source={icon} style={styles.iconStyle} />
        </TouchableOpacity>
    ), []);

    const TitleRow = useCallback(({ icon, title }) => (
        <View style={styles.lineaTitulo}>
            <Image source={icon} style={[styles.iconoTexto, themeStyles.icon]} />
            <Text style={[styles.divisor, themeStyles.text]}> | </Text>
            <Text style={[styles.titulo, themeStyles.text]}>{title}</Text>
        </View>
    ), [themeStyles]);

    const DockIcon = useCallback(({ icon, onPress }) => (
        <TouchableOpacity onPress={onPress}>
            <Image source={icon} style={styles.iconStyle} />
        </TouchableOpacity>
    ), []);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light}
                style={styles.backGround}
            >
                <HeaderIcon 
                    style={styles.iconNotes}
                    icon={ASSETS.icons.notes}
                    onPress={() => handleNavigation("QuickNotes")}
                />
                <HeaderIcon
                    style={styles.iconSettings}
                    icon={ASSETS.icons.settings}
                    onPress={() => handleNavigation("Settings")}
                />

                <View style={[styles.standEstado, themeStyles.stand]}>
                    <TouchableOpacity onPress={() => handleNavigation("CalendarEmotions")}>
                        <TitleRow icon={ASSETS.icons.mind} title="ESTADO" />
                        <Text style={[styles.textoEstado, themeStyles.subText]}>
                            Recuerda registrar cómo te encuentras hoy
                        </Text>
                    </TouchableOpacity>

                    <EmojiRow
                        selected={selectedEmoji}
                        onSelectEmoji={handleEmojiSelect}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.standFrase, themeStyles.stand]}
                    onPress={() => handleNavigation("Phrases")}
                >
                    <TitleRow icon={ASSETS.icons.sun} title="FRASE" />
                    <Text style={[styles.textoFrase, themeStyles.subText]}>
                        {favoritePhrase}
                    </Text>
                </TouchableOpacity>

                <View style={styles.dock}>
                    <DockIcon
                        icon={ASSETS.icons.list}
                        onPress={() => handleNavigation("RemindersList")}
                    />
                    <DockIcon
                        icon={ASSETS.icons.daily}
                        onPress={() => handleNavigation("DailyEntries")}
                    />
                    <DockIcon
                        icon={ASSETS.icons.calendar}
                        onPress={openCalendar}
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
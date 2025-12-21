import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
    Linking,
    Platform
} from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useFavorites } from "../Contexts/FavoritesContext";
import { useEmotions } from "../Contexts/EmotionsContext";
import { EmojiRow } from "../Elements/EmojiRow";
import dayjs from "dayjs";

import { AuthContext } from "../Contexts/AuthContext";
import ASSETS from '../Constants/ASSETS';

const API_URL = "https://diarybackend-txxw.onrender.com/api/phrases";
const DEFAULT_PHRASE = "No puedes controlar el viento, pero sí puedes ajustar las velas.";

const Start = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { favorites } = useFavorites();
    const { emotions, fetchEmotions, saveEmotion } = useEmotions();
    const [favoritePhrase, setFavoritePhrase] = useState(DEFAULT_PHRASE);
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    // MODIFICADO: Obtenemos también el userToken
    const { user, userToken, logout } = useContext(AuthContext);

    const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

    const themeStyles = useMemo(() => ({
        stand: {
            backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.85)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
            backdropFilter: 'blur(20px)', // For web support mostly, but good for intent
        },
        text: { color: isDarkMode ? "#FFFFFF" : "#1C1C1E" },
        subText: { color: isDarkMode ? "#EBEBF5" : "#3C3C43" },
        icon: { tintColor: isDarkMode ? "#FFFFFF" : "#1C1C1E" },
    }), [isDarkMode]);

    const handleNavigation = useCallback((screen) => { navigation.navigate(screen); }, [navigation]);
    const openCalendar = useCallback(() => {
        if (Platform.OS === 'ios') {
            Linking.openURL('calshow://');
        } else if (Platform.OS === 'android') {
            Linking.openURL('content://com.android.calendar/time/');
        }
    }, []);
    const handleEmojiSelect = useCallback(async (emoji) => {
        await saveEmotion(today, emoji);
        setSelectedEmoji(emoji);
    }, [today, saveEmotion]);

    useEffect(() => {
        // MODIFICADO: La carga de emociones ahora depende del token
        const loadData = async () => {
            if (userToken) {
                await fetchEmotions();
            }
        };
        loadData();
    }, [userToken, fetchEmotions]);

    useEffect(() => {
        if (emotions[today]) {
            setSelectedEmoji(emotions[today]);
        }
    }, [emotions, today]);


    useEffect(() => {
        const fetchFavoritePhrases = async () => {
            // AÑADIDO: Si no hay token, no hacemos la petición
            if (!userToken) return;

            try {
                // AÑADIDO: Cabecera de autorización
                const response = await fetch(API_URL, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });

                if (response.status === 401 || response.status === 403) {
                     console.log("Token inválido o expirado. Cerrando sesión...");
                     await logout();
                     return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const allPhrases = await response.json();

                const favoritePhrases = allPhrases.filter(phrase =>
                    favorites.includes(phrase.id)
                );

                if (favoritePhrases.length > 0) {
                    const randomPhrase = favoritePhrases[Math.floor(Math.random() * favoritePhrases.length)].phrase;
                    setFavoritePhrase(randomPhrase);
                } else {
                    setFavoritePhrase(DEFAULT_PHRASE);
                }
            } catch (error) {
                console.error("Error fetching favorite phrases:", error);
                setFavoritePhrase(DEFAULT_PHRASE);
            }
        };

        fetchFavoritePhrases();
    }, [userToken, logout]); // Dependencia corregida: favorites eliminado para evitar bucle infinito

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
            <ImageBackground source={isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light} style={styles.backGround}>
                <HeaderIcon style={styles.iconSettings} icon={ASSETS.icons.navigation.settings} onPress={() => handleNavigation("Settings")} />
                <View style={[styles.standEstado, themeStyles.stand]}>
                    <TouchableOpacity onPress={() => handleNavigation("CalendarEmotions")}>
                        <TitleRow icon={ASSETS.icons.general.mind} title="ESTADO" />
                        <Text style={[styles.textoEstado, themeStyles.subText]}>Recuerda registrar cómo te encuentras hoy</Text>
                    </TouchableOpacity>
                    <EmojiRow selected={selectedEmoji} onSelectEmoji={handleEmojiSelect} />
                </View>
                <TouchableOpacity style={[styles.standFrase, themeStyles.stand]} onPress={() => handleNavigation("Phrases")}>
                    <TitleRow icon={ASSETS.icons.general.sun} title="FRASE" />
                    <Text style={[styles.textoFrase, themeStyles.subText]}>{favoritePhrase}</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 100 }}>
                    {user ? (
                        <Text style={{ color: "white", fontSize: 18 }}>Hola {user.name || user.email}</Text>
                    ) : (
                        <Text style={{ color: "white", fontSize: 18 }}>No has iniciado sesión</Text>
                    )}
                </View>
                <View style={styles.dock}>
                    <DockIcon icon={ASSETS.icons.navigation.list} onPress={() => handleNavigation("RemindersList")} />
                    <DockIcon icon={ASSETS.icons.navigation.daily} onPress={() => handleNavigation("DailyEntries")} />
                    <DockIcon icon={ASSETS.icons.navigation.calendar} onPress={openCalendar} />
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backGround: { flex: 1, alignItems: "center", resizeMode: "cover", justifyContent: "center" },
    iconNotes: { position: "absolute", top: 50, left: 10, padding: 10 },
    iconSettings: { position: "absolute", top: 50, right: 0, padding: 10, marginRight: 10 },
    iconStyle: { width: 60, height: 60 },
    standEstado: { borderRadius: 20, padding: 20, width: "90%", position: "absolute", top: 140 },
    lineaTitulo: { flexDirection: "row", paddingLeft: 5, alignItems: "center" },
    titulo: { fontSize: 17, fontWeight: "600" },
    divisor: { fontSize: 16 },
    textoEstado: { fontSize: 15, marginBottom: 15, marginTop: 5, marginLeft: 5 },
    standFrase: { borderRadius: 20, padding: 20, width: "90%", position: "absolute", top: 310 },
    textoFrase: { fontSize: 15, fontFamily: "SF Pro", marginLeft: 5, marginTop: 5 },
    dock: { position: "absolute", bottom: 40, width: "90%", flexDirection: "row", justifyContent: "space-around", alignItems: "center", padding: 15, backgroundColor: "rgba(0, 0, 0, 0.08)", borderRadius: 40 },
    iconoTexto: { width: 18, height: 16 },
});

export default Start;


import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";
import { useTheme } from "../../Contexts/ThemeContext";
import { useFavorites } from "../../Contexts/FavoritesContext";
import { useFocusEffect } from "@react-navigation/native";
// Wallpaper
const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// ICONOS DE TEXTO
const flecha = require("../../../assets/IconosTexto/flecha.png");
const sparkles = require("../../../assets/IconosTexto/sparkles.png");
const star_fill = require("../../../assets/IconosTexto/star_fill.png");
const star = require("../../../assets/IconosTexto/star.png");

const Phrases = (props) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [darkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);
    const { favorites, toggleFavorite, removeFavorite } = useFavorites();
    const [phrases, setPhrases] = useState([]);
    const API_BASE_URL = "http://localhost:8080/api/phrases";

    const fetchAllPhrases = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error("Error al obtener las frases");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al cargar todas las frases desde la base de datos:", error);
            return [];
        }
    };

    useEffect(() => {
        const loadPhrases = async () => {
            const allPhrases = await fetchAllPhrases();
            setPhrases(allPhrases);
        };
        loadPhrases();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const loadPhrases = async () => {
                const allPhrases = await fetchAllPhrases();
                setPhrases(allPhrases);
            };
            loadPhrases();
        }, [])
    );


    const handleToggleFavorite = async (id) => {
        if (removingFavorites.includes(id)) return; 

        setRemovingFavorites((prev) => [...prev, id]);

        try {

            const url = `http://localhost:8080/api/phrases/${id}/favorite`;
            await fetch(url, { method: "POST" });
            toggleFavorite(id);
        } catch (error) {
            console.error("Error al cambiar el estado del favorito:", error);
        }

        setTimeout(() => {
            setRemovingFavorites((prev) => prev.filter((item) => item !== id));
        }, 500);
    };


    const isFavorite = (id) => {
        return favorites.includes(id);
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

                <TouchableOpacity
                    onPress={() =>
                        props.navigation.navigate("PhrasesFavorite", {
                            favorites,
                        })
                    }
                >
                    <Image
                        source={star_fill}
                        style={[
                            styles.iconoFav,
                            { tintColor: isDarkMode ? "white" : "black" },
                        ]}
                    />
                </TouchableOpacity>

                <View style={styles.lineaTitulo}>
                    <Image
                        source={sparkles}
                        style={[
                            styles.iconoTitulo,
                            { tintColor: isDarkMode ? "white" : "black" },
                        ]}
                    />
                    <Text
                        style={[
                            styles.titulo,
                            { color: isDarkMode ? "#FFFFFF" : "#000" },
                        ]}
                    >
                        {" "}
                        FRASES
                    </Text>
                </View>

                <View style={styles.card}>
                    <FlatList
                        data={phrases}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.fraseContainer,
                                    {
                                        backgroundColor: isDarkMode
                                            ? "rgb(163, 169, 184)"
                                            : "white",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.fraseText,
                                        {
                                            color: isDarkMode
                                                ? "white"
                                                : "black",
                                        },
                                    ]}
                                >
                                    {item.phrase}
                                </Text>
                                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                                <Image
                                    source={isFavorite(item.id) ? star_fill : star}
                                    style={[
                                        styles.staroflife,
                                        { tintColor: isDarkMode ? "rgb(78, 88, 100)" : "rgb(158, 158, 158)" },
                                    ]}
                                />
                            </TouchableOpacity>

                            </View>
                        )}
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
    titulo: {
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
    iconoTitulo: {
        width: 18,
        height: 25,
        marginTop: 80,
        marginBottom: 20,
    },
    iconoFav: {
        width: 30,
        height: 30,
        top: -330,
        right: -150,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        elevation: 5, 
    },
    fraseContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 20,
        marginVertical: 5,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        elevation: 5, 
    },
    fraseText: {
        fontSize: 14,
        color: "#333",
        flex: 1, 
    },
    staroflife: {
        width: 20,
        height: 20,
        tintColor: "#FFD700",
        marginLeft: 10,
    },
    fila: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
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
    card: {
        borderRadius: 10,
        width: "100%",
        position: "absolute",
        bottom: 50,
        top: 150,
    },
});

export default Phrases;

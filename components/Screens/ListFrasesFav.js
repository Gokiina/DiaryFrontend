import React, { useState, useEffect } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";
import { useTheme } from "../Contexts/ThemeContext";
import { useFavorites } from "../Contexts/FavoritesContext";
import { useFocusEffect } from "@react-navigation/native";

// Wallpaper
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const flecha = require("../../assets/IconosTexto/flecha.png");
const star_fill = require("../../assets/IconosTexto/star_fill.png");
const star_slash = require("../../assets/IconosTexto/star_slash.png");

const ListFrasesFav = ({ navigation }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [darkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);
    const [phrases, setPhrases] = useState([]);
    const API_BASE_URL = "http://localhost:8080/api/phrases";
    const { favorites, toggleFavorite, removeFavorite } = useFavorites();
    const [removingFavorites, setRemovingFavorites] = useState([]);



    useEffect(() => {
        const fetchFavoritePhrases = async () => {
            try {
                const response = await fetch(API_BASE_URL);
                const allPhrases = await response.json();
                const favoritePhrases = allPhrases.filter((phrase) => favorites.includes(phrase.id));
                setPhrases(favoritePhrases);
            } catch (error) {
                console.error("Error fetching favorite phrases:", error);
            }
        };

        fetchFavoritePhrases();
    }, [favorites]);

    const handleToggleFavorite = async (id) => {
        if (removingFavorites.includes(id)) return;

        setRemovingFavorites((prev) => [...prev, id]);

        try {
            // Actualizar el estado del favorito en la base de datos
            await updateFavoriteStatus(id); // Llamada para actualizar en la base de datos
            toggleFavorite(id); // Cambiar el estado localmente en la app
        } catch (error) {
            console.error("Error al cambiar el estado del favorito:", error);
        }

        setTimeout(() => {
            setRemovingFavorites((prev) => prev.filter((item) => item !== id));
        }, 100);
    };




    useFocusEffect(
        React.useCallback(() => {
            const removeUnfavoritedPhrases = () => {
                phrases.forEach((phrase) => {
                    if (!favorites.includes(phrase.id)) {
                        removeFavorite(phrase.id);
                    }
                });
            };

            removeUnfavoritedPhrases();

            return () => { };
        }, [favorites, phrases])
    );
    const updateFavoriteStatus = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/favorite`, {
                method: 'POST', 
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el estado de favorito');
            }
        } catch (error) {
            console.error('Error al actualizar el estado de favorito en la base de datos:', error);
        }
    };



    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            >
                <View style={styles.lineaVolver}>
                    <TouchableOpacity onPress={() => navigation.navigate("ListFrases")}>
                        <Text style={{ color: isDarkMode ? "#FFFFFF" : "#007AFF", fontSize: 18 }}>
                            <Image source={flecha} style={[styles.iconoTexto, { tintColor: isDarkMode ? "white" : "#007AFF" }]} />
                            Volver
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.lineaTitulo}>
                    <Image source={star_fill} style={[styles.iconoTitulo, { tintColor: isDarkMode ? "white" : "black" }]} />
                    <Text style={[styles.titulo, { color: isDarkMode ? "#FFFFFF" : "#000" }]}> FAVORITAS</Text>
                </View>

                <View style={styles.card}>
                    <FlatList
                        data={phrases}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.fraseContainer}>
                                <Text style={styles.fraseText}>{item.phrase}</Text>
                                <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
                                    <Image
                                        source={favorites.includes(item.id) && !removingFavorites.includes(item.id)
                                            ? star_fill
                                            : star_slash
                                        }
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
        width: 25,
        height: 25,
        marginTop: 80,
        marginBottom: 20,
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
        top: 150,
    },
});

export default ListFrasesFav;

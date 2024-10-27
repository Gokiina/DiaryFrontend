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
import { Switch } from "react-native-paper";
import { useTheme } from "../Contexts/ThemeContext";
import { frasesList } from "../Elements/Frases";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
// Wallpaper
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// ICONOS DE TEXTO
const flecha = require("../../assets/IconosTexto/flecha.png");
const sparkles = require("../../assets/IconosTexto/sparkles.png");
const star_fill = require("../../assets/IconosTexto/star_fill.png");
const star = require("../../assets/IconosTexto/star.png");

const ListFrases = (props) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [darkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);
    const [favorites, setFavorites] = useState([]);

    // Cargar frases favoritas desde AsyncStorage al cargar la app
    useEffect(() => {
        const loadFavorites = async () => {
            const savedFavorites = await AsyncStorage.getItem("favorites");
            if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        };
        loadFavorites();
    }, []);

    // Guardar favoritos en AsyncStorage
    const saveFavorites = async (favorites) => {
        setFavorites(favorites);
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
    };

    // Marcar o desmarcar una frase como favorita
    const toggleFavorite = (item) => {
        if (favorites.includes(item.id)) {
            saveFavorites(favorites.filter((id) => id !== item.id));
        } else {
            saveFavorites([...favorites, item.id]);
        }
    };
    // Usar useFocusEffect para recargar favoritos cada vez que la pantalla de frases vuelve a estar en foco
    useFocusEffect(
        React.useCallback(() => {
            const loadFavorites = async () => {
                const savedFavorites = await AsyncStorage.getItem("favorites");
                if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
            };
            loadFavorites();
        }, [])
    );
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
                        props.navigation.navigate("ListFrasesFav", {
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
                        data={frasesList}
                        keyExtractor={(item) => item.id.toString()}
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
                                    {item.frase}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => toggleFavorite(item)}
                                >
                                    <Image
                                        source={
                                            favorites.includes(item.id)
                                                ? star_fill
                                                : star
                                        }
                                        style={[
                                            styles.staroflife,
                                            {
                                                tintColor: isDarkMode
                                                    ? "rgb(78, 88, 100)"
                                                    : "rgb(158, 158, 158)",
                                            },
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
        elevation: 5, // Sombra en Android
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
        elevation: 5, // Sombra en Android
    },
    fraseText: {
        fontSize: 14,
        color: "#333",
        flex: 1, // Para asegurarse de que el texto ocupe el máximo espacio posible
    },
    staroflife: {
        width: 20,
        height: 20,
        tintColor: "#FFD700", // Color dorado para la estrella
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

export default ListFrases;

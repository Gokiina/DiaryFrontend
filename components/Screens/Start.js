import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
} from "react-native";
import { useTheme } from "../Contexts/ThemeContext"; 
import { useFavorites } from "../Contexts/FavoritesContext"; // Importar el contexto de favoritos// Importar la lista de frases
import AsyncStorage from '@react-native-async-storage/async-storage'; // Si es necesario para guardar las favoritas
import { EmojiRow } from "../Elements/EmojiRow";
import { useEmotions } from "../Contexts/EmotionsContext"; // Importa el contexto de emociones
import dayjs from "dayjs";

// Wallpaper
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");

// ICONOS
const iconNotas = require("../../assets/Imag/Iconos/Notas.png");
const iconAjustes = require("../../assets/Imag/Iconos/Ajustes.png");

const iconLista = require("../../assets/Imag/Iconos/Lista.png");
const iconAgenda = require("../../assets/Imag/Iconos/Agenda.png");
const iconCalendario = require("../../assets/Imag/Iconos/Calendario.png");

// ICONOS DE TEXTO
const mind = require("../../assets/IconosTexto/mind.png");
const sun = require("../../assets/IconosTexto/sun.png");

const Start = (props) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { favorites } = useFavorites(); // Obtener las frases favoritas del contexto
    const [favoritePhrase, setFavoritePhrase] = useState(null); // Estado para la frase favorita
    const API_BASE_URL = "http://localhost:8080/api/phrases";

    useEffect(() => {
        const fetchFavoritePhrases = async () => {
            try {
                if (favorites.length > 0) {
                    const response = await fetch(`${API_BASE_URL}/favorites`);
                    const data = await response.json();
    
                    if (data.length > 0) {
                        // Elegir una frase al azar o la primera de la lista
                        const randomPhrase = data[Math.floor(Math.random() * data.length)].phrase;
                        setFavoritePhrase(randomPhrase);
                    }
                }
            } catch (error) {
                console.error("Error fetching favorite phrases:", error);
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
                    style={styles.iconNotas}
                    onPress={() => alert("Botón notas presionado!")}
                >
                    <Image source={iconNotas} style={styles.iconStyle} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconAjustes}
                    onPress={() => props.navigation.navigate("Ajustes")}
                >
                    <Image source={iconAjustes} style={styles.iconStyle} />
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
                            props.navigation.navigate("CalendarEstados")
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

                    <EmojiRow></EmojiRow>
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
                    onPress={() =>
                        props.navigation.navigate("ListFrases")
                    }
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
                            ? favoritePhrase // Mostrar la frase favorita
                            : "No puedes controlar el viento, pero sí puedes ajustar las velas." // Frase por defecto si no hay favoritos
                        }
                    </Text>
                </TouchableOpacity>

                <View id="dock" style={styles.dock}>
                    <TouchableOpacity
                        onPress={() => alert("Botón lista presionado!")}
                    >
                        <Image source={iconLista} style={styles.iconStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("ListAgenda")}
                    >
                        <Image source={iconAgenda} style={styles.iconStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => alert("Botón calendario presionado!")}
                    >
                        <Image
                            source={iconCalendario}
                            style={styles.iconStyle}
                        />
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
    iconNotas: {
        position: "absolute",
        top: 50,
        left: 10,
        padding: 10,
    },
    iconAjustes: {
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

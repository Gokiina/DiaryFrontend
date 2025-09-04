import React, { useState, useCallback, memo, useContext } from "react"; // AÑADIDO: useContext
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
import { AuthContext } from "../../Contexts/AuthContext"; // AÑADIDO: Importar AuthContext
import ASSETS from '../../Constants/ASSETS';

const API_BASE_URL = "https://diarybackend-txxw.onrender.com/api/phrases";

const BackButton = memo(({ navigation, isDarkMode }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Start")}>
        <Text style={{ color: isDarkMode ? "#FFFFFF" : "#007AFF", fontSize: 18 }}>
            <Image
                source={ASSETS.icons.general.arrow}
                style={[styles.iconoTexto, { tintColor: isDarkMode ? "white" : "#007AFF" }]}
            />
            Volver
        </Text>
    </TouchableOpacity>
));

const PhraseItem = memo(({ item, isDarkMode, onToggleFavorite, isFavorite, isRemoving }) => (
    <View style={[styles.fraseContainer, {
        backgroundColor: isDarkMode ? "rgb(163, 169, 184)" : "white"
    }]}>
        <Text style={[styles.fraseText, { color: isDarkMode ? "white" : "black" }]}>
            {item.phrase}
        </Text>
        <TouchableOpacity
            onPress={() => onToggleFavorite(item.id)}
            disabled={isRemoving}
        >
            <Image
                source={isFavorite ? ASSETS.icons.general.starFill : ASSETS.icons.general.star}
                style={[styles.staroflife, {
                    tintColor: isDarkMode ? "rgb(78, 88, 100)" : "rgb(158, 158, 158)"
                }]}
            />
        </TouchableOpacity>
    </View>
));

const Phrases = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { favorites, toggleFavorite } = useFavorites();
    const { userToken } = useContext(AuthContext); // AÑADIDO: Obtener el token
    const [phrases, setPhrases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingFavorites, setRemovingFavorites] = useState(new Set());

    const fetchAllPhrases = useCallback(async () => {
        if (!userToken) return; // AÑADIDO: No hacer nada si no hay token
        try {
            setIsLoading(true);
            const response = await fetch(API_BASE_URL, {
                headers: { 'Authorization': `Bearer ${userToken}` } // AÑADIDO: Cabecera de autorización
            });
            if (!response.ok) throw new Error("Error al obtener las frases");
            const data = await response.json();
            setPhrases(data);
        } catch (error) {
            console.error("Error al cargar las frases:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]); // AÑADIDO: userToken como dependencia

    useFocusEffect(
        useCallback(() => {
            fetchAllPhrases();
        }, [fetchAllPhrases])
    );

    const handleToggleFavorite = useCallback(async (id) => {
        if (removingFavorites.has(id) || !userToken) return; // AÑADIDO: No hacer nada si no hay token

        setRemovingFavorites(prev => new Set(prev).add(id));
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/favorite`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${userToken}` } // AÑADIDO: Cabecera de autorización
            });
            if (!response.ok) throw new Error("Error al actualizar favorito");
            toggleFavorite(id);
        } catch (error) {
            console.error("Error al cambiar favorito:", error);
        } finally {
            setRemovingFavorites(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    }, [toggleFavorite, removingFavorites, userToken]); // AÑADIDO: userToken como dependencia

    const renderItem = useCallback(({ item }) => (
        <PhraseItem
            item={item}
            isDarkMode={isDarkMode}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(item.id)}
            isRemoving={removingFavorites.has(item.id)}
        />
    ), [isDarkMode, handleToggleFavorite, favorites, removingFavorites]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light}
                style={styles.backGround}
            >
                <View style={styles.lineaVolver}>
                    <BackButton navigation={navigation} isDarkMode={isDarkMode} />
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate("PhrasesFavorite", { favorites })}
                    style={styles.favoriteButton}
                >
                    <Image
                        source={ASSETS.icons.general.starFill}
                        style={[styles.iconoFav, { tintColor: isDarkMode ? "white" : "black" }]}
                    />
                </TouchableOpacity>

                <View style={styles.lineaTitulo}>
                    <Image
                        source={ASSETS.icons.general.sparkles}
                        style={[styles.iconoTitulo, { tintColor: isDarkMode ? "white" : "black" }]}
                    />
                    <Text style={[styles.titulo, { color: isDarkMode ? "#FFFFFF" : "#000" }]}>
                        FRASES
                    </Text>
                </View>

                <View style={styles.card}>
                    {isLoading ? (
                        <Text style={styles.loadingText}>Cargando frases...</Text>
                    ) : (
                        <FlatList
                            data={phrases}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderItem}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            initialNumToRender={8}
                        />
                    )}
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
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        elevation: 5,
    },
    favoriteButton: {
        position: 'absolute',
        top: 80,
        right: 30,
    },
    fraseContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
        flex: 1,
    },
    staroflife: {
        width: 20,
        height: 20,
        marginLeft: 10,
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
        bottom: 30,
        top: 150,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});

export default memo(Phrases);
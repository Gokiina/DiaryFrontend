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
    <TouchableOpacity onPress={() => navigation.navigate("Phrases")}>
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
    <View style={[styles.fraseContainer, { backgroundColor: isDarkMode ? "rgb(163, 169, 184)" : "white" }]}>
        <Text style={[styles.fraseText, { color: isDarkMode ? "white" : "#333" }]}>
            {item.phrase}
        </Text>
        <TouchableOpacity
            onPress={() => onToggleFavorite(item.id)}
            disabled={isRemoving}
        >
            <Image
                source={isFavorite && !isRemoving ? ASSETS.icons.general.starFill : ASSETS.icons.general.starSlash}
                style={[styles.staroflife, {
                    tintColor: isDarkMode ? "rgb(78, 88, 100)" : "rgb(158, 158, 158)"
                }]}
            />
        </TouchableOpacity>
    </View>
));

const PhrasesFavorite = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { favorites, toggleFavorite } = useFavorites();
    const { userToken } = useContext(AuthContext); // AÑADIDO: Obtener el token
    const [phrases, setPhrases] = useState([]);
    const [removingFavorites, setRemovingFavorites] = useState(new Set());

    const fetchFavoritePhrases = useCallback(async () => {
        if (!userToken) return; // AÑADIDO: No hacer nada si no hay token
        try {
            const response = await fetch(API_BASE_URL, {
                headers: { 'Authorization': `Bearer ${userToken}` } // AÑADIDO: Cabecera de autorización
            });
            if (!response.ok) throw new Error("Error fetching phrases");
            const allPhrases = await response.json();
            const favoritePhrases = allPhrases.filter(phrase => favorites.includes(phrase.id));
            setPhrases(favoritePhrases);
        } catch (error) {
            console.error("Error fetching favorite phrases:", error);
        }
    }, [favorites, userToken]); // AÑADIDO: userToken como dependencia

    const updateFavoriteStatus = useCallback(async (id) => {
        if (!userToken) return; // AÑADIDO: No hacer nada si no hay token
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/favorite`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${userToken}` } // AÑADIDO: Cabecera de autorización
            });
            if (!response.ok) {
                throw new Error("Error updating favorite status");
            }
        } catch (error) {
            console.error("Error updating favorite status:", error);
            throw error;
        }
    }, [userToken]); // AÑADIDO: userToken como dependencia

    const handleToggleFavorite = useCallback(async (id) => {
        if (removingFavorites.has(id)) return;

        setRemovingFavorites(prev => new Set(prev).add(id));
        
        try {
            await updateFavoriteStatus(id);
            toggleFavorite(id);
            setPhrases(prev => prev.filter(phrase => phrase.id !== id));
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setRemovingFavorites(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    }, [toggleFavorite, removingFavorites, updateFavoriteStatus]);

    useFocusEffect(
        useCallback(() => {
            fetchFavoritePhrases();
        }, [fetchFavoritePhrases])
    );

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

                <View style={styles.lineaTitulo}>
                    <Image
                        source={ASSETS.icons.general.starFill}
                        style={[styles.iconoTitulo, { tintColor: isDarkMode ? "white" : "black" }]}
                    />
                    <Text style={[styles.titulo, { color: isDarkMode ? "#FFFFFF" : "#000" }]}>
                        FAVORITAS
                    </Text>
                </View>

                <View style={styles.card}>
                    <FlatList
                        data={phrases}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={8}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: isDarkMode ? "#FFFFFF" : "#666" }]}>
                                No hay frases favoritas
                            </Text>
                        }
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
        top: 150,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
});

export default memo(PhrasesFavorite);
import React, { useContext, useRef, useCallback } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeContext";
import { DailyContext } from "../../Contexts/DailyContext";

// Wallpapers y Iconos
const backGround = require("../../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const flecha = require("../../../assets/IconosTexto/flecha.png");
const plusCircle2 = require("../../../assets/IconosTexto/plusCircle2.png");
const trash = require("../../../assets/IconosTexto/trash.png");
const book = require("../../../assets/IconosTexto/book.png");

const DailyEntries = (props) => {
    const { isDarkMode } = useTheme();
    const { entradas, eliminarEntrada } = useContext(DailyContext);
    
    // Referencia al swipeable actualmente abierto
    const openSwipeableRef = useRef(null);
    // Referencias a todos los swipeables
    const swipeableRefs = useRef({});

    // Función para cerrar todos los swipeables
    const closeAllSwipeables = useCallback(() => {
        Object.values(swipeableRefs.current).forEach(ref => {
            if (ref && ref.close) {
                ref.close();
            }
        });
        openSwipeableRef.current = null;
    }, []);

    // Función para manejar la navegación
    const handleNavigation = useCallback((route, params = {}) => {
        closeAllSwipeables();
        props.navigation.navigate(route, params);
    }, [props.navigation]);

    const renderRightActions = (id) => (
        <TouchableOpacity
            style={styles.botonEliminar}
            onPress={() => {
                eliminarEntrada(id);
                openSwipeableRef.current = null;
            }}
        >
            <View style={styles.eliminarContainer}>
                <Image source={trash} style={styles.iconoTrash} />
                <Text style={styles.textoEliminar}>Eliminar</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item, index }) => (
        <Swipeable
            ref={(ref) => {
                swipeableRefs.current[item.id] = ref;
            }}
            renderRightActions={() => renderRightActions(item.id)}
            rightThreshold={50}
            onSwipeableWillOpen={() => {
                // Si hay otro swipeable abierto, ciérralo
                if (openSwipeableRef.current && openSwipeableRef.current !== swipeableRefs.current[item.id]) {
                    openSwipeableRef.current.close();
                }
                openSwipeableRef.current = swipeableRefs.current[item.id];
            }}
        >
            <TouchableOpacity
                style={[
                    styles.entrada,
                    {
                        backgroundColor: isDarkMode
                            ? "rgba(155, 160, 180, 0.90)"
                            : "rgba(255, 255, 255, 0.9)",
                    },
                ]}
                onPress={() => handleNavigation("DailyPage", { entrada: item })}
            >
                <View style={styles.fechaHoraContainer}>
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
                            ? `${item.date
                                  .split("T")[0]
                                  .split("-")
                                  .reverse()
                                  .join(".")}`
                            : "Sin fecha"}
                    </Text>
                    <Text
                        style={[
                            styles.hora,
                            {
                                color: isDarkMode
                                    ? "rgba(255, 255, 255, 0.9)"
                                    : "#2C2C2E",
                            },
                        ]}
                    >
                        {item.date
                            ? (() => {
                                  const [hours, minutes] = item.date
                                      .split("T")[1]
                                      .slice(0, 5)
                                      .split(":");
                                  const hours12 = hours % 12 || 12;
                                  const period = hours >= 12 ? "PM" : "AM";
                                  return `${hours12}:${minutes} ${period}`;
                              })()
                            : "Sin hora"}
                    </Text>
                </View>
                <Text
                    style={[
                        styles.texto,
                        {
                            color: isDarkMode
                                ? "rgba(255, 255, 255, 0.9)"
                                : "#2C2C2E",
                        },
                    ]}
                >
                    {item.content.length > 30
                        ? `${item.content.slice(0, 30)}...`
                        : item.content}
                </Text>
            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            >
                <View style={styles.lineaVolver}>
                    <TouchableOpacity
                        onPress={() => handleNavigation("Start")}
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
                <View style={styles.lineaTitulo}>
                    <Image
                        source={book}
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
                        DIARIO
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleNavigation("DailyPage")}
                >
                    <Image
                        source={plusCircle2}
                        style={[
                            styles.iconoAdd,
                            { tintColor: isDarkMode ? "rgb(7, 20, 35)" : "white", backgroundColor: isDarkMode ? "white" : null },
                        ]}
                    />
                </TouchableOpacity>

                <View style={styles.card}>
                    <FlatList
                        data={[...entradas].sort(
                            (a, b) => new Date(b.date) - new Date(a.date)
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        style={[styles.fraseContainer]}
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
    card: {
        borderRadius: 10,
        width: "100%",
        position: "absolute",
        bottom: 30,
        top: 150,
        paddingHorizontal: 10,
    },
    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
    },
    entrada: {
        //backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 20,
        padding: 15,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    fechaHoraContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    fecha: {
        fontSize: 16,
        fontWeight: "bold",
    },
    hora: {
        textAlign: "right",
        fontSize: 12,
    },
    texto: {
        fontSize: 14,
    },
    botonEliminar: {
        backgroundColor: "#FF6B6B",
        justifyContent: "center",
        alignItems: "center",
        width: 105,
        borderRadius: 20,
        marginVertical: 5,
    },eliminarContainer: {
        flexDirection: "row", // Coloca los elementos en fila
        alignItems: "center", // Alinea verticalmente
        justifyContent: "center", // Centra horizontalmente
        width: "100%", // Asegura que ocupe todo el espacio del botón
    },
    textoEliminar: {
        color: "white",
        fontSize: 14,
        marginLeft: 10
    },
    iconoAdd: {
        width: 30,
        height: 30,
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
    fraseContainer: {
        paddingVertical: 5,
        marginHorizontal: 10,
    },
});

export default DailyEntries;

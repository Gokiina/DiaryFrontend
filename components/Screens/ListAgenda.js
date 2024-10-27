import React, { useContext } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler"; // Para deslizamientos
import { useTheme } from "../Contexts/ThemeContext"; // Contexto de tema
import { DiarioContext } from "../Contexts/DiarioContext";

// Wallpapers y Iconos
const backGround = require("../../assets/Imag/Wallpaper/Wallpaper.jpg");
const backGroundBlack = require("../../assets/Imag/Wallpaper/WallpaperBlack.jpeg");
const flecha = require("../../assets/IconosTexto/flecha.png");
const plusCircle2 = require("../../assets/IconosTexto/plusCircle2.png");
const trash = require("../../assets/IconosTexto/trash.png");

const ListAgenda = (props) => {
    const { isDarkMode } = useTheme(); // Usamos el contexto para manejar el tema
    const { entradas, eliminarEntrada } = useContext(DiarioContext);

    // Renderizamos cada entrada con la opción de eliminar al deslizar
    const renderItem = ({ item }) => (
        <Swipeable
        renderRightActions={() => (
            <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => eliminarEntrada(item.id)} // Eliminar la entrada
            >
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                        source={trash}
                        style={styles.iconoTrash}
                    />
                    <Text style={styles.textoEliminar}>{ } Eliminar</Text>
                </View>
            </TouchableOpacity>
            
        )}
    >
        <TouchableOpacity
            style={[
                styles.entrada,
                { backgroundColor: isDarkMode ? "rgba(155, 160, 180, 0.90)" : "rgba(255, 255, 255, 0.9)", color: isDarkMode ? "white" : "black" }
            ]}
            onPress={() => 
                // Navegar a la pantalla de detalles de la entrada
                props.navigation.navigate("PaginaDiarioDetalles", { 
                    entrada: item // Pasamos la entrada completa como parámetro
                })
            }
        >
            <Text style={[
                styles.fecha,
                {
                    color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : "#2C2C2E",
                },
            ]}>
                {item.date} - {item.time}
            </Text>
            <Text 
            style={[
                styles.texto,
                {
                    color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : "#2C2C2E",
                },
            ]}
            >{item.text.slice(0, 30)}...</Text>
        </TouchableOpacity>
    </Swipeable>
    
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? backGroundBlack : backGround}
                style={styles.backGround}
            >
                {/* Botón Volver */}
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

                {/* Botón para agregar una nueva entrada */}
                <TouchableOpacity
                    onPress={() =>
                        props.navigation.navigate("PaginaDiarioNueva")
                    }
                >
                    <Image
                        source={plusCircle2}
                        style={[
                            styles.iconoAdd,
                            { tintColor: isDarkMode ? "black" : "white" },
                        ]}
                    />
                </TouchableOpacity>

                <View style={styles.card}>
                    {/* Lista de entradas */}
                    <FlatList
                        data={entradas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
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
    card: {
        borderRadius: 10,
        width: "98%",
        position: "absolute",
        bottom: 50,
        top: 120,
        paddingHorizontal: 10,
    },
    lineaVolver: {
        position: "absolute",
        top: 60,
        left: 10,
    },
    entrada: {
        //backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 25,
        padding: 15,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    fecha: {
        fontSize: 16,
        fontWeight: "bold",
    },
    texto: {
        fontSize: 14,
    },
    botonEliminar: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderRadius: 20,
        marginVertical: 5,
    },
    textoEliminar: {
        color: "white",
        fontSize: 14,
    },
    iconoAdd: {
        width: 25,
        height: 25,
        top: -330,
        right: -150,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 20,
        elevation: 50, // Sombra en Android
    },
    iconoTexto: {
        width: 18,
        height: 16,
    },    iconoTrash: {
        width: 13,
        height: 17,
        tintColor: 'white'
    },
});

export default ListAgenda;

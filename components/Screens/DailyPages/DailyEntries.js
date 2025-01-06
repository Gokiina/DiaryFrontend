import React, { useContext, useRef, useCallback, useMemo } from "react";
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

const ASSETS = {
    backGround: require("../../../assets/Imag/Wallpaper/Wallpaper.jpg"),
    backGroundBlack: require("../../../assets/Imag/Wallpaper/WallpaperBlack.jpeg"),
    flecha: require("../../../assets/IconosTexto/flecha.png"),
    plusCircle2: require("../../../assets/IconosTexto/plusCircle2.png"),
    trash: require("../../../assets/IconosTexto/trash.png"),
    book: require("../../../assets/IconosTexto/book.png"),
};

const Header = ({ isDarkMode, onBack }) => (
    <>
        <View style={styles.lineaVolver}>
            <TouchableOpacity onPress={onBack}>
                <Text style={{ color: isDarkMode ? "#FFFFFF" : "#007AFF", fontSize: 18 }}>
                    <Image
                        source={ASSETS.flecha}
                        style={[styles.iconoTexto, { tintColor: isDarkMode ? "white" : "#007AFF" }]}
                    />
                    Volver
                </Text>
            </TouchableOpacity>
        </View>
        <View style={styles.lineaTitulo}>
            <Image
                source={ASSETS.book}
                style={[styles.iconoTitulo, { tintColor: isDarkMode ? "white" : "black" }]}
            />
            <Text style={[styles.titulo, { color: isDarkMode ? "#FFFFFF" : "#000" }]}>
                {" "}DIARIO
            </Text>
        </View>
    </>
);

const EntryItem = ({ item, isDarkMode, onPress, renderRightActions }) => (
    <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        rightThreshold={50}
    >
        <TouchableOpacity
            style={[styles.entrada, {
                backgroundColor: isDarkMode ? "rgba(155, 160, 180, 0.90)" : "rgba(255, 255, 255, 0.9)",
            }]}
            onPress={() => onPress("DailyPage", { entrada: item })}
        >
            <EntryContent item={item} isDarkMode={isDarkMode} />
        </TouchableOpacity>
    </Swipeable>
);

const EntryContent = ({ item, isDarkMode }) => {
    const textColor = { color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "#2C2C2E" };
    const formattedDate = useMemo(() => {
        if (!item.date) return "Sin fecha";
        return item.date.split("T")[0].split("-").reverse().join(".");
    }, [item.date]);

    const formattedTime = useMemo(() => {
        if (!item.date) return "Sin hora";
        const [hours, minutes] = item.date.split("T")[1].slice(0, 5).split(":");
        const hours12 = hours % 12 || 12;
        const period = hours >= 12 ? "PM" : "AM";
        return `${hours12}:${minutes} ${period}`;
    }, [item.date]);

    return (
        <>
            <View style={styles.fechaHoraContainer}>
                <Text style={[styles.fecha, textColor]}>{formattedDate}</Text>
                <Text style={[styles.hora, textColor]}>{formattedTime}</Text>
            </View>
            <Text style={[styles.texto, textColor]}>
                {item.content.length > 30 ? `${item.content.slice(0, 30)}...` : item.content}
            </Text>
        </>
    );
};

const DailyEntries = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { entradas, eliminarEntrada } = useContext(DailyContext);
    
    const sortedEntries = useMemo(() => 
        [...entradas].sort((a, b) => new Date(b.date) - new Date(a.date)),
        [entradas]
    );

    const handleNavigation = useCallback((route, params = {}) => {
        navigation.navigate(route, params);
    }, [navigation]);

    const renderRightActions = useCallback((id) => (
        <TouchableOpacity
            style={styles.botonEliminar}
            onPress={() => eliminarEntrada(id)}
        >
            <View style={styles.eliminarContainer}>
                <Image source={ASSETS.trash} style={styles.iconoTrash} />
                <Text style={styles.textoEliminar}>Eliminar</Text>
            </View>
        </TouchableOpacity>
    ), [eliminarEntrada]);

    const renderItem = useCallback(({ item }) => (
        <EntryItem
            item={item}
            isDarkMode={isDarkMode}
            onPress={handleNavigation}
            renderRightActions={renderRightActions}
        />
    ), [isDarkMode, handleNavigation, renderRightActions]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDarkMode ? ASSETS.backGroundBlack : ASSETS.backGround}
                style={styles.backGround}
            >
                <Header 
                    isDarkMode={isDarkMode} 
                    onBack={() => handleNavigation("Start")} 
                />
                
                <TouchableOpacity onPress={() => handleNavigation("DailyPage")}>
                    <Image
                        source={ASSETS.plusCircle2}
                        style={[styles.iconoAdd, {
                            tintColor: isDarkMode ? "rgb(7, 20, 35)" : "white",
                            backgroundColor: isDarkMode ? "white" : null
                        }]}
                    />
                </TouchableOpacity>

                <View style={styles.card}>
                    <FlatList
                        data={sortedEntries}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        style={styles.fraseContainer}
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
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center", 
        width: "100%", 
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

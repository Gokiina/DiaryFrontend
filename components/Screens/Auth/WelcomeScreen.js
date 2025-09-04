import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from "../../Contexts/ThemeContext";
import ASSETS from '../../Constants/ASSETS';

const WelcomeScreen = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const background = isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light;
    const themeStyles = {
        text: { color: isDarkMode ? '#FFF' : '#000' },
        buttonText: { color: isDarkMode ? '#000' : '#FFF' },
        buttonPrimary: { backgroundColor: isDarkMode ? '#FFF' : '#007bff' },
        buttonSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: isDarkMode ? '#FFF' : '#007bff' },
        buttonSecondaryText: { color: isDarkMode ? '#FFF' : '#007bff' },
    };

    return (
        <ImageBackground source={background} style={styles.background}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, themeStyles.text]}>DIARY</Text>
                    <Text style={[styles.subtitle, themeStyles.text]}>Tu espacio personal para reflexionar y crecer.</Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, themeStyles.buttonPrimary]}
                        onPress={() => navigation.navigate('LoginOptions')}
                    >
                        <Text style={[styles.buttonText, themeStyles.buttonText]}>Iniciar sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, themeStyles.buttonSecondary]}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        <Text style={[styles.buttonText, themeStyles.buttonSecondaryText]}>Registrarse</Text>
                    </TouchableOpacity>
                    <Text style={[styles.legalText, themeStyles.text]}>
                        Al registrarte, aceptas nuestro Aviso de usuario y Política de privacidad.
                    </Text>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        marginTop: '20%',
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'SF Pro', // Asegúrate de tener esta fuente
    },
    subtitle: {
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'SF Pro',
    },
    footer: {
        width: '100%',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'SF Pro',
    },
    legalText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
        opacity: 0.7,
    },
});

export default WelcomeScreen;

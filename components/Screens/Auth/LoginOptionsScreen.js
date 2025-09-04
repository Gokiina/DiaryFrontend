import { useContext } from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ASSETS from '../../Constants/ASSETS';
import { AuthContext } from '../../Contexts/AuthContext'; // Importa AuthContext
import { useTheme } from "../../Contexts/ThemeContext";

const LoginOptionsScreen = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    
    const background = isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light;
    const themeStyles = {
        text: { color: isDarkMode ? '#FFF' : '#333' },
        stand: { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' },
    };

    const { googleLogin } = useContext(AuthContext);

    const handleGoogleLogin = async () => {
        try {
            console.log("🔄 Iniciando login con Google...");
            await googleLogin();
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
        }
    };

    return (
        <ImageBackground source={background} style={styles.background}>
            <SafeAreaView style={styles.container}>
                <View style={[styles.stand, themeStyles.stand]}>
                    <Text style={[styles.title, themeStyles.text]}>Iniciar Sesión</Text>
                    
                    <TouchableOpacity 
                        style={styles.optionButton} 
                        onPress={handleGoogleLogin}
                    >
                        <Image source={ASSETS.icons.general.google} style={styles.icon} />
                        <Text style={[styles.optionText, themeStyles.text]}>Continuar con Google</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EmailLogin')}>
                        <Image source={ASSETS.icons.general.mail} style={styles.icon} />
                        <Text style={[styles.optionText, themeStyles.text]}>Iniciar sesión con correo electrónico</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backLink}>Volver</Text>
                    </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    stand: {
        width: '90%',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    optionButton: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    backLink: {
        marginTop: 20,
        color: '#007bff',
        fontSize: 16,
    }
});

export default LoginOptionsScreen;
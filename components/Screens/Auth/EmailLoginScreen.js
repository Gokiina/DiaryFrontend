import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from "../../Contexts/ThemeContext";
import { AuthContext } from '../../Contexts/AuthContext';
import ASSETS from '../../Constants/ASSETS';

const EmailLoginScreen = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // AÑADIDO: Estado para la carga

    const background = isDarkMode ? ASSETS.backgrounds.dark : ASSETS.backgrounds.light;
    const themeStyles = {
        text: { color: isDarkMode ? '#FFF' : '#333' },
        input: {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#FFF',
            color: isDarkMode ? '#FFF' : '#000',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#ddd',
        },
        button: { backgroundColor: '#007bff' },
        buttonText: { color: '#FFF' },
        linkText: { color: isDarkMode ? '#FFF' : '#007bff' },
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, introduce tu correo y contraseña.");
            return;
        }
        
        setLoading(true); // AÑADIDO: Inicia la carga
        try {
            await login(email, password);
            // Si el login es exitoso, el AppNavigator nos llevará a la app principal automáticamente.
        } catch (error) {
            const errorMessage = error.response?.data?.message || "El correo o la contraseña son incorrectos.";
            Alert.alert("Error de Autenticación", errorMessage);
        } finally {
            setLoading(false); // AÑADIDO: Finaliza la carga
        }
    };

    return (
        <ImageBackground source={background} style={styles.background}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <SafeAreaView style={styles.content}>
                    <Text style={[styles.title, themeStyles.text]}>Iniciar Sesión</Text>

                    <TextInput
                        style={[styles.input, themeStyles.input]}
                        placeholder="Correo Electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={[styles.input, themeStyles.input]}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#888"
                    />

                    {/* MODIFICADO: Botón con estado de carga */}
                    <TouchableOpacity 
                        style={[styles.button, themeStyles.button, loading && styles.buttonDisabled]} 
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={[styles.buttonText, themeStyles.buttonText]}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading}>
                        <Text style={[styles.linkText, themeStyles.linkText]}>¿No tienes una cuenta? Regístrate</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: { flex: 1 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, fontFamily: 'SF Pro' },
    input: { width: '100%', height: 50, borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, borderWidth: 1 },
    button: { width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#555' }, // AÑADIDO
    buttonText: { fontSize: 18, fontWeight: 'bold' },
    linkText: { marginTop: 20, fontSize: 16 },
});

export default EmailLoginScreen;

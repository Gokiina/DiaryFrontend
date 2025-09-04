import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from "../../Contexts/ThemeContext";
import { AuthContext } from '../../Contexts/AuthContext';
import ASSETS from '../../Constants/ASSETS';

// Función de utilidad para validar la contraseña
const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return regex.test(password);
};

const SignUpScreen = ({ navigation }) => {
    const { isDarkMode } = useTheme();
    const { signup } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // AÑADIDO: Estado para confirmar contraseña
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(''); // AÑADIDO: Estado para errores de contraseña

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
        errorText: { color: '#FF453A' } // AÑADIDO
    };

    const handleSignUp = async () => {
        // --- VALIDACIONES AÑADIDAS ---
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Por favor, rellena todos los campos.");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden.");
            return;
        }

        if (!isPasswordValid(password)) {
            setPasswordError("La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.");
            return;
        }
        
        // Si todo es correcto, limpiamos los errores
        setPasswordError('');
        setLoading(true);
        try {
            await signup(name, email, password);
            // El AppNavigator se encargará de la redirección si el signup es exitoso
        } catch (error) {
            const errorMessage = error.response?.data || "No se pudo crear la cuenta. Inténtalo de nuevo.";
            Alert.alert("Error de Registro", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={background} style={styles.background}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <SafeAreaView style={styles.content}>
                    <Text style={[styles.title, themeStyles.text]}>Crear Cuenta</Text>
                    
                    <TextInput
                        style={[styles.input, themeStyles.input]}
                        placeholder="Nombre"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#888"
                    />
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
                    {/* AÑADIDO: Campo para confirmar contraseña */}
                    <TextInput
                        style={[styles.input, themeStyles.input]}
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor="#888"
                    />
                    {/* AÑADIDO: Muestra el mensaje de error de contraseña */}
                    {passwordError ? <Text style={[styles.errorText, themeStyles.errorText]}>{passwordError}</Text> : null}

                    <TouchableOpacity 
                        style={[styles.button, themeStyles.button, loading && styles.buttonDisabled]} 
                        onPress={handleSignUp}
                        disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.buttonText, themeStyles.buttonText]}>Registrarse</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('LoginOptions')} disabled={loading}>
                        <Text style={[styles.linkText, themeStyles.linkText]}>¿Ya tienes una cuenta? Inicia sesión</Text>
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
    buttonDisabled: { backgroundColor: '#555' },
    buttonText: { fontSize: 18, fontWeight: 'bold' },
    linkText: { marginTop: 20, fontSize: 16 },
    errorText: { alignSelf: 'flex-start', marginLeft: 5, marginBottom: 10, fontSize: 14 }, // AÑADIDO
});

export default SignUpScreen;
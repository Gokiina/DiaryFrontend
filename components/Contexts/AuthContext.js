import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as SplashScreen from 'expo-splash-screen';
import { Alert } from "react-native";

SplashScreen.preventAutoHideAsync();

const API_URL = 'https://diarybackend-txxw.onrender.com/api/auth';

// --- CONFIGURACIÓN FINAL ---
// Añadimos la solicitud explícita de scopes para asegurar que recibimos el idToken.
GoogleSignin.configure({
  webClientId: '185662845459-7tvaru51p5f1njnvab4o8loipk0iapfi.apps.googleusercontent.com', // ID de cliente WEB (correcto)
  offlineAccess: true,
  scopes: ['profile', 'email'], // <-- ¡ESTA ES LA LÍNEA CLAVE!
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleGoogleLoginBackend = async (googleIdToken) => {
        try {
            const res = await axios.post(`${API_URL}/google`, { token: googleIdToken });
            const { accessToken, user: userData } = res.data;
            
            if (accessToken) {
                setUserToken(accessToken);
                setUser(userData);
                await SecureStore.setItemAsync('userToken', accessToken);
                if (userData) {
                    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
                }
            } else {
                throw new Error("No se recibió accessToken del backend");
            }
        } catch (error) {
            console.error('Error en el backend con Google:', error.response?.data || error.message);
            throw error;
        }
    };

    const signup = async (name, email, password) => {
        await axios.post(`${API_URL}/signup`, { name, email, password });
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/signin`, { email, password });
            const { accessToken, user: userData } = response.data;
            
            if (accessToken) {
                setUserToken(accessToken);
                setUser(userData);
                await SecureStore.setItemAsync('userToken', accessToken);
                if (userData) {
                    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
                }
            }
        } catch (error) {
            console.error("Error en el inicio de sesión con email:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUser(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.error("Error al cerrar sesión de Google:", error);
        }
        setIsLoading(false);
    };

    const isLoggedIn = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const userData = await SecureStore.getItemAsync('userData');
            
            if (token && userData) {
                setUserToken(token);
                setUser(JSON.parse(userData));
            }
        } catch (e) {
            console.error('Error al comprobar el token guardado:', e);
            setUserToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
            await SplashScreen.hideAsync();
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    const googleLogin = async () => {
        setIsLoading(true);
        try {
            console.log("Paso 1: Verificando Google Play Services...");
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            
            console.log("Paso 2: Play Services OK. Iniciando signIn...");
            const userInfo = await GoogleSignin.signIn();

            console.log("Paso 3: signIn exitoso. Obteniendo idToken...");
            // --- CORRECCIÓN FINAL ---
            // El idToken viene dentro de userInfo.data en tu caso.
            const idToken = userInfo.data ? userInfo.data.idToken : userInfo.idToken;
            
            if (idToken) {
                console.log("Paso 4: idToken recibido. ¡ÉXITO!");
                await handleGoogleLoginBackend(idToken);
            } else {
                console.error("DEBUG: userInfo no contenía idToken en la ruta esperada", userInfo);
                throw new Error("No se pudo obtener el idToken de Google después de un signIn exitoso.");
            }
        } catch (error) {
            console.error("DEBUG: Raw error object in googleLogin:", error);
            console.error("DEBUG: Stringified error in googleLogin:", JSON.stringify(error, null, 2));

            if (error.code) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        console.log("Usuario canceló el login");
                        break;
                    case statusCodes.IN_PROGRESS:
                        console.log("El login ya está en progreso");
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        Alert.alert("Error", "Los servicios de Google Play no están disponibles o actualizados.");
                        break;
                    case statusCodes.DEVELOPER_ERROR:
                         Alert.alert("Error de Configuración", "Hay un problema con la configuración de Google Sign-In (SHA-1 o google-services.json). Por favor, sincroniza tu configuración de Firebase.");
                        break;
                    default:
                        Alert.alert("Error de Google", `Código: ${error.code}`);
                        break;
                }
            } else {
                Alert.alert("Error de Autenticación", error.message || "Ocurrió un error inesperado al iniciar sesión con Google.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            login, 
            logout, 
            signup, 
            userToken, 
            user,
            isLoading,
            googleLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};


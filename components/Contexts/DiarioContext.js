import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para persistencia

export const DiarioContext = createContext();

export const DiarioProvider = ({ children }) => {
    const [entradas, setEntradas] = useState([]);

    // Cargar las entradas desde AsyncStorage al iniciar la app
    useEffect(() => {
        const cargarEntradas = async () => {
            try {
                const dataGuardada = await AsyncStorage.getItem("entradas");
                if (dataGuardada !== null) {
                    setEntradas(JSON.parse(dataGuardada));
                }
            } catch (error) {
                console.error("Error cargando entradas", error);
            }
        };
        cargarEntradas();
    }, []);

    // Guardar las entradas en AsyncStorage cuando se actualizan
    useEffect(() => {
        const guardarEntradas = async () => {
            try {
                await AsyncStorage.setItem("entradas", JSON.stringify(entradas));
            } catch (error) {
                console.error("Error guardando entradas", error);
            }
        };
        guardarEntradas();
    }, [entradas]);

    // Función para agregar una nueva entrada
    const agregarEntrada = (entrada) => {
        setEntradas((prevEntradas) => [entrada, ...prevEntradas]);
    };

    // Función para eliminar una entrada
    const eliminarEntrada = (id) => {
        setEntradas((prevEntradas) =>
            prevEntradas.filter((entrada) => entrada.id !== id)
        );
    };

    const actualizarEntrada = (entradaActualizada) => {
        setEntradas((prevEntradas) =>
            prevEntradas.map((entrada) =>
                entrada.id === entradaActualizada.id ? entradaActualizada : entrada
            )
        );
    };

    return (
        <DiarioContext.Provider
            value={{
                entradas,
                agregarEntrada,
                eliminarEntrada, actualizarEntrada
            }}
        >
            {children}
        </DiarioContext.Provider>
    );
};

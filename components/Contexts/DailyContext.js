import React, { createContext, useState, useEffect, useContext } from "react";
// AÑADIDO: Importamos el contexto de autenticación
import { AuthContext } from "./AuthContext";

export const DailyContext = createContext();
const URL_DIARY = "https://diarybackend-txxw.onrender.com/api/diary";

export const DailyProvider = ({ children }) => {
    const [entradas, setEntradas] = useState([]);
    // AÑADIDO: Obtenemos el token
    const { userToken } = useContext(AuthContext);

    const fetchEntries = async () => {
        if (!userToken) return;

        try {
            const response = await fetch(URL_DIARY, {
                headers: { 'Authorization': `Bearer ${userToken}` } // AÑADIDO
            });
            const data = await response.json();
            setEntradas(data);
        } catch (error) {
            console.error("Error al cargar las entradas:", error);
        }
    };

    const agregarEntrada = (nuevaEntrada) => {
        // Esta función probablemente también debería hacer una llamada POST a la API
        setEntradas(currentEntradas => [...currentEntradas, nuevaEntrada]);
    };

    const actualizarEntrada = async (nuevaEntrada) => {
        if (!userToken) return;

        setEntradas(currentEntradas => 
            currentEntradas.map(entrada => 
                entrada.id === nuevaEntrada.id ? nuevaEntrada : entrada
            )
        );
        try {
            await fetch(`${URL_DIARY}/${nuevaEntrada.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${userToken}` // AÑADIDO
                },
                body: JSON.stringify(nuevaEntrada),
            });
        } catch (error) {
            console.error("Error al actualizar la entrada:", error);
        }
    };

    const eliminarEntrada = async (id) => {
        if (!userToken) return;

        try {
            const response = await fetch(`${URL_DIARY}/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${userToken}` } // AÑADIDO
            });
            if (response.ok) {
                setEntradas(currentEntradas => 
                    currentEntradas.filter(entrada => entrada.id !== id)
                );
            } else {
                console.error(`Error al eliminar la entrada con ID ${id}`);
            }
        } catch (error) {
            console.error("Error al eliminar la entrada:", error);
        }
    };

    // MODIFICADO: Hacemos que la carga dependa de la existencia del token
    useEffect(() => {
        if (userToken) {
            fetchEntries();
        }
    }, [userToken]);

    return (
        <DailyContext.Provider
            value={{ entradas, actualizarEntrada, eliminarEntrada, agregarEntrada }}
        >
            {children}
        </DailyContext.Provider>
    );
};

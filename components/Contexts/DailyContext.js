import React, { createContext, useState, useEffect } from "react";

export const DailyContext = createContext();

const URL_DIARY = "http://localhost:8080/api/diary";

export const DailyProvider = ({ children }) => {
    const [entradas, setEntradas] = useState([]);

    const handleResponse = (response, successCallback) => {
        if (!response.ok) throw new Error("Error al procesar la solicitud.");
        return response.json().then(successCallback);
    };

    const fetchEntries = async () => {
        try {
            const response = await fetch(URL_DIARY);
            const data = await response.json();
            setEntradas(data);
        } catch (error) {
            console.error("Error al cargar las entradas:", error);
        }
    };

    const agregarEntrada = (nuevaEntrada) => {
        setEntradas(currentEntradas => {
            const updatedEntradas = currentEntradas.slice();
            updatedEntradas.push(nuevaEntrada);
            return updatedEntradas;
        });
    };

    const actualizarEntrada = async (nuevaEntrada) => {
        setEntradas(currentEntradas => 
            currentEntradas.map(entrada => 
                entrada.id === nuevaEntrada.id ? nuevaEntrada : entrada
            )
        );
        try {
            const response = await fetch(`${URL_DIARY}/${nuevaEntrada.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaEntrada),
            });
            handleResponse(response, (data) =>
                console.log("Entrada actualizada:", data)
            );
        } catch (error) {
            console.error("Error al actualizar la entrada:", error);
        }
    };

    const eliminarEntrada = async (id) => {
        try {
            const response = await fetch(`${URL_DIARY}/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setEntradas(currentEntradas => 
                    currentEntradas.filter(entrada => entrada.id !== id)
                );
                console.log(`Entrada con ID ${id} eliminada.`);
            } else {
                console.error(`Error al eliminar la entrada con ID ${id}`);
            }
        } catch (error) {
            console.error("Error al eliminar la entrada:", error);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    return (
        <DailyContext.Provider
            value={{
                entradas,
                actualizarEntrada,
                eliminarEntrada,
                agregarEntrada,
            }}
        >
            {children}
        </DailyContext.Provider>
    );
};
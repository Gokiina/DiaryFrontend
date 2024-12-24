import React, { createContext, useState, useContext, useEffect } from "react";

export const DailyContext = createContext();

export const DailyProvider = ({ children }) => {
    const [entradas, setEntradas] = useState([]);

    const agregarEntrada = (nuevaEntrada) => {
        setEntradas((prevEntradas) => [...prevEntradas, nuevaEntrada]);
    };

    const actualizarEntrada = (nuevaEntrada) => {
        setEntradas(prevEntradas =>
            prevEntradas.map(entrada =>
                entrada.id === nuevaEntrada.id ? nuevaEntrada : entrada
            )
        );

        fetch(`http://localhost:8080/api/diary/${nuevaEntrada.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevaEntrada),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al actualizar la entrada en el servidor.");
            }
            return response.json();
        })
            .then((data) => {
                console.log("Entrada actualizada en el servidor:", data);
                
            })
            .catch((error) => {
                console.error("Error al actualizar la entrada:", error);
            });
    };


    const fetchEntradas = () => {
        fetch("http://localhost:8080/api/diary")
            .then((response) => response.json())
            .then((data) => {
                setEntradas(data); 
            })
            .catch((error) => console.error("Error al cargar las entradas:", error));
    };




    const eliminarEntrada = (id) => {
        fetch(`http://localhost:8080/api/diary/${id}`, {
            method: "DELETE",
        })
            .then(response => {
                if (response.ok) {
                    setEntradas(prevEntradas =>
                        prevEntradas.filter(entrada => entrada.id !== id)
                    );
                    console.log(`Entrada con ID ${id} eliminada correctamente.`);
                } else {
                    console.error(`Error al eliminar la entrada con ID ${id}: ${response.statusText}`);
                }
            })
            .catch(error => console.error("Error al eliminar la entrada:", error));
    };
    
    useEffect(() => {
        fetch("http://localhost:8080/api/diary")
            .then((response) => response.json())
            .then((data) => {
                setEntradas(data); 
            })
            .catch((error) => console.error("Error al cargar las entradas:", error));
    }, []);

    return (
        <DailyContext.Provider value={{ entradas, actualizarEntrada, eliminarEntrada, agregarEntrada }}>
            {children}
        </DailyContext.Provider>
    );
};

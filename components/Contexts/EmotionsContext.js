import React, { Component } from 'react';

// Creamos el contexto
export const EmotionsContext = React.createContext();

export class EmotionsProvider extends Component {
    state = {
        emotions: {}, // Aquí almacenamos las emociones por fecha
    };

    // Función para registrar una emoción con una fecha
    registerEmotion = (date, emoji) => {
        this.setState(prevState => ({
            emotions: {
                ...prevState.emotions,
                [date]: emoji, // Asignamos un emoji a una fecha
            },
        }));
    };

    // Función para borrar una emoción de una fecha específica (opcional)
    removeEmotion = (date) => {
        this.setState(prevState => {
            const emotions = { ...prevState.emotions };
            delete emotions[date]; // Eliminamos la emoción del estado
            return { emotions };
        });
    };

    render() {
        return (
            <EmotionsContext.Provider
                value={{
                    emotions: this.state.emotions, // Proveer el estado de emociones
                    registerEmotion: this.registerEmotion, // Proveer la función de registro
                    removeEmotion: this.removeEmotion, // Proveer la función para eliminar emociones
                }}
            >
                {this.props.children}
            </EmotionsContext.Provider>
        );
    }
}

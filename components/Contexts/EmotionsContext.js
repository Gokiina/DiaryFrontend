import React, { Component } from 'react';


export const EmotionsContext = React.createContext();

export class EmotionsProvider extends Component {
    state = {
        emotions: {}, 
    };


    registerEmotion = (date, emoji) => {
        this.setState(prevState => ({
            emotions: {
                ...prevState.emotions,
                [date]: emoji, 
            },
        }));
    };

    removeEmotion = (date) => {
        this.setState(prevState => {
            const emotions = { ...prevState.emotions };
            delete emotions[date];
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

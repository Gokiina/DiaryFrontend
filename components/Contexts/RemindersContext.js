import React, { createContext, useState, useEffect, useContext } from "react";
// AÑADIDO: Importamos el contexto de autenticación
import { AuthContext } from "./AuthContext";

export const RemindersContext = createContext();

export const RemindersProvider = ({ children }) => {
    const [reminders, setReminders] = useState([]);
    const URL_REMINDERS = "https://diarybackend-txxw.onrender.com/api/reminders";
    // AÑADIDO: Obtenemos el token
    const { userToken } = useContext(AuthContext);

    const fetchReminders = async () => {
        if (!userToken) return;
        try {
            const response = await fetch(URL_REMINDERS, {
                headers: { 'Authorization': `Bearer ${userToken}` } // AÑADIDO
            });
            const data = await response.json();
            setReminders(data);
        } catch (error) {
            console.error("Error fetching reminders:", error);
        }
    };

    const addReminder = async (newReminder) => {
        if (!userToken) return;
        try {
            const response = await fetch(URL_REMINDERS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${userToken}` // AÑADIDO
                },
                body: JSON.stringify(newReminder),
            });
            const data = await response.json();
            setReminders(currentReminders => [...currentReminders, data]);
        } catch (error) {
            console.error("Error adding reminder:", error);
        }
    };

    const updateReminder = async (updatedReminder) => {
        if (!userToken) return;
        try {
            const response = await fetch(`${URL_REMINDERS}/${updatedReminder.id}`, { // CORREGIDO: URL con ID
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${userToken}` // AÑADIDO
                },
                body: JSON.stringify(updatedReminder),
            });
            const data = await response.json();
            setReminders(currentReminders => 
                currentReminders.map(reminder => 
                    reminder.id === updatedReminder.id ? data : reminder
                )
            );
        } catch (error) {
            console.error("Error updating reminder:", error);
        }
    };

    const deleteReminder = async (id) => {
        if (!userToken) return;
        try {
            await fetch(`${URL_REMINDERS}/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${userToken}` } // AÑADIDO
            });
            setReminders(currentReminders => 
                currentReminders.filter(reminder => reminder.id !== id)
            );
        } catch (error) {
            console.error("Error deleting reminder:", error);
        }
    };

    // MODIFICADO: Hacemos que la carga dependa de la existencia del token
    useEffect(() => {
        if (userToken) {
            fetchReminders();
        }
    }, [userToken]);

    return (
        <RemindersContext.Provider
            value={{ reminders, addReminder, updateReminder, deleteReminder }}
        >
            {children}
        </RemindersContext.Provider>
    );
};

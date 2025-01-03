import React, { createContext, useState, useEffect } from "react";

export const RemindersContext = createContext();

export const RemindersProvider = ({ children }) => {
    const [reminders, setReminders] = useState([]);
    const URL_REMINDERS = "http://localhost:8080/api/reminders";

    const fetchReminders = async () => {
        try {
            const response = await fetch(URL_REMINDERS);
            const data = await response.json();
            setReminders(data);
        } catch (error) {
            console.error("Error fetching reminders:", error);
        }
    };

    const addReminder = async (newReminder) => {
        try {
            const response = await fetch(URL_REMINDERS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newReminder),
            });
            const data = await response.json();
            setReminders((prev) => [...prev, data]);
        } catch (error) {
            console.error("Error adding reminder:", error);
        }
    };

    const updateReminder = async (updatedReminder) => {
        try {
            const response = await fetch(URL_REMINDERS, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedReminder),
            });
            const data = await response.json();
            setReminders((prev) =>
                prev.map((reminder) =>
                    reminder.id === updatedReminder.id ? data : reminder
                )
            );
        } catch (error) {
            console.error("Error updating reminder:", error);
        }
    };

    const deleteReminder = async (id) => {
        try {
            await fetch(`${URL_REMINDERS}/${id}`, {
                method: "DELETE",
            });
            setReminders((prev) =>
                prev.filter((reminder) => reminder.id !== id)
            );
        } catch (error) {
            console.error("Error deleting reminder:", error);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    return (
        <RemindersContext.Provider
            value={{ reminders, addReminder, updateReminder, deleteReminder }}
        >
            {children}
        </RemindersContext.Provider>
    );
};

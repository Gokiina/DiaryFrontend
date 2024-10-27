// SettingsContext.js
import React, { createContext, useState } from "react";

// Crear el contexto
export const SettingsContext = createContext();

// Crear el proveedor del contexto
export const SettingsProvider = ({ children }) => {
    // Estados para los switches
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [record, setRecord] = useState(false);
    const [time, setTime] = useState(new Date());

    return (
        <SettingsContext.Provider
            value={{
                faceIdEnabled,
                setFaceIdEnabled,
                record,
                setRecord,
                time, setTime
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

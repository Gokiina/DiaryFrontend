
import React, { createContext, useState } from "react";


export const SettingsContext = createContext();


export const SettingsProvider = ({ children }) => {

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

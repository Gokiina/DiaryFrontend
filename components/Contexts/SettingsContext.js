import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [record, setRecord] = useState(false);
    const [time, setTime] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedFaceId = await AsyncStorage.getItem('faceIdEnabled');
                const storedRecord = await AsyncStorage.getItem('record');
                const storedTime = await AsyncStorage.getItem('time');

                if (storedFaceId !== null) setFaceIdEnabled(JSON.parse(storedFaceId));
                if (storedRecord !== null) setRecord(JSON.parse(storedRecord));
                if (storedTime !== null) setTime(new Date(storedTime));
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadSettings();
    }, []);

    const saveFaceId = async (value) => {
        setFaceIdEnabled(value);
        await AsyncStorage.setItem('faceIdEnabled', JSON.stringify(value));
    };

    const saveRecord = async (value) => {
        setRecord(value);
        await AsyncStorage.setItem('record', JSON.stringify(value));
    };

    const saveTime = async (value) => {
        setTime(value);
        await AsyncStorage.setItem('time', value.toString());
    };

    return (
        <SettingsContext.Provider
            value={{
                faceIdEnabled,
                setFaceIdEnabled: saveFaceId,
                record,
                setRecord: saveRecord,
                time,
                setTime: saveTime,
                isLoaded
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

// Crear el contexto
const ThemeContext = createContext();

// Proveedor de tema
export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();  // Obtenemos el esquema de color del sistema
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  // Alternar entre modo oscuro y claro
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useTheme = () => useContext(ThemeContext);

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from "../Contexts/ThemeContext"; // Importamos el hook del tema

const Separador = () => {
  const { isDarkMode } = useTheme(); // Usamos el hook en un componente funcional

  return <View style={[isDarkMode ? styles.separadorN : styles.separador]}></View>;
};

const styles = StyleSheet.create({
  separador: {
    height: 1,
    backgroundColor: '#f3f3f3',
    marginVertical: 1,
  },
  separadorN: {
    height: 1,
    backgroundColor: '#545456',
    marginVertical: 1,
  },
});

export default Separador;


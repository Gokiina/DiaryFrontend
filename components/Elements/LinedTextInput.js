import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';

const LinedBackground = ({ isDarkMode, children }) => {
  const screenHeight = Dimensions.get('window').height;
  const lineHeight = 26; 
  const numberOfLines = Math.floor(screenHeight / lineHeight);
  
  const lines = Array(numberOfLines).fill(0);

  return (
    <View style={styles.container}>
      <View style={styles.linesContainer}>
        {lines.map((_, index) => (
          <View
            key={index}
            style={[
              styles.line,
              {
                top: index * lineHeight + lineHeight
              }
            ]}
          />
        ))}
      </View>
      {children}
    </View>
  );
};

const LinedTextInput = ({ isDarkMode, value, onChangeText, style, ...props }) => {
  return (
    <LinedBackground isDarkMode={isDarkMode}>
      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.textInput,
          {
            lineHeight: 26,
          },
          style,
        ]}
      />
    </LinedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  linesContainer: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
  line: {
    height: 1,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 20,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
    color: 'black',
  },
});

export default LinedTextInput;
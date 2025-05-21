// client/index.js
import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Simple App component defined directly in index.js to avoid any import issues
function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello from Shego Taxi!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9E2A45',
  },
});

// Register the App component
registerRootComponent(App);
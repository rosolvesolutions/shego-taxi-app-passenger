// client/reset-minimal.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===== COMPLETE PROJECT RESET TO MINIMAL VERSION =====');

// Create the absolute minimal files
const files = [
  {
    path: 'index.js',
    content: `// Absolute minimal index.js
import { registerRootComponent } from 'expo';
import App from './BasicApp';

registerRootComponent(App);`
  },
  {
    path: 'BasicApp.js',
    content: `// BasicApp.js - Absolute minimal version
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
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
});`
  },
  {
    path: 'babel.config.js',
    content: `// babel.config.js - Absolute minimal version
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};`
  },
  {
    path: 'package.json',
    content: `{
  "name": "client",
  "main": "./index.js",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "^53.0.9",
    "expo-constants": "~17.1.6",
    "expo-status-bar": "~2.2.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-native": "0.79.2",
    "react-native-safe-area-context": "5.4.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2"
  },
  "private": true
}`
  },
  {
    path: 'app.json',
    content: `{
  "expo": {
    "name": "ShegoTaxi",
    "slug": "shego-taxi",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}`
  }
];

// Create the assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('✅ Created assets directory');
}

// Create a simple PNG (1x1 transparent pixel)
const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

// Create required image files
const requiredImages = [
  'icon.png',
  'splash.png',
  'adaptive-icon.png',
  'favicon.png'
];

requiredImages.forEach(imageName => {
  const imagePath = path.join(assetsDir, imageName);
  fs.writeFileSync(imagePath, pngData);
  console.log(`✅ Created ${imageName}`);
});

// Create the files
files.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  // Create a backup if the file already exists
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`Created backup: ${backupPath}`);
  }
  
  // Write the new file
  fs.writeFileSync(filePath, file.content, 'utf8');
  console.log(`✅ Created ${file.path}`);
});

console.log('\n✅ All files created successfully!');
console.log('\nNow run:');
console.log('rm -rf node_modules');
console.log('npm cache clean --force');
console.log('npm install');
console.log('npx expo start --clear');

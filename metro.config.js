// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this to ensure proper resolution of Expo Router
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

module.exports = config;
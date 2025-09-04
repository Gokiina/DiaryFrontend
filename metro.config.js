// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// --- ESTA ES LA LÍNEA MÁGICA ---
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
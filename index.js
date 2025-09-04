// index.js

import { AppRegistry } from 'react-native';
import App from './App';
// Ya no necesitamos esta línea, puedes borrarla o comentarla
// import { name as appName } from './app.json';

// ANTES:
// AppRegistry.registerComponent(appName, () => App);

// DESPUÉS (la línea que necesitas):
AppRegistry.registerComponent("main", () => App);
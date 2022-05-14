import 'expo-dev-client';

import { registerRootComponent } from 'expo';
import App from './App';
import TrackPlayer from 'react-native-track-player';
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema, modelClassArr as modelClasses } from "@/utils/schema";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => require('./trackserver'));

const adapter = new SQLiteAdapter({
    dbName: 'yeaplaymusic',
    schema, jsi: false, onSetUpError: error => { console.error('sqlite db setup failure', error);}
})

export const database = new Database({
    adapter, modelClasses
})
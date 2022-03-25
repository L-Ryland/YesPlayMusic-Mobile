import 'expo-dev-client';

import { registerRootComponent } from 'expo';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from './App';
// import TrackPlayer from 'react-native-track-player';
import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { schema, modelClassArr as modelClasses } from "@/utils/schema";
import { store, persistor } from './redux/store';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(
  () => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  )
  // App
);
// TrackPlayer.registerPlaybackService(() => {
// 	require('./trackserver');
// });
// const adapter = new SQLiteAdapter({
//     dbName: 'yeaplaymusic',
//     schema, migrations, jsi: true, onSetUpError: error => { console.error('sqlite db setup failure', error);}
// })
const adapter = new LokiJSAdapter({
  schema, useWebWorker: false, useIncrementalIndexedDB: true, onQuotaExceededError: (error) => { console.error("Browser run out of disk space", error); }, onSetUpError: (error) => { console.error("Database failed to load", error); }, extraIncrementalIDBOptions: {
    onDidOverwrite: () => { },
    onversionchange: () => { }
  }
})
export const database = new Database({
  adapter, modelClasses
})

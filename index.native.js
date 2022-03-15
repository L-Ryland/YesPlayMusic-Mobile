import 'expo-dev-client';

import { registerRootComponent } from 'expo';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from './redux/store';

import App from './App';
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema, modelClassArr as modelClasses } from "@/utils/schema";

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
 ));

const adapter = new SQLiteAdapter({
    dbName: 'yeaplaymusic',
    schema, jsi: false, onSetUpError: error => { console.error('sqlite db setup failure', error);}
})

export const database = new Database({
    adapter, modelClasses
})
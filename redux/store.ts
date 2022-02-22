import { apiSlice } from "./slice/apiSlice";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ...
import settingsReducer from "./slice/settingsSlice";
import dataReducer from "./slice/dataSlice";
// import saga from "./saga";

const persistSettigsReducer = persistReducer(
  { key: "settings", storage: AsyncStorage },
  settingsReducer,
);
const dataPersistReducer = persistReducer(
  { key: "data", storage: AsyncStorage },
  dataReducer,
);

export const store = configureStore({
  reducer: {
    // posts: postsReducer,
    // comments: commentsReducer,
    // users: usersReducer,
    // settings: settingsReducer,
    settings: persistSettigsReducer,
    // data: dataReducer,
    data: dataPersistReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// use default export to prevent sagaMiddleware running command executed after the store running.
// export default store;
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

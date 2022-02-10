import { apiSlice } from './slice/apiSlice';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import createSagaMiddleware from "redux-saga";
// ...
import settingsReducer from "./slice/settingsSlice";
import dataReducer from "./slice/dataSlice";
// import saga from "./saga";

// const sagaMiddleware  = createSagaMiddleware();
const store = configureStore({
  reducer: {
    // posts: postsReducer,
    // comments: commentsReducer,
    // users: usersReducer,
    settings: settingsReducer, 
    data: dataReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware=> getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production'
})

// use default export to prevent sagaMiddleware running command executed after the store running. 
export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
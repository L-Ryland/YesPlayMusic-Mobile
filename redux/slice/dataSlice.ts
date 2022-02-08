import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

type userType = {};
type likedSongPlayListIDType = Number;
type lastRefreshCookieDateType = Number;
type loginModeType = String | null

// Define a type for the slice state
interface GeneralState {
  user: userType,
  likedSongPlaylistID: likedSongPlayListIDType,
  lastRefreshCookieDate: lastRefreshCookieDateType,
  loginMode: loginModeType,
}

// Define the initial state using that type
const initialState: GeneralState = {
  user: {},
  likedSongPlaylistID: 0,
  lastRefreshCookieDate: 0,
  loginMode: null, 
}

export const dataSlice = createSlice({
  name: 'data',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<userType>) => {
      state.user = action.payload;
    },
    setLikedSongPlaylist: (state, action: PayloadAction<likedSongPlayListIDType>) => {
      state.likedSongPlaylistID = action.payload;
    },
    setLastRefreshCookieDate: (state, action: PayloadAction<lastRefreshCookieDateType>) => {
      state.lastRefreshCookieDate = action.payload;
    },
    setLoginMode: (state, action: PayloadAction<loginModeType>) => {
      state.loginMode = action.payload;
    },
  },
})

export const { 
  setUser, setLikedSongPlaylist, setLastRefreshCookieDate, setLoginMode
} = dataSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectData = (state: RootState) => state.data

export default dataSlice.reducer
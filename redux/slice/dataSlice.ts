import { userAccount, userPlayHistory } from '@/api/';
import { isAccountLoggedIn } from '@/utils/auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
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
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, {payload}) => { 
      state.user = payload;
    })
  }
})

export const fetchUserProfile = createAsyncThunk(
  'data/fetchUserProfile',
  async (param, thunkAPI) => {
    if (!isAccountLoggedIn()) return;
    return userAccount().then(
      (result: any) => result.profile
    )
  }
);
/**
 *
 * @param {*} user
 * @param {*} thunkAPI
 * @return {*} 
 */
export const fetchPlayHistory = createAsyncThunk(
  'data/fetchPlayHistory',
  
  async (user: any, thunkAPI) => {
    if (!isAccountLoggedIn()) return;
    return Promise.all([
      userPlayHistory({ uid: user?.userId, type: 0 }),
      userPlayHistory({ uid: user?.userId, type: 1 }),
    ]).then(result => {
      const data = {};
      const dataType = { 0: 'allData', 1: 'weekData' };
      if (result[0] && result[1]) {
        for (let i = 0; i < result.length; i++) {
          const songData = result[i][dataType[i]].map(item => {
            const song = item.song;
            song.playCount = item.playCount;
            return song;
          });
          data[[dataType[i]]] = songData;
        }
        commit('updateLikedXXX', {
          name: 'playHistory',
          data: data,
        });
      }
    });
  },
) 
export const {
  setUser, setLikedSongPlaylist, setLastRefreshCookieDate, setLoginMode
} = dataSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectData = (state: RootState) => state.data

export default dataSlice.reducer
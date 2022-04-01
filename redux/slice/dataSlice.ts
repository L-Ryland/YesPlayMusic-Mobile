import { userAccount, userPlayHistory, userPlaylist, logout, likedAlbums, likedArtists } from '@/api/';
import { doLogout, isAccountLoggedIn, isLooseLoggedIn } from '@/utils/auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { build } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle';
import type { RootState } from '../store'

type likedSongPlayListIDType = Number;
type lastRefreshCookieDateType = Number;
type loginModeType = String | null

interface UserType { userId?: number, [key: string]: any };
interface LikedItemInject {
  name: string,
  data: {}
}
interface PayLoadInject {
  key: string,
  value: any
}

// Define a type for the slice state
interface GeneralState {
  user: UserType,
  likedSongPlaylistID: likedSongPlayListIDType,
  lastRefreshCookieDate: lastRefreshCookieDateType,
  loginMode: loginModeType,
  liked,
}

// Define the initial state using that type
const initialState: GeneralState = {
  user: {},
  likedSongPlaylistID: 0,
  lastRefreshCookieDate: 0,
  loginMode: null,
  liked: {},
}

export const dataSlice = createSlice({
  name: 'data',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLikedSongPlaylist: (state, action: PayloadAction<likedSongPlayListIDType>) => {
      state.likedSongPlaylistID = action.payload;
    },
    setLastRefreshCookieDate: (state, action: PayloadAction<lastRefreshCookieDateType>) => {
      state.lastRefreshCookieDate = action.payload;
    },
    setLoginMode: (state, action: PayloadAction<loginModeType>) => {
      state.loginMode = action.payload;
    },
    updatedLikedItems: (state, { payload }: PayloadAction<LikedItemInject>) => {
      const { name, data } = payload;
      state.liked[name] = data;
    },
    updateData: (state, { payload }: PayloadAction<PayLoadInject>) => {
      const { key, value } = payload;
      state[key] = value;
    },
    logOut: (state, { payload }: PayloadAction) => {
      Object.keys(initialState).forEach((key) => {
        state[key] = initialState[key];
      });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => { })
  }
})
/**
 * fetch user profile
 *
 * @return {*} profile data
 */
export const fetchUserProfile = createAsyncThunk(
  'data/fetchUserProfile',
  async (param, { dispatch, fulfillWithValue }) => {
    console.log("isAccount logged in", isAccountLoggedIn());
    
    if (!isAccountLoggedIn()) return;
    return userAccount().then(
      (result: any) => {
        console.log("account result", result);

        dispatch(updateData({
          key: 'user', value: result.profile,
        }));
        return result.profile.userId
      }
    )
  }
);
/**
 * fetch play history and dispatach data to `liked` state
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
          data[dataType[i]] = songData;
          console.log("songData", data);
        }
        thunkAPI.dispatch(updatedLikedItems({
          name: 'playHistory', data
        }))
        return {
          name: 'playHistory', data
        };
      }
    });
  },
);

/**
 * if there is account loggined in, update user playlists and user likedSongPlaylistID
 *
 * @param {*} params
 * @param {*} thunkAPI
 * @return {*} 
 */
export const fetchLikedPlaylist = createAsyncThunk(
  'data/fetchLikedPlaylist',
  // ({ state, commit }) => {
  async (userId: number, thunkAPI) => {
    console.log("is loose logged in? ", isLooseLoggedIn());
    
    if (!isLooseLoggedIn()) return;
    if (isAccountLoggedIn() && userId) {
      return userPlaylist({
        uid: userId,
        limit: 2000, // 最多只加载2000个歌单（等有用户反馈问题再修）
        timestamp: new Date().getTime(),
      }).then((result: any) => {
        
        if (result.playlist) {
          thunkAPI.dispatch(updatedLikedItems({
            name: 'playlists',
            data: result.playlist,
          })),
            // 更新用户”喜欢的歌曲“歌单ID
            thunkAPI.dispatch(updateData({
              key: 'likedSongPlaylistID',
              value: result.playlist[0].id,
            }))
        }
      });
    } else {
      // TODO:搜索ID登录的用户
    }
  },
)

/**
 * if there is account loggined in, fetch liked albums
 *
 * @param {*} params
 * @param {*} thunkAPI
 * @return {*} 
 */
export const fetchLikedAlbums = createAsyncThunk(
  'data/fetchLikedAlbums', 
  async (params:any, thunkAPI) => {
    
  }
)


/**
 * if there is account loggined in, fetch liked artists
 *
 * @param {*} params
 * @param {*} thunkAPI
 * @return {*} 
 */
 export const fetchLikedArtists = createAsyncThunk(
  'data/fetchLikedAlbums', 
  async (params, thunkAPI) => {
    if (!isAccountLoggedIn()) thunkAPI.rejectWithValue('account not logged in');
    return likedAlbums({ limit: 2000 }).then(result => {
      if (result.data) {
        thunkAPI.dispatch(updatedLikedItems({
          name: 'albums',
          data: result.data,
        }))
      }
    });
  }
)

/**
 * if there is account loggined in, fetch liked mvs
 *
 * @param {*} params
 * @param {*} thunkAPI
 * @return {*} 
 */
 export const fetchLikedMVs = createAsyncThunk(
  'data/fetchLikedAlbums', 
  async (params:any, thunkAPI) => {
    if (!isAccountLoggedIn()) thunkAPI.rejectWithValue('account not logged in');
    return likedArtists({ limit: 2000 }).then(result => {
      if (result.data) {
        // commit('updateLikedXXX', {
        //   name: 'artists',
        //   data: result.data,
        // });
      }
    }); 
  }
)

/**
 * if there is account loggined in, fetch data from cloud disk
 *
 * @param {*} params
 * @param {*} thunkAPI
 * @return {*} 
 */
 export const fetchCloudDisk = createAsyncThunk(
  'data/fetchLikedAlbums', 
  async (params:any, thunkAPI) => {
    
  }
)


/**
 * log out from server
 *
 * @param {*} params
 * @param {*} thunkAPI
 */
export const logOutThunk = createAsyncThunk(
  'data/logout',
  async (params, { dispatch }) => {
    doLogout();
    dispatch(logOut())
  }
)
export const {
  setLikedSongPlaylist, setLastRefreshCookieDate, setLoginMode, updatedLikedItems, updateData, logOut
} = dataSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectData = (state: RootState) => state.data

export default dataSlice.reducer
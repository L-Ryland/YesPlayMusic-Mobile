import { userAccount, userPlayHistory, userPlaylist, logout, likedAlbums, likedArtists, cloudDisk, likedMVs, userLikedSongsIDs, getPlaylistDetail, getTrackDetail } from '@/api/';
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
 * if there is account loggined in, update user 
 * liked playlist, 
 * liked albums,
 * liked artists, 
 * like mvs and data from cloud disk
 *
 * @param {*} params
 * @param {*} thunkAPI
 * @return {*} 
 */
export const fetchLikedThings = createAsyncThunk(
  'data/fetchLikedThings',
  // ({ state, commit }) => {
  async (userId: number, thunkAPI) => {
    console.log("is loose logged in? ", isLooseLoggedIn());

    if (!isLooseLoggedIn()) return;
    if (isAccountLoggedIn() && userId) {
      let result;
      // fetch liked songs, update `songs` into `state.data`
      result = await userLikedSongsIDs(userId);
      if (result.ids) {
        thunkAPI.dispatch(updatedLikedItems({
          name: 'songs',
          data: result.ids,
        }))
      }

      // update `playlist` and `likedSongPlaylistID` into `state.data`
      result = await userPlaylist({
        uid: userId,
        limit: 2000, // 最多只加载2000个歌单（等有用户反馈问题再修）
        timestamp: new Date().getTime(),
      })
      if (result.playlist) {
        let likedSongPlaylistID: number = result.playlist[0].id;
        console.log("likedSongPlaylistID", likedSongPlaylistID, result.playlist[0].id);
        
        thunkAPI.dispatch(updatedLikedItems({
          name: 'playlists',
          data: result.playlist,
        })),
          // 更新用户”喜欢的歌曲“歌单ID
          thunkAPI.dispatch(updateData({
            key: 'likedSongPlaylistID',
            value: likedSongPlaylistID,
          }))
        // fetch liked songs with details, update `songsWithDetails` into `state.data`
        result = await getPlaylistDetail(likedSongPlaylistID, true);
        let trackIds = result.playlist.trackIds;
        if (trackIds.length == 0) {
          result = new Promise<void>(resolve => resolve())
        }
        result = await getTrackDetail(
          trackIds
            .slice(0, 12)
            .map(t => t.id)
            .join(',')
        )
        
        if (result.songs) {
          thunkAPI.dispatch(updatedLikedItems({
            name: 'songsWithDetails',
            data: result.songs,
          }))
        }
      }
      // update `albums` into `state.data`
      result = await likedAlbums({ limit: 2000 });
      if (result.data) {
        thunkAPI.dispatch(updatedLikedItems({
          name: 'albums',
          data: result.data,
        }))
      }
      // update `artists` into `state.data`
      result = await likedArtists({ limit: 2000 });
      if (result.data) {
        thunkAPI.dispatch(updatedLikedItems({
          name: 'artists',
          data: result.data,

        }))
      }
      // update `mvs` into `state.data`
      result = await likedMVs({ limit: 1000 });
      if (result.data) {
        thunkAPI.dispatch(updatedLikedItems({
          name: 'mvs',
          data: result.data,

        }))
      }
      // update `cloudDisk` into `state.data`
      result = await cloudDisk({ limit: 1000 });
      thunkAPI.dispatch(updatedLikedItems({
        name: 'cloudDisk',
        data: result.data,
      }))
    } else {
      // TODO:搜索ID登录的用户
    }
  },
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
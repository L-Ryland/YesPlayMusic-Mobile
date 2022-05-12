import {
  fetchUserAccount,
  userPlayHistory,
  fetchUserPlaylists as fetchUserPlaylistsFromApi,
  fetchUserAlbums as fetchUserAlbumsFromApi,
  fetchUserArtists as fetchUserArtistsFromApi,
  fetchCloudDisk as fetchCloudDiskFromApi,
  fetchLikedMVs as fetchLikedMVsFromApi,
  fetchUserLikedTracksIDs as fetchUserLikedTracksIDsFromApi,
  fetchPlaylist as fetchPlaylistfromApi,
  fetchTracks as fetchTracksFromApi,
} from "@/api/";
import { doLogout, isAccountLoggedIn, isLooseLoggedIn } from "@/utils/auth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface LikedItemInject {
  name: string;
  data: {};
}
interface PayLoadInject<T> {
  key: keyof T;
  value: T[keyof T];
}

// Define a type for the slice state
interface GeneralState {
  user: User | null;
  likedSongPlaylistID: number;
  lastRefreshCookieDate: number;
  loginMode: string | null;
  liked: {
    songs?: number[];
    playlists?: unknown[];
    songsWithDetails?: unknown[];
    albums?: unknown[];
    artists?: unknown[];
    mvs?: unknown[];
    cloudDisk?: unknown[];
  };
}

// Define the initial state using that type
const initialState: GeneralState = {
  user: null,
  likedSongPlaylistID: 0,
  lastRefreshCookieDate: 0,
  loginMode: null,
  liked: {},
};

export const dataSlice = createSlice({
  name: "data",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLikedSongPlaylist: (state, action: PayloadAction<number>) => {
      state.likedSongPlaylistID = action.payload;
    },
    setLastRefreshCookieDate: (state, action: PayloadAction<number>) => {
      state.lastRefreshCookieDate = action.payload;
    },
    setLoginMode: (state, action: PayloadAction<string>) => {
      state.loginMode = action.payload;
    },
    updatedLikedItems: (state, { payload }: PayloadAction<LikedItemInject>) => {
      const { name, data } = payload;
      state.liked[name] = data;
    },
    updateData: (
      state,
      { payload }: PayloadAction<PayLoadInject<GeneralState>>
    ) => {
      const { key, value } = payload;
      (<typeof value>state[key]) = value;
    },
    logOut: (state, _: PayloadAction<void>) => {
      Object.keys(initialState).forEach((key) => {
        state[key] = initialState[key];
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {});
  },
});
/**
 * fetch user profile
 *
 * @return {*} profile data
 */
export const fetchUserProfile = createAsyncThunk(
  "data/fetchUserProfile",
  async (param, { dispatch }) => {
    console.log("isAccount logged in", isAccountLoggedIn());

    if (!isAccountLoggedIn()) return;
    return fetchUserAccount().then((result: any) => {
      dispatch(
        updateData({
          key: "user",
          value: result.profile,
        })
      );
      console.log("payload expect", result.profile.userId);

      return result.profile.userId;
    });
  }
);
/**
 * fetch play history and dispatach data to `liked` state
 * @param {*} user
 * @param {*} thunkAPI
 * @return {*}
 */
export const fetchPlayHistory = createAsyncThunk(
  "data/fetchPlayHistory",

  async (user: any, thunkAPI) => {
    if (!isAccountLoggedIn()) return;
    return Promise.all([
      userPlayHistory({ uid: user?.userId, type: 0 }),
      userPlayHistory({ uid: user?.userId, type: 1 }),
    ]).then((result) => {
      const data = {};
      const dataType = { 0: "allData", 1: "weekData" };
      if (result[0] && result[1]) {
        for (let i = 0; i < result.length; i++) {
          const songData = result[i][dataType[i]].map((item) => {
            const song = item.song;
            song.playCount = item.playCount;
            return song;
          });
          data[dataType[i]] = songData;
          console.log("songData", data);
        }
        thunkAPI.dispatch(
          updatedLikedItems({
            name: "playHistory",
            data,
          })
        );
        return {
          name: "playHistory",
          data,
        };
      }
    });
  }
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
  "data/fetchLikedThings",
  // ({ state, commit }) => {
  async (userId: number, thunkAPI) => {
    console.log("is loose logged in? ", isLooseLoggedIn());

    if (!isLooseLoggedIn()) {
      await thunkAPI.dispatch(logOutThunk());
      thunkAPI.rejectWithValue("not logged in");
    }
    if (isAccountLoggedIn() && userId) {
      let result;
      // fetch liked songs, update `songs` into `state.data`
      result = await fetchUserLikedTracksIDsFromApi({ uid: userId });
      if (result.ids) {
        thunkAPI.dispatch(
          updatedLikedItems({
            name: "songs",
            data: result.ids,
          })
        );
      }

      // update `playlist` and `likedSongPlaylistID` into `state.data`
      result = await fetchUserPlaylistsFromApi({
        uid: userId,
        limit: 2000, // 最多只加载2000个歌单（等有用户反馈问题再修）
      });
      if (result.playlist) {
        let likedSongPlaylistID: number = result.playlist[0].id;
        console.log("likedSongPlaylistID", likedSongPlaylistID, result);

        thunkAPI.dispatch(
          updatedLikedItems({
            name: "playlists",
            data: result.playlist,
          })
        );
        // 更新用户”喜欢的歌曲“歌单ID
        thunkAPI.dispatch(
          updateData({
            key: "likedSongPlaylistID",
            value: likedSongPlaylistID,
          })
        );
        // fetch liked songs with details, update `songsWithDetails` into `state.data`
        let trackIds = await (
          await fetchPlaylistfromApi({ id: likedSongPlaylistID }, true)
        ).playlist.trackIds;
        if (!trackIds) {
          trackIds = [];
        }

        console.log("poccessed trackIds", trackIds);

        console.log("[dtaSlice.ts] [trackIds]", trackIds);
        result = await fetchTracksFromApi({
          ids: trackIds?.slice(0, 12).map((t) => t.id),
        });

        if (result.songs) {
          thunkAPI.dispatch(
            updatedLikedItems({
              name: "songsWithDetails",
              data: result.songs,
            })
          );
        }
      }
      // update `albums` into `state.data`
      result = await fetchUserAlbumsFromApi({ limit: 2000 });
      console.log(
        "[data.ts] [fetchUserAlbums]",
        await fetchUserAlbumsFromApi({ limit: 2000 })
      );

      if (result.data) {
        thunkAPI.dispatch(
          updatedLikedItems({
            name: "albums",
            data: result.data,
          })
        );
      }
      // update `artists` into `state.data`
      result = await fetchUserArtistsFromApi();
      if (result.data) {
        thunkAPI.dispatch(
          updatedLikedItems({
            name: "artists",
            data: result.data,
          })
        );
      }
      // update `mvs` into `state.data`
      result = await fetchLikedMVsFromApi({ limit: 1000 });
      if (result.data) {
        thunkAPI.dispatch(
          updatedLikedItems({
            name: "mvs",
            data: result.data,
          })
        );
      }
      // update `cloudDisk` into `state.data`
      result = await fetchCloudDiskFromApi({ limit: 1000 });
      thunkAPI.dispatch(
        updatedLikedItems({
          name: "cloudDisk",
          data: result.data,
        })
      );
    } else {
      // TODO:搜索ID登录的用户
    }
    return true;
  }
);

/**
 * log out from server
 *
 * @param {*} params
 * @param {*} thunkAPI
 */
export const logOutThunk = createAsyncThunk(
  "data/logout",
  async (params, { dispatch }) => {
    doLogout();
    dispatch(logOut());
  }
);
export const {
  setLikedSongPlaylist,
  setLastRefreshCookieDate,
  setLoginMode,
  updatedLikedItems,
  updateData,
  logOut,
} = dataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectData = (state: RootState) => state.data;

export default dataSlice.reducer;

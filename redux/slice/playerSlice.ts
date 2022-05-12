import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

import shuffle from "lodash/shuffle";

import { fetchAudioSource } from '@/api';
import { cacheTrackSource } from '@/utils/db';



// Define a type for the slice state
interface GeneralState {
  playing: boolean;
  progress: number;
  enabled: boolean;
  repeatMode: 'off' | 'on' | 'one';
  shuffle: boolean;
  reversed: boolean;
  volume: number,
  volumeBeforeMuted: number,
  personalFMLoading: boolean,
  personalFMNextLoading: boolean;

  list: Array<any>;
  current: number;
  shuffledList: Array<any>;
  shuffledCurrent: number;
  playlistSource: { type: string, id: number, [key: string]: any };
  currentTrack: { id: number, [key: string]: any };
  playNextList: Array<any>;
  isPersonalFM: boolean;
  personalFMTrack: { id: number, [key: string]: any };
  personalFMNextTrack: { id: number, [key: string]: any };
  trackTimestamp: AudioTimestamp,
  hasLyrics: boolean,
  trackPlayer,
  State,
  Event,
}

// Define the initial state using that type
const initialState: GeneralState = {
  playing: false, // 是否正在播放中
  progress: 0, // 当前播放歌曲的进度
  enabled: false, // 是否启用Player
  repeatMode: 'off', // off | on | one
  shuffle: false, // true | false
  reversed: false,
  volume: 1, // 0 to 1
  volumeBeforeMuted: 1, // 用于保存静音前的音量
  personalFMLoading: false, // 是否正在私人FM中加载新的track
  personalFMNextLoading: false, // 是否正在缓存私人FM的下一首歌曲

  list: [], // 播放列表
  current: 0, // 当前播放歌曲在播放列表里的index
  shuffledList: [], // 被随机打乱的播放列表，随机播放模式下会使用此播放列表
  shuffledCurrent: 0, // 当前播放歌曲在随机列表里面的index
  playlistSource: { type: 'album', id: 123 }, // 当前播放列表的信息
  currentTrack: { id: 86827685 }, // 当前播放歌曲的详细信息
  playNextList: [], // 当这个list不为空时，会优先播放这个list的歌
  isPersonalFM: false, // 是否是私人FM模式
  personalFMTrack: { id: 0 }, // 私人FM当前歌曲
  personalFMNextTrack: { id: 0 },
  trackTimestamp: {
    contextTime: 0,
    performanceTime: 0,
  },
  hasLyrics: false,
  trackPlayer: undefined,
  State: undefined,
  Event: undefined,
}

export const setTracklist = createAsyncThunk(
  'player/setPlaylist',
  async (tracks: Array<any>, thunkAPI) => {
    console.log("currentstate", thunkAPI.getState());
    // generate directly played playlist
    const newTracks = await Promise.all(tracks.map(async (track) => {
      console.log("current track", track);

      const source = await fetchAudioSource(track.id).then(result => {

        if (!result.data[0]) return null;
        if (!result.data[0].url) return null;
        if (result.data[0].freeTrialInfo !== null) return null; // 跳过只能试听的歌曲
        const source = result.data[0].url.replace(/^http:/, 'https:');
        const currentState = thunkAPI.getState();
        console.log("currentstate", currentState);
        const automaticallyCacheSongs = false;
        if (automaticallyCacheSongs) {
          cacheTrackSource(track, source, result.data[0].br);
        }

        return source;
      });
      const artists = track.ar.length == 1 ? track.ar[0].name : track.ar.reduce((prev, cur) => prev.name + ", " + cur.name);
      return {
        url: source,
        title: track.name,
        artist: artists,
        artwork: track.al.picUrl,
      };
    }));

    return newTracks;
  }
)
export const playerSlice = createSlice({
  name: 'player',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPlayingStatus: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload;
    },
    setTrackTimeStamp: (state, action: PayloadAction<AudioTimestamp>) => {
      state.trackTimestamp = action.payload;
    },
    setHasLyrics: (state, action: PayloadAction<boolean>) => {
      state.hasLyrics = action.payload;
    },
    setList: (state, action: PayloadAction<Array<any>>) => {
      state.list = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setTracklist.fulfilled, (state, action) => {
      const list = action.payload;
      state.list = list;
      state.shuffledList = shuffle(list);
    })
  }
})


export const {
  setPlayingStatus, setTrackTimeStamp, setList
} = playerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayer = (state: RootState) => state.player;

export default playerSlice.reducer
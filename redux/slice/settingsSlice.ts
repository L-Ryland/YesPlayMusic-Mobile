import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


export type langProp = 'en'|'tr'|'zh-CN'|'zh-TW';
export type appreanceProp = 'auto'|'light'|'dark';
export type musicLangProp = 'all'|'zh'|'ea'|'jp'|'kr';
export type musicQualityProp =128000|192000|320000|999000;
export type showLyricsTranslationProp = Boolean;
export type lyricsBackgroundProp = 'on'|'off'|'blur';
export type lyricFontSizeProp = 'small'|'medium'|'large'|'xlarge';
// Define a type for the slice state
interface SettingsState {
  lang: langProp,
  appearance: appreanceProp,
  musicLanguage: musicLangProp,
  musicQuality: musicQualityProp, 
  showLyricsTranslation: showLyricsTranslationProp,
  lyricsBackground: lyricsBackgroundProp,
  lyricFontSize: lyricFontSizeProp,
  outputDevice: String,
  showPlaylistsByAppleMusic: Boolean,
  enableUnblockNeteaseMusic: Boolean 
  automaticallyCacheSongs: Boolean,
  cacheLimit: Number,
  enableReversedMode: Boolean,
  nyancatStyle: Boolean,
  enableDiscordRichPresence: Boolean,
  enableGlobalShortcut: Boolean
  subTitleDefault: Boolean
  enabledPlaylistCategories: Boolean,
  showLibraryDefault: Boolean,
  proxyConfig: {
    protocol: String,
    server: String, 
    port: Number
  }
}
const settingsAdapter = createEntityAdapter<SettingsState>({});
// Define the initial state using that type
const initialState: SettingsState = {
    lang: 'en',
    musicLanguage: 'all',
    appearance: 'auto',
    musicQuality: 320000,
    lyricFontSize: 'medium',
    outputDevice: 'default',
    showPlaylistsByAppleMusic: true,
    enableUnblockNeteaseMusic: true,
    automaticallyCacheSongs: true,
    cacheLimit: 8192,
    enableReversedMode: false,
    nyancatStyle: false,
    showLyricsTranslation: true,
    lyricsBackground: 'on',
    enableDiscordRichPresence: false,
    enableGlobalShortcut: true,
    showLibraryDefault: false,
    subTitleDefault: false,
    enabledPlaylistCategories: true,
    proxyConfig: {
      protocol: 'noProxy',
      server: '',
      port: 0,
    },
}

export const settingsSlice = createSlice({
  name: 'settings',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: settingsAdapter.getInitialState(initialState),
  reducers: {
    switchLang: (state, action: PayloadAction<langProp>) => {
      state.lang = action.payload;
    },
    switchAppearance: (state, action: PayloadAction<appreanceProp>) => {
      state.appearance = action.payload;
    },
    switchMusicLang: (state, action: PayloadAction<musicLangProp>) => {
      state.musicLanguage = action.payload;
    },
    switchMusicQuality: (state, action: PayloadAction<musicQualityProp>) => {
      state.musicQuality = action.payload;
    },
    switchShowTranslation: (state, action: PayloadAction<showLyricsTranslationProp>) => {
      state.showLyricsTranslation = action.payload;
    },
    switchLyricsBackGround: (state, action: PayloadAction<lyricsBackgroundProp>) => {
      state.lyricsBackground = action.payload;
    },
    switchLyricsFontSize: (state, action: PayloadAction<lyricFontSizeProp>) => {
      state.lyricFontSize = action.payload;
    },
  },
})

export const { 
  switchLang, 
  switchAppearance, 
  switchMusicLang,
  switchMusicQuality,
  switchShowTranslation,
  switchLyricsBackGround,
  switchLyricsFontSize
} = settingsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
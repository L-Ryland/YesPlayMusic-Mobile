import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'


export type langProp = 'en'|'tr'|'zh-CN'|'zh-TW';
export type apreanceProp = 'auto'|'light'|'dark';
export type musicLangProp = 'all'|'zh'|'ea'|'jp'|'kr';
export type musicQualityProp =128000|192000|320000|999000;
export type showLyricsTranslationProp = Boolean;
export type lyricsBackgroundProp = 'on'|'off'|'blur';
export type lyricFontSizeProp = 'small'|'medium'|'large'|'xlarge';
// Define a type for the slice state
interface GeneralState {
  lang: langProp,
  appearance: apreanceProp,
  musicLanguage: musicLangProp,
  musicQuality: musicQualityProp, 
  showLyricsTranslation: showLyricsTranslationProp,
  lyricsBackground: lyricsBackgroundProp,
  lyricFontSize: lyricFontSizeProp,
}

// Define the initial state using that type
const initialState: GeneralState = {
  lang: 'en',
  appearance: 'auto',
  musicLanguage: 'all',
  musicQuality: 128000,
  showLyricsTranslation: true,
  lyricsBackground: 'off',
  lyricFontSize: 'medium'
}

export const settingsSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    switchLang: (state, action: PayloadAction<langProp>) => {
      state.lang = action.payload;
    },
    switchAppearance: (state, action: PayloadAction<apreanceProp>) => {
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
export const selectSettings = (state: RootState) => state.settings

export default settingsSlice.reducer
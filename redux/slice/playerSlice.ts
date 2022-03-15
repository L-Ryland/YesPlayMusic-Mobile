import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'



// Define a type for the slice state
interface GeneralState {
  playing: boolean,
  trackTimestamp: AudioTimestamp,
  hasLyrics: boolean,
}

// Define the initial state using that type
const initialState: GeneralState = {
  playing: false,
  trackTimestamp: {
    contextTime: 0,
    performanceTime: 0,
  },
  hasLyrics: false,
}

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
    }

  },
})

export const {
  setPlayingStatus, setTrackTimeStamp
} = playerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPlayer = (state: RootState) => state.player;

export default playerSlice.reducer
import { playlistCategories } from "@/utils/staticData";
import { subscribe } from "valtio";
import proxyWithPersist, { PersistStrategy } from "valtio-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storage from "@/utils/storage";
import { devtools } from "valtio/utils";

export enum Lang {
  EN = "en",
  TR = "tr",
  CN = "zh-CN",
  TW = "zh-TW",
}
export enum Appearance {
  Auto = "auto",
  Light = "light",
  Dark = "dark"
}
export enum MusicLang {
  zh  = 1,
  ea,
  jp,
  kr,
}
export enum MusicQuality {
  Low = 128000,
  Normal = 192000,
  High = 32000,
  FLAC = 999000,
}
export enum LyricsBackground {
  On = "on",
  Off = "off",
  Blur = "blur",
}
export enum LyricsFontSize {
  Small = "16px",
  Medium = "22px",
  Large = "28px",
  Xlarge = "36px"
}

// Define a type for the slice state
const enabledPlaylistCategories = playlistCategories
  .filter((c) => c.enable)
  .map((c) => c.name);

export interface SettingsState {
  lang: Lang;
  appearance: Appearance;
  musicLanguage: MusicLang | undefined;
  musicQuality: MusicQuality;
  showLyricsTranslation: boolean;
  lyricsBackground: LyricsBackground;
  lyricFontSize: LyricsFontSize;
  outputDevice: string;
  showPlaylistsByAppleMusic: boolean;
  enableUnblockNeteaseMusic: boolean;
  automaticallyCacheSongs: boolean;
  cacheLimit: number;
  enableReversedMode: boolean;
  nyancatStyle: boolean;
  enableDiscordRichPresence: boolean;
  enableGlobalShortcut: boolean;
  subTitleDefault: boolean;
  enabledPlaylistCategories: string[];
  showLibraryDefault: boolean;
  proxyConfig: {
    protocol: string;
    server: string;
    port: number;
  };
}

// Define the initial state using that type
const initialState: SettingsState = {
  lang: Lang.EN,
  musicLanguage: MusicLang.ea,
  appearance: Appearance.Auto,
  musicQuality: 320000,
  lyricFontSize: LyricsFontSize.Medium,
  outputDevice: "default",
  showPlaylistsByAppleMusic: true,
  enableUnblockNeteaseMusic: true,
  automaticallyCacheSongs: true,
  cacheLimit: 8192,
  enableReversedMode: false,
  nyancatStyle: false,
  showLyricsTranslation: true,
  lyricsBackground: LyricsBackground.On,
  enableDiscordRichPresence: false,
  enableGlobalShortcut: true,
  showLibraryDefault: false,
  subTitleDefault: false,
  enabledPlaylistCategories,
  proxyConfig: {
    protocol: "noProxy",
    server: "",
    port: 0,
  },
};

export const settings = proxyWithPersist({
  // must be unique, files/paths will be created with this prefix
  name: "settings",

  initialState,
  persistStrategies: PersistStrategy.SingleFile,
  version: 0,
  migrations: {},

  // see "Storage Engine" section below
  getStorage: () => AsyncStorage,
});

// Other code such as selectors can use the imported `RootState` type
devtools(settings, { name: "settings", enabled: true });

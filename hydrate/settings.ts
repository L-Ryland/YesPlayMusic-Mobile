import { playlistCategories } from "@/utils/staticData";
import { subscribe } from "valtio";
import proxyWithPersist, { PersistStrategy } from "valtio-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storage from "@/utils/storage";
import { devtools } from "valtio/utils";

type langProp = "en" | "tr" | "zh-CN" | "zh-TW";
type appreanceProp = "auto" | "light" | "dark";
type musicLangProp = "all" | "zh" | "ea" | "jp" | "kr";
type musicQualityProp = 128000 | 192000 | 320000 | 999000;
type showLyricsTranslationProp = Boolean;
type lyricsBackgroundProp = "on" | "off" | "blur";
type lyricFontSizeProp = "small" | "medium" | "large" | "xlarge";
// Define a type for the slice state
const enabledPlaylistCategories = playlistCategories
  .filter((c) => c.enable)
  .map((c) => c.name);

export interface SettingsState {
  lang: langProp;
  appearance: appreanceProp;
  musicLanguage: musicLangProp;
  musicQuality: musicQualityProp;
  showLyricsTranslation: showLyricsTranslationProp;
  lyricsBackground: lyricsBackgroundProp;
  lyricFontSize: lyricFontSizeProp;
  outputDevice: String;
  showPlaylistsByAppleMusic: Boolean;
  enableUnblockNeteaseMusic: Boolean;
  automaticallyCacheSongs: Boolean;
  cacheLimit: Number;
  enableReversedMode: Boolean;
  nyancatStyle: Boolean;
  enableDiscordRichPresence: Boolean;
  enableGlobalShortcut: Boolean;
  subTitleDefault: Boolean;
  enabledPlaylistCategories: string[];
  showLibraryDefault: Boolean;
  proxyConfig: {
    protocol: String;
    server: String;
    port: Number;
  };
}

// Define the initial state using that type
const initialState: SettingsState = {
  lang: "en",
  musicLanguage: "all",
  appearance: "auto",
  musicQuality: 320000,
  lyricFontSize: "medium",
  outputDevice: "default",
  showPlaylistsByAppleMusic: true,
  enableUnblockNeteaseMusic: true,
  automaticallyCacheSongs: true,
  cacheLimit: 8192,
  enableReversedMode: false,
  nyancatStyle: false,
  showLyricsTranslation: true,
  lyricsBackground: "on",
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

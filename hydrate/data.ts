import proxyWithPersist, { PersistStrategy } from "valtio-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { devtools } from "valtio/utils";
import { FetchUserAccountResponse } from "@/api";

interface LikedItemInject {
  name: string;
  data: {};
}

// Define a type for the slice state
interface UserData {
  cookie: {key: string, value: string} | null;
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
const initialState: UserData = {
  cookie: null,
  likedSongPlaylistID: 0,
  lastRefreshCookieDate: 0,
  loginMode: null,
  liked: {},
};

export const userData = proxyWithPersist({
  name: "userData",
  initialState,
  persistStrategies: PersistStrategy.SingleFile,
  version: 0,
  migrations: {},
  getStorage: () => AsyncStorage,
});
devtools(userData, { name: "userData", enabled: true });
export const initialUserData = initialState;

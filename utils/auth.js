import Cookies from "js-cookie";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "@/api/auth";
// import store from '@/store';
import {
  setUser,
  setLikedSongPlaylist,
  setLoginMode,
} from "@/redux/slice/dataSlice";

export function setCookies(string) {
  const cookies = string.split(";;");
  cookies.map((cookie) => {
    document.cookie = cookie;
    const cookieKeyValue = cookie.split(";")[0].split("=");
    // localStorage.setItem(`cookie-${cookieKeyValue[0]}`, cookieKeyValue[1]);
    (async () => {
      try {
        await AsyncStorage.setItem(
          `cookie-${cookieKeyValue[0]}`,
          cookieKeyValue[1]
        );
      } catch (error) {
        console.error("Error occurs while putting cookie in async storage");
      }
    })();
  });
}

export function getCookie(key) {
  (async () => {
    if (!Cookies.get(key)) {
      try {
        return await AsyncStorage.getItem(`cookie-${key}`);
      } catch (error) {
        console.error("get cookie error", error);
      }
    }
    return Cookies.get(key);
  })();
  // return Cookies.get(key) ?? localStorage.getItem(`cookie-${key}`);
}

export function removeCookie(key) {
  Cookies.remove(key);
  (async () => {
    try {
      await AsyncStorage.removeItem(`cookie-${key}`);
    } catch (error) {
      console.error(
        `error deleting cookie key ${key} from Async Storage`,
        error
      );
    }
  })();
  // localStorage.removeItem(`cookie-${key}`);
}

// MUSIC_U 只有在账户登录的情况下才有
export function isLoggedIn() {
  return getCookie("MUSIC_U") !== undefined;
}

// 账号登录
export function isAccountLoggedIn() {
  return (
    getCookie("MUSIC_U") !== undefined &&
    store.state.data.loginMode === "account"
  );
}

// 用户名搜索（用户数据为只读）
export function isUsernameLoggedIn() {
  return store.state.data.loginMode === "username";
}

// 账户登录或者用户名搜索都判断为登录，宽松检查
export function isLooseLoggedIn() {
  return isAccountLoggedIn() || isUsernameLoggedIn();
}

export function doLogout() {
  logout();
  removeCookie("MUSIC_U");
  removeCookie("__csrf");
  // 更新状态仓库中的用户信息
  // store.commit('updateData', { key: 'user', value: {} });
  setUser({});
  // 更新状态仓库中的登录状态
  // store.commit('updateData', { key: 'loginMode', value: null });
  setLoginMode(null);
  // 更新状态仓库中的喜欢列表
  // store.commit('updateData', { key: 'likedSongPlaylistID', value: undefined });
  setLikedSongPlaylist(undefined);
}

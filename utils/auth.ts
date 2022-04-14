import Cookies from "js-cookie";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "@/api/auth";
import AsyncStorage from "@/utils/AsyncStorage";
import { Platform } from "expo-modules-core";
// import store from '@/store';

function getData() {
  const data = AsyncStorage.getItem('persist:data');
  return data;
}



export function setCookies(string) {
  const cookies = string.split(";;");
  cookies.map((cookie) => {
    if (Platform.OS == 'web') {
      document.cookie = cookie;
    }
    const cookieKeyValue = cookie.split(";")[0].split("=");
    // localStorage.setItem(`cookie-${cookieKeyValue[0]}`, cookieKeyValue[1]);
    AsyncStorage.setItem(
      `cookie-${cookieKeyValue[0]}`,
      cookieKeyValue[1]
    );
  });
}

export function getCookie(key) {
  let cookies;
  console.debug('getCookies initiate', cookies);
  if (Platform.OS == 'web') {
    cookies = Cookies.get(key);
  }
  console.debug('getCookies previous', cookies);
  cookies = AsyncStorage.getItem(`cookie-${key}`);
  console.debug('getCookies', cookies);
  return cookies;
  // return Cookies.get(key) ?? localStorage.getItem(`cookie-${key}`);
}

export function removeCookie(key) {
  if (Platform.OS == 'web') {
    Cookies.remove(key);
  }
  AsyncStorage.removeItem(`cookie-${key}`);
  // localStorage.removeItem(`cookie-${key}`);
}

// MUSIC_U 只有在账户登录的情况下才有
export function isLoggedIn() {
  return getCookie("MUSIC_U") !== undefined;
}

// 账号登录
export const isAccountLoggedIn = () => {
  const data = getData();
  return (
    getCookie("MUSIC_U") !== undefined &&
    // data.loginMode === "account"
    data?.loginMode?.search(/account/)
  );
}

// 用户名搜索（用户数据为只读）
export function isUsernameLoggedIn() {
  const data = getData();
  // return data.loginMode === 'username'
  return data?.loginMode?.search(/username/);
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
  // setUser({});
  // // 更新状态仓库中的登录状态
  // // store.commit('updateData', { key: 'loginMode', value: null });
  // setLoginMode(null);
  // // 更新状态仓库中的喜欢列表
  // // store.commit('updateData', { key: 'likedSongPlaylistID', value: undefined });
  // setLikedSongPlaylist(undefined);
}

import Cookies from "js-cookie";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "@/api/auth";
import storage from "@/utils/storage";
import { Platform } from "expo-modules-core";
import {l} from "i18n-js";
import {userData} from "@/hydrate/data";

// import store from '@/store';

async function getData() {
  return await storage.getAllDataForKey("data");
}

export async function setCookies(string) {
  const cookies = string.split(";;");
  await storage.save({
    key: "cookies",
    data: cookies.map((cookie) => {
      // if (Platform.OS == "web") document.cookie = cookie;
      const cookieKeyValue = cookie.split(";")[0].split("=");
      return { key: cookieKeyValue[0], value: cookieKeyValue[1] };
    }),
  });
  userData.cookie = await getCookie("MUSIC_U");
}

export async function getCookie(key) {
  // if (Platform.OS == "web") {
  //   return Cookies.get(key);
  // }
  try {
    const cookieData = await storage.load({ key: "cookies" });
    return cookieData.find((cookie) => cookie.key == key)??undefined;

  } catch (e) {
    console.log("no cookies stored");
  }
}

export async function removeCookie(key) {
  if (Platform.OS == "web") {
    Cookies.remove(key);
  }

  const cookieData = await storage.load({ key: "cookies" });
  await storage.remove({ key: "cookies" });
  storage.save({
    key: "cookies",
    data: cookieData.filter((cookie) => cookie.key !== key),
  });
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
    data.data?.loginMode?.search(/account/)
  );
};

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

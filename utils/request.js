import axios from "axios";
import { Platform } from "react-native";
import { getCookie } from "@/utils/auth";

export const baseURL = "http://localhost:3000/";
// Web 和 Electron 跑在不同端口避免同时启动时冲突
// if (process.env.IS_ELECTRON) {
//   if (process.env.NODE_ENV === 'production') {
//     baseURL = process.env.VUE_APP_ELECTRON_API_URL;
//   } else {
//     baseURL = process.env.VUE_APP_ELECTRON_API_URL_DEV;
//   }
// } else {
//   baseURL = process.env.VUE_APP_NETEASE_API_URL;
// }

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

// const { CancelToken } = axios;
// const source = CancelToken.source();
service.interceptors.request.use(
  function (config) {
    console.log(config);
    if (!config.params) config.params = {};
    // recognize if the target platfrom is iOS
    if (Platform.OS === "ios") {
      // set ios cache
    } else if (Platform.OS === "android") {
      //recognize if the target platfrom is android
      // set android file cache
      if (baseURL[0] !== "/")
        config.params.cookie = `MUSIC_U=${getCookie("MUSIC_U")};`;
      if (!config.url.includes("/login"))
        config.params.realIP = "211.161.244.70";
    } else {
      // react-native test platfrom
      // set cookie
      if (baseURL[0] !== "/")
        config.params.cookie = `MUSIC_U=${getCookie("MUSIC_U")};`;
      if (!config.url.includes("/login"))
        config.params.realIP = "211.161.244.70";
    }
    // const proxyConfig = JSON.parse(localStorage.getItem('settings')).proxyConfig;
    // if (['HTTP', 'HTTPS'].includes(proxyConfig.protocol)) {
    //   config.params.proxy = `${proxyConfig.protocol}://${proxyConfig.server}:${proxyConfig.port}`;
    // }
    // config.params.CancelToken = source.token;
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error, "request error");
  }
);

service.interceptors.response.use(
  (response)=>{
    const res = response.data;
    console.log(response.data);
    return res;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error, "response error");
  }
)
export default service;

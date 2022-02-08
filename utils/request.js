import axios from 'axios';
import { getCookie } from '@/utils/auth';

let baseURL = 'http://localhost:3000/';
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

service.interceptors.request.use(function (config) {
  console.log(config);
  if (!config.params) config.params = {};
  if (baseURL[0] !== '/' && !process.env.IS_ELECTRON) {
    config.params.cookie = `MUSIC_U=${getCookie('MUSIC_U')};`;
  }

  if (!process.env.IS_ELECTRON && !config.url.includes('/login')) {
    config.params.realIP = '211.161.244.70';
  }
  // const proxyConfig = JSON.parse(localStorage.getItem('settings')).proxyConfig;
  // if (['HTTP', 'HTTPS'].includes(proxyConfig.protocol)) {
  //   config.params.proxy = `${proxyConfig.protocol}://${proxyConfig.server}:${proxyConfig.port}`;
  // }

  return config;
});

service.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;

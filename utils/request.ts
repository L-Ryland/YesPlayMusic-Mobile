import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import {getCookie} from "@/utils/auth";
import {userData} from "@/hydrate/data";

const baseURL = "http://localhost:3000/";

const service: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use((config: AxiosRequestConfig) => {
  const {cookie} = userData;
  if (cookie && config.params) config.params.cookie = `${cookie.key}=${cookie.value}`;
  return config;
});

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response; //.data
    return res;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const request = async <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>["data"]> => {
  const { data } = await service.request<T>(config);
  return data;
};

export default request;

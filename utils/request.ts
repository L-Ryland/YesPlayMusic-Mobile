import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'

// const baseURL = String(
//   import.meta.env.DEV ? '/netease' : import.meta.env.VITE_APP_NETEASE_API_URL
// )
const baseURL = "http://localhost:3000/";

const service: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
})

service.interceptors.request.use((config: AxiosRequestConfig) => {
  return config
})

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response //.data
    return res
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

const request = async (config: AxiosRequestConfig) => {
  const { data } = await service.request(config)
  return data as any
}

export default request

import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import Store from 'electron-store'

export enum RequestEnum {
  GET = 'GET',
  POST = 'POST'
}

const store = new Store()

const createInstance = () => {
  const instance = axios.create()

  instance.interceptors.request.use(
    async config => {
      const app = store.get('app')
      if (!app) throw new Error('未找到 Cookie,请前往设置页面配置 Cookie')

      const { cookie } = JSON.parse(app as string).state
      if (!cookie) throw new Error('未找到 Cookie,请前往设置页面配置 Cookie')

      if (cookie && !config.headers.Cookie) config.headers.Cookie = cookie

      return config
    },
    error => Promise.reject(error)
  )

  instance.interceptors.response.use(
    response => {
      const res = response.data
      return res
    },
    (error: AxiosError) => Promise.reject(error)
  )
  return instance
}

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const defaultConfig = {
    timeout: 5000,
    withCredentials: true
  } as AxiosRequestConfig
  const instance = createInstance()
  const http = await instance({ ...defaultConfig, ...config })
  return http as unknown as Promise<T>
}

export default request

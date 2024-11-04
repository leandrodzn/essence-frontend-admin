import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import { useLoginStore } from '@stores/login'

const axiosApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BACKEND as string
})

const defaultHeaders = (): Record<string, string | null> => {
  const token = localStorage.getItem('accessToken')
  return {
    Authorization: token ? `Bearer ${token}` : null
  }
}

axiosApi.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const hh = defaultHeaders()
    for (const k in hh) {
      if (hh[k] != null) {
        if (config.headers) {
          config.headers[k] = hh[k] as string
        }
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axiosApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const useLogin = useLoginStore()
      useLogin.logout()
    }
    return Promise.reject(error)
  }
)

function buildFormData(formData: FormData, data: any, parentKey?: string): void {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
    })
  } else {
    const value = data == null ? '' : data
    formData.append(parentKey || '', value)
  }
}

interface Api {
  api: AxiosInstance
  baseURL: string
  defaultHeaders: () => Record<string, string | null>
  get: (path: string, params?: Record<string, any>) => Promise<any>
  post: (
    path: string,
    data: any,
    isMultipart?: boolean,
    params?: Record<string, any>
  ) => Promise<any>
  put: (path: string, data: any, isMultipart: boolean, params?: Record<string, any>) => Promise<any>
  delete: (path: string, params?: Record<string, any>) => Promise<any>
  addResponseInterceptor: (
    onResponse?: (response: AxiosResponse) => AxiosResponse,
    onError?: (error: any) => Promise<any>
  ) => number
  removeResponseInterceptor: (id: number) => void
}

const api: Api = {
  api: axiosApi,
  baseURL: import.meta.env.VITE_APP_API_BACKEND as string,
  defaultHeaders: defaultHeaders,

  get: (path: string, params?: Record<string, any>) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resource: AxiosResponse = await axiosApi.get(path, { params: params ?? {} })
        resolve(resource?.data ?? {})
      } catch (error) {
        if (axios.isAxiosError(error)) {
          reject(error.response?.data ?? error.response ?? error)
        } else {
          reject(error)
        }
      }
    })
  },

  post: (path: string, data: any, isMultipart?: boolean, params?: Record<string, any>) => {
    return new Promise(async (resolve, reject) => {
      let formData: any = data
      const config: AxiosRequestConfig = {
        params: params ?? {}
      }

      if (data != null && isMultipart) {
        formData = new FormData()
        buildFormData(formData, data)
        config.headers = {
          ...defaultHeaders(),
          'content-type': 'multipart/form-data'
        }
      }

      try {
        const resource: AxiosResponse = await axiosApi.post(path, formData, config)
        resolve(resource?.data ?? {})
      } catch (error) {
        if (axios.isAxiosError(error)) {
          reject(error.response?.data ?? error.response ?? error)
        } else {
          reject(error)
        }
      }
    })
  },

  put: (path: string, data: any, isMultipart?: boolean, params?: Record<string, any>) => {
    return new Promise(async (resolve, reject) => {
      let formData: any = data
      const config: AxiosRequestConfig = {
        params: params ?? {}
      }

      if (data != null && isMultipart) {
        formData = new FormData()
        buildFormData(formData, data)
        config.headers = {
          ...defaultHeaders(),
          'content-type': 'multipart/form-data'
        }
      }

      try {
        const resource: AxiosResponse = await axiosApi.put(path, formData, config)
        resolve(resource?.data ?? {})
      } catch (error) {
        if (axios.isAxiosError(error)) {
          reject(error.response?.data ?? error.response ?? error)
        } else {
          reject(error)
        }
      }
    })
  },

  delete: (path: string, params?: Record<string, any>) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resource: AxiosResponse = await axiosApi.delete(path, { data: params ?? undefined })
        resolve(resource?.data ?? {})
      } catch (error) {
        if (axios.isAxiosError(error)) {
          reject(error.response?.data ?? error.response ?? error)
        } else {
          reject(error)
        }
      }
    })
  },

  addResponseInterceptor: (
    onResponse?: (response: AxiosResponse) => AxiosResponse,
    onError?: (error: any) => Promise<any>
  ) => {
    const onResponseCB = onResponse ? onResponse : (response: AxiosResponse) => response
    const onErrorCB = onError ? onError : (error: any) => Promise.reject(error)

    return axiosApi.interceptors.response.use(onResponseCB, onErrorCB)
  },

  removeResponseInterceptor: (id: number) => {
    axiosApi.interceptors.response.eject(id)
  }
}

export default api

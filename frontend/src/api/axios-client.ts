declare const process: { env: { NODE_ENV: string } }

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import { navigateTo } from './navigation'
import useAppAlertStore from '../stores/app-alert'

const axiosClient = axios.create({
  withCredentials: true
})

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) config.headers['Authorization'] = token
    return config
  },
  (error: unknown) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('id')
      useAppAlertStore.getState().addAlert({
        message: 'Your session has expired. Please log in again.',
        severity: 'warning'
      })
      navigateTo('/login')
    }
    return Promise.reject(error)
  }
)

const getSentData = (config: InternalAxiosRequestConfig): unknown =>
  (config.data && JSON.parse(config.data as string)) || config.params || null

const logResponse = (response: AxiosResponse): AxiosResponse => {
  const xhr = response.request as XMLHttpRequest
  console.log(
    `\n  ${response.config.method!.toUpperCase()} ${xhr.responseURL}\n  Sent: %O\n  Received: HTTP ${response.status} %O`,
    getSentData(response.config),
    response.data,
  )
  return response
}

const logErrorResponse = (error: AxiosError): Promise<never> => {
  const xhr = error.request as XMLHttpRequest | undefined
  let responseData: unknown = error?.response?.data
  if (typeof responseData === 'string') responseData = { string: responseData }

  console.warn(
    `\n  ${error?.config?.method?.toUpperCase()} ${xhr?.responseURL}\n  Sent: %O\n  Received: HTTP ${xhr?.status} %O`,
    error.config && getSentData(error.config),
    responseData,
  )
  return Promise.reject(error)
}

if (process.env.NODE_ENV === 'development') {
  axiosClient.interceptors.response.use(logResponse, logErrorResponse)
}

export const apiClient = applyCaseMiddleware(axiosClient, {
  ignoreHeaders: true
})

export default apiClient

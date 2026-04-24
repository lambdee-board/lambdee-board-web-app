declare const process: { env: { NODE_ENV: string } }

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import { navigateTo } from './navigation'
import useAppAlertStore from '../stores/app-alert'
import { logResponse, logErrorResponse } from './axios-logger'

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


if (process.env.NODE_ENV === 'development') {
  axiosClient.interceptors.response.use(logResponse, logErrorResponse)
}

export const apiClient = applyCaseMiddleware(axiosClient, {
  ignoreHeaders: true
})

export default apiClient

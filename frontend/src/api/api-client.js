import axios from 'axios'
import useSWR, { mutate as swrMutate, unstable_serialize as unstableSerialize } from 'swr'
import applyCaseMiddleware from 'axios-case-converter'


const axiosClient = axios.create({
  withCredentials: true
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.reload()
    }
    return error
  }
)

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers['Authorization'] = token

    return config
  },
  (error) => Promise.reject(error)
)

if (process.env.NODE_ENV === 'development') {
  axiosClient.interceptors.response.use((response) => {
    console.log(
      `
  ${response?.config?.method?.toUpperCase()} ${response?.request?.responseURL}
  Sent: %O
  Received: HTTP ${response.status} %O
      `,
      response.config.data && JSON.parse(response.config.data) || response.config.params || null,
      response.data,
    )
    return response
  }, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let responseData = error?.response?.data
    if (typeof(responseData) === 'string') responseData = { string: responseData }

    console.error(
      `
  ${error?.config?.method?.toUpperCase()} ${error?.request?.responseURL}
  Sent: %O
  Received: HTTP ${error.request.status} %O
      `,
      error.config.data && JSON.parse(error.config.data) || error.config.params || null,
      responseData,
    )
    return Promise.reject(error)
  })
}

export const apiClient = applyCaseMiddleware(axiosClient, {
  ignoreHeaders: true
})

export const fetcher = (...args) => apiClient.get(...args).then((res) => res.data)

export const useAPI = (key, options = undefined) => {
  const { data, error, mutate } = useSWR(key, fetcher, options)

  return {
    data,
    error,
    mutate,
    isLoading: !error && !data,
    isError: Boolean(error),
  }
}

export const mutateAPI = (key, data, options = undefined) => {
  if (data || options) return swrMutate(key, data, options)
  return swrMutate(key)
}

export const swrCacheKey = (key) => unstableSerialize(key)

export default apiClient

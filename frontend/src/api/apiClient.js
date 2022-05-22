import axios from 'axios'
import useSWR from 'swr'
import applyCaseMiddleware from 'axios-case-converter'

const axiosClient = axios.create({
  withCredentials: true
})

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
    console.error(
      `
  ${error?.config?.method?.toUpperCase()} ${error?.request?.responseURL}
  Sent: %O
  Received: HTTP ${error.request.status} %O
      `,
      error.config.data && JSON.parse(error.config.data) || error.config.params || null,
      error?.response?.data,
    )
    return Promise.reject(error)
  })
}

const apiClient = applyCaseMiddleware(axiosClient, {
  ignoreHeaders: true
})

const fetcher = (...args) => apiClient.get(...args).then((res) => res.data)

const useAPI = (url, axiosOptions = {}, fetch = true) => {
  const { data, error, mutate } = useSWR(fetch ? [url, axiosOptions] : null, fetcher)

  return {
    data,
    error,
    mutate,
    isLoading: !error && !data,
    isError: Boolean(error),
  }
}

export { apiClient, fetcher, useAPI }
export default apiClient

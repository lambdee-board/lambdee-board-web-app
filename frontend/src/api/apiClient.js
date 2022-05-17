import axios from 'axios'
import useSWR from 'swr'
import applyCaseMiddleware from 'axios-case-converter'

const axiosClient = axios.create({
  withCredentials: true
})

const apiClient = applyCaseMiddleware(axiosClient, {
  ignoreHeaders: true
})

const fetcher = (...args) => apiClient.get(...args).then((res) => res.data)

const useAPI = (url, axiosOptions = {}, fetch = true) => {
  const { data, error } = useSWR(fetch ? [url, axiosOptions] : null, fetcher)

  return {
    data,
    error,
    isLoading: !error && !data,
    isError: Boolean(error),
  }
}

export { apiClient, fetcher, useAPI }
export default apiClient

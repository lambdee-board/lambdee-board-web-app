import useSWR, { mutate as swrMutate, unstable_serialize as unstableSerialize } from 'swr'
import { apiClient } from './axios-client'

export const fetcher = (keyOrUrl) => {
  if (Array.isArray(keyOrUrl)) {
    const [url, axiosOptions] = keyOrUrl
    return apiClient.get(url, axiosOptions).then((res) => res.data)
  }
  return apiClient.get(keyOrUrl).then((res) => res.data)
}

export const useAPI = (key, options = undefined) => {
  const { data, error, mutate, isLoading } = useSWR(key, fetcher, options)

  return {
    data,
    error,
    mutate,
    isLoading,
    isError: Boolean(error),
  }
}

export const mutateAPI = (key, data = undefined, options = undefined) => {
  if (data !== undefined || options !== undefined) return swrMutate(key, data, options)
  return swrMutate(key)
}

export const swrCacheKey = (key) => unstableSerialize(key)

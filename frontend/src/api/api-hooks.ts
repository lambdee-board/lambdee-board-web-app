import useSWR, { SWRConfiguration, mutate as swrMutate, unstable_serialize as unstableSerialize } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { apiClient } from './axios-client'

type FetcherKey = string | [string, AxiosRequestConfig]

export const fetcher = (key: FetcherKey) => {
  if (Array.isArray(key)) {
    const [url, axiosOptions] = key
    return apiClient.get(url, axiosOptions).then((res) => res.data)
  }
  return apiClient.get(key).then((res) => res.data)
}

export const useAPI = <T>(key: FetcherKey | null, options?: SWRConfiguration) => {
  const { data, error, mutate, isLoading } = useSWR<T>(key, fetcher, options)

  return {
    data,
    error,
    mutate,
    isLoading,
    isError: Boolean(error),
  }
}

export const mutateAPI = (key: FetcherKey, data?: unknown, options?: boolean | object) => {
  if (data !== undefined || options !== undefined) return swrMutate(key, data, options)
  return swrMutate(key)
}

export const swrCacheKey = (key: FetcherKey) => unstableSerialize(key)

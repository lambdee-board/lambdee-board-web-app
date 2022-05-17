import useSWR from 'swr'

import { fetcher } from './apiClient'

export default function useUser(id) {
  const { data, error } = useSWR(`/api/users/${id}`, fetcher)

  return {
    user: data,
    isLoading: !error && !data,
    isError: error
  }
}

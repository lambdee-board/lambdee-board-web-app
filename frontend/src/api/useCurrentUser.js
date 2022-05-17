import useSWR from 'swr'

import { fetcher } from './apiClient'

export default function useCurrentUser(id) {
  const { data, error } = useSWR('/api/users/current', fetcher)

  return {
    user: data,
    isLoading: !error && !data,
    isError: error
  }
}

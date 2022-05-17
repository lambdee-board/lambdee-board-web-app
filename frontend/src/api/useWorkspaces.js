import useSWR from 'swr'

import { fetcher } from './apiClient'

export default function useWorkspaces(limit, fetch = true) {
  const { data, error } = useSWR(fetch ? `/api/workspaces?limit=${limit}` : null, fetcher)

  return {
    workspaces: data,
    isLoading: !error && !data,
    isError: error
  }
}

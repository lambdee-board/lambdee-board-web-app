import useSWR from 'swr'

import { fetcher } from './apiClient'

export default function useWorkspace(id, options = {}) {
  const url = `/api/workspaces/${id}`
  const { data, error } = useSWR([url, options], fetcher)

  return {
    workspace: data,
    isLoading: !error && !data,
    isError: error
  }
}

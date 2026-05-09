import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI } from './api-hooks'

interface ChartDataPoint {
  name: string
  data: Record<string, number | null>
}

interface SprintChartArgs {
  id: number | string
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

const requestPath = (id: number | string) => `/api/sprints/${id}/burn_up_chart`

const getterKey = (id: number | string, axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath(id), axiosOptions] as [string, AxiosRequestConfig]
  return requestPath(id)
}

export const useSprintChart = ({ id, axiosOptions, options }: SprintChartArgs) =>
  useAPI<ChartDataPoint[]>(getterKey(id, axiosOptions), options)
export default useSprintChart

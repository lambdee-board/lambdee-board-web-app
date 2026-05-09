import { SWRConfiguration } from 'swr'
import { AxiosRequestConfig } from 'axios'
import { useAPI } from './api-hooks'

interface ScriptRun {
  id: number
  scriptName: string
  state: string
  input: string
  output: string | null
  triggeredAt: string | null
  executedAt: string | null
  delay: number | null
}

interface ScriptRunsResponse {
  runs: ScriptRun[]
  totalPages: number
}

interface ScriptRunsArgs {
  axiosOptions?: AxiosRequestConfig
  options?: SWRConfiguration
}

const requestPath = '/api/script_runs'

const getterKey = (axiosOptions?: AxiosRequestConfig) => {
  if (axiosOptions != null) return [requestPath, axiosOptions] as [string, AxiosRequestConfig]
  return requestPath
}

export const useScriptRuns = ({ axiosOptions, options }: ScriptRunsArgs) =>
  useAPI<ScriptRunsResponse>(getterKey(axiosOptions), options)
export default useScriptRuns

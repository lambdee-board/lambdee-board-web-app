import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const METHOD_COLOR: Record<string, string> = {
  GET:    '#61AFEF',
  POST:   '#98C379',
  PUT:    '#E5C07B',
  PATCH:  '#E5C07B',
  DELETE: '#E06C75',
}

const statusColor = (status: number) => {
  if (status < 300) return '#98C379'
  if (status < 400) return '#61AFEF'
  if (status < 500) return '#E5C07B'
  return '#E06C75'
}

const badge = (color: string) =>
  `background:${color};color:#111;border-radius:3px;padding:1px 5px;font-weight:bold`

const getRequest = (config: InternalAxiosRequestConfig): unknown =>
  (config.data && JSON.parse(config.data as string)) || config.params || null

export const logResponse = (response: AxiosResponse): AxiosResponse => {
  const xhr = response.request as XMLHttpRequest
  const method = response.config.method!.toUpperCase()

  console.groupCollapsed(
    `%c ${method} %c ${xhr.responseURL} %c ${response.status}`,
    badge(METHOD_COLOR[method] ?? '#888'),
    'color:inherit',
    badge(statusColor(response.status)),
  )
  console.log('Sent', getRequest(response.config))
  console.log('Received', response.data)
  console.groupEnd()
  return response
}

export const logErrorResponse = (error: AxiosError): Promise<never> => {
  const xhr = error.request as XMLHttpRequest | undefined
  const method = error.config?.method?.toUpperCase() ?? '?'
  const status = xhr?.status ?? 0
  let responseData: unknown = error?.response?.data
  if (typeof responseData === 'string') responseData = { string: responseData }

  // Use console.warn only for server/network errors — 4xx are often expected responses
  const log = status >= 500 || status === 0 ? console.warn : console.log

  console.groupCollapsed(
    `%c ${method} %c ${xhr?.responseURL} %c ${status}`,
    badge(METHOD_COLOR[method] ?? '#888'),
    'color:inherit',
    badge(statusColor(status)),
  )
  log('Sent', error.config && getRequest(error.config))
  log('Received', responseData)
  console.groupEnd()
  return Promise.reject(error)
}

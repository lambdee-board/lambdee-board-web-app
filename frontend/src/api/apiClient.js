import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

const axiosClient = axios.create({
  withCredentials: true
})

const apiClient = applyCaseMiddleware(axiosClient, {
  ignoreHeaders: true
})

const fetcher = (...args) => apiClient.get(...args).then((res) => res.data)

export { apiClient, fetcher }
export default apiClient

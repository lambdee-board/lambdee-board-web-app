import { create } from 'zustand'

interface Alert {
  title?: string
  message?: string
  severity?: string
}

interface State {
  title: string | null
  message: string | null
  severity: string | null
}

interface Actions {
  addAlert: (alert: Alert) => void
  addAlertTimeout: (alert: Alert, timeout?: number) => void
  clearAlert: () => void
  clearAlertTimeout: (timeout?: number) => void
}

type Store = State & Actions

const useAppAlertStore = create<Store>((set, get) => ({
  title: null,
  message: null,
  severity: null,
  addAlert: (alert) => set(() => ({
    title: alert.title || null,
    message: alert.message || null,
    severity: alert.severity || null
  })),
  addAlertTimeout: (alert, timeout = 1000) => {
    setTimeout(() => set(() => ({
      title: alert.title || null,
      message: alert.message || null,
      severity: alert.severity || null
    })), timeout)
  },
  clearAlert: () => set(() => ({
    title: null,
    message: null,
    severity: null,
  })),
  clearAlertTimeout: (timeout = 5000) => {
    setTimeout(() => get().clearAlert(), timeout)
  }
}))

export default useAppAlertStore

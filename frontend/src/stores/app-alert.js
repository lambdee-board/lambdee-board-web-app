import create from 'zustand'

const useAppAlertStore = create((set, get) => ({
  title: null,
  message: null,
  severity: null,
  addAlert: (alert) => set(() => ({
    title: alert.title || null,
    message: alert.message || null,
    severity: alert.severity || null
  })),
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

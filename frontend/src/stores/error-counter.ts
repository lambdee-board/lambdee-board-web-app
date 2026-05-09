import { create } from 'zustand'

interface State {
  errors: number
  warnings: number
}

interface Actions {
  addError: () => void
  addWarning: () => void
}

type Store = State & Actions

const useErrorCounterStore = create<Store>((set) => ({
  errors: 0,
  warnings: 0,
  addError: () => set((state) => ({ errors: state.errors + 1 })),
  addWarning: () => set((state) => ({ warnings: state.warnings + 1 })),
}))

export default useErrorCounterStore

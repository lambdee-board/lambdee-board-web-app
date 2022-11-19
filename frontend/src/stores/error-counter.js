import create from 'zustand'

const useErrorCounterStore = create((set) => ({
  errors: 0,
  warnings: 0,
  addError: () => set((state) => ({ errors: state.errors + 1 })),
  addWarning: () => set((state) => ({ warnings: state.warnings + 1 })),
}))

export default useErrorCounterStore

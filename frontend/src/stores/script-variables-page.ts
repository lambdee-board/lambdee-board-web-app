import { create } from 'zustand'

interface State {
  page: number
  per: number
}

interface Actions {
  setPage: (page: number) => void
  setPer: (per: number) => void
}

type Store = State & Actions

const useScriptVariablesPage = create<Store>((set) => ({
  page: 1,
  per: 10,
  setPage: (page) => set({ page }),
  setPer: (per) => set({ per })
}))

export default useScriptVariablesPage

import create from 'zustand'

const useScriptVariablesPage = create((set) => ({
  page: 1,
  per: 10,
  setPage: (page) => set({ page }),
  setPer: (per) => set({ per })
}))

export default useScriptVariablesPage

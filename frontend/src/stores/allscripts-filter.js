import create from 'zustand'

const useAllScriptsFilter = create((set) => ({
  filter: { page: 1, per: 10 },
  setFilter: (filter) => set(() => ({
    filter
  })),
}))

export default useAllScriptsFilter

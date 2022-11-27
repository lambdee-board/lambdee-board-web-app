export const dndId = (dndType, listId) => `${dndType}-${listId}`
export const dbId = (id) => (typeof id === 'number' ? id : parseInt(id.split('-')[1]))

export const dndListId = (id) => dndId('list', id)
export const dndTaskId = (id) => dndId('task', id)

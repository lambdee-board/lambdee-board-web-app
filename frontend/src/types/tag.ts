export interface TagShort {
  id: number
  name: string
  colour: string
  url: string
}

export interface Tag extends TagShort {
  boardId: number
  createdAt: string
  updatedAt: string
  customData: Record<string, unknown>
}

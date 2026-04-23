export interface ScriptVariable {
  id: number
  name: string
  description: string
  ownerId: number | null
  ownerType: string | null
  createdAt: string
  updatedAt: string
  value?: string
  url: string
}

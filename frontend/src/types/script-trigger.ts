export interface ScriptTrigger {
  id: number
  scriptId: number
  subjectType: string
  subjectId: number
  scopeType: string
  scopeId: number
  action: string
  delay: number
  private: boolean
  authorId: number
  url: string
}

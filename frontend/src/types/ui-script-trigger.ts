export interface UiScriptTrigger {
  id: number
  scriptId: number
  subjectType: string
  subjectId: number
  scopeType: string
  scopeId: number
  authorId: number
  delay: number
  private: boolean
  colour: string
  text: string
  url: string
}

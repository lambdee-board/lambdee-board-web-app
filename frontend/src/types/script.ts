import type { ScriptTrigger } from './script-trigger'
import type { UiScriptTrigger } from './ui-script-trigger'

export interface Script {
  id: number
  content: string
  name: string
  description: string
  authorId: number
  url: string
  scriptTriggers?: ScriptTrigger[]
  uiScriptTriggers?: UiScriptTrigger[]
}

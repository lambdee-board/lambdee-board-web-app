export type ScriptRunState = 'waiting' | 'running' | 'executed' | 'failed' | 'timed_out' | 'connection_failed'

export interface ScriptRun {
  id: number
  scriptId: number
  input: string
  output: string
  initiatorId: number
  state: ScriptRunState
  triggeredAt: string
  delay: number
  executedAt: string | null
  scriptName: string
  url: string
}

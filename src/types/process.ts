export interface ProcessInfo {
  pid: number
  name: string
  cpu_usage: number
  memory_kb: number
  status: string
  user: string | null
}

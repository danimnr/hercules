export interface CpuMetrics {
  global_usage: number
  per_core: number[]
  frequency_mhz: number
  core_count: number
}

export interface RamMetrics {
  total_kb: number
  used_kb: number
  available_kb: number
}

export interface DiskMetrics {
  name: string
  mount: string
  total_kb: number
  used_kb: number
  kind: string
}

export interface NetworkMetrics {
  bytes_received_per_sec: number
  bytes_sent_per_sec: number
}

export interface SystemMetrics {
  cpu: CpuMetrics
  ram: RamMetrics
  disks: DiskMetrics[]
  network: NetworkMetrics
  timestamp: number
}

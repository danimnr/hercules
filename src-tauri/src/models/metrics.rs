use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CpuMetrics {
    pub global_usage: f32,
    pub per_core: Vec<f32>,
    pub frequency_mhz: u64,
    pub core_count: usize,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RamMetrics {
    pub total_kb: u64,
    pub used_kb: u64,
    pub available_kb: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DiskMetrics {
    pub name: String,
    pub mount: String,
    pub total_kb: u64,
    pub used_kb: u64,
    pub kind: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NetworkMetrics {
    pub bytes_received_per_sec: u64,
    pub bytes_sent_per_sec: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SystemMetrics {
    pub cpu: CpuMetrics,
    pub ram: RamMetrics,
    pub disks: Vec<DiskMetrics>,
    pub network: NetworkMetrics,
    pub timestamp: u64,
}

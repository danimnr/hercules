use std::time::{SystemTime, UNIX_EPOCH};
use sysinfo::Disks;
use tauri::command;
use tauri::State;

use crate::models::metrics::{
    CpuMetrics, DiskMetrics, NetworkMetrics, RamMetrics, SystemMetrics,
};
use crate::platform::get_platform;
use crate::SysState;
use crate::NetState;

#[command]
pub fn get_platform_info() -> String {
    let platform = get_platform();
    format!("{:?}", platform)
}

#[command]
pub fn get_system_metrics(
    sys_state: State<SysState>,
    net_state: State<NetState>,
) -> SystemMetrics {
    let mut sys = sys_state.0.lock().unwrap();
    sys.refresh_all();

    let cpu = CpuMetrics {
        global_usage:  sys.global_cpu_usage(),
        per_core:      sys.cpus().iter().map(|c| c.cpu_usage()).collect(),
        frequency_mhz: sys.cpus().first().map(|c| c.frequency()).unwrap_or(0),
        core_count:    sys.cpus().len(),
    };

    let total = sys.total_memory();
    let avail = sys.available_memory();
    let used  = total.saturating_sub(avail);

    let ram = RamMetrics {
        total_kb:     total / 1024,
        used_kb:      used  / 1024,
        available_kb: avail / 1024,
    };

    let disks_info = Disks::new_with_refreshed_list();
    let disks: Vec<DiskMetrics> = disks_info
        .iter()
        .map(|d| DiskMetrics {
            name:     d.name().to_string_lossy().to_string(),
            mount:    d.mount_point().to_string_lossy().to_string(),
            total_kb: d.total_space() / 1024,
            used_kb:  (d.total_space() - d.available_space()) / 1024,
            kind:     format!("{:?}", d.kind()),
        })
        .collect();

    // Red: sysinfo 0.33 devuelve bytes desde el último refresh en received()/transmitted()
    let mut networks = net_state.0.lock().unwrap();
    networks.refresh(true);

    let rx: u64 = networks.iter().map(|(_, n)| n.received()).sum();
    let tx: u64 = networks.iter().map(|(_, n)| n.transmitted()).sum();

    let network = NetworkMetrics {
        bytes_received_per_sec: rx,
        bytes_sent_per_sec: tx,
    };

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    SystemMetrics { cpu, ram, disks, network, timestamp }
}

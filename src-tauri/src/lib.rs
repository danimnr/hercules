mod commands;
mod models;
mod platform;

use std::sync::Mutex;
use sysinfo::{System, Networks};
use commands::metrics::{get_system_metrics, get_platform_info};
use commands::processes::{get_processes, kill_process};
use commands::actions::{clear_temp_files, clear_system_cache, free_ram};

pub struct SysState(pub Mutex<System>);
pub struct NetState(pub Mutex<Networks>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let sys = System::new_all();
    let mut networks = Networks::new_with_refreshed_list();
    networks.refresh(true);

    tauri::Builder::default()
        .manage(SysState(Mutex::new(sys)))
        .manage(NetState(Mutex::new(networks)))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_system_metrics,
            get_platform_info,
            get_processes,
            kill_process,
            clear_temp_files,
            clear_system_cache,
            free_ram,
        ])
        .run(tauri::generate_context!())
        .expect("error al ejecutar Hércules");
}

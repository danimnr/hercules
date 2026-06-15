use sysinfo::Signal;
use tauri::command;
use tauri::State;
use crate::models::process::ProcessInfo;
use crate::SysState;

#[command]
pub fn get_processes(state: State<SysState>) -> Vec<ProcessInfo> {
    let mut sys = state.0.lock().unwrap();
    sys.refresh_all();

    let mut processes: Vec<ProcessInfo> = sys
        .processes()
        .iter()
        .map(|(pid, process)| ProcessInfo {
            pid: pid.as_u32(),
            name: process.name().to_string_lossy().to_string(),
            cpu_usage: process.cpu_usage(),
            memory_kb: process.memory() / 1024,
            status: format!("{:?}", process.status()),
            user: None,
        })
        .collect();

    processes.sort_by(|a, b| {
        b.cpu_usage.partial_cmp(&a.cpu_usage).unwrap_or(std::cmp::Ordering::Equal)
    });
    processes.truncate(100);
    processes
}

#[command]
pub fn kill_process(state: State<SysState>, pid: u32) -> Result<String, String> {
    let sys = state.0.lock().unwrap();
    let pid = sysinfo::Pid::from_u32(pid);

    if let Some(process) = sys.process(pid) {
        if process.kill_with(Signal::Term).unwrap_or(false) {
            Ok(format!("Proceso {} terminado correctamente", pid))
        } else {
            process.kill();
            Ok(format!("Proceso {} forzado a terminar", pid))
        }
    } else {
        Err(format!("No se encontró el proceso con PID {}", pid))
    }
}

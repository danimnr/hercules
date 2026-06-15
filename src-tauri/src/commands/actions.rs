use std::process::Command;
use tauri::command;
use serde::{Deserialize, Serialize};
use crate::platform::get_platform;
use crate::platform::detect::Platform;

#[derive(Debug, Serialize, Deserialize)]
pub struct ActionResult {
    pub success: bool,
    pub message: String,
    pub freed_bytes: Option<u64>,
}

fn run_in_thread<F>(f: F) -> Result<String, String>
where
    F: FnOnce() -> std::io::Result<std::process::Output> + Send + 'static,
{
    let handle = std::thread::spawn(f);
    match handle.join() {
        Ok(Ok(o)) if o.status.success() => Ok(String::from_utf8_lossy(&o.stdout).to_string()),
        Ok(Ok(o)) => Err(String::from_utf8_lossy(&o.stderr).to_string()),
        Ok(Err(e)) => Err(e.to_string()),
        Err(_) => Err("El comando tardó demasiado".to_string()),
    }
}

fn run_with_pkexec(script: &'static str) -> Result<String, String> {
    run_in_thread(move || {
        Command::new("pkexec")
            .args(["sh", "-c", script])
            .output()
    })
}

fn dir_size(path: &str) -> u64 {
    Command::new("du").args(["-sb", path]).output()
        .ok()
        .and_then(|o| {
            String::from_utf8_lossy(&o.stdout)
                .split_whitespace()
                .next()
                .and_then(|n| n.parse::<u64>().ok())
        })
        .unwrap_or(0)
}

#[command]
pub fn clear_temp_files() -> ActionResult {
    match get_platform() {
        Platform::Linux => {
            let dirs = ["/tmp", "/var/tmp"];
            let mut freed: u64 = 0;
            for dir in &dirs {
                freed += dir_size(dir);
            }
            match run_with_pkexec("find /tmp /var/tmp -mindepth 1 -delete 2>/dev/null; exit 0") {
                Ok(_) => ActionResult {
                    success: true,
                    message: "Archivos temporales eliminados correctamente".to_string(),
                    freed_bytes: Some(freed),
                },
                Err(e) if e.contains("dismissed") || e.contains("cancel") || e.contains("126") => ActionResult {
                    success: false,
                    message: "Operación cancelada por el usuario".to_string(),
                    freed_bytes: None,
                },
                Err(_) => ActionResult {
                    success: false,
                    message: "No se pudo obtener permisos de administrador".to_string(),
                    freed_bytes: None,
                },
            }
        }
        Platform::MacOS => {
            let size = dir_size("/private/tmp");
            match run_in_thread(|| Command::new("find").args(["/private/tmp", "-mindepth", "1", "-delete"]).output()) {
                Ok(_) => ActionResult { success: true, message: "Temporales eliminados".to_string(), freed_bytes: Some(size) },
                Err(e) => ActionResult { success: false, message: e, freed_bytes: None },
            }
        }
        Platform::Windows => {
            match run_in_thread(|| Command::new("cmd").args(["/C", "del /q/f/s %TEMP%\\*"]).output()) {
                Ok(_) => ActionResult { success: true, message: "Temporales eliminados".to_string(), freed_bytes: None },
                Err(e) => ActionResult { success: false, message: e, freed_bytes: None },
            }
        }
        Platform::Unknown => ActionResult { success: false, message: "SO no reconocido".to_string(), freed_bytes: None },
    }
}

#[command]
pub fn clear_system_cache() -> ActionResult {
    match get_platform() {
        Platform::Linux => {
            match run_with_pkexec("sync && echo 3 > /proc/sys/vm/drop_caches") {
                Ok(_) => ActionResult {
                    success: true,
                    message: "Caché del sistema liberada (pagecache, dentries, inodes)".to_string(),
                    freed_bytes: None,
                },
                Err(e) if e.contains("dismissed") || e.contains("cancel") || e.contains("126") => ActionResult {
                    success: false,
                    message: "Operación cancelada por el usuario".to_string(),
                    freed_bytes: None,
                },
                Err(_) => ActionResult {
                    success: false,
                    message: "No se pudo obtener permisos de administrador".to_string(),
                    freed_bytes: None,
                },
            }
        }
        Platform::MacOS => {
            match run_in_thread(|| Command::new("purge").output()) {
                Ok(_) => ActionResult { success: true, message: "Caché liberada con purge".to_string(), freed_bytes: None },
                Err(e) => ActionResult { success: false, message: e, freed_bytes: None },
            }
        }
        Platform::Windows => ActionResult {
            success: false,
            message: "La caché en Windows la gestiona el SO automáticamente".to_string(),
            freed_bytes: None,
        },
        Platform::Unknown => ActionResult { success: false, message: "SO no reconocido".to_string(), freed_bytes: None },
    }
}

#[command]
pub fn free_ram() -> ActionResult {
    match get_platform() {
        Platform::Linux => {
            match run_with_pkexec("sync && echo 1 > /proc/sys/vm/drop_caches") {
                Ok(_) => ActionResult {
                    success: true,
                    message: "Pagecache liberado correctamente".to_string(),
                    freed_bytes: None,
                },
                Err(e) if e.contains("dismissed") || e.contains("cancel") || e.contains("126") => ActionResult {
                    success: false,
                    message: "Operación cancelada por el usuario".to_string(),
                    freed_bytes: None,
                },
                Err(_) => ActionResult {
                    success: false,
                    message: "No se pudo obtener permisos de administrador".to_string(),
                    freed_bytes: None,
                },
            }
        }
        Platform::MacOS => {
            match run_in_thread(|| Command::new("purge").output()) {
                Ok(_) => ActionResult { success: true, message: "Memoria inactiva liberada".to_string(), freed_bytes: None },
                Err(e) => ActionResult { success: false, message: e, freed_bytes: None },
            }
        }
        Platform::Windows => ActionResult {
            success: false,
            message: "En Windows la gestión de RAM la realiza el SO automáticamente".to_string(),
            freed_bytes: None,
        },
        Platform::Unknown => ActionResult { success: false, message: "SO no reconocido".to_string(), freed_bytes: None },
    }
}

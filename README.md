<div align="center">

# ⚡ Hércules

**Monitor y optimizador del sistema para Windows, Linux y macOS**

*Construido con Tauri v2 · Rust · React*

[![License: MIT](https://img.shields.io/badge/License-MIT-7c6af7.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-v2-7c6af7)](https://tauri.app)
[![Rust](https://img.shields.io/badge/Rust-stable-orange)](https://www.rust-lang.org)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)

</div>

---

## ¿Qué es Hércules?

Hércules es una aplicación de escritorio ligera, rápida y visualmente cuidada para monitorizar y optimizar tu sistema. Diseñada para ser tan útil como bonita — sin consumir los recursos que viene a monitorizar.

Funciona de forma nativa en **Windows, Linux y macOS**, detectando automáticamente el sistema operativo y adaptando su comportamiento a cada plataforma.

## ✨ Características

- **Dashboard en tiempo real** — CPU por núcleo, RAM, disco y red actualizándose cada 2 segundos
- **Panel de procesos** — lista ordenable y filtrable con soporte para terminar procesos
- **Acciones del sistema** — limpieza de temporales, liberación de caché y RAM
- **Multiplataforma** — Windows, Linux y macOS con detección automática del SO
- **Interfaz moderna** — ventana transparente con blur, modo oscuro/claro
- **Totalmente personalizable** — color de acento libre, nivel de transparencia ajustable

## 🖥️ Capturas

> *Próximamente*

## 🚀 Instalación

### Requisitos previos

- [Rust](https://rustup.rs/) stable
- [Node.js](https://nodejs.org/) ≥ 18

**Linux — dependencias adicionales:**
```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential libssl-dev \
  libayatana-appindicator3-dev librsvg2-dev libgtk-3-dev
```

**macOS y Windows** — sin dependencias adicionales.

### Ejecutar en desarrollo

```bash
git clone https://github.com/danimnr/hercules.git
cd hercules
npm install
npm run tauri dev
```

### Build para producción

```bash
npm run tauri build
```

Genera el instalador nativo para tu plataforma (`.deb` / `.AppImage` en Linux, `.dmg` en macOS, `.msi` en Windows).

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Empaquetado | Tauri v2 |
| Backend | Rust + sysinfo |
| Frontend | React + TypeScript |
| Estilos | CSS puro |
| Estado | Zustand |
| Router | React Router |

## 🗺️ Roadmap

- [ ] Gráficas históricas de CPU y RAM
- [ ] Notificaciones cuando el sistema supera umbrales
- [ ] Autostart con el sistema
- [ ] Más acciones de optimización
- [ ] Exportar informes del sistema
- [ ] Temas adicionales

## 🤝 Contribuir

Las contribuciones son bienvenidas. Abre un issue o un pull request.

1. Fork del repositorio
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de tus cambios (`git commit -m 'feat: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT © [danimnr](https://github.com/danimnr)

---

<div align="center">

**Si Hércules te resulta útil, considera apoyar el desarrollo**

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Apóyame-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/danidev_mnr)

*Hecho con ❤️ y mucho Rust*

</div>

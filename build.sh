#!/bin/bash
echo "🧹 Limpiando bundles anteriores..."
rm -rf src-tauri/target/release/bundle

echo "🔨 Compilando Hércules..."
npm run tauri build

echo "✅ Build completado. Archivos en src-tauri/target/release/bundle/"

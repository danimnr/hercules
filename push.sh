#!/bin/bash
echo "📝 Mensaje del commit:"
read -r msg
git add .
git commit -m "$msg"
git push
echo "✅ Cambios subidos"

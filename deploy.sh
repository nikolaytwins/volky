#!/usr/bin/env bash
# Локальный деплой на hoster.by (без GitHub). Нужен lftp: brew install lftp
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  echo "Создайте .env из .env.example и укажите FTP-пароль."
  exit 1
fi

# shellcheck disable=SC1091
source .env

: "${FTP_SERVER:?FTP_SERVER не задан}"
: "${FTP_USERNAME:?FTP_USERNAME не задан}"
: "${FTP_PASSWORD:?FTP_PASSWORD не задан}"
: "${FTP_REMOTE_DIR:=/www/volki-frn.by/}"

if ! command -v lftp &>/dev/null; then
  echo "Установите lftp: brew install lftp"
  exit 1
fi

echo "→ Заливка в ${FTP_REMOTE_DIR} на ${FTP_SERVER} ..."

lftp -u "${FTP_USERNAME},${FTP_PASSWORD}" "${FTP_SERVER}" <<EOF
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3
mirror -R --verbose \
  --exclude-glob .git/ \
  --exclude-glob .github/ \
  --exclude-glob .env \
  --exclude-glob .env.* \
  --exclude DEPLOY.md \
  --exclude UPLOAD-MANIFEST.txt \
  --exclude deploy.sh \
  --exclude .gitignore \
  ./ ${FTP_REMOTE_DIR}
quit
EOF

echo "✓ Готово. Проверьте: https://volki-frn.by/ (Cmd+Shift+R)"

# Автодеплой Volki → volki-frn.by (hoster.by)

Корень сайта для nginx: **`/www/volki-frn.by/`** на сервере.  
Для FTP (chroot): **`www/volki-frn.by/`** — без ведущего `/`, иначе файлы попадут не туда.

После настройки: правки в Cursor → `git push` → сайт обновляется сам (1–5 мин).

---

## Шаг 1. Репозиторий на GitHub

1. Зайдите на [github.com](https://github.com) → **New repository**.
2. Имя, например: `volki-site` (приватный репозиторий — лучше).
3. **Не** добавляйте README/license (репозиторий пустой).
4. Скопируйте URL, например: `https://github.com/ВАШ_ЛОГИН/volki-site.git`

В терминале (папка `volki-site-client`):

```bash
cd "/Users/admin/Desktop/cursor/дутв/volki-site-client"
git init
git branch -M main
git add .
git commit -m "Initial site + deploy workflow"
git remote add origin https://github.com/ВАШ_ЛОГИН/volki-site.git
git push -u origin main
```

---

## Шаг 2. Секреты GitHub (пароль не в коде)

Репозиторий → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Значение |
|--------|----------|
| `FTP_SERVER` | `87.232.64.14` (или `ftp.hoster.by` из панели) |
| `FTP_USERNAME` | `volki-upload` (ваш FTP-логин) |
| `FTP_PASSWORD` | пароль FTP |
| `FTP_REMOTE_DIR` | `www/volki-frn.by/` (не `/www/...` и не `httpdocs`) |
| `FTP_PORT` | `21` (опционально; если не работает — попробуйте `22` и смените protocol в workflow на `ftps`) |

---

## Шаг 3. Проверка автодеплоя

1. Внесите мелкую правку (например, комментарий в `index.html`).
2. ```bash
   git add .
   git commit -m "test deploy"
   git push
   ```
3. GitHub → вкладка **Actions** → workflow **Deploy to hoster.by** → зелёная галочка.
4. Откройте https://volki-frn.by/ с **Cmd+Shift+R**.

---

## Локальный деплой без GitHub (запасной вариант)

```bash
cp .env.example .env
# отредактируйте .env — вставьте пароль FTP
brew install lftp   # один раз
chmod +x deploy.sh
./deploy.sh
```

---

## Ежедневная работа

```bash
# правки в файлах...
git add .
git commit -m "описание правки"
git push
```

Большие файлы (`partner-review.mp4` ~38 МБ) заливаются только если изменились.

---

## Если деплой падает

- **ECONNRESET** — FTP hoster.by часто рвёт соединение с серверов GitHub. Workflow использует **lftp** с 5 повторами и одним потоком (`--parallel=1`).
- Если Actions всё равно красные — залейте правки локально: `./deploy.sh` (нужен `brew install lftp`).
- **Тяжёлые файлы** (видеоотзыв, PDF) при обычном push **не** перезаливаются. Полная синхронизация: **Actions** → **Run workflow** → **full_sync**.
- **Login incorrect** — проверьте `FTP_USERNAME` / `FTP_PASSWORD`.
- **Wrong directory** — `FTP_REMOTE_DIR` = `/www/volki-frn.by/`

---

## SSL (отдельно)

Let's Encrypt на hoster.by иногда падает с timeout — это не связано с Git. Пишите в поддержку hoster.by или выпускайте сертификат из панели после того, как сайт стабильно открывается по HTTP.

# Water Watcher v2 - Deployment Notes

## Local Development

```bash
npm run dev          # Start dev server (hot reload)
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

**Local Preview URL:** http://192.168.59.129:4173/

To start preview server on all interfaces:
```bash
npm run preview -- --host 0.0.0.0
```

---

## Production Deployment

### Pokemon Webserver

- **Server IP:** 192.168.0.37
- **Web Root:** /var/www/water-watcher/
- **URL:** http://192.168.0.37/
- **Web Server:** nginx
- **File Owner:** www-data:www-data

**Deploy commands:**
```bash
# 1. Build
npm run build

# 2. Create tarball
tar -czf /tmp/water-watcher-dist.tar.gz -C dist .

# 3. Upload to server
scp /tmp/water-watcher-dist.tar.gz fafek@192.168.0.37:/tmp/

# 4. Extract on server (via pokemon helper)
cd /home/claudeshare/github/Aquants
./pokemon cmd "echo 'PASSWORD' | sudo -S rm -rf /var/www/water-watcher/*"
./pokemon cmd "echo 'PASSWORD' | sudo -S tar -xzf /tmp/water-watcher-dist.tar.gz -C /var/www/water-watcher/"
./pokemon cmd "sudo chown -R www-data:www-data /var/www/water-watcher/"
```

**Quick deploy (one-liner with pokemon script):**
```bash
npm run build && \
tar -czf /tmp/ww.tar.gz -C dist . && \
cd /home/claudeshare/github/Aquants && \
./pokemon cmd "echo '234oiuoiu234' | sudo -S bash -c 'rm -rf /var/www/water-watcher/* && tar -xzf /tmp/ww.tar.gz -C /var/www/water-watcher/ && chown -R www-data:www-data /var/www/water-watcher/'"
```

---

## Android App (Capacitor)

```bash
npm run build                    # Build web assets
npx cap sync android             # Sync to Android project
npx cap open android             # Open in Android Studio
```

APK location after build: `android/app/build/outputs/apk/`

---

## Versioning

**Current Version:** 2.1.0

To release a new version:
```bash
# 1. Update version in package.json
# 2. Commit changes
git add -A && git commit -m "Release vX.Y.Z - Description"

# 3. Tag the release
git tag -a vX.Y.Z -m "Release vX.Y.Z - Description"

# 4. Push (if using remote)
git push && git push --tags
```

---

## Server Access

**Pokemon server helper:** `/home/claudeshare/github/Aquants/pokemon`

```bash
./pokemon status          # Check server status
./pokemon ssh             # Interactive SSH session
./pokemon cmd "COMMAND"   # Run remote command
```

---

## Network Info

| Service | IP | Port |
|---------|-----|------|
| Local dev | 192.168.59.129 | 5173 |
| Local preview | 192.168.59.129 | 4173 |
| Pokemon web | 192.168.0.37 | 80 |
| Pokemon SSH | 192.168.0.37 | 22 |

# Simulatore GEA PWA V5.13

App Android generata con **Crea APK** (by Lollo ®2026) dall'app HTML `Simulatore_GEA_PWA_v5.13.zip` (10 file), pagina di avvio `index.html`.

## Struttura
- `www/` — la tua app HTML, intatta: viene messa dentro l'APK
- `package.json`, `capacitor.config.json` — configurazione di Capacitor (la WebView che mostra le pagine)
- `app.json` — versione, permessi e orientamento
- `cap-prepara.js` — applica nome, versione, permessi e icona al progetto Android
- `cap-download.js` — dentro l'APK trasforma i download della pagina in «Salva o condividi»
- `.github/workflows/build-apk.yml` — compila l'APK su GitHub a ogni push
- `firma/` — creata al primo giro: chiave che permette gli aggiornamenti. Non cancellarla.

## Come ottenere l'APK
1. Carica tutti questi file in un repository GitHub (anche la cartella `.github`).
2. Scheda **Actions** → attendi il pallino verde (prima volta 5–10 min).
3. Sezione **Releases** → "APK build N" → scarica il file `.apk` e installalo.

## Note
- L'app gira su `https://localhost` dentro l'APK: usa percorsi relativi, non `file://`.
- `localStorage` e IndexedDB funzionano e restano tra un aggiornamento e l'altro (stessa chiave di firma).

Pacchetto: `org.lollo.quiz` · versione 1.1

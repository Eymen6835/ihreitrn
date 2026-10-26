# Ihre IT Rhein-Neckar (`ihreitrn.de` – 1:1 Nachbau)

Vollständiger, lokaler 1:1-Nachbau der Website **[ihreitrn.de](https://ihreitrn.de/)** in reinem HTML, CSS und JavaScript – inklusive aller Unterseiten, Schriften, Bilder (AVIF/WebP/JPG/SVG), interaktiver Anfahrtskarte und Hell-/Dunkel-Modus.

## Enthaltene Seiten

- [`index.html`](./index.html) – Startseite (`/`)
- [`geschaeftskunden.html`](./geschaeftskunden.html) – Unternehmen (`/geschaeftskunden`)
- [`leistungen.html`](./leistungen.html) – Privatkunden (`/leistungen`)
- [`preise.html`](./preise.html) – Preise & interaktive Einzugsgebietskarte (`/preise`)
- [`ueber-mich.html`](./ueber-mich.html) – Über mich (`/ueber-mich`)
- [`kontakt.html`](./kontakt.html) – Kontakt (`/kontakt`)
- [`impressum.html`](./impressum.html) – Impressum (`/impressum`)
- [`datenschutz.html`](./datenschutz.html) – Datenschutz (`/datenschutz`)

## Starten

### Option 1: Mitgelieferter lokaler Webserver (empfohlen, unterstützt saubere URLs wie `/geschaeftskunden`)

```bash
npm start
# oder direkt:
node server.js
```

Anschließend im Browser öffnen: **http://localhost:3000**

### Option 2: Direkt im Dateisystem öffnen

Du kannst [`index.html`](./index.html) auch direkt per Doppelklick im Browser öffnen (`file://`-Protokoll wird durch einen automatischen Link-Handler in `assets/js/main.js` unterstützt).

# 🎯 Agentic Investigation AI System

A desktop-ready intelligence analyst AI. Investigate people, companies, usernames, and emails — build structured intel reports.

## Features

- **Multi-target support** — Person, Company, Username, Email, Other
- **Intel Reports** — structured sections: Background, Web Presence, Social Profiles, Affiliations, News & Media, Legal & Financial, Pattern Analysis, Conclusion
- **Investigation Engine** — live console with agent-driven search
- **Confidence scoring** — per-section and per-investigation ratings
- **Local storage** — all data stored locally, no account needed
- **macOS native** — runs as a `.app` / `.dmg`

## Quick Start (macOS)

### Option 1: Double-click setup (easiest)
```bash
./setup-mac.sh
```

### Option 2: Manual
```bash
npm install
npm run electron:dev     # dev mode
npm run electron:build   # build .dmg for distribution
```

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Desktop:** Electron (macOS, arm64 + x64)
- **Storage:** localStorage (no backend required)

## Build Output

After `npm run electron:build`, find your `.dmg` installer in `/release/`.

## Project Structure

```
├── electron/          # Electron main process
│   ├── main.js        # App window, lifecycle
│   └── preload.js     # Context bridge
├── src/
│   ├── pages/         # Dashboard, New, Detail, Run
│   ├── App.tsx        # Router
│   └── main.tsx       # Entry point
├── public/            # Icons
└── setup-mac.sh       # One-click macOS setup
```

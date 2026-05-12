# Fleek Quality Dashboard

## First-time setup (do once)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USERNAME/fleek-quality-dashboard.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to vercel.com → Add New Project
2. Import your `fleek-quality-dashboard` GitHub repo
3. Click Deploy — no settings to change
4. You get a URL like `fleek-quality-dashboard.vercel.app`

## Daily data update (n8n automates this)

The dashboard reads cadence data from `public/cadence.json`.
Every day n8n runs the BigQuery query, appends the new date, 
and pushes the updated file to GitHub. Vercel redeploys automatically.

## n8n workflow setup

1. In n8n, create a new workflow
2. Add a **Schedule Trigger** — set to 8:00 AM daily
3. Add an **HTTP Request** node:
   - URL: https://api.anthropic.com/v1/messages
   - Method: POST
   - Headers: Content-Type: application/json
   - Body: (see n8n_payload.json in this repo)
4. Add a **Code** node to parse the response and merge with existing cadence.json
5. Add a **GitHub** node:
   - Operation: Create or update file
   - Repository: fleek-quality-dashboard
   - File path: public/cadence.json
   - Content: {{ $json.updatedCadence }}
   - Commit message: "Update cadence data {{ $now }}"
6. Connect GitHub credentials (Personal Access Token with repo write access)

## File structure
```
├── index.html          — entry point
├── package.json        — dependencies
├── vite.config.js      — build config
├── src/
│   ├── main.jsx        — React bootstrap
│   └── App.jsx         — full dashboard
└── public/
    └── cadence.json    — live data file (updated by n8n daily)
```

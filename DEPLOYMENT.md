# ADR-RAS Deployment Guide

## Prerequisites

- Node.js v18.x or v20.x
- MongoDB Atlas account (or self-hosted MongoDB ≥ 5.0)
- A cloud host that supports **persistent Node.js processes and WebSockets** (required for Socket.IO)

> ⚠️ **Socket.IO requires WebSocket support.** Serverless or edge platforms (Cloudflare Workers, Vercel Functions) are NOT compatible with the backend. Use: **Render**, **Railway**, **Fly.io**, **DigitalOcean App Platform**, or **AWS EC2**.

---

## 1. Environment Variables

**Never commit `.env` files.** Use your host's secret management dashboard.

### Backend (`backend/.env`)

```env
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<db>?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>   # openssl rand -base64 48
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.vercel.app

# Weather Integration (optional — graceful fallback if not set)
# Option A: OpenWeatherMap
WEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather
WEATHER_API_KEY=<your-openweathermap-key>

# Option B: WeatherAPI.com
# WEATHER_API_URL=https://api.weatherapi.com/v1/current.json
# WEATHER_API_KEY=<your-weatherapi-key>
```

### Frontend (`.env` — set BEFORE running `npm run build`)

```env
# IMPORTANT: Vite bakes this value into the bundle at BUILD TIME.
# Set this to your production backend URL before building.
VITE_API_URL=https://your-backend.render.com/api/v1
```

---

## 2. Pre-Deployment Checklist

Run through every item before deploying:

- [ ] `MONGODB_URI` set in backend host environment
- [ ] `JWT_SECRET` set to a strong random string (≥ 32 chars)
- [ ] `JWT_EXPIRES_IN` set (recommend `7d`)
- [ ] `CLIENT_URL` set to production frontend URL (for CORS)
- [ ] `NODE_ENV=production` set in backend host environment
- [ ] `VITE_API_URL` set to production backend URL **before `npm run build`**
- [ ] Backend host supports **WebSockets** (for Socket.IO)
- [ ] File upload persistence strategy decided (see Section 6)
- [ ] Weather API key configured (optional, app works without it)
- [ ] Health endpoint accessible: `GET /api/v1/health`

---

## 3. Startup Validation

The backend runs `validateEnv()` on startup and logs the status of every required environment variable (without printing values):

```
[ENV VALIDATION]
  ✓ MONGODB_URI configured
  ✓ JWT_SECRET configured
  ✓ CLIENT_URL configured
  ✓ JWT_EXPIRES_IN configured
  ~ WEATHER_API_KEY not set — Weather integration will be disabled
  ~ WEATHER_API_URL not set — Weather integration will be disabled
  ✓ NODE_ENV=production
[/ENV VALIDATION]
```

If any **required** variable is missing in `NODE_ENV=production`, the process exits immediately with exit code 1.

---

## 4. Frontend Deployment (Vercel)

The frontend is a Vite SPA. `vercel.json` includes the SPA rewrite rule (`/(.*) → /index.html`).

1. Set `VITE_API_URL` as an **Environment Variable** in your Vercel project settings.
2. Vercel will inject it at build time when deploying from the repository.
3. No custom build command needed — Vercel detects Vite automatically (`npm run build`).

---

## 5. Backend Deployment

The backend startup command is: `npm start` (runs `node server.js`).

Example for **Render**:
- Build command: `npm install`
- Start command: `npm start`
- Environment: Node.js
- Set all environment variables in the Render dashboard

Example for **Railway**:
- Dockerfile not required — Railway auto-detects Node.js
- Set environment variables in Railway's Variables tab

---

## 6. File Upload Storage

The backend currently stores uploaded incident evidence to the **local filesystem** (`backend/uploads/incidents/`).

| Scenario | Suitable? |
|---|---|
| Local development | ✅ Works fine |
| Render / Railway (with persistent disk) | ✅ Attach a persistent disk and set upload path |
| Render / Railway (free tier, ephemeral) | ⚠️ Files lost on restart |
| Vercel / Cloudflare (serverless) | ❌ Not supported — use S3 |

**To enable persistent uploads on Render:** Add a persistent disk and set the `UPLOADS_DIR` env var (the upload service uses `process.cwd()/uploads/incidents` by default).

**To migrate to S3:** Replace `multer.diskStorage` in `backend/src/services/uploadService.js` with `multer-s3`. The controller interface does not need to change.

---

## 7. Weather Integration

The weather service supports two providers out-of-the-box:

**OpenWeatherMap** (recommended):
```
WEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather
WEATHER_API_KEY=<your-key>
```
Free tier: 1,000 calls/day at https://openweathermap.org/api

**WeatherAPI.com**:
```
WEATHER_API_URL=https://api.weatherapi.com/v1/current.json
WEATHER_API_KEY=<your-key>
```

If keys are not configured, `GET /api/v1/weather` returns HTTP 503 with `{"success": false, "message": "Weather service temporarily unavailable"}`. The frontend displays a graceful unavailable state — **all other functionality continues normally**.

---

## 8. Health Check

```
GET /api/v1/health
```

Returns:
```json
{
  "success": true,
  "message": "ADRRAS API is running",
  "apiStatus": "online",
  "databaseStatus": "connected",
  "uptime": 120.4,
  "timestamp": "...",
  "environment": "production"
}
```

Returns HTTP 503 if MongoDB is not connected.

Configure an uptime monitor (UptimeRobot, BetterStack) to ping this endpoint every 5 minutes.

---

## 9. CI/CD (GitHub Actions)

The workflow (`.github/workflows/ci.yml`) runs on every push to `main`/`master`:

1. **Backend — Syntax & Import Check**: Installs dependencies, runs `node ci-check.js` which imports every module and verifies no syntax/resolution errors. **Does not require MongoDB.**
2. **Frontend — Build Check**: Installs dependencies, runs `npm run build` with a placeholder `VITE_API_URL`.

Both jobs run against Node.js 18.x and 20.x.

> **Note:** The CI does not run integration tests against a live database. Full integration testing should be performed locally before merging to `main`.

---

## 10. Database Backups

MongoDB Atlas provides automated backup configuration. Enable it in your Atlas cluster settings under **Backup**. The application itself does not handle backups internally.

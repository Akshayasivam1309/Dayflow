# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- No external database needed — SQLite runs as an embedded file.

## 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and, at minimum, change `JWT_SECRET` to a long random string before any real use.

```bash
npm run seed     # creates the data/dayflow.db file and demo accounts
npm start         # starts the API on http://localhost:4000
```

Verify it's running:

```bash
curl http://localhost:4000/api/health
# {"status":"ok","service":"Dayflow HRMS API"}
```

Useful scripts:
- `npm start` — run the server
- `npm run dev` — run with auto-restart on file changes
- `npm run seed` — (re)seed demo accounts (safe to re-run; skips existing emails)

To reset the database, delete `backend/data/dayflow.db*` and re-run `npm run seed`.

## 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit **http://localhost:5173**. The `VITE_API_URL` in `.env` should point at the backend (defaults to `http://localhost:4000/api`).

Sign in with a demo account:

| Role | Email | Password |
|---|---|---|
| HR Admin | admin@dayflow.com | Admin@123 |
| Employee | priya.sharma@dayflow.com | Employee@123 |

Or register a new account from the Sign Up screen — you'll be shown a demo "verification token" to confirm the email (in a real deployment this would arrive by email instead).

## 3. Production build

```bash
cd frontend
npm run build      # outputs static files to frontend/dist
npm run preview     # serve the production build locally to sanity-check it
```

Deploy `frontend/dist` to any static host, and run the `backend` as a normal Node process (or containerize it). Set `VITE_API_URL` at build time to point at your deployed API's URL, and set a strong `JWT_SECRET` in the backend's environment.

## Troubleshooting

- **"Incorrect email or password"** — double-check you ran `npm run seed`, and that you're using the exact demo credentials above.
- **CORS errors in the browser console** — confirm the backend is running and `VITE_API_URL` matches its actual address.
- **Port already in use** — change `PORT` in `backend/.env`, and update `VITE_API_URL` in `frontend/.env` to match.

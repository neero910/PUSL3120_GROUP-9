# Vercel Deployment Guide — Hotel Management System

This guide walks you through deploying the Hotel Management System fullstack app to Vercel in two configurations:
- **Option A (Recommended):** Frontend + REST API all-in-one on Vercel (no WebSocket real-time updates)
- **Option B (Full WebSockets):** Frontend on Vercel + Backend on Render for persistent socket connections

---

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free)
- The GitHub repository pushed to GitHub: `https://github.com/neero910/PUSL3120_GROUP-9`
- A MongoDB Atlas cluster with your database

---

## Part 1 — Set Up MongoDB Atlas for Cloud Access

Before deploying, you need to allow Vercel's IP addresses to connect to your MongoDB Atlas cluster.

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to **Network Access** (under Security in the left sidebar)
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (this adds `0.0.0.0/0`)
5. Click **Confirm**

> **Why?** Vercel uses dynamic IPs that change frequently. Allowing all IPs is the standard approach for serverless deployments. Atlas itself still requires your username/password credentials.

---

## Option A — All-in-One on Vercel (Recommended)

### Step 1: Import Your GitHub Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Add GitHub Account"** or select your existing GitHub account
3. Find and select the `neero910/PUSL3120_GROUP-9` repository
4. Click **"Import"**

### Step 2: Configure Project Settings

On the **Configure Project** screen:

| Setting | Value |
|---|---|
| Framework Preset | **Vite** |
| Root Directory | `.` (leave as-is) |
| Build Command | `vite build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

> These are already set in `vercel.json` — Vercel will auto-detect them.

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add the following:

| Name | Value | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/hotel-safron` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-strong-secret-key-here` | Secret key for JWT token signing (use a long random string) |
| `NODE_ENV` | `production` | Sets the Node.js environment |
| `CLIENT_URL` | `https://your-project.vercel.app` | Your Vercel deployment URL (set after first deploy) |

> **Getting your MONGODB_URI:**
> 1. In MongoDB Atlas, click **"Connect"** on your cluster
> 2. Choose **"Connect your application"**
> 3. Copy the connection string and replace `<password>` with your database user password

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will install dependencies, build the Vite app, and deploy
3. After ~2 minutes, you'll see a success page with your deployment URL (e.g., `https://pusl3120-group-9.vercel.app`)

### Step 5: Verify the Deployment

Test these URLs in your browser after deployment:

```
# API Health Check
https://your-project.vercel.app/api/health

# Frontend (React SPA)
https://your-project.vercel.app/

# Login Page
https://your-project.vercel.app/login

# Direct page reload (should NOT 404)
https://your-project.vercel.app/dashboard
```

---

## Option B — Frontend on Vercel + Backend on Render (Full WebSocket Support)

Use this if you need real-time reservation updates via Socket.io.

### Step 1: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Environment | `Node` |

5. Add Environment Variables:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — your JWT secret
   - `NODE_ENV` — `production`
   - `CLIENT_URL` — your Vercel frontend URL (set after Vercel deploy)

6. Click **"Create Web Service"**
7. Note your backend URL (e.g., `https://hotel-api.onrender.com`)

### Step 2: Deploy Frontend to Vercel

Follow the same steps as Option A, but add these additional environment variables:

| Name | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://hotel-api.onrender.com/api` |
| `VITE_WS_URL` | `https://hotel-api.onrender.com` |

> With `VITE_API_BASE_URL` set, all frontend API calls will go to your Render backend instead of the Vercel serverless function. With `VITE_WS_URL` set, real-time WebSocket updates will work.

---

## Environment Variables Reference

### Required (Both Options)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT token signing secret |

### Optional

| Variable | Purpose | Default |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `VITE_API_BASE_URL` | Override backend API URL | `/api` (relative) |
| `VITE_WS_URL` | WebSocket server URL for Render backend | Auto-detected |

---

## Troubleshooting

### "Cannot connect to database"
- Check that `MONGODB_URI` is correctly set in Vercel Environment Variables
- Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
- Ensure the database user has **Read and Write** permissions

### Pages return 404 on refresh
- This is fixed by `vercel.json` rewrites — ensure `vercel.json` is in the root directory and committed to Git

### API calls return 404
- Check that `vercel.json` is correctly configuring the `/api/(.*)` rewrite to `/api/index.js`
- Verify the `api/index.js` file exists in the root of the project

### CORS errors in browser console
- Add your Vercel deployment URL to the `CLIENT_URL` environment variable in Vercel
- All `*.vercel.app` domains are already whitelisted automatically

### WebSocket not connecting
- In Option A (all-in-one on Vercel), WebSockets are not supported — this is expected
- For full WebSocket support, use Option B with a dedicated backend on Render

---

## CI/CD — Automatic Deployments

Once connected, Vercel automatically:
- Deploys to **production** when you push to `master`/`main`
- Creates **preview deployments** for every Pull Request

Your GitHub Actions CI pipeline (`.github/workflows/ci.yml`) runs tests on every push before Vercel deploys.

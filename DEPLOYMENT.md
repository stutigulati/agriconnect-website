# AgriConnect — Deployment Guide
### Frontend → Vercel | Backend → Render | DB → MongoDB Atlas

---

## Architecture

```
GitHub Repo
    ├── Frontend (React + Vite)  ──→  Vercel   (agriconnect.vercel.app)
    └── Backend  (Express + Node) ──→  Render   (agriconnect-api.onrender.com)
                                           └── MongoDB Atlas
```

---

## STEP 1 — Push to GitHub

### 1a. Create a new GitHub repo
1. Go to [github.com/new](https://github.com/new)
2. Name it `agriconnect`, set to **Private**
3. **Do NOT** tick "Add README" or ".gitignore" — you already have them
4. Click **Create repository**

### 1b. Push your code
Open terminal inside your project folder and run:

```bash
git init
git add .
git commit -m "feat: initial AgriConnect deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agriconnect.git
git push -u origin main
```

> ⚠️ Verify `.env` is NOT in the push — it's excluded by `.gitignore`. Only `.env.example` is committed.

---

## STEP 2 — MongoDB Atlas

> Skip if you already have a working `MONGO_URI`.

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free **M0** cluster (Singapore)
2. **Database Access** → Add user → set username + password
3. **Network Access** → Add IP → `0.0.0.0/0` (Render IPs change, so allow all)
4. **Connect** → **Drivers** → copy your URI:
   ```
   mongodb+srv://<user>:<password>@cluster.mongodb.net/agriconnect?retryWrites=true&w=majority
   ```

---

## STEP 3 — Deploy Backend on Render

### 3a. Sign up
[render.com](https://render.com) → **Sign up with GitHub**

### 3b. New Web Service
1. Dashboard → **New** → **Web Service**
2. Connect GitHub → select `agriconnect` repo → **Connect**
3. Configure:

| Field | Value |
|-------|-------|
| Name | `agriconnect-api` |
| Region | Singapore |
| Branch | `main` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server/index.js` |
| Plan | Free |

### 3c. Environment Variables
Click the **Environment** tab and add each one:

```
MONGO_URI         = mongodb+srv://...   (your Atlas URI)
JWT_SECRET        = (run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
PORT              = 10000
NODE_ENV          = production
FRONTEND_URL      = https://agriconnect.vercel.app   ← update after Step 4
AWS_REGION        = us-east-1
AWS_ACCESS_KEY_ID = (your key)
AWS_SECRET_ACCESS_KEY = (your secret)
AWS_S3_BUCKET     = (your bucket)
```

### 3d. Deploy & Test
Click **Create Web Service** → wait ~3 min → visit:

```
https://agriconnect-api.onrender.com/api/health
```

Expected response:
```json
{ "ok": true, "service": "agriconnect-community-api" }
```

📝 **Copy your Render URL** — you need it for Vercel.

---

## STEP 4 — Deploy Frontend on Vercel

### 4a. Sign up
[vercel.com](https://vercel.com) → **Sign up with GitHub**

### 4b. Import Project
1. Dashboard → **Add New** → **Project**
2. Select `agriconnect` repo → **Import**
3. Vercel auto-detects Vite. Confirm settings:

| Field | Value |
|-------|-------|
| Framework | Vite |
| Root Directory | `./` (leave blank) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 4c. Add Environment Variable
Before clicking Deploy, go to **Environment Variables**:

```
VITE_API_URL = https://agriconnect-api.onrender.com/api
```

> ⚠️ `VITE_` variables are baked in at build time — must be set before deploying.

### 4d. Deploy
Click **Deploy** → ~2 min → your app is live at `https://agriconnect.vercel.app`

---

## STEP 5 — Cross-link (CORS fix)

1. Go to Render → `agriconnect-api` → **Environment**
2. Update `FRONTEND_URL` to your actual Vercel URL:
   ```
   FRONTEND_URL = https://agriconnect.vercel.app
   ```
3. **Save Changes** → Render auto-redeploys

---

## STEP 6 — Verify Everything

- [ ] `https://agriconnect.vercel.app` — app loads
- [ ] `https://agriconnect-api.onrender.com/api/health` — returns `ok: true`
- [ ] Login / Register works
- [ ] Community posts load and submit
- [ ] Navbar shows "Welcome, Name" after login

---

## Future Deployments (Auto)

Both platforms watch your `main` branch:

```bash
git add .
git commit -m "your change"
git push origin main
# → Vercel rebuilds frontend (~90 sec)
# → Render redeploys backend (~2-3 min)
```

---

## Environment Variables Reference

### Render (Backend)
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | 64-char random secret |
| `PORT` | `10000` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Vercel URL (for CORS) |
| `AWS_REGION` | e.g. `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS IAM key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret |
| `AWS_S3_BUCKET` | S3 bucket name |

### Vercel (Frontend)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | `https://your-service.onrender.com/api` |

---

## Common Issues

**CORS error in browser**
→ `FRONTEND_URL` on Render must match Vercel URL exactly — no trailing slash
→ Redeploy Render after changing env vars

**404 on page refresh**
→ `vercel.json` handles this — make sure it's committed ✓

**Render sleeping (free plan)**
→ Free services sleep after 15 min idle — first wake-up takes ~30s
→ Use [UptimeRobot](https://uptimerobot.com) (free) to ping `/api/health` every 10 min

**Images lost after Render restart**
→ Render free disk is ephemeral — configure AWS S3 env vars for persistent uploads

---

## Local Development

```bash
git clone https://github.com/YOUR_USERNAME/agriconnect.git
cd agriconnect
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env

# Terminal 1 — backend
npm run dev:server

# Terminal 2 — frontend
npm run dev
# Open http://localhost:5173
```

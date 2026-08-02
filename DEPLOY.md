# MediTrack — Deployment Guide

## Step 1 — MongoDB Atlas (free)

1. Go to https://cloud.mongodb.com and create a free account.
2. Create a **free M0 cluster** (any region).
3. **Database Access** → Add a database user with username + password.
4. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere).
5. Click **Connect** → **Drivers** → copy the connection string.
   It looks like:
   ```
   mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 2 — Deploy the Backend on Vercel

1. Go to https://vercel.com → New Project → import your GitHub repo.
2. Set **Root Directory** to `backend`.
3. **Framework Preset**: Other.
4. Add these **Environment Variables** in the Vercel dashboard:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Any long random string (32+ chars) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | Your frontend Vercel URL (step 3) |
   | `NODE_ENV` | `production` |
   | `EMAIL_USER` | your Gmail address |
   | `EMAIL_PASS` | Gmail App Password |
   | `TWILIO_ACCOUNT_SID` | From Twilio console |
   | `TWILIO_AUTH_TOKEN` | From Twilio console |
   | `TWILIO_PHONE_FROM` | Your Twilio number |
5. Deploy. Note the backend URL e.g. `https://meditrack-api.vercel.app`.

---

## Step 3 — Deploy the Frontend on Vercel

1. New Project → same repo, **Root Directory**: `.` (project root).
2. **Framework Preset**: Vite.
3. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://meditrack-api.vercel.app/api` |
4. Deploy. Copy the frontend URL.
5. Go back to the **backend** Vercel project → Settings → Environment Variables →
   update `CLIENT_URL` to the frontend URL → Redeploy.

---

## Step 4 — Test

Open your frontend URL, click **Register**, fill in your details.
The account is stored in MongoDB Atlas — any device can now sign in
with the same email and password.

---

## Key notes

- **One account, any device**: credentials are in MongoDB Atlas, not a local file.
- **Passwords are hashed** with bcrypt (cost 12) — never stored in plain text.
- **JWT tokens** expire after 7 days; the user is auto-redirected to login.
- The scheduler (SMS/email at medicine time) only runs in local dev, not on Vercel.
  For production scheduling, use a separate service like Railway or Render.

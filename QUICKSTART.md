# 🚀 ZURVAN Quick Start Guide

## What You Got

✅ **Docker PostgreSQL setup** - Local database with full control  
✅ **Firebase Auth integration** - Free authentication system  
✅ **Firebase Storage ready** - For proof uploads  
✅ **Database abstraction layer** - Clean PostgreSQL client  
✅ **Complete schema** - All ZURVAN tables ready  
✅ **Migration scripts** - Easy database setup  
✅ **Vite + React** - Your existing frontend intact  

---

## Setup in 5 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Database
```bash
docker-compose up -d
```

### 3️⃣ Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project → Enable Auth (Email/Password) → Enable Storage
3. Project Settings → Your apps → Web app
4. Copy config values

### 4️⃣ Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase values
```

### 5️⃣ Initialize Database
```bash
# Add these to package.json scripts section:
"db:migrate": "docker exec -i zurvan-db psql -U zurvan_user -d zurvan < lib/db/schema/schema.sql",
"db:seed": "docker exec -i zurvan-db psql -U zurvan_user -d zurvan < lib/db/schema/seed.sql"

# Then run:
npm run db:migrate
```

---

## Start Developing

```bash
npm run dev
```

Open `http://localhost:8080` → Go to `/auth` → Sign up!

---

## Your Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Vite + React + TypeScript |
| Database | PostgreSQL 16 (Docker) |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| Styling | Tailwind CSS + ShadCN |

---

## Project Structure

```
zurvan/
├── lib/db/
│   ├── schema/
│   │   ├── schema.sql       ← Database tables
│   │   └── seed.sql         ← Sample data
│   └── index.ts             ← Database client
├── src/
│   ├── lib/firebase/
│   │   └── config.ts        ← Firebase setup
│   ├── contexts/
│   │   └── AuthContext.tsx  ← Auth state
│   ├── pages/
│   │   ├── Index.tsx        ← Dashboard
│   │   └── Auth.tsx         ← Login/Signup
│   └── components/          ← UI components
└── docker-compose.yml       ← PostgreSQL config
```

---

## Database Tables

- `profiles` - User profiles (synced with Firebase)
- `streams` - Your 5 learning streams
- `topics` - Topics within streams
- `tasks` - Daily tasks
- `focus_sessions` - Pomodoro sessions
- `proofs` - Evidence uploads

---

## Next Steps

1. **Sign up** at `/auth`
2. **Add your 5 streams** (IBM, Red Hat, Skillsoft, CS Degree, Cyber Dojo)
3. **Create topics** for each stream
4. **Add tasks** and start tracking!

---

## Troubleshooting

**Database won't start:**
```bash
docker-compose down -v
docker-compose up -d
```

**Can't connect to database:**
- Check `.env.local` has correct `VITE_DATABASE_URL`
- Verify Docker container is running: `docker ps`

**Firebase errors:**
- Verify all Firebase env vars are set
- Check Firebase Console → Authentication is enabled
- Ensure Email/Password provider is active

---

## Full Documentation

See `SETUP.md` for comprehensive setup guide with all details.

---

## 🎯 You Now Have:
✅ Full local development control  
✅ Free Firebase services  
✅ Professional tech stack  
✅ Zero platform lock-in  
✅ Offline-capable database  

**Ready to master infinite progress!** 🚀

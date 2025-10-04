# Survivor Fantasy League - Development Guide

## 🎯 App Refactoring Summary

This app has been refactored to focus **exclusively on Survivor**. All Big Brother, Love Island, and Traitors references have been removed.

---

## 🔐 Authentication System

### Development Mode (Auth Bypass)

For rapid development without worrying about authentication:

**Backend:** Set in `.env`:
```bash
DISABLE_AUTH=True
```

When enabled:
- ✅ All API endpoints work without authentication
- ✅ No need to login or register
- ✅ No JWT tokens required
- ⚠️ Console warning: "Authentication is DISABLED (dev mode)"

**To re-enable auth for production:**
```bash
DISABLE_AUTH=False  # or remove the line entirely
```

### Production Mode (Auth Enabled)

When `DISABLE_AUTH=False` or not set:
- 🔒 Standard JWT authentication required
- User must register/login
- Protected endpoints require `Authorization: Bearer <token>` header

---

## 🚀 Quick Start

### Backend

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt beautifulsoup4

# Start the server
uvicorn app.main:app --reload
```

**API runs at:** `http://localhost:8000`
**API Docs:** `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**App runs at:** `http://localhost:5173`

---

## 📁 Project Structure

### Backend

```
backend/
├── app/
│   ├── api/
│   │   ├── auth.py          # Auth endpoints + dev bypass logic
│   │   ├── survivor.py      # Survivor data endpoints
│   │   ├── leagues.py       # Fantasy league endpoints
│   │   └── users.py         # User management
│   ├── models/
│   │   ├── user.py          # User model
│   │   ├── league.py        # League models (Survivor only)
│   │   └── player.py        # Player model
│   ├── schemas/
│   │   └── ...              # Pydantic schemas
│   ├── core/
│   │   ├── config.py        # App configuration + DISABLE_AUTH
│   │   ├── database.py      # Database connection
│   │   └── security.py      # Security utilities
│   └── main.py              # FastAPI app entry point
├── survivor_scraper.py      # Fandom wiki scraper
└── .env                     # Environment variables
```

### Frontend

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── Dashboard.tsx    # User dashboard (Survivor focused)
│   │   ├── Survivor.tsx     # Survivor-specific page
│   │   ├── Leagues.tsx      # League management
│   │   └── ...
│   ├── components/
│   │   ├── Header.tsx       # App header
│   │   └── Layout.tsx       # Page layout
│   ├── context/
│   │   └── AuthContext.tsx  # Auth state management
│   ├── types/
│   │   ├── league.ts        # TypeScript types (Survivor only)
│   │   └── user.ts
│   └── App.tsx              # React Router setup
└── package.json
```

---

## 🔑 Environment Variables

### Backend `.env`

```bash
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/survivor_db

# Security
SECRET_KEY=your-secret-key-here

# Environment
DEBUG=True

# Development - Auth Bypass
DISABLE_AUTH=True  # Set to False for production
```

### Creating `.env` from Template

```bash
cd backend
cp .env.example .env
# Edit .env with your actual values
```

---

## 🗃️ Database Setup

### Prerequisites

- PostgreSQL 14+

### Setup Steps

```bash
# Create database
createdb survivor_db

# Or via psql
psql -U postgres -c "CREATE DATABASE survivor_db;"

# Run migrations
cd backend
alembic upgrade head
```

### Reset Database

```bash
# Drop and recreate
dropdb survivor_db
createdb survivor_db
alembic upgrade head
```

---

## 🧪 Testing the App

### Test Backend API

```bash
# With auth disabled (dev mode)
curl http://localhost:8000/api/survivor/seasons

# Test auth endpoints
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

### Test Frontend

1. Start backend: `uvicorn app.main:app --reload`
2. Start frontend: `npm run dev`
3. Open browser: `http://localhost:5173`
4. Should work without login if `DISABLE_AUTH=True`

---

## 🎮 Features Removed

### Deleted Files

- ❌ `frontend/src/pages/BigBrother.tsx`
- ❌ `frontend/src/pages/LoveIsland.tsx`
- ❌ `frontend/src/pages/Traitors.tsx`

### Updated Files

- ✅ `frontend/src/App.tsx` - Removed non-Survivor routes
- ✅ `frontend/src/pages/Dashboard.tsx` - Removed carousel with other shows
- ✅ `backend/app/models/league.py` - GameType enum now only has `survivor`
- ✅ `frontend/src/types/league.ts` - GameType now only `"survivor"`

### Features Retained

- ✅ Survivor data fetching
- ✅ Fantasy league creation
- ✅ User authentication (with optional bypass)
- ✅ Player stats
- ✅ Dashboard
- ✅ Leaderboards (planned)

---

## 🔧 Common Development Tasks

### Add a New API Endpoint

1. Edit `backend/app/api/survivor.py` (or create new router)
2. Add route decorator: `@router.get("/new-endpoint")`
3. Use auth bypass if needed: `current_user: User | None = Depends(get_current_user_or_bypass)`
4. Test at `http://localhost:8000/docs`

### Add a New Frontend Page

1. Create `frontend/src/pages/NewPage.tsx`
2. Add route in `frontend/src/App.tsx`:
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Navigate to `http://localhost:5173/new-page`

### Update Database Schema

1. Edit model in `backend/app/models/`
2. Create migration:
   ```bash
   alembic revision --autogenerate -m "description"
   ```
3. Review migration in `backend/alembic/versions/`
4. Apply migration:
   ```bash
   alembic upgrade head
   ```

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `No module named 'aiohttp'` or `'bs4'`

**Fix:**
```bash
cd backend
source venv/bin/activate
pip install aiohttp beautifulsoup4
```

**Error:** `Database connection failed`

**Fix:**
1. Make sure PostgreSQL is running: `brew services start postgresql`
2. Check `.env` DATABASE_URL is correct
3. Create database: `createdb survivor_db`

### Frontend won't start

**Error:** `Cannot find module` errors

**Fix:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Auth not working

**Check:**
1. Is `DISABLE_AUTH=True` in `.env`?
2. Did you restart the backend after changing `.env`?
3. Check browser console for errors
4. Visit `/auth-debug` page to test auth state

### Frontend can't reach backend

**Fix:**
1. Make sure backend is running on `http://localhost:8000`
2. Check CORS settings in `backend/app/core/config.py`
3. Check `frontend/src/config/api.ts` has correct API URL

---

## 📊 Data Sources

### Current Season Data

Uses the Fandom scraper: `backend/survivor_scraper.py`

**Usage:**
```bash
cd backend
source venv/bin/activate
python survivor_scraper.py
```

**Output:** `season_49_data.json`

⚠️ **Note:** Requires Fandom permission for production use. See `FANDOM_PERMISSION_REQUEST.md`

### Historical Data

**Source:** `doehm/survivoR` GitHub repository
**API Endpoint:** `https://github.com/doehm/survivoR/raw/master/dev/json/`
**Coverage:** Seasons 1-48

---

## 🚢 Deploying to Production

### Before Deployment

1. **Disable auth bypass:**
   ```bash
   DISABLE_AUTH=False  # or remove from .env
   ```

2. **Change SECRET_KEY:**
   ```bash
   SECRET_KEY=$(openssl rand -hex 32)
   ```

3. **Update database credentials**

4. **Set DEBUG=False:**
   ```bash
   DEBUG=False
   ```

5. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

### Deployment Checklist

- [ ] DISABLE_AUTH=False
- [ ] Strong SECRET_KEY generated
- [ ] Database password changed from dev
- [ ] DEBUG=False
- [ ] Frontend built for production
- [ ] CORS origins configured for production domain
- [ ] Database migrations applied
- [ ] Fandom API permission obtained (if using scraper)

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test locally with auth both enabled and disabled
4. Commit with descriptive messages
5. Push and create PR

---

## 📝 Notes

- **Auth bypass is for development only** - Never deploy with `DISABLE_AUTH=True`
- The app is now **Survivor-focused only**
- Database schema still supports multiple game types (for potential future expansion)
- Frontend routing simplified to remove other reality shows
- All scraping should respect Fandom's Terms of Service

---

## 🔗 Useful Links

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **React Router:** https://reactrouter.com/
- **Survivor Wiki:** https://survivor.fandom.com
- **survivoR Data:** https://github.com/doehm/survivoR

---

**Happy Coding! 🏝️**

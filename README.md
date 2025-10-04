# Survivor Fantasy League

A fantasy sports web application for CBS Survivor fans to create and manage fantasy leagues based on the hit reality TV show.

## 📺 About

Survivor Fantasy League allows fans to draft contestants, track their performance throughout the season, and compete with friends to see who can predict eliminations and build the best fantasy team.

## 🎯 Project Status

**Current Status:** Development/Beta
**Target Audience:** CBS Survivor fan community
**Scale:** Small community platform (< 1000 initial users)
**Commercial Status:** Non-commercial / Fan project

## ✨ Features

- **Season Tracking:** Up-to-date contestant information for current and past seasons
- **Fantasy Drafts:** Create leagues and draft your favorite contestants
- **Live Scoring:** Automatic point calculation based on eliminations and gameplay
- **Leaderboards:** Compete with friends and track league standings
- **Player Stats:** View detailed contestant information and tribe assignments

## 🏗️ Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation

### Backend

- **FastAPI** - Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Asyncio/HTTPX** - Async HTTP requests
- **JWT Authentication** - Secure user auth

## 📊 Data Sources

### Current Implementation

- **Survivor Wiki (Fandom)** - Primary data source for current seasons
  - _Note: API access permission requested from Fandom_
  - Proper attribution provided on all pages displaying wiki data

### Historical Data

- **doehm/survivoR** - Open-source dataset for seasons 1-48
  - GitHub: https://github.com/doehm/survivoR

### Data Attribution

All contestant information is sourced from [Survivor Wiki](https://survivor.fandom.com) and is properly attributed throughout the application. We respect all content ownership and comply with data usage policies.

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

API will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Application will be available at: `http://localhost:5173`

## 📡 API Endpoints

### Survivor Data

- `GET /api/survivor/seasons` - List all seasons
- `GET /api/survivor/players?season={n}` - Get contestants for a season
- `GET /api/survivor/player-stats?player_id={id}` - Get player statistics

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Leagues (Coming Soon)

- `POST /api/leagues` - Create league
- `GET /api/leagues` - List user's leagues
- `POST /api/leagues/{id}/draft` - Conduct draft

## 🗄️ Database Schema

### Key Tables

- `users` - User accounts and authentication
- `contestants` - Survivor contestant information
- `seasons` - Season metadata
- `leagues` - Fantasy league configurations
- `teams` - User fantasy teams
- `picks` - Draft picks and contestant assignments

## 🔐 Data Privacy & Compliance

### Terms of Service Compliance

- Full compliance with Fandom's Terms of Service
- API access permission requested from Fandom
- Rate limiting: 1-2 second delays between requests
- Caching: 24-hour minimum to reduce server load
- No data redistribution or commercial resale

### User Data Protection

- Secure password hashing (bcrypt)
- JWT-based authentication
- HTTPS only in production
- Privacy policy and terms of service available

## 📝 Development Roadmap

### Phase 1: Core Features (Current)

- [x] Basic authentication system
- [x] Season and contestant data display
- [x] Data scraping infrastructure
- [ ] Fantasy league creation
- [ ] Draft system
- [ ] Scoring engine

### Phase 2: Enhanced Features

- [ ] Live season updates
- [ ] Push notifications
- [ ] Mobile responsive design
- [ ] Social sharing
- [ ] Advanced statistics

### Phase 3: Community Features

- [ ] Public leagues
- [ ] Chat/messaging
- [ ] Achievement system
- [ ] Season predictions
- [ ] Historical analysis tools

## 🤝 Contributing

This is a personal fan project. If you're interested in contributing or have suggestions:

1. Open an issue for bugs or feature requests
2. Fork the repository for major changes
3. Submit pull requests with clear descriptions

## 📜 License

This project is for educational and non-commercial use only.

### Content Attribution

- Survivor contestant data © Survivor Wiki (Fandom)
- Survivor™ is a registered trademark of CBS Broadcasting Inc.
- This is an unofficial fan project not affiliated with CBS or Survivor

### Code License

MIT License - See LICENSE file for details

## ⚠️ Disclaimers

- **Unofficial Project:** Not affiliated with CBS, Survivor, or Paramount
- **Fan Project:** Created by fans, for fans
- **Non-Commercial:** No monetization or commercial use
- **Educational:** Built for learning full-stack development

## 📧 Contact

**Developer:** David Morgan
**Email:** davidjmorgan26@gmail.com
**Project Repository:** https://github.com/djmorgan26/Survivor.git

## 🙏 Acknowledgments

- [Survivor Wiki](https://survivor.fandom.com) for comprehensive contestant data
- [doehm/survivoR](https://github.com/doehm/survivoR) for historical datasets
- CBS and Survivor production team for creating an amazing show
- The Survivor fan community for inspiration

---

**Built with ❤️ by Survivor fans, for Survivor fans**

_Outwit. Outplay. Outlast._

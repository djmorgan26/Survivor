# 🏝️ Survivor Fantasy League

A fantasy sports platform for CBS Survivor fans. Draft your favorite castaways, compete with friends, and score points based on real episode results.

## 🎯 Project Overview

### Core Features
- **Fantasy Drafts**: Snake or auction-style drafts with Survivor contestants
- **Real-time Scoring**: Automated point updates after each episode
- **League Management**: Create private leagues or join public competitions
- **Live Episode Tracking**: Score updates during episode airings
- **Historical Data**: Access to 70+ seasons of Survivor data
- **Social Features**: Chat, trash talk, and league standings

### Scoring System
- **Challenge Wins**: Individual immunity (+15), Reward (+10), Team wins (+5)
- **Survival**: Avoid elimination (+5), Make merge (+25), Final 3 (+50)
- **Strategy**: Find idols (+15), Successful idol plays (+10), Blindsides (+20)
- **Screen Time**: Confessionals (+1 each), Episode focus bonus
- **Penalties**: Voted out (-10), Quit (-25)

## 🏗️ Tech Stack

### Frontend
- **React 18** with hooks and context
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Socket.io Client** for real-time updates
- **React Hook Form** for form handling
- **React Query** for API state management

### Backend
- **FastAPI** (Python) for REST API
- **WebSockets** for real-time features
- **SQLAlchemy** for database ORM
- **Alembic** for database migrations
- **FastAPI-Users** for authentication
- **Pydantic** for data validation
- **Celery** for background tasks

### Database & Infrastructure
- **PostgreSQL** for primary database
- **Redis** for caching and sessions
- **Docker** for containerization
- **GitHub Actions** for CI/CD
- **Vercel** for frontend hosting
- **Railway/Render** for backend hosting

### External APIs & Data
- **SurvivorR API**: Historical contestant and episode data
  - Base URL: `https://github.com/doehm/survivoR/raw/master/dev/json/`
  - Endpoints: `castaways.json`, `vote_history.json`, `challenge_results.json`
- **Web Scraping**: Real-time episode results from fan sites
  - Inside Survivor: `https://insidesurvivor.com/`
  - Reality Blurred: `https://realityblurred.com/realitytv/survivor/`
  - Gold Derby: `https://www.goldderby.com/tv/survivor/`
- **OpenAI API**: Parse episode recaps into structured data
- **RSS Feeds**: Monitor fan sites for new episode content

## 📁 Project Structure

```
survivor-fantasy/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Draft/        # Draft-related components
│   │   │   ├── League/       # League management
│   │   │   ├── Player/       # Player cards, stats
│   │   │   └── Common/       # Shared UI elements
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Draft.tsx
│   │   │   ├── League.tsx
│   │   │   └── Login.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Helper functions
│   ├── public/
│   └── package.json
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── auth.py     # Authentication endpoints
│   │   │   ├── leagues.py  # League management
│   │   │   ├── drafts.py   # Draft functionality
│   │   │   ├── players.py  # Player data
│   │   │   └── scoring.py  # Score calculations
│   │   ├── core/           # Core functionality
│   │   │   ├── config.py   # App configuration
│   │   │   ├── database.py # Database setup
│   │   │   └── auth.py     # Auth configuration
│   │   ├── models/         # Database models
│   │   │   ├── user.py
│   │   │   ├── league.py
│   │   │   ├── team.py
│   │   │   └── player.py
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   │   ├── draft_service.py
│   │   │   ├── scoring_service.py
│   │   │   └── data_service.py
│   │   └── tasks/          # Background tasks
│   │       ├── episode_monitor.py
│   │       ├── data_scraper.py
│   │       └── score_updater.py
│   ├── alembic/            # Database migrations
│   ├── requirements.txt
│   └── Dockerfile
├── scripts/                # Utility scripts
│   ├── seed_database.py    # Populate with Survivor data
│   ├── update_scores.py    # Manual score updates
│   └── backup_data.py      # Data backup utilities
├── docs/                   # Documentation
│   ├── api.md             # API documentation
│   ├── scoring.md         # Scoring system details
│   └── deployment.md      # Deployment guide
├── docker-compose.yml      # Local development setup
├── .github/
│   └── workflows/         # CI/CD pipelines
│       ├── frontend.yml
│       └── backend.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost/survivor_fantasy
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key
CORS_ORIGINS=http://localhost:3000

# Frontend (.env.local)
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/survivor-fantasy.git
cd survivor-fantasy

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
alembic upgrade head
python scripts/seed_database.py  # Load Survivor data

# Frontend setup
cd ../frontend
npm install
npm start

# Start backend
cd ../backend
uvicorn app.main:app --reload
```

## 📊 Data Sources & APIs

### SurvivorR Package Data
- **Castaways**: Complete contestant information across all seasons
- **Vote History**: Every tribal council vote ever cast
- **Challenges**: Immunity and reward challenge results
- **Episodes**: Air dates, ratings, episode summaries
- **Advantages**: Hidden idols, advantages, and usage

### Real-time Episode Data
- **RSS Monitoring**: Automated checking of fan site feeds
- **Web Scraping**: Extract results from episode recaps
- **AI Parsing**: Use LLMs to structure unstructured episode data
- **Social Media**: Monitor official Survivor accounts

### Example API Usage

```python
# Backend service to fetch Survivor data
import aiohttp

class SurvivorDataService:
    BASE_URL = "https://github.com/doehm/survivoR/raw/master/dev/json/"
    
    async def get_season_contestants(self, season: int):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}castaways.json") as response:
                data = await response.json()
                return [c for c in data if c["season"] == season]
    
    async def get_challenge_results(self, season: int):
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}challenge_results.json") as response:
                data = await response.json()
                return [c for c in data if c["season"] == season]
```

## 🎮 Core Features Implementation

### Draft System
- Real-time multiplayer draft rooms using WebSockets
- Snake draft algorithm with auto-pick timers
- Trade functionality between draft picks
- Commissioner controls and draft settings

### Scoring Engine
- Automated point calculation after episode results
- Real-time score updates during episodes
- Historical scoring for past seasons (testing/practice)
- Manual override capabilities for disputed calls

### League Management
- Private leagues with invite codes
- Public leagues with skill-based matchmaking
- Commissioner tools for league settings
- Playoff brackets and championship rounds

### Episode Integration
- Background monitoring for new episode data
- Automated scraping of fan site recaps
- AI-powered result extraction and verification
- Push notifications for score updates

## 🔧 Development Workflow

### Backend Development
```bash
# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Background task monitoring
celery -A app.tasks worker --loglevel=info
```

### Frontend Development
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Type checking
npm run type-check
```

### Testing with Historical Data
```python
# Test scoring system with past seasons
python scripts/test_scoring.py --season 45
python scripts/simulate_draft.py --season 46
```

## 🚢 Deployment

### Production Environment
- **Frontend**: Vercel with automatic deployments
- **Backend**: Railway or Render with Docker containers
- **Database**: Managed PostgreSQL (Railway/Supabase)
- **Cache**: Redis Cloud or Upstash
- **Monitoring**: Sentry for error tracking

### CI/CD Pipeline
- GitHub Actions for automated testing
- Automated deployments on merge to main
- Database migration automation
- Environment-specific configurations

## 📈 Roadmap

### Phase 1: MVP (Months 1-2)
- [ ] Basic user authentication and registration
- [ ] Simple league creation and joining
- [ ] Manual draft system with historical players
- [ ] Basic scoring system and leaderboards
- [ ] Manual episode result entry

### Phase 2: Automation (Months 3-4)
- [ ] Automated episode result detection
- [ ] Real-time scoring during episodes
- [ ] Advanced draft features (trades, auto-pick)
- [ ] Mobile-responsive design
- [ ] Email notifications and updates

### Phase 3: Social Features (Months 5-6)
- [ ] In-app chat and messaging
- [ ] League social feeds and trash talk
- [ ] Achievement system and badges
- [ ] Public leaderboards and tournaments
- [ ] Mobile app (React Native)

### Phase 4: Monetization (Month 6+)
- [ ] Premium league features
- [ ] Payment integration for prize pools
- [ ] Advanced analytics and insights
- [ ] Survivor merchandise integration
- [ ] Partnership with CBS/Paramount+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Considerations

- This is a fan-made project not affiliated with CBS or Survivor
- No official Survivor content is redistributed
- Data is sourced from publicly available APIs and fan sites
- Fantasy game mechanics are for entertainment purposes
- Users handle their own financial arrangements for prize pools

## 📞 Contact

- Project Lead: [Your Name]
- Email: your.email@example.com
- Discord: [Survivor Fantasy Discord]
- Issues: [GitHub Issues](https://github.com/yourusername/survivor-fantasy/issues)

---

**Ready to outwit, outplay, and outlast the competition? 🔥**
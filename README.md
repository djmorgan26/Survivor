# Reality Fantasy League (RFL)

Welcome to the Reality Fantasy League platform! RFL lets fans of reality TV shows (Survivor, Love Island, Big Brother, The Traitors, and more) create fantasy leagues, draft contestants, and compete with friends across multiple shows—all in one modern, mobile-friendly app.

## Features

- User registration and login (with robust validation)
- Create and manage leagues for multiple reality shows
- Draft contestants for Survivor, Love Island, Big Brother, The Traitors, and more
- Scoring system based on episode outcomes
- Show selector for seamless multi-show support
- Modern, unified UI with dark mode and mobile-first design
- Responsive image gallery carousel and glassy stat cards
- Easy onboarding and sharing
- Free deployment and CI/CD ready (see below)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: FastAPI, Python, SQLAlchemy, PostgreSQL
- **Authentication**: FastAPI-Users with JWT tokens
- **Real-time**: WebSockets for live drafts and scoring

## Getting Started

### Prerequisites

- Node.js and npm for the frontend
- Python 3.9+ and pip for the backend
- PostgreSQL for the database

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd survivor-fantasy
   ```

2. Set up the frontend:

   ```
   cd frontend
   npm install
   ```

3. Set up the backend:

   ```
   cd backend
   pip install -r requirements.txt
   ```

4. Configure the database and run migrations.

5. Start the development servers for both frontend and backend.

### Deployment

- The app is ready for free deployment (e.g., Vercel for frontend, Fly.io/Render for backend, Supabase/Neon for Postgres).
- See the sample GitHub Actions workflow for CI/CD automation.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

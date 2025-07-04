from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import auth_router, register_router, users_router, reset_password_router, router as custom_auth_router

app = FastAPI(title="Survivor Fantasy League API")

# Add CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(register_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(reset_password_router, prefix="/auth", tags=["auth"])
app.include_router(custom_auth_router, prefix="/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Survivor Fantasy League API is running!"}
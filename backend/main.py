import os
from dotenv import load_dotenv

# Load .env for local dev; on Render, env vars are set in dashboard
load_dotenv("backend/.env")
load_dotenv(".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.routers import auth, chat, address, orders, menu, preferences
from backend.seed_data import seed

Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="Food Ordering Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(address.router)
app.include_router(orders.router)
app.include_router(menu.router)
app.include_router(preferences.router)


@app.get("/")
def root():
    return {"message": "Food Ordering Assistant API is running"}

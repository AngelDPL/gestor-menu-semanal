import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_jwt")

    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///meal_planner.db")
    SQLALCHEMY_DATABASE_URI = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
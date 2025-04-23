from flask import Flask
from flask_cors import CORS
from db.database import DataBase
import os
from dotenv import load_dotenv
from .routes import register_routes

load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = "db_calendar"


def create_app():
    app = Flask(__name__)
    CORS(app)  # разрешаем доступ с фронтенда (React)

    # Инициализация БД
    app.db = DataBase(DB_NAME, DB_USER, DB_PASSWORD)

    # Роуты
    register_routes(app)

    return app

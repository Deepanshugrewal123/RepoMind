import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
SECRET_KEY = os.getenv("APP_SECRET_KEY", "dev_secret_key_environment_configured")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

import os

class Settings:
    PROJECT_NAME: str = "Career OS"
    PROJECT_VERSION: str = "1.0.0"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    DATABASE_PATH: str = os.path.join(BASE_DIR, "database", "career.db")


    @property
    def DATABASE_URL(self):
        return f"sqlite:///{self.DATABASE_PATH}"

settings = Settings()

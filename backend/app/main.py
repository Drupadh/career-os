from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.api import api_router
from app.core.config import settings
from app.core.database import engine, Base
import os

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# API Router
app.include_router(api_router, prefix="/api/v1")

# Static Files (React Frontend)
dist_path = os.path.join(settings.BASE_DIR, "frontend-react", "dist")
assets_path = os.path.join(dist_path, "assets")

if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # API requests are handled by the router above due to order
    # Verify file existence to serve it, else serve index.html for client-side routing
    file_path = os.path.join(dist_path, full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback to index.html for React Router
    index_path = os.path.join(dist_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"message": "Frontend not built. Please run 'npm run build' in frontend-react directory or use the Vite dev server at port 5173."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)

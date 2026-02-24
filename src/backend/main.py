"""Torrent Creator Backend - FastAPI application entry point.

This module creates the FastAPI app, registers all route modules, and
provides the uvicorn entry point when run directly.
"""

import os
import sys

# When this file is executed directly (python src/backend/main.py), Python
# does not recognise it as part of the 'backend' package, so relative imports
# inside sub-modules would fail.  Adding the parent of the package directory
# (i.e. 'src/') to sys.path lets Python resolve 'backend.*' as a package.
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_SRC_DIR = os.path.dirname(_BACKEND_DIR)
if _SRC_DIR not in sys.path:
    sys.path.insert(0, _SRC_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import init_config
from backend.routes.health import router as health_router
from backend.routes.config_routes import router as config_router
from backend.routes.files import router as files_router
from backend.routes.seasons import router as seasons_router
from backend.routes.torrents import router as torrents_router
from backend.routes.tmdb import router as tmdb_router
from backend.routes.create import router as create_router

# Initialize config on module load
init_config()

app = FastAPI(title="Torrent Creator Backend")

# Allow Electron to connect (file:// origins send null, so allow all for local-only use)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route modules
app.include_router(health_router)
app.include_router(config_router)
app.include_router(files_router)
app.include_router(seasons_router)
app.include_router(torrents_router)
app.include_router(tmdb_router)
app.include_router(create_router)

if __name__ == "__main__":
    import uvicorn
    print("Starting Torrent Creator Backend on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)

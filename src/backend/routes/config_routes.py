"""Configuration and ASCII art endpoints."""

from fastapi import APIRouter, HTTPException

from ..config import load_config, save_config, load_ascii_art, save_ascii_art
from ..models import ConfigUpdate, AsciiArtUpdate

router = APIRouter()


@router.get("/config")
def get_config():
    """Get current configuration."""
    config = load_config()
    ascii_art = load_ascii_art()
    return {
        "success": True,
        "config": config,
        "ascii_art": ascii_art
    }


@router.post("/config")
def update_config(update: ConfigUpdate):
    """Update configuration."""
    try:
        save_config(update.config)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/config/ascii-art")
def update_ascii_art(update: AsciiArtUpdate):
    """Update ASCII art."""
    try:
        save_ascii_art(update.ascii_art)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

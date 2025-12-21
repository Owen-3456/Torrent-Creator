from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from guessit import guessit
import os
import json

# Config and ASCII art file locations
CONFIG_PATH = os.path.expanduser("~/.torrent-creator/config.json")
ASCII_ART_PATH = os.path.expanduser("~/.torrent-creator/custom-ascii-art.txt")


def load_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {}


def load_ascii_art():
    if os.path.exists(ASCII_ART_PATH):
        with open(ASCII_ART_PATH, "r") as f:
            return f.read()
    return ""


app = FastAPI(title="Torrent Maker Backend")

# Allow Electron to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FileRequest(BaseModel):
    filepath: str


class ParseResponse(BaseModel):
    filename: str
    parsed: dict
    media_type: str  # 'movie', 'episode', 'season'


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/parse", response_model=ParseResponse)
def parse_filename(request: FileRequest):
    """Parse a media filename to extract metadata"""
    filename = os.path.basename(request.filepath)

    # Use guessit to parse the filename
    parsed = guessit(filename)

    # Determine media type
    if parsed.get('type') == 'movie':
        media_type = 'movie'
    elif 'season' in parsed and 'episode' not in parsed:
        media_type = 'season'
    else:
        media_type = 'episode'

    return ParseResponse(
        filename=filename,
        parsed=dict(parsed),
        media_type=media_type
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
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
    folder: str
    nfo_path: str


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/parse", response_model=ParseResponse)
def parse_filename(file_req: FileRequest):
    """Parse a media filename, move it, and create NFO"""
    filepath = file_req.filepath

    # Validate and expand the filepath
    filepath = os.path.expanduser(filepath)

    if not os.path.isfile(filepath):
        raise HTTPException(
            status_code=400,
            detail=f"File does not exist: {filepath}"
        )

    filename = os.path.basename(filepath)
    parsed = guessit(filename)

    # Determine media type
    if parsed.get('type') == 'movie':
        media_type = 'movie'
    elif 'season' in parsed and 'episode' not in parsed:
        media_type = 'season'
    else:
        media_type = 'episode'

    # Target folder: ~/Documents/torrents/[filename without extension]
    base_name = os.path.splitext(filename)[0]
    torrents_dir = os.path.expanduser('~/Documents/torrents')
    target_dir = os.path.join(torrents_dir, base_name)

    # Create the torrents directory and target folder
    try:
        os.makedirs(target_dir, exist_ok=True)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create directory {target_dir}: {e}"
        )

    # Move the file to target directory
    target_file = os.path.join(target_dir, filename)

    # Only move if source and destination are different
    if os.path.abspath(filepath) != os.path.abspath(target_file):
        try:
            shutil.move(filepath, target_file)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to move file from {filepath} to {target_file}: {e}"
            )

    # Create NFO file using base_name (filename without extension)
    nfo_path = os.path.join(target_dir, f"{base_name}.NFO")
    nfo_content = f"Title: {parsed.get('title', base_name)}\nYear: {parsed.get('year', '')}\nType: {media_type}\nFilename: {filename}\n"

    try:
        with open(nfo_path, "w") as nfo:
            nfo.write(nfo_content)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create NFO at {nfo_path}: {e}"
        )

    return ParseResponse(
        filename=filename,
        parsed=dict(parsed),
        media_type=media_type,
        folder=target_dir,
        nfo_path=nfo_path
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

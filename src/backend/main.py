from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
from guessit import guessit
import os
import json
from typing import Optional

# Config file location
CONFIG_PATH = os.path.expanduser("~/.torrent-creator/config.json")


def load_config() -> dict:
    """Load configuration from file."""
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {}


app = FastAPI(title="Torrent Creator Backend")

# Allow Electron to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class FileRequest(BaseModel):
    filepath: str


class ParseResponse(BaseModel):
    success: bool
    filename: str
    parsed: dict
    media_type: str
    target_folder: str
    nfo_path: str
    error: Optional[str] = None


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/parse")
def parse_and_process_file(file_req: FileRequest):
    """
    Parse a media filename, create folder structure, move file, and create NFO.

    Expected result structure:
    ~/Documents/torrents/[filename-without-ext]/
        ├── [original-filename]
        └── [filename-without-ext].NFO
    """
    filepath = file_req.filepath

    # Expand user path if needed
    if filepath.startswith("~"):
        filepath = os.path.expanduser(filepath)

    # Check if file exists
    if not os.path.isfile(filepath):
        raise HTTPException(
            status_code=400,
            detail=f"File not found: {filepath}"
        )

    # Get filename and base name (without extension)
    filename = os.path.basename(filepath)
    base_name = os.path.splitext(filename)[0]

    # Parse filename with guessit
    parsed = guessit(filename)

    # Determine media type
    parsed_type = parsed.get("type", "")
    if parsed_type == "movie":
        media_type = "movie"
    elif "season" in parsed and "episode" not in parsed:
        media_type = "season"
    elif "episode" in parsed:
        media_type = "episode"
    else:
        media_type = "unknown"

    # Create target directory structure
    torrents_dir = os.path.expanduser("~/Documents/torrents")
    target_folder = os.path.join(torrents_dir, base_name)

    # Create directories
    os.makedirs(target_folder, exist_ok=True)

    # Target file path
    target_file = os.path.join(target_folder, filename)

    # Move the file (only if not already there)
    if os.path.abspath(filepath) != os.path.abspath(target_file):
        # If target already exists, remove it first
        if os.path.exists(target_file):
            os.remove(target_file)
        shutil.move(filepath, target_file)

    # Create NFO file
    nfo_path = os.path.join(target_folder, f"{base_name}.NFO")
    nfo_content = generate_nfo(parsed, filename, media_type)

    with open(nfo_path, "w") as f:
        f.write(nfo_content)

    # Convert parsed dict (may contain non-serializable objects)
    parsed_dict = {}
    for key, value in parsed.items():
        if isinstance(value, (str, int, float, bool, type(None))):
            parsed_dict[key] = value
        elif isinstance(value, list):
            parsed_dict[key] = [str(v) for v in value]
        else:
            parsed_dict[key] = str(value)

    return {
        "success": True,
        "filename": filename,
        "parsed": parsed_dict,
        "media_type": media_type,
        "target_folder": target_folder,
        "nfo_path": nfo_path
    }


def generate_nfo(parsed: dict, filename: str, media_type: str) -> str:
    """Generate NFO file content."""
    title = parsed.get("title", "Unknown")
    year = parsed.get("year", "")

    lines = [
        "=" * 50,
        "  RELEASE INFO",
        "=" * 50,
        "",
        f"Title       : {title}",
        f"Year        : {year}",
        f"Type        : {media_type.capitalize()}",
        f"Filename    : {filename}",
    ]

    # Add optional fields if present
    if "resolution" in parsed:
        lines.append(f"Resolution  : {parsed['resolution']}")
    if "source" in parsed:
        lines.append(f"Source      : {parsed['source']}")
    if "video_codec" in parsed:
        lines.append(f"Video Codec : {parsed['video_codec']}")
    if "audio_codec" in parsed:
        lines.append(f"Audio Codec : {parsed['audio_codec']}")
    if "release_group" in parsed:
        lines.append(f"Group       : {parsed['release_group']}")

    lines.extend([
        "",
        "=" * 50,
    ])

    return "\n".join(lines)


if __name__ == "__main__":
    import uvicorn
    print("Starting Torrent Creator Backend on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)

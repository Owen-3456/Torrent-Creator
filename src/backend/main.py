from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
from guessit import guessit
import os
import json
import httpx
from typing import Optional

# Config paths
CONFIG_DIR = os.path.expanduser("~/.torrent-creator")
CONFIG_PATH = os.path.join(CONFIG_DIR, "config.json")
ASCII_ART_PATH = os.path.join(CONFIG_DIR, "custom-ascii-art.txt")

# Get the project root directory (for example files)
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(BACKEND_DIR))
EXAMPLE_CONFIG_PATH = os.path.join(PROJECT_ROOT, "example-config.json")
EXAMPLE_ASCII_PATH = os.path.join(PROJECT_ROOT, "example-custom-ascii-art.txt")

# Default config structure
DEFAULT_CONFIG = {
    "api_keys": {
        "tmdb": "",
        "tvdb": ""
    },
    "naming_templates": {
        "movie": "{title}.{year}.{quality}.{source}.{codec}-{group}",
        "episode": "{title}.S{season:02}E{episode:02}.{episode_title}.{quality}.{source}.{codec}-{group}",
        "season": "{title}.S{season:02}.{quality}.{source}.{codec}-{group}"
    },
    "trackers": [],
    "output_directory": "~/Documents/torrents",
    "release_group": "GROUP",
    "nfo": {
        "include_notes": True,
        "notes_template": "Enjoy and seed!"
    }
}

DEFAULT_ASCII_ART = """═══════════════════════════════════════════════════
  TORRENT CREATOR
═══════════════════════════════════════════════════"""


def init_config():
    """Initialize config files if they don't exist."""
    # Create config directory
    os.makedirs(CONFIG_DIR, exist_ok=True)

    # Initialize config.json
    if not os.path.exists(CONFIG_PATH):
        # Try to copy from example file, otherwise use defaults
        if os.path.exists(EXAMPLE_CONFIG_PATH):
            shutil.copy(EXAMPLE_CONFIG_PATH, CONFIG_PATH)
            # Clear the API keys in the copied config
            config = load_config()
            config["api_keys"]["tmdb"] = ""
            config["api_keys"]["tvdb"] = ""
            save_config(config)
        else:
            save_config(DEFAULT_CONFIG)

    # Initialize ascii-art.txt
    if not os.path.exists(ASCII_ART_PATH):
        if os.path.exists(EXAMPLE_ASCII_PATH):
            shutil.copy(EXAMPLE_ASCII_PATH, ASCII_ART_PATH)
        else:
            with open(ASCII_ART_PATH, "w") as f:
                f.write(DEFAULT_ASCII_ART)


def load_config() -> dict:
    """Load configuration from file."""
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return DEFAULT_CONFIG.copy()


def save_config(config: dict):
    """Save configuration to file."""
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)


def load_ascii_art() -> str:
    """Load ASCII art from file."""
    if os.path.exists(ASCII_ART_PATH):
        with open(ASCII_ART_PATH, "r") as f:
            return f.read()
    return DEFAULT_ASCII_ART


def save_ascii_art(art: str):
    """Save ASCII art to file."""
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(ASCII_ART_PATH, "w") as f:
        f.write(art)


# Initialize config on module load
init_config()

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


class FolderRequest(BaseModel):
    folder_path: str


class ConfigUpdate(BaseModel):
    config: dict


class AsciiArtUpdate(BaseModel):
    ascii_art: str


class TMDBSearchRequest(BaseModel):
    query: str
    year: Optional[int] = None


class ParseResponse(BaseModel):
    success: bool
    filename: str
    parsed: dict
    media_type: str
    target_folder: str
    nfo_path: str
    error: Optional[str] = None


# ============================================
# Health Check
# ============================================
@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


# ============================================
# Config Endpoints
# ============================================
@app.get("/config")
def get_config():
    """Get current configuration."""
    config = load_config()
    ascii_art = load_ascii_art()
    return {
        "success": True,
        "config": config,
        "ascii_art": ascii_art
    }


@app.post("/config")
def update_config(update: ConfigUpdate):
    """Update configuration."""
    try:
        save_config(update.config)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/config/ascii-art")
def update_ascii_art(update: AsciiArtUpdate):
    """Update ASCII art."""
    try:
        save_ascii_art(update.ascii_art)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# File Processing
# ============================================
@app.post("/parse")
def parse_and_process_file(file_req: FileRequest):
    """
    Parse a media filename, create folder structure, move file, and create NFO.
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
    config = load_config()
    output_dir = config.get("output_directory", "~/Documents/torrents")
    torrents_dir = os.path.expanduser(output_dir)
    target_folder = os.path.join(torrents_dir, base_name)

    # Create directories
    os.makedirs(target_folder, exist_ok=True)

    # Target file path
    target_file = os.path.join(target_folder, filename)

    # Move the file (only if not already there)
    if os.path.abspath(filepath) != os.path.abspath(target_file):
        if os.path.exists(target_file):
            os.remove(target_file)
        shutil.move(filepath, target_file)

    # Create NFO file
    nfo_path = os.path.join(target_folder, f"{base_name}.NFO")
    nfo_content = generate_nfo(parsed, filename, media_type)

    with open(nfo_path, "w") as f:
        f.write(nfo_content)

    # Convert parsed dict (may contain non-serializable objects)
    parsed_dict = serialize_parsed(parsed)

    return {
        "success": True,
        "filename": filename,
        "parsed": parsed_dict,
        "media_type": media_type,
        "target_folder": target_folder,
        "nfo_path": nfo_path
    }


# ============================================
# Torrent Management
# ============================================
@app.get("/torrents")
def list_torrents():
    """List all existing torrent folders."""
    config = load_config()
    output_dir = config.get("output_directory", "~/Documents/torrents")
    torrents_dir = os.path.expanduser(output_dir)

    if not os.path.exists(torrents_dir):
        return {"torrents": []}

    torrents = []
    for name in os.listdir(torrents_dir):
        folder_path = os.path.join(torrents_dir, name)
        if os.path.isdir(folder_path):
            file_count = len([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))])
            torrents.append({
                "name": name,
                "path": folder_path,
                "file_count": file_count
            })

    torrents.sort(key=lambda x: x["name"].lower())
    return {"torrents": torrents}


@app.post("/torrent-details")
def get_torrent_details(folder_req: FolderRequest):
    """Get details of an existing torrent folder."""
    folder_path = folder_req.folder_path

    if not os.path.isdir(folder_path):
        raise HTTPException(
            status_code=400,
            detail=f"Folder not found: {folder_path}"
        )

    video_extensions = [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm", ".m4v"]
    video_file = None
    files = os.listdir(folder_path)

    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in video_extensions:
            video_file = f
            break

    if not video_file:
        video_file = os.path.basename(folder_path) + ".mp4"

    parsed = guessit(video_file)
    parsed_dict = serialize_parsed(parsed)

    parsed_type = parsed.get("type", "")
    if parsed_type == "movie":
        media_type = "movie"
    elif "season" in parsed and "episode" not in parsed:
        media_type = "season"
    elif "episode" in parsed:
        media_type = "episode"
    else:
        media_type = "unknown"

    return {
        "success": True,
        "filename": video_file,
        "parsed": parsed_dict,
        "media_type": media_type,
        "target_folder": folder_path,
        "files": files
    }


# ============================================
# TMDB API
# ============================================
TMDB_BASE_URL = "https://api.themoviedb.org/3"


@app.post("/tmdb/search")
async def tmdb_search_movies(request: TMDBSearchRequest):
    """Search for movies on TMDB."""
    config = load_config()
    api_key = config.get("api_keys", {}).get("tmdb", "")

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="TMDB API key not configured. Please add it in Settings."
        )

    params = {
        "api_key": api_key,
        "query": request.query,
        "include_adult": False
    }

    if request.year:
        params["year"] = request.year

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/search/movie",
            params=params
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        data = response.json()
        results = []

        for movie in data.get("results", [])[:10]:
            results.append({
                "id": movie.get("id"),
                "title": movie.get("title"),
                "original_title": movie.get("original_title"),
                "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "",
                "overview": movie.get("overview", ""),
                "poster_path": movie.get("poster_path"),
                "vote_average": movie.get("vote_average")
            })

        return {"success": True, "results": results}


@app.get("/tmdb/movie/{movie_id}")
async def tmdb_get_movie(movie_id: int):
    """Get detailed movie information from TMDB."""
    config = load_config()
    api_key = config.get("api_keys", {}).get("tmdb", "")

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="TMDB API key not configured. Please add it in Settings."
        )

    async with httpx.AsyncClient() as client:
        # Get movie details
        response = await client.get(
            f"{TMDB_BASE_URL}/movie/{movie_id}",
            params={"api_key": api_key}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        movie = response.json()

        # Extract relevant details
        result = {
            "id": movie.get("id"),
            "tmdb_id": movie.get("id"),
            "imdb_id": movie.get("imdb_id", ""),
            "title": movie.get("title"),
            "original_title": movie.get("original_title"),
            "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "",
            "overview": movie.get("overview", ""),
            "runtime": movie.get("runtime"),
            "poster_path": movie.get("poster_path"),
            "backdrop_path": movie.get("backdrop_path"),
            "vote_average": movie.get("vote_average"),
            "genres": [g.get("name") for g in movie.get("genres", [])],
            "spoken_languages": [l.get("english_name") for l in movie.get("spoken_languages", [])],
            "original_language": movie.get("original_language"),
        }

        return {"success": True, "movie": result}


# ============================================
# Helper Functions
# ============================================
def serialize_parsed(parsed: dict) -> dict:
    """Convert guessit parsed dict to JSON-serializable format."""
    parsed_dict = {}
    for key, value in parsed.items():
        if isinstance(value, (str, int, float, bool, type(None))):
            parsed_dict[key] = value
        elif isinstance(value, list):
            parsed_dict[key] = [str(v) for v in value]
        else:
            parsed_dict[key] = str(value)
    return parsed_dict


def generate_nfo(parsed: dict, filename: str, media_type: str) -> str:
    """Generate NFO file content."""
    config = load_config()
    ascii_art = load_ascii_art()
    nfo_config = config.get("nfo", {})

    title = parsed.get("title", "Unknown")
    year = parsed.get("year", "")

    lines = [ascii_art, ""]

    lines.extend([
        f"Title       : {title}",
        f"Year        : {year}",
        f"Type        : {media_type.capitalize()}",
        f"Filename    : {filename}",
    ])

    if "resolution" in parsed:
        lines.append(f"Resolution  : {parsed['resolution']}")
    if "source" in parsed:
        lines.append(f"Source      : {parsed['source']}")
    if "video_codec" in parsed:
        lines.append(f"Video Codec : {parsed['video_codec']}")
    if "audio_codec" in parsed:
        lines.append(f"Audio Codec : {parsed['audio_codec']}")

    release_group = config.get("release_group", parsed.get("release_group", ""))
    if release_group:
        lines.append(f"Group       : {release_group}")

    lines.append("")
    lines.append("=" * 50)

    if nfo_config.get("include_notes", True):
        notes = nfo_config.get("notes_template", "Enjoy and seed!")
        if notes:
            lines.append("")
            lines.append(notes)

    return "\n".join(lines)


if __name__ == "__main__":
    import uvicorn
    print("Starting Torrent Creator Backend on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)

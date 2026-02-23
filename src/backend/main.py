from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
from guessit import guessit
from torf import Torrent
import os
import json
import httpx
import platform
import subprocess
from typing import Optional, List

# Try to import send2trash for safe deletion
try:
    from send2trash import send2trash
    HAS_TRASH = True
except ImportError:
    HAS_TRASH = False

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
        try:
            with open(CONFIG_PATH, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Warning: Failed to load config ({e}), using defaults")
            return DEFAULT_CONFIG.copy()
    return DEFAULT_CONFIG.copy()


def save_config(config: dict):
    """Save configuration to file."""
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)


def load_ascii_art() -> str:
    """Load ASCII art from file."""
    if os.path.exists(ASCII_ART_PATH):
        try:
            with open(ASCII_ART_PATH, "r", encoding="utf-8") as f:
                return f.read()
        except (IOError, UnicodeDecodeError) as e:
            print(f"Warning: Failed to load ASCII art ({e}), using defaults")
            return DEFAULT_ASCII_ART
    return DEFAULT_ASCII_ART


def save_ascii_art(art: str):
    """Save ASCII art to file."""
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(ASCII_ART_PATH, "w") as f:
        f.write(art)


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


class TorrentRequest(BaseModel):
    folder_path: str
    name: str
    year: str
    runtime: str
    size: str
    language: str
    resolution: str
    source: str
    video_codec: str
    audio_codec: str
    container: str
    release_group: str
    tmdb_id: str
    imdb_id: str
    overview: str
    bit_depth: str
    hdr_format: str
    audio_channels: str


class EpisodeTorrentRequest(TorrentRequest):
    show_name: str
    season: int
    episode: int
    episode_title: str


class SeasonTorrentRequest(BaseModel):
    folder_path: str
    show_name: str
    season: int
    year: str
    language: str
    resolution: str
    source: str
    video_codec: str
    audio_codec: str
    container: str
    release_group: str
    tmdb_id: str
    imdb_id: str
    overview: str
    bit_depth: str
    hdr_format: str
    audio_channels: str
    total_size: str
    episode_count: int


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

    # Extract file metadata using ffprobe
    file_metadata = get_file_metadata(filepath)

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

    # Copy the file (only if not already there)
    if os.path.abspath(filepath) != os.path.abspath(target_file):
        if os.path.exists(target_file):
            raise HTTPException(
                status_code=409,
                detail=f"A file named '{filename}' already exists in the target folder. Please remove it first."
            )
        shutil.copy2(filepath, target_file)

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
        "metadata": file_metadata,
        "media_type": media_type,
        "target_folder": target_folder,
        "nfo_path": nfo_path
    }


# ============================================
# Season Pack Processing
# ============================================
@app.post("/parse-season")
def parse_season_folder(folder_req: FolderRequest):
    """
    Parse a folder of episode files for season pack creation.
    Finds all video files, extracts metadata from the first, and copies them
    into a new folder in the output directory.
    """
    folder_path = folder_req.folder_path

    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    # Find all video files in the folder
    video_files = find_all_video_files(folder_path)

    if not video_files:
        raise HTTPException(
            status_code=400,
            detail="No video files found in the selected folder."
        )

    # Sort files naturally (by name)
    video_files.sort()

    # Parse the first file with guessit for show/season metadata
    parsed = guessit(video_files[0])
    parsed_dict = serialize_parsed(parsed)

    # Extract metadata from the first file (representative of the season)
    first_file_path = os.path.join(folder_path, video_files[0])
    file_metadata = get_file_metadata(first_file_path)

    # Calculate total size of all video files
    total_bytes = 0
    file_list = []
    for vf in video_files:
        vf_path = os.path.join(folder_path, vf)
        vf_size = os.path.getsize(vf_path)
        total_bytes += vf_size
        file_list.append({"name": vf, "size": format_file_size(vf_size)})

    total_size = format_file_size(total_bytes)

    # Create target folder in output directory
    config = load_config()
    output_dir = config.get("output_directory", "~/Documents/torrents")
    torrents_dir = os.path.expanduser(output_dir)
    folder_name = os.path.basename(folder_path)
    target_folder = os.path.join(torrents_dir, folder_name)

    os.makedirs(target_folder, exist_ok=True)

    # Copy all video files to the target folder
    for vf in video_files:
        src = os.path.join(folder_path, vf)
        dst = os.path.join(target_folder, vf)
        if os.path.abspath(src) != os.path.abspath(dst):
            if os.path.exists(dst):
                raise HTTPException(
                    status_code=409,
                    detail=f"A file named '{vf}' already exists in the target folder. Please remove it first."
                )
            shutil.copy2(src, dst)

    # Create initial NFO
    nfo_path = os.path.join(target_folder, f"{folder_name}.NFO")
    nfo_content = generate_nfo(parsed, video_files[0], "season")
    with open(nfo_path, "w") as f:
        f.write(nfo_content)

    return {
        "success": True,
        "folder_name": folder_name,
        "parsed": parsed_dict,
        "metadata": file_metadata,
        "media_type": "season",
        "target_folder": target_folder,
        "video_files": file_list,
        "episode_count": len(video_files),
        "total_size": total_size,
        "nfo_path": nfo_path,
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

    video_file, video_ext = find_video_file(folder_path)
    video_file_found = video_file is not None
    files = os.listdir(folder_path)

    if not video_file:
        video_file = os.path.basename(folder_path) + ".mp4"

    parsed = guessit(video_file)
    parsed_dict = serialize_parsed(parsed)

    # Extract metadata from the actual video file only if one was found
    file_metadata = {}
    if video_file_found:
        video_file_path = os.path.join(folder_path, video_file)
        if os.path.exists(video_file_path):
            file_metadata = get_file_metadata(video_file_path)

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
        "metadata": file_metadata,
        "media_type": media_type,
        "target_folder": folder_path,
        "files": files
    }


@app.delete("/torrent")
async def delete_torrent(folder_req: FolderRequest):
    """Delete a torrent folder - moves to trash/recycle bin if available."""
    folder_path = folder_req.folder_path

    # Expand path before checking
    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(
            status_code=400,
            detail=f"Folder not found: {folder_path}"
        )

    try:
        if HAS_TRASH:
            # Use send2trash to move to recycle bin/trash
            send2trash(folder_path)
            return {
                "success": True,
                "message": "Torrent moved to trash",
                "method": "trash"
            }
        else:
            # Permanently delete if send2trash not available
            shutil.rmtree(folder_path)
            return {
                "success": True,
                "message": "Torrent permanently deleted",
                "method": "permanent"
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete torrent: {str(e)}"
        )


@app.get("/system/delete-capability")
def get_delete_capability():
    """Get information about delete capabilities on this system."""
    system = platform.system()

    return {
        "has_trash": HAS_TRASH,
        "platform": system,
        "message": get_delete_message(system, HAS_TRASH)
    }


def get_delete_message(system: str, has_trash: bool) -> str:
    """Get appropriate delete confirmation message for the platform."""
    if has_trash:
        if system == "Windows":
            return "This torrent will be moved to the Recycle Bin."
        elif system == "Darwin":  # macOS
            return "This torrent will be moved to the Trash."
        else:  # Linux and others
            return "This torrent will be moved to the Trash."
    else:
        return "WARNING: This torrent will be PERMANENTLY deleted. This action cannot be undone."


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
# TMDB TV API
# ============================================
@app.post("/tmdb/search-tv")
async def tmdb_search_tv(request: TMDBSearchRequest):
    """Search for TV shows on TMDB."""
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
        params["first_air_date_year"] = request.year

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/search/tv",
            params=params
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        data = response.json()
        results = []

        for show in data.get("results", [])[:10]:
            results.append({
                "id": show.get("id"),
                "name": show.get("name"),
                "original_name": show.get("original_name"),
                "year": show.get("first_air_date", "")[:4] if show.get("first_air_date") else "",
                "overview": show.get("overview", ""),
                "poster_path": show.get("poster_path"),
                "vote_average": show.get("vote_average")
            })

        return {"success": True, "results": results}


@app.get("/tmdb/tv/{tv_id}")
async def tmdb_get_tv(tv_id: int):
    """Get detailed TV show information from TMDB."""
    config = load_config()
    api_key = config.get("api_keys", {}).get("tmdb", "")

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="TMDB API key not configured. Please add it in Settings."
        )

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/tv/{tv_id}",
            params={"api_key": api_key}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        show = response.json()

        # Get external IDs (for IMDB ID)
        ext_response = await client.get(
            f"{TMDB_BASE_URL}/tv/{tv_id}/external_ids",
            params={"api_key": api_key}
        )
        external_ids = ext_response.json() if ext_response.status_code == 200 else {}

        result = {
            "id": show.get("id"),
            "tmdb_id": show.get("id"),
            "imdb_id": external_ids.get("imdb_id", ""),
            "name": show.get("name"),
            "original_name": show.get("original_name"),
            "year": show.get("first_air_date", "")[:4] if show.get("first_air_date") else "",
            "overview": show.get("overview", ""),
            "poster_path": show.get("poster_path"),
            "vote_average": show.get("vote_average"),
            "genres": [g.get("name") for g in show.get("genres", [])],
            "spoken_languages": [l.get("english_name") for l in show.get("spoken_languages", [])],
            "original_language": show.get("original_language"),
            "number_of_seasons": show.get("number_of_seasons", 0),
            "seasons": [
                {
                    "season_number": s.get("season_number"),
                    "name": s.get("name"),
                    "episode_count": s.get("episode_count"),
                    "air_date": s.get("air_date", ""),
                }
                for s in show.get("seasons", [])
                if s.get("season_number", 0) > 0  # Skip specials (season 0)
            ],
        }

        return {"success": True, "show": result}


@app.get("/tmdb/tv/{tv_id}/season/{season_number}")
async def tmdb_get_season(tv_id: int, season_number: int):
    """Get season details including episode list from TMDB."""
    config = load_config()
    api_key = config.get("api_keys", {}).get("tmdb", "")

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="TMDB API key not configured. Please add it in Settings."
        )

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/tv/{tv_id}/season/{season_number}",
            params={"api_key": api_key}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        season = response.json()

        episodes = []
        for ep in season.get("episodes", []):
            episodes.append({
                "episode_number": ep.get("episode_number"),
                "name": ep.get("name", ""),
                "overview": ep.get("overview", ""),
                "air_date": ep.get("air_date", ""),
                "runtime": ep.get("runtime"),
                "still_path": ep.get("still_path"),
                "vote_average": ep.get("vote_average"),
            })

        return {
            "success": True,
            "season_number": season.get("season_number"),
            "name": season.get("name"),
            "episodes": episodes,
        }


@app.get("/tmdb/tv/{tv_id}/season/{season_number}/episode/{episode_number}")
async def tmdb_get_episode(tv_id: int, season_number: int, episode_number: int):
    """Get detailed episode information from TMDB."""
    config = load_config()
    api_key = config.get("api_keys", {}).get("tmdb", "")

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="TMDB API key not configured. Please add it in Settings."
        )

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/tv/{tv_id}/season/{season_number}/episode/{episode_number}",
            params={"api_key": api_key}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        ep = response.json()

        result = {
            "episode_number": ep.get("episode_number"),
            "season_number": ep.get("season_number"),
            "name": ep.get("name", ""),
            "overview": ep.get("overview", ""),
            "air_date": ep.get("air_date", ""),
            "runtime": ep.get("runtime"),
            "still_path": ep.get("still_path"),
            "vote_average": ep.get("vote_average"),
        }

        return {"success": True, "episode": result}


# ============================================
# Preview Torrent (dry-run: show files + NFO)
# ============================================
@app.post("/preview-torrent")
async def preview_torrent(req: TorrentRequest):
    """
    Generate a preview of what the torrent will contain:
    - The new file/folder names after applying the naming template
    - The full NFO content
    Does NOT write anything to disk.
    """
    folder_path = req.folder_path
    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    # Find current video file to know the extension
    _, video_ext = find_video_file(folder_path)

    if not video_ext:
        raise HTTPException(status_code=400, detail="No video file found in the torrent folder.")

    # Build the new base name from the naming template
    config = load_config()
    template = config.get("naming_templates", {}).get(
        "movie", "{title}.{year}.{quality}.{source}.{codec}-{group}"
    )
    details = req.model_dump()
    new_base_name = apply_movie_template(template, details)

    if not new_base_name:
        raise HTTPException(
            status_code=400,
            detail="Naming template produced an empty name. Check your template and fields."
        )

    new_video_name = new_base_name + video_ext
    new_nfo_name = new_base_name + ".NFO"
    new_torrent_name = new_base_name + ".torrent"

    # Generate NFO content (preview only, not written to disk)
    nfo_content = generate_nfo_from_details(details, new_video_name)

    # Build file tree for preview
    output_dir = config.get("output_directory", "~/Documents/torrents")
    files = [
        {"name": new_video_name, "type": "video"},
        {"name": new_nfo_name, "type": "nfo"},
    ]

    # Collect warnings
    warnings = []
    trackers = config.get("trackers", [])
    if not trackers:
        warnings.append("No trackers configured. The torrent will be created without any announce URLs.")

    return {
        "success": True,
        "base_name": new_base_name,
        "torrent_name": new_torrent_name,
        "output_dir": output_dir,
        "files": files,
        "nfo_content": nfo_content,
        "warnings": warnings,
    }


# ============================================
# Create Torrent (.torrent file generation)
# ============================================
@app.post("/create-torrent")
def create_torrent(req: TorrentRequest):
    """
    Full torrent creation pipeline:
    1. Rename video file + folder using the naming template
    2. Generate and write the NFO file
    3. Create a .torrent file from the folder contents using configured trackers
    Returns the path to the created .torrent file.

    NOTE: This is a regular def (not async) so FastAPI runs it in a thread pool.
    torrent.generate() hashes the entire video file and would block the event loop
    if this were async, causing "Failed to fetch" timeouts on large files.
    """
    folder_path = req.folder_path
    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    # Find the video file
    video_file, video_ext = find_video_file(folder_path)

    if not video_file:
        raise HTTPException(status_code=400, detail="No video file found in the torrent folder.")

    # Build the new base name
    config = load_config()
    template = config.get("naming_templates", {}).get(
        "movie", "{title}.{year}.{quality}.{source}.{codec}-{group}"
    )
    details = req.model_dump()
    new_base_name = apply_movie_template(template, details)

    if not new_base_name:
        raise HTTPException(
            status_code=400,
            detail="Naming template produced an empty name. Check your template and fields."
        )

    new_video_name = new_base_name + video_ext
    new_nfo_name = new_base_name + ".NFO"

    # --- Step 1: Rename video file ---
    old_video_path = os.path.join(folder_path, video_file)
    new_video_path = os.path.join(folder_path, new_video_name)

    if old_video_path != new_video_path:
        if os.path.exists(new_video_path):
            raise HTTPException(
                status_code=409,
                detail=f"A file named '{new_video_name}' already exists in the folder."
            )
        os.rename(old_video_path, new_video_path)

    # --- Step 2: Remove old NFO files and write new one ---
    for f in os.listdir(folder_path):
        if f.upper().endswith(".NFO"):
            os.remove(os.path.join(folder_path, f))

    nfo_content = generate_nfo_from_details(details, new_video_name)
    nfo_path = os.path.join(folder_path, new_nfo_name)
    with open(nfo_path, "w", encoding="utf-8") as fh:
        fh.write(nfo_content)

    # --- Step 3: Rename the folder ---
    parent_dir = os.path.dirname(folder_path)
    new_folder_path = os.path.join(parent_dir, new_base_name)

    if folder_path != new_folder_path:
        if os.path.exists(new_folder_path):
            raise HTTPException(
                status_code=409,
                detail=f"A folder named '{new_base_name}' already exists."
            )
        os.rename(folder_path, new_folder_path)

    # --- Step 4: Create .torrent file ---
    trackers = config.get("trackers", [])

    torrent = Torrent(
        path=new_folder_path,
        trackers=trackers if trackers else None,
        comment="Created by Torrent Creator",
    )
    torrent.generate()

    torrent_filename = new_base_name + ".torrent"
    torrent_file_path = os.path.join(parent_dir, torrent_filename)
    torrent.write(torrent_file_path, overwrite=True)

    output_dir = config.get("output_directory", "~/Documents/torrents")

    return {
        "success": True,
        "new_folder_path": new_folder_path,
        "new_filename": new_video_name,
        "new_base_name": new_base_name,
        "output_dir": output_dir,
        "torrent_file": torrent_file_path,
        "torrent_filename": torrent_filename,
    }


# ============================================
# Episode Torrent Preview & Create
# ============================================
@app.post("/preview-episode-torrent")
async def preview_episode_torrent(req: EpisodeTorrentRequest):
    """
    Generate a preview of what the episode torrent will contain.
    Does NOT write anything to disk.
    """
    folder_path = req.folder_path
    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    _, video_ext = find_video_file(folder_path)
    if not video_ext:
        raise HTTPException(status_code=400, detail="No video file found in the torrent folder.")

    config = load_config()
    template = config.get("naming_templates", {}).get(
        "episode",
        "{title}.S{season:02}E{episode:02}.{episode_title}.{quality}.{source}.{codec}-{group}"
    )
    details = req.model_dump()
    new_base_name = apply_episode_template(template, details)

    if not new_base_name:
        raise HTTPException(
            status_code=400,
            detail="Naming template produced an empty name. Check your template and fields."
        )

    new_video_name = new_base_name + video_ext
    new_nfo_name = new_base_name + ".NFO"
    new_torrent_name = new_base_name + ".torrent"

    nfo_content = generate_episode_nfo_from_details(details, new_video_name)

    output_dir = config.get("output_directory", "~/Documents/torrents")
    files = [
        {"name": new_video_name, "type": "video"},
        {"name": new_nfo_name, "type": "nfo"},
    ]

    warnings = []
    trackers = config.get("trackers", [])
    if not trackers:
        warnings.append("No trackers configured. The torrent will be created without any announce URLs.")

    return {
        "success": True,
        "base_name": new_base_name,
        "torrent_name": new_torrent_name,
        "output_dir": output_dir,
        "files": files,
        "nfo_content": nfo_content,
        "warnings": warnings,
    }


@app.post("/create-episode-torrent")
def create_episode_torrent(req: EpisodeTorrentRequest):
    """
    Full episode torrent creation pipeline.

    NOTE: This is a regular def (not async) so FastAPI runs it in a thread pool.
    torrent.generate() hashes the entire video file and would block the event loop.
    """
    folder_path = req.folder_path
    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    video_file, video_ext = find_video_file(folder_path)
    if not video_file:
        raise HTTPException(status_code=400, detail="No video file found in the torrent folder.")

    config = load_config()
    template = config.get("naming_templates", {}).get(
        "episode",
        "{title}.S{season:02}E{episode:02}.{episode_title}.{quality}.{source}.{codec}-{group}"
    )
    details = req.model_dump()
    new_base_name = apply_episode_template(template, details)

    if not new_base_name:
        raise HTTPException(
            status_code=400,
            detail="Naming template produced an empty name. Check your template and fields."
        )

    new_video_name = new_base_name + video_ext
    new_nfo_name = new_base_name + ".NFO"

    # --- Step 1: Rename video file ---
    old_video_path = os.path.join(folder_path, video_file)
    new_video_path = os.path.join(folder_path, new_video_name)

    if old_video_path != new_video_path:
        if os.path.exists(new_video_path):
            raise HTTPException(
                status_code=409,
                detail=f"A file named '{new_video_name}' already exists in the folder."
            )
        os.rename(old_video_path, new_video_path)

    # --- Step 2: Remove old NFO files and write new one ---
    for f in os.listdir(folder_path):
        if f.upper().endswith(".NFO"):
            os.remove(os.path.join(folder_path, f))

    nfo_content = generate_episode_nfo_from_details(details, new_video_name)
    nfo_path = os.path.join(folder_path, new_nfo_name)
    with open(nfo_path, "w", encoding="utf-8") as fh:
        fh.write(nfo_content)

    # --- Step 3: Rename the folder ---
    parent_dir = os.path.dirname(folder_path)
    new_folder_path = os.path.join(parent_dir, new_base_name)

    if folder_path != new_folder_path:
        if os.path.exists(new_folder_path):
            raise HTTPException(
                status_code=409,
                detail=f"A folder named '{new_base_name}' already exists."
            )
        os.rename(folder_path, new_folder_path)

    # --- Step 4: Create .torrent file ---
    trackers = config.get("trackers", [])

    torrent = Torrent(
        path=new_folder_path,
        trackers=trackers if trackers else None,
        comment="Created by Torrent Creator",
    )
    torrent.generate()

    torrent_filename = new_base_name + ".torrent"
    torrent_file_path = os.path.join(parent_dir, torrent_filename)
    torrent.write(torrent_file_path, overwrite=True)

    output_dir = config.get("output_directory", "~/Documents/torrents")

    return {
        "success": True,
        "new_folder_path": new_folder_path,
        "new_filename": new_video_name,
        "new_base_name": new_base_name,
        "output_dir": output_dir,
        "torrent_file": torrent_file_path,
        "torrent_filename": torrent_filename,
    }


# ============================================
# Season Pack Torrent Preview & Create
# ============================================
@app.post("/preview-season-torrent")
async def preview_season_torrent(req: SeasonTorrentRequest):
    """
    Generate a preview of what the season pack torrent will contain.
    Does NOT write anything to disk.
    """
    folder_path = req.folder_path
    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    video_files = find_all_video_files(folder_path)
    if not video_files:
        raise HTTPException(status_code=400, detail="No video files found in the torrent folder.")

    config = load_config()
    template = config.get("naming_templates", {}).get(
        "season", "{title}.S{season:02}.{quality}.{source}.{codec}-{group}"
    )
    details = req.model_dump()
    new_base_name = apply_season_template(template, details)

    if not new_base_name:
        raise HTTPException(
            status_code=400,
            detail="Naming template produced an empty name. Check your template and fields."
        )

    new_nfo_name = new_base_name + ".NFO"
    new_torrent_name = new_base_name + ".torrent"

    # Build file list with sizes for NFO
    file_list_with_sizes = []
    for vf in video_files:
        vf_path = os.path.join(folder_path, vf)
        vf_size = os.path.getsize(vf_path)
        file_list_with_sizes.append({"name": vf, "size": format_file_size(vf_size)})

    nfo_content = generate_season_nfo_from_details(details, new_base_name, file_list_with_sizes)

    output_dir = config.get("output_directory", "~/Documents/torrents")
    files = [{"name": f, "type": "video"} for f in video_files]
    files.append({"name": new_nfo_name, "type": "nfo"})

    warnings = []
    trackers = config.get("trackers", [])
    if not trackers:
        warnings.append("No trackers configured. The torrent will be created without any announce URLs.")

    return {
        "success": True,
        "base_name": new_base_name,
        "torrent_name": new_torrent_name,
        "output_dir": output_dir,
        "files": files,
        "nfo_content": nfo_content,
        "warnings": warnings,
    }


@app.post("/create-season-torrent")
def create_season_torrent(req: SeasonTorrentRequest):
    """
    Full season pack torrent creation pipeline:
    1. Rename the folder using the season naming template
    2. Generate and write the NFO file (with file listing)
    3. Create a .torrent file from the folder contents

    NOTE: This is a regular def (not async) so FastAPI runs it in a thread pool.
    torrent.generate() hashes all video files and would block the event loop.
    """
    folder_path = req.folder_path
    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    video_files = find_all_video_files(folder_path)
    if not video_files:
        raise HTTPException(status_code=400, detail="No video files found in the torrent folder.")

    config = load_config()
    template = config.get("naming_templates", {}).get(
        "season", "{title}.S{season:02}.{quality}.{source}.{codec}-{group}"
    )
    details = req.model_dump()
    new_base_name = apply_season_template(template, details)

    if not new_base_name:
        raise HTTPException(
            status_code=400,
            detail="Naming template produced an empty name. Check your template and fields."
        )

    new_nfo_name = new_base_name + ".NFO"

    # --- Step 1: Remove old NFO files and write new one ---
    for f in os.listdir(folder_path):
        if f.upper().endswith(".NFO"):
            os.remove(os.path.join(folder_path, f))

    # Build file list with sizes for NFO
    file_list_with_sizes = []
    for vf in video_files:
        vf_path = os.path.join(folder_path, vf)
        vf_size = os.path.getsize(vf_path)
        file_list_with_sizes.append({"name": vf, "size": format_file_size(vf_size)})

    nfo_content = generate_season_nfo_from_details(details, new_base_name, file_list_with_sizes)
    nfo_path = os.path.join(folder_path, new_nfo_name)
    with open(nfo_path, "w", encoding="utf-8") as fh:
        fh.write(nfo_content)

    # --- Step 2: Rename the folder ---
    parent_dir = os.path.dirname(folder_path)
    new_folder_path = os.path.join(parent_dir, new_base_name)

    if folder_path != new_folder_path:
        if os.path.exists(new_folder_path):
            raise HTTPException(
                status_code=409,
                detail=f"A folder named '{new_base_name}' already exists."
            )
        os.rename(folder_path, new_folder_path)

    # --- Step 3: Create .torrent file ---
    trackers = config.get("trackers", [])

    torrent = Torrent(
        path=new_folder_path,
        trackers=trackers if trackers else None,
        comment="Created by Torrent Creator",
    )
    torrent.generate()

    torrent_filename = new_base_name + ".torrent"
    torrent_file_path = os.path.join(parent_dir, torrent_filename)
    torrent.write(torrent_file_path, overwrite=True)

    output_dir = config.get("output_directory", "~/Documents/torrents")

    return {
        "success": True,
        "new_folder_path": new_folder_path,
        "new_base_name": new_base_name,
        "output_dir": output_dir,
        "torrent_file": torrent_file_path,
        "torrent_filename": torrent_filename,
    }


# ============================================
# File Metadata Extraction
# ============================================
def get_file_metadata(filepath: str) -> dict:
    """Extract metadata from video file using ffprobe."""
    metadata = {
        "resolution": "",
        "video_codec": "",
        "audio_codec": "",
        "file_size": "",
        "duration": "",
        "bit_depth": "",
        "hdr_format": "",
        "audio_channels": ""
    }

    # Get file size
    try:
        file_size_bytes = os.path.getsize(filepath)
        # Convert to human-readable format
        if file_size_bytes >= 1024**3:  # GB
            metadata["file_size"] = f"{file_size_bytes / (1024**3):.2f} GB"
        elif file_size_bytes >= 1024**2:  # MB
            metadata["file_size"] = f"{file_size_bytes / (1024**2):.2f} MB"
        else:
            metadata["file_size"] = f"{file_size_bytes / 1024:.2f} KB"
    except Exception as e:
        print(f"Error getting file size: {e}")

    # Try to use ffprobe
    try:
        # Check if ffprobe is available
        result = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", filepath],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            data = json.loads(result.stdout)

            # Extract video stream info
            video_stream = None
            audio_stream = None

            for stream in data.get("streams", []):
                if stream.get("codec_type") == "video" and not video_stream:
                    video_stream = stream
                elif stream.get("codec_type") == "audio" and not audio_stream:
                    audio_stream = stream

            if video_stream:
                # Resolution — use coded dimensions as fallback since some
                # containers report cropped height (e.g. letterboxed 1080p
                # content with height < 1080).  Checking width disambiguates
                # these cases: a true 1080p encode has width >= 1920 even when
                # the stored height is reduced by letterboxing.
                width = video_stream.get("coded_width") or video_stream.get("width")
                height = video_stream.get("coded_height") or video_stream.get("height")
                if width and height:
                    # Use the larger of width- and height-derived resolution so
                    # that letterboxed or pillarboxed content is classified by
                    # its actual encode tier rather than the visible rectangle.
                    res_by_height = height
                    res_by_width = round(width * 9 / 16)  # assume 16:9 reference

                    effective = max(res_by_height, res_by_width)

                    if effective >= 2160:
                        metadata["resolution"] = "2160p"
                    elif effective >= 1440:
                        metadata["resolution"] = "1440p"
                    elif effective >= 1080:
                        metadata["resolution"] = "1080p"
                    elif effective >= 720:
                        metadata["resolution"] = "720p"
                    elif effective >= 576:
                        metadata["resolution"] = "576p"
                    elif effective >= 480:
                        metadata["resolution"] = "480p"
                    else:
                        metadata["resolution"] = f"{effective}p"

                # Video codec
                codec_name = video_stream.get("codec_name", "")
                if codec_name == "h264":
                    metadata["video_codec"] = "x264"
                elif codec_name == "hevc":
                    metadata["video_codec"] = "x265"
                elif codec_name == "av1":
                    metadata["video_codec"] = "AV1"
                elif codec_name == "vp9":
                    metadata["video_codec"] = "VP9"
                else:
                    metadata["video_codec"] = codec_name.upper()

                # Bit depth
                pix_fmt = video_stream.get("pix_fmt", "")
                if "10le" in pix_fmt or "10be" in pix_fmt:
                    metadata["bit_depth"] = "10-bit"
                elif "12le" in pix_fmt or "12be" in pix_fmt:
                    metadata["bit_depth"] = "12-bit"
                else:
                    metadata["bit_depth"] = "8-bit"

                # HDR format (check color transfer and color space)
                color_transfer = video_stream.get("color_transfer", "")
                color_space = video_stream.get("color_space", "")

                if "smpte2084" in color_transfer.lower():
                    metadata["hdr_format"] = "HDR10"
                elif "arib-std-b67" in color_transfer.lower():
                    metadata["hdr_format"] = "HLG"
                elif "bt2020" in color_space.lower() and metadata["bit_depth"] == "10-bit":
                    metadata["hdr_format"] = "HDR"

            if audio_stream:
                # Audio codec
                codec_name = audio_stream.get("codec_name", "")
                if codec_name == "aac":
                    metadata["audio_codec"] = "AAC"
                elif codec_name == "ac3":
                    metadata["audio_codec"] = "AC3"
                elif codec_name == "eac3":
                    metadata["audio_codec"] = "EAC3"
                elif codec_name == "dts":
                    metadata["audio_codec"] = "DTS"
                elif codec_name == "truehd":
                    metadata["audio_codec"] = "TrueHD"
                elif codec_name == "flac":
                    metadata["audio_codec"] = "FLAC"
                elif codec_name == "opus":
                    metadata["audio_codec"] = "Opus"
                elif codec_name == "vorbis":
                    metadata["audio_codec"] = "Vorbis"
                else:
                    metadata["audio_codec"] = codec_name.upper()

                # Audio channels
                channels = audio_stream.get("channels")
                if channels:
                    if channels == 1:
                        metadata["audio_channels"] = "1.0"
                    elif channels == 2:
                        metadata["audio_channels"] = "2.0"
                    elif channels == 6:
                        metadata["audio_channels"] = "5.1"
                    elif channels == 8:
                        metadata["audio_channels"] = "7.1"
                    else:
                        metadata["audio_channels"] = f"{channels}.0"

            # Duration
            format_data = data.get("format", {})
            duration_seconds = format_data.get("duration")
            if duration_seconds:
                try:
                    total_seconds = int(float(duration_seconds))
                    hours = total_seconds // 3600
                    minutes = (total_seconds % 3600) // 60
                    seconds = total_seconds % 60
                    metadata["duration"] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
                except (ValueError, TypeError):
                    pass

    except FileNotFoundError:
        print("ffprobe not found - metadata extraction unavailable")
    except subprocess.TimeoutExpired:
        print("ffprobe timed out")
    except Exception as e:
        print(f"Error running ffprobe: {e}")

    return metadata


# ============================================
# Helper Functions
# ============================================
VIDEO_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm", ".m4v"]


def find_video_file(folder_path: str) -> tuple:
    """Find the first video file in a folder.

    Returns (filename, extension) if found, or (None, None) if not.
    """
    for f in os.listdir(folder_path):
        ext = os.path.splitext(f)[1].lower()
        if ext in VIDEO_EXTENSIONS:
            return f, ext
    return None, None


def find_all_video_files(folder_path: str) -> list:
    """Find all video files in a folder, sorted by name.

    Returns a list of filenames.
    """
    files = []
    for f in os.listdir(folder_path):
        ext = os.path.splitext(f)[1].lower()
        if ext in VIDEO_EXTENSIONS:
            files.append(f)
    return sorted(files)


def format_file_size(size_bytes: int) -> str:
    """Format a file size in bytes to a human-readable string."""
    if size_bytes >= 1024 ** 3:
        return f"{size_bytes / (1024 ** 3):.2f} GB"
    elif size_bytes >= 1024 ** 2:
        return f"{size_bytes / (1024 ** 2):.2f} MB"
    elif size_bytes >= 1024:
        return f"{size_bytes / 1024:.2f} KB"
    else:
        return f"{size_bytes} B"


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


def apply_movie_template(template: str, details: dict) -> str:
    """Apply the movie naming template with the given details.

    Replaces placeholders like {title}, {year}, etc. with actual values.
    Dots in the title are preserved (spaces are converted to dots).
    """
    title = details.get("name", "Unknown").replace(" ", ".")
    year = details.get("year", "")
    quality = details.get("resolution", "")
    source = details.get("source", "")
    # Map display codec names to template-friendly names
    codec = details.get("video_codec", "")
    group = details.get("release_group", "")

    result = template
    result = result.replace("{title}", title)
    result = result.replace("{year}", year)
    result = result.replace("{quality}", quality)
    result = result.replace("{source}", source)
    result = result.replace("{codec}", codec)
    result = result.replace("{group}", group)

    # Remove any unreplaced template variables (from empty fields)
    # e.g. ".." from empty year → single dot
    while ".." in result:
        result = result.replace("..", ".")
    # Remove trailing dots before the group separator
    result = result.replace(".-", "-")
    # Remove leading/trailing dots
    result = result.strip(".")

    return result


def apply_episode_template(template: str, details: dict) -> str:
    """Apply the episode naming template with the given details.

    Handles format specifiers like {season:02} and {episode:02} for zero-padding.
    """
    import re

    show_name = details.get("show_name", details.get("name", "Unknown")).replace(" ", ".")
    episode_title = details.get("episode_title", "").replace(" ", ".")
    year = details.get("year", "")
    quality = details.get("resolution", "")
    source = details.get("source", "")
    codec = details.get("video_codec", "")
    group = details.get("release_group", "")
    season = details.get("season", 0)
    episode = details.get("episode", 0)

    result = template
    result = result.replace("{title}", show_name)
    result = result.replace("{year}", year)
    result = result.replace("{quality}", quality)
    result = result.replace("{source}", source)
    result = result.replace("{codec}", codec)
    result = result.replace("{group}", group)
    result = result.replace("{episode_title}", episode_title)

    # Handle {season:02} and {episode:02} format specifiers
    def replace_formatted(match):
        field = match.group(1)
        fmt = match.group(2)
        if field == "season":
            val = int(season)
        elif field == "episode":
            val = int(episode)
        else:
            return match.group(0)
        try:
            return format(val, fmt)
        except (ValueError, TypeError):
            return str(val)

    result = re.sub(r"\{(season|episode):([^}]+)\}", replace_formatted, result)

    # Plain {season} and {episode} without format specifier
    result = result.replace("{season}", str(season))
    result = result.replace("{episode}", str(episode))

    # Clean up double dots and trailing dots
    while ".." in result:
        result = result.replace("..", ".")
    result = result.replace(".-", "-")
    result = result.strip(".")

    return result


def apply_season_template(template: str, details: dict) -> str:
    """Apply the season pack naming template with the given details.

    Handles format specifiers like {season:02} for zero-padding.
    """
    import re

    show_name = details.get("show_name", "Unknown").replace(" ", ".")
    year = details.get("year", "")
    quality = details.get("resolution", "")
    source = details.get("source", "")
    codec = details.get("video_codec", "")
    group = details.get("release_group", "")
    season = details.get("season", 0)

    result = template
    result = result.replace("{title}", show_name)
    result = result.replace("{year}", year)
    result = result.replace("{quality}", quality)
    result = result.replace("{source}", source)
    result = result.replace("{codec}", codec)
    result = result.replace("{group}", group)

    # Handle {season:02} format specifier
    def replace_formatted(match):
        field = match.group(1)
        fmt = match.group(2)
        if field == "season":
            val = int(season)
        else:
            return match.group(0)
        try:
            return format(val, fmt)
        except (ValueError, TypeError):
            return str(val)

    result = re.sub(r"\{(season):([^}]+)\}", replace_formatted, result)

    # Plain {season} without format specifier
    result = result.replace("{season}", str(season))

    # Clean up double dots and trailing dots
    while ".." in result:
        result = result.replace("..", ".")
    result = result.replace(".-", "-")
    result = result.strip(".")

    return result


def generate_season_nfo_from_details(details: dict, folder_name: str, video_files: list) -> str:
    """Generate NFO file content for a season pack torrent with file listing."""
    config = load_config()
    ascii_art = load_ascii_art()
    nfo_config = config.get("nfo", {})

    lines = [ascii_art, ""]

    lines.extend([
        f"Show        : {details.get('show_name', 'Unknown')}",
        f"Season      : {details.get('season', '')}",
        f"Year        : {details.get('year', '')}",
        f"Type        : Season Pack",
        f"Episodes    : {details.get('episode_count', len(video_files))}",
        f"Folder      : {folder_name}",
    ])

    if details.get("resolution"):
        lines.append(f"Resolution  : {details['resolution']}")
    if details.get("source"):
        lines.append(f"Source      : {details['source']}")
    if details.get("video_codec"):
        lines.append(f"Video Codec : {details['video_codec']}")
    if details.get("audio_codec"):
        lines.append(f"Audio Codec : {details['audio_codec']}")
    if details.get("audio_channels"):
        lines.append(f"Audio       : {details['audio_channels']}")
    if details.get("bit_depth"):
        lines.append(f"Bit Depth   : {details['bit_depth']}")
    if details.get("hdr_format"):
        lines.append(f"HDR Format  : {details['hdr_format']}")
    if details.get("language"):
        lines.append(f"Language    : {details['language']}")
    if details.get("total_size"):
        lines.append(f"Total Size  : {details['total_size']}")
    if details.get("release_group"):
        lines.append(f"Group       : {details['release_group']}")
    if details.get("imdb_id"):
        lines.append(f"IMDb        : https://www.imdb.com/title/{details['imdb_id']}/")
    if details.get("tmdb_id"):
        lines.append(f"TMDB        : https://www.themoviedb.org/tv/{details['tmdb_id']}")

    if details.get("overview"):
        lines.append("")
        lines.append("Plot:")
        lines.append(details["overview"])

    # File listing
    lines.append("")
    lines.append("-" * 50)
    lines.append("Files:")
    lines.append("")
    for vf in video_files:
        if isinstance(vf, dict):
            lines.append(f"  {vf['name']}  ({vf.get('size', '')})")
        else:
            lines.append(f"  {vf}")

    lines.append("")
    lines.append("=" * 50)

    if nfo_config.get("include_notes", True):
        notes = nfo_config.get("notes_template", "Enjoy and seed!")
        if notes:
            lines.append("")
            lines.append(notes)

    return "\n".join(lines)


def generate_episode_nfo_from_details(details: dict, filename: str) -> str:
    """Generate NFO file content for an episode torrent."""
    config = load_config()
    ascii_art = load_ascii_art()
    nfo_config = config.get("nfo", {})

    lines = [ascii_art, ""]

    lines.extend([
        f"Show        : {details.get('show_name', 'Unknown')}",
        f"Season      : {details.get('season', '')}",
        f"Episode     : {details.get('episode', '')}",
        f"Title       : {details.get('episode_title', '')}",
        f"Year        : {details.get('year', '')}",
        f"Type        : Episode",
        f"Filename    : {filename}",
    ])

    if details.get("resolution"):
        lines.append(f"Resolution  : {details['resolution']}")
    if details.get("source"):
        lines.append(f"Source      : {details['source']}")
    if details.get("video_codec"):
        lines.append(f"Video Codec : {details['video_codec']}")
    if details.get("audio_codec"):
        lines.append(f"Audio Codec : {details['audio_codec']}")
    if details.get("audio_channels"):
        lines.append(f"Audio       : {details['audio_channels']}")
    if details.get("bit_depth"):
        lines.append(f"Bit Depth   : {details['bit_depth']}")
    if details.get("hdr_format"):
        lines.append(f"HDR Format  : {details['hdr_format']}")
    if details.get("language"):
        lines.append(f"Language    : {details['language']}")
    if details.get("size"):
        lines.append(f"File Size   : {details['size']}")
    if details.get("runtime"):
        lines.append(f"Runtime     : {details['runtime']}")
    if details.get("release_group"):
        lines.append(f"Group       : {details['release_group']}")
    if details.get("imdb_id"):
        lines.append(f"IMDb        : https://www.imdb.com/title/{details['imdb_id']}/")
    if details.get("tmdb_id"):
        lines.append(f"TMDB        : https://www.themoviedb.org/tv/{details['tmdb_id']}")

    if details.get("overview"):
        lines.append("")
        lines.append("Plot:")
        lines.append(details["overview"])

    lines.append("")
    lines.append("=" * 50)

    if nfo_config.get("include_notes", True):
        notes = nfo_config.get("notes_template", "Enjoy and seed!")
        if notes:
            lines.append("")
            lines.append(notes)

    return "\n".join(lines)


def generate_nfo_from_details(details: dict, filename: str) -> str:
    """Generate NFO file content from saved movie details."""
    config = load_config()
    ascii_art = load_ascii_art()
    nfo_config = config.get("nfo", {})

    lines = [ascii_art, ""]

    lines.extend([
        f"Title       : {details.get('name', 'Unknown')}",
        f"Year        : {details.get('year', '')}",
        f"Type        : Movie",
        f"Filename    : {filename}",
    ])

    if details.get("resolution"):
        lines.append(f"Resolution  : {details['resolution']}")
    if details.get("source"):
        lines.append(f"Source      : {details['source']}")
    if details.get("video_codec"):
        lines.append(f"Video Codec : {details['video_codec']}")
    if details.get("audio_codec"):
        lines.append(f"Audio Codec : {details['audio_codec']}")
    if details.get("audio_channels"):
        lines.append(f"Audio       : {details['audio_channels']}")
    if details.get("bit_depth"):
        lines.append(f"Bit Depth   : {details['bit_depth']}")
    if details.get("hdr_format"):
        lines.append(f"HDR Format  : {details['hdr_format']}")
    if details.get("language"):
        lines.append(f"Language    : {details['language']}")
    if details.get("size"):
        lines.append(f"File Size   : {details['size']}")
    if details.get("runtime"):
        lines.append(f"Runtime     : {details['runtime']}")
    if details.get("release_group"):
        lines.append(f"Group       : {details['release_group']}")
    if details.get("imdb_id"):
        lines.append(f"IMDb        : https://www.imdb.com/title/{details['imdb_id']}/")
    if details.get("tmdb_id"):
        lines.append(f"TMDB        : https://www.themoviedb.org/movie/{details['tmdb_id']}")

    if details.get("overview"):
        lines.append("")
        lines.append("Plot:")
        lines.append(details["overview"])

    lines.append("")
    lines.append("=" * 50)

    if nfo_config.get("include_notes", True):
        notes = nfo_config.get("notes_template", "Enjoy and seed!")
        if notes:
            lines.append("")
            lines.append(notes)

    return "\n".join(lines)


def generate_nfo(parsed: dict, filename: str, media_type: str) -> str:
    """Generate NFO file content from guessit parsed data (used during initial parse)."""
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

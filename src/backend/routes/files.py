"""File parsing and conflict checking endpoints."""

import os
import shutil
from datetime import datetime

from fastapi import APIRouter, HTTPException
from guessit import guessit

from ..config import load_config
from ..models import FileRequest
from ..metadata import get_file_metadata
from ..helpers import format_file_size, serialize_parsed, get_torrent_type_dir
from ..nfo import generate_nfo

router = APIRouter()


@router.post("/check-conflict")
def check_torrent_conflict(file_req: FileRequest):
    """
    Check if a torrent with the same name already exists.
    Returns conflict info if found.
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

    # Check target folder (need to parse to determine type first)
    config = load_config()
    parsed_temp = guessit(filename)
    parsed_type = parsed_temp.get("type", "")
    if parsed_type == "movie":
        temp_media_type = "movie"
    elif "season" in parsed_temp and "episode" not in parsed_temp:
        temp_media_type = "season"
    elif "episode" in parsed_temp:
        temp_media_type = "episode"
    else:
        temp_media_type = "unknown"
    
    torrents_dir = get_torrent_type_dir(config, temp_media_type)
    target_folder = os.path.join(torrents_dir, base_name)

    if os.path.exists(target_folder):
        # Get info about existing torrent
        files = os.listdir(target_folder)
        video_files = [f for f in files if f.split(".")[-1].lower() in ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v"]]

        # Calculate total size
        total_size = 0
        for f in files:
            fpath = os.path.join(target_folder, f)
            if os.path.isfile(fpath):
                total_size += os.path.getsize(fpath)

        # Get creation time
        created_time = os.path.getctime(target_folder)
        created_date = datetime.fromtimestamp(created_time).strftime("%Y-%m-%d %H:%M")

        return {
            "conflict": True,
            "existing": {
                "name": base_name,
                "path": target_folder,
                "size": format_file_size(total_size),
                "file_count": len(files),
                "video_file_count": len(video_files),
                "created": created_date
            },
            "new": {
                "name": base_name,
                "size": format_file_size(os.path.getsize(filepath)),
                "file_count": 1
            }
        }

    return {"conflict": False}


@router.post("/parse")
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
    torrents_dir = get_torrent_type_dir(config, media_type)
    target_folder = os.path.join(torrents_dir, base_name)

    # Create directories
    os.makedirs(target_folder, exist_ok=True)

    # Target file path
    target_file = os.path.join(target_folder, filename)

    # Copy the file (only if not already there)
    if os.path.abspath(filepath) != os.path.abspath(target_file):
        # Remove existing file if present (allows overwrite)
        if os.path.exists(target_file):
            os.remove(target_file)
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

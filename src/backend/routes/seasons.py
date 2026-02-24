"""Season pack parsing and conflict checking endpoints."""

import os
import shutil
from datetime import datetime

from fastapi import APIRouter, HTTPException
from guessit import guessit

from ..config import load_config
from ..models import FolderRequest
from ..metadata import get_file_metadata
from ..helpers import find_all_video_files, format_file_size, serialize_parsed
from ..nfo import generate_nfo

router = APIRouter()


@router.post("/check-season-conflict")
def check_season_conflict(folder_req: FolderRequest):
    """
    Check if a season pack with the same name already exists.
    Returns conflict info if found.
    """
    folder_path = folder_req.folder_path

    if folder_path.startswith("~"):
        folder_path = os.path.expanduser(folder_path)

    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder not found: {folder_path}")

    # Find all video files in the source folder
    video_files = find_all_video_files(folder_path)

    if not video_files:
        raise HTTPException(
            status_code=400,
            detail="No video files found in the selected folder."
        )

    # Calculate total size of source files
    new_total_bytes = 0
    for vf in video_files:
        vf_path = os.path.join(folder_path, vf)
        new_total_bytes += os.path.getsize(vf_path)

    # Check target folder
    config = load_config()
    output_dir = config.get("output_directory", "~/Documents/torrents")
    torrents_dir = os.path.expanduser(output_dir)
    folder_name = os.path.basename(folder_path)
    target_folder = os.path.join(torrents_dir, folder_name)

    if os.path.exists(target_folder):
        # Get info about existing torrent
        existing_files = os.listdir(target_folder)
        existing_videos = [f for f in existing_files if f.split(".")[-1].lower() in ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v"]]

        # Calculate total size of existing
        existing_total_size = 0
        for f in existing_files:
            fpath = os.path.join(target_folder, f)
            if os.path.isfile(fpath):
                existing_total_size += os.path.getsize(fpath)

        # Get creation time
        created_time = os.path.getctime(target_folder)
        created_date = datetime.fromtimestamp(created_time).strftime("%Y-%m-%d %H:%M")

        return {
            "conflict": True,
            "existing": {
                "name": folder_name,
                "path": target_folder,
                "size": format_file_size(existing_total_size),
                "file_count": len(existing_files),
                "video_file_count": len(existing_videos),
                "created": created_date
            },
            "new": {
                "name": folder_name,
                "size": format_file_size(new_total_bytes),
                "file_count": len(video_files),
                "video_file_count": len(video_files)
            }
        }

    return {"conflict": False}


@router.post("/parse-season")
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
            # Remove existing file if present (allows overwrite)
            if os.path.exists(dst):
                os.remove(dst)
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

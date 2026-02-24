"""Torrent listing, details, deletion, and system capabilities endpoints."""

import os
import shutil
import platform

from fastapi import APIRouter, HTTPException
from guessit import guessit

from ..config import load_config
from ..models import FolderRequest
from ..metadata import get_file_metadata
from ..helpers import find_video_file, find_all_video_files, serialize_parsed

# Try to import send2trash for safe deletion
try:
    from send2trash import send2trash
    HAS_TRASH = True
except ImportError:
    HAS_TRASH = False

router = APIRouter()


@router.get("/torrents")
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


@router.post("/torrent-details")
def get_torrent_details(folder_req: FolderRequest):
    """Get details of an existing torrent folder."""
    folder_path = folder_req.folder_path

    if not os.path.isdir(folder_path):
        raise HTTPException(
            status_code=400,
            detail=f"Folder not found: {folder_path}"
        )

    # Find all video files to determine if this is a season pack
    all_video_files = find_all_video_files(folder_path)
    video_file_count = len(all_video_files)

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

    # Determine media type
    # Parse the folder name itself to get better context (not just the video file)
    folder_name = os.path.basename(folder_path)
    folder_parsed = guessit(folder_name)
    folder_has_season = "season" in folder_parsed
    folder_has_episode = "episode" in folder_parsed

    # If multiple video files exist, it's definitely a season pack
    if video_file_count > 1:
        media_type = "season"
    # If folder name indicates season without specific episode, it's a season pack
    # (e.g., "Show.S01.1080p.WEB-DL" or "Show.Season.1.Complete")
    elif folder_has_season and not folder_has_episode:
        media_type = "season"
    else:
        # Fall back to parsing the video file or folder
        parsed_type = parsed.get("type", "")
        if parsed_type == "movie":
            media_type = "movie"
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


@router.delete("/torrent")
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


@router.get("/system/delete-capability")
def get_delete_capability():
    """Get information about delete capabilities on this system."""
    system = platform.system()

    return {
        "has_trash": HAS_TRASH,
        "platform": system,
        "message": _get_delete_message(system, HAS_TRASH)
    }


def _get_delete_message(system: str, has_trash: bool) -> str:
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

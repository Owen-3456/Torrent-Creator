"""Torrent creation and preview endpoints (movie, episode, season pack)."""

import os

from fastapi import APIRouter, HTTPException
from guessit import guessit
from torf import Torrent

from ..config import load_config
from ..models import TorrentRequest, EpisodeTorrentRequest, SeasonTorrentRequest
from ..helpers import (
    find_video_file,
    find_all_video_files,
    format_file_size,
    apply_movie_template,
    apply_episode_template,
    apply_season_template,
)
from ..nfo import (
    generate_nfo_from_details,
    generate_episode_nfo_from_details,
    generate_season_nfo_from_details,
)

router = APIRouter()


# ============================================
# Movie Torrent Preview & Create
# ============================================
@router.post("/preview-torrent")
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


@router.post("/create-torrent")
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
@router.post("/preview-episode-torrent")
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


@router.post("/create-episode-torrent")
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
@router.post("/preview-season-torrent")
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

    # Generate preview of renamed video filenames
    renamed_video_files = []
    for vf in video_files:
        ext = os.path.splitext(vf)[1]

        # Parse the filename to extract episode info
        parsed = guessit(vf)
        episode_num = parsed.get("episode")

        if episode_num is not None:
            # Build new filename: ShowName.S01E02.quality.source.codec-group.ext
            new_filename = f"{details['show_name']}.S{details['season']:02d}E{episode_num:02d}"

            # Add quality, source, codec, group if available
            if details.get("resolution"):
                new_filename += f".{details['resolution']}"
            if details.get("source"):
                new_filename += f".{details['source']}"
            if details.get("video_codec"):
                new_filename += f".{details['video_codec']}"
            if details.get("release_group"):
                new_filename += f"-{details['release_group']}"

            new_filename += ext
            renamed_video_files.append(new_filename)
        else:
            # Couldn't parse episode number, keep original name
            renamed_video_files.append(vf)

    # Build file list with sizes for NFO (using renamed filenames)
    file_list_with_sizes = []
    for i, vf in enumerate(video_files):
        vf_path = os.path.join(folder_path, vf)
        vf_size = os.path.getsize(vf_path)
        # Use renamed filename in the list
        file_list_with_sizes.append({"name": renamed_video_files[i], "size": format_file_size(vf_size)})

    nfo_content = generate_season_nfo_from_details(details, new_base_name, file_list_with_sizes)

    output_dir = config.get("output_directory", "~/Documents/torrents")
    # Show renamed filenames in preview
    files = [{"name": f, "type": "video"} for f in renamed_video_files]
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


@router.post("/create-season-torrent")
def create_season_torrent(req: SeasonTorrentRequest):
    """
    Full season pack torrent creation pipeline:
    1. Rename individual video files with standardized episode names
    2. Generate and write the NFO file (with file listing)
    3. Rename the folder using the season naming template
    4. Create a .torrent file from the folder contents

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

    # --- Step 1: Rename individual video files ---
    # Parse each video file to extract episode number and rename consistently
    renamed_video_files = []
    for vf in video_files:
        old_path = os.path.join(folder_path, vf)
        ext = os.path.splitext(vf)[1]

        # Parse the filename to extract episode info
        parsed = guessit(vf)
        episode_num = parsed.get("episode")

        if episode_num is not None:
            # Build new filename: ShowName.S01E02.quality.source.codec-group.ext
            new_filename = f"{details['show_name']}.S{details['season']:02d}E{episode_num:02d}"

            # Add quality, source, codec, group if available
            if details.get("resolution"):
                new_filename += f".{details['resolution']}"
            if details.get("source"):
                new_filename += f".{details['source']}"
            if details.get("video_codec"):
                new_filename += f".{details['video_codec']}"
            if details.get("release_group"):
                new_filename += f"-{details['release_group']}"

            new_filename += ext
            new_path = os.path.join(folder_path, new_filename)

            # Only rename if the name is different
            if old_path != new_path:
                if os.path.exists(new_path):
                    raise HTTPException(
                        status_code=409,
                        detail=f"A file named '{new_filename}' already exists."
                    )
                os.rename(old_path, new_path)
                renamed_video_files.append(new_filename)
            else:
                renamed_video_files.append(vf)
        else:
            # Couldn't parse episode number, keep original name
            renamed_video_files.append(vf)

    # Update video_files list with renamed files
    video_files = renamed_video_files

    # --- Step 2: Remove old NFO files and write new one ---
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
        "new_base_name": new_base_name,
        "output_dir": output_dir,
        "torrent_file": torrent_file_path,
        "torrent_filename": torrent_filename,
    }

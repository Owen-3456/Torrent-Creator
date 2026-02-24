"""Utility functions for file handling, naming templates, and serialization."""

import os
import re

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
    # e.g. ".." from empty year -> single dot
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

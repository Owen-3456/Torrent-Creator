"""NFO file generation functions."""

from .config import load_config, load_ascii_art


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

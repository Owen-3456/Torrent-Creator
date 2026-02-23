# Torrent Creator

Desktop application for creating properly formatted movie and TV show torrents. Built for personal use.

**Requirements:** Python 3.8+, Node.js 16+, TMDB API key

[Setup Guide](SETUP.md) • [Configuration](#configuration)

---

## Features

**Torrent Creation**
- Movies - Single video file with metadata and NFO
- Episodes - Individual TV episodes with season/episode info
- Season Packs - Full seasons with automatic episode file renaming
- Edit existing torrents to update metadata

**Metadata**
- TMDB search via modal popup
- Automatic field population (title, year, IDs, overview, language)
- Manual editing with revert functionality

**Customization**
- Configurable naming templates
- Custom tracker management
- Release group defaults
- Settings import/export

---

## Installation

```bash
# Install dependencies
pip install -r requirements.txt
npm install

# Run
npm start
```

See [SETUP.md](SETUP.md) for detailed instructions including TMDB API key setup.

---

## File Structure

```
torrents/
  └── Movie.Name.2024.1080p.WEB-DL.x264-GROUP/
      ├── Movie.Name.2024.1080p.WEB-DL.x264-GROUP.mkv
      └── Movie.Name.2024.1080p.WEB-DL.x264-GROUP.NFO

  └── Show.Name.S01.1080p.WEB-DL.x264-GROUP/
      ├── Show.Name.S01E01.1080p.WEB-DL.x264-GROUP.mkv
      ├── Show.Name.S01E02.1080p.WEB-DL.x264-GROUP.mkv
      └── Show.Name.S01.1080p.WEB-DL.x264-GROUP.NFO
```

Season packs automatically rename all episode files to match the template format.

---

## Configuration

Settings stored in `~/.torrent-creator/config.json`

**Naming Templates**

Movie: `{title}.{year}.{quality}.{source}.{codec}-{group}`  
Episode: `{title}.S{season:02}E{episode:02}.{episode_title}.{quality}.{source}.{codec}-{group}`  
Season: `{title}.S{season:02}.{quality}.{source}.{codec}-{group}`

**Available Variables**

- `{title}` - Movie/show name
- `{year}` - Release year
- `{season}` - Season number
- `{episode}` - Episode number
- `{episode_title}` - Episode name
- `{quality}` - Resolution (1080p, 720p, etc.)
- `{source}` - Source type (BluRay, WEB-DL, etc.)
- `{codec}` - Video codec (x264, x265, etc.)
- `{group}` - Release group tag

---

## Tech Stack

Frontend: Electron, Vanilla JavaScript  
Backend: Python, FastAPI, Uvicorn  
Parser: guessit  
Metadata: TMDB API, pymediainfo  
Torrents: torf

---

## Troubleshooting

**Backend won't start**  
Check if port 8000 is in use: `lsof -i :8000`

**Metadata search fails**  
Verify TMDB API key in Settings

**Files not renaming**  
Ensure episode numbers are parseable in original filenames

See [SETUP.md](SETUP.md#troubleshooting) for detailed troubleshooting.

---

## Development

```bash
# Run with DevTools
npm start -- --dev
```

Backend runs on http://localhost:8000

---

Built for personal use on private trackers. Requires TMDB API key.

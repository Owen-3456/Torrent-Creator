# Torrent Creator

<div align="center">

A desktop application for creating properly formatted movie and TV show torrents.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Node](https://img.shields.io/badge/Node-16+-green.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-47848f.svg)](https://www.electronjs.org/)

Built for personal use with my specific workflow needs.

[Features](#features) • [Setup](SETUP.md) • [Usage](#usage) • [Configuration](#configuration)

</div>

---

## Features

### 🎬 Torrent Creation
- **Movies** - Single video file torrents with complete metadata
- **TV Episodes** - Individual episodes with season/episode information  
- **Season Packs** - Full seasons with automatic episode file renaming
- **Edit Existing** - Modify metadata of previously created torrents

### 🎯 Smart Automation
- Automatic filename parsing with intelligent detection
- Individual episode files renamed to match your template format
- Season pack vs single episode detection from folder structure
- NFO generation with ASCII art support

### 🔍 Metadata Integration  
- TMDB search via popup modal interface
- Automatic population of title, year, IDs, overview, language
- Episode-specific metadata (season, episode number, title)
- Manual override of all fields with revert functionality

### ⚙️ Customization
- Configurable naming templates for movies, episodes, and seasons
- Custom tracker management with add/remove interface
- Release group defaults and output directory selection
- Settings import/export for backup and portability

---

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- TMDB API key (free)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/Torrent-Creator.git
cd Torrent-Creator

# Install dependencies
pip install -r requirements.txt
npm install

# Run application
npm start
```

**→ For detailed setup instructions including API key setup, see [SETUP.md](SETUP.md)**

---

## Usage

### Creating a Movie Torrent

1. **Select Type** - Choose "Movie" from the main menu
2. **Upload File** - Click upload box or drag video file
3. **Lookup Metadata** - Click "Lookup Metadata" button and search TMDB
4. **Review** - Edit any fields as needed, click "Preview" to see final structure
5. **Create** - Click "Make Torrent" to generate the .torrent file

### Creating a Season Pack

1. **Select Type** - Choose "Season Pack" from the main menu  
2. **Upload Folder** - Select folder containing all episode files
3. **Lookup Metadata** - Search for the show, select season number
4. **Preview** - Review renamed episode filenames in the preview
5. **Create** - All episodes automatically renamed with consistent format

### Editing Existing Torrents

1. **Edit Existing** - Select from main menu
2. **Choose Torrent** - Click on any previously created torrent
3. **Modify** - Update metadata, search TMDB again if needed
4. **Update** - Save changes and regenerate torrent

---

## File Structure

```
Output Directory/
  └── Movie.Name.2024.1080p.WEB-DL.x264-GROUP/
      ├── Movie.Name.2024.1080p.WEB-DL.x264-GROUP.mkv
      └── Movie.Name.2024.1080p.WEB-DL.x264-GROUP.NFO

  └── Show.Name.S01.1080p.WEB-DL.x264-GROUP/
      ├── Show.Name.S01E01.1080p.WEB-DL.x264-GROUP.mkv
      ├── Show.Name.S01E02.1080p.WEB-DL.x264-GROUP.mkv
      ├── ...
      └── Show.Name.S01.1080p.WEB-DL.x264-GROUP.NFO
```

Season packs automatically parse and rename all episode files to match your template.

---

## Configuration

Settings are stored in `~/.torrent-creator/config.json`

### Naming Templates

Customize output format with template variables:

**Movie**
```
{title}.{year}.{quality}.{source}.{codec}-{group}
→ Inception.2010.1080p.BluRay.x264-GROUP
```

**Episode**  
```
{title}.S{season:02}E{episode:02}.{episode_title}.{quality}.{source}.{codec}-{group}
→ Breaking.Bad.S01E01.Pilot.1080p.WEB-DL.x264-GROUP
```

**Season**
```
{title}.S{season:02}.{quality}.{source}.{codec}-{group}  
→ Breaking.Bad.S01.1080p.WEB-DL.x264-GROUP
```

### Available Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{title}` | Movie/show name | `Inception` |
| `{year}` | Release year | `2010` |
| `{season}` | Season number | `01` |
| `{episode}` | Episode number | `02` |
| `{episode_title}` | Episode name | `Pilot` |
| `{quality}` | Resolution | `1080p` |
| `{source}` | Source type | `BluRay`, `WEB-DL` |
| `{codec}` | Video codec | `x264`, `x265` |
| `{group}` | Release group | `GROUP` |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Electron, Vanilla JavaScript |
| Backend | Python, FastAPI, Uvicorn |
| Parser | guessit |
| Metadata | TMDB API, pymediainfo |
| Torrents | torf |
| UI Design | Monospace terminal aesthetic |

---

## Design Philosophy

This application is built **specifically for my personal torrenting workflow**. The focus is on:

✓ **Speed** - Minimal clicks to create properly formatted torrents  
✓ **Consistency** - Predictable, standardized naming across all content  
✓ **Intelligence** - Automatic detection and renaming where possible  
✓ **Simplicity** - No unnecessary features or visual bloat  
✓ **Keyboard-friendly** - Fast navigation and input  

Not intended as a general-purpose tool, but rather optimized for private tracker requirements and personal preferences.

---

## Requirements

- **Python 3.8+** with pip
- **Node.js 16+** with npm  
- **TMDB API key** (free account required)
- **MediaInfo** (for video metadata extraction)

See [SETUP.md](SETUP.md) for complete installation instructions.

---

## Troubleshooting

Common issues and solutions:

**Backend won't start**  
→ Check if port 8000 is in use: `lsof -i :8000`

**Metadata search fails**  
→ Verify TMDB API key in Settings

**Files not renaming**  
→ Ensure episode numbers are parseable in original filenames

**For detailed troubleshooting, see [SETUP.md](SETUP.md#troubleshooting)**

---

## Development

```bash
# Run with DevTools for debugging
npm start -- --dev

# Backend runs on http://localhost:8000
# Frontend connects via IPC
```

---

## Note

Built for **personal use** to organize media on private trackers. Requires your own TMDB API key.

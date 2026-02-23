# Torrent Creator

A desktop application for creating properly formatted movie and TV show torrents. Built for personal use with my specific workflow needs.

## Features

### Torrent Creation
- **Movies** - Single video file with metadata and NFO
- **Episodes** - Individual TV show episodes with season/episode info
- **Season Packs** - Full season folders with automatic episode file renaming
- Customizable naming templates for consistent formatting
- Automatic NFO generation with ASCII art support
- Edit existing torrents to update metadata

### Metadata Integration
- TMDB search via popup modal for movies and TV shows
- Automatic metadata population (title, year, IDs, overview, language)
- Episode-specific data (season, episode number, title)
- Manual editing of all fields with revert functionality

### Configuration
- Custom tracker management with add/remove
- Configurable output directory
- Release group defaults
- Settings import/export as JSON
- Template customization for movies, episodes, and seasons

## Technical Details

**Frontend**: Electron + vanilla JavaScript  
**Backend**: Python with FastAPI + uvicorn  
**Parser**: guessit for filename analysis  
**Metadata**: TMDB API integration  

### File Structure
```
torrents/
  └── Movie.Name.2024.1080p.WEB-DL.x264-GROUP/
      ├── Movie.Name.2024.1080p.WEB-DL.x264-GROUP.mkv
      └── Movie.Name.2024.1080p.WEB-DL.x264-GROUP.NFO
```

Season packs automatically rename individual episode files to match your template format.

## Setup

**Requirements**: Python 3.8+, Node.js 16+

```bash
# Install dependencies
pip install -r requirements.txt
npm install

# Run
npm start
```

## Usage

1. Select torrent type (Movie/Episode/Season)
2. Upload video file or folder
3. Click "Lookup Metadata" to search TMDB (optional)
4. Review/edit metadata fields
5. Preview shows final filenames and NFO
6. Create torrent

Season packs parse and rename all episode files automatically. The metadata modal handles TV shows intelligently - season packs only need a season number, episodes need both season and episode.

## Configuration

Settings stored in `~/.torrent-creator/config.json`

**Key settings:**
- `naming_templates` - File naming patterns with template variables
- `trackers` - Announce URLs for torrent trackers  
- `output_directory` - Where torrents are saved
- `release_group` - Default group tag
- `api_keys.tmdb` - TMDB API key for metadata lookup

## Design Philosophy

Built specifically for my personal torrenting workflow. Focuses on:
- Fast, keyboard-friendly interface
- Consistent, predictable naming
- Minimal clicks to create properly formatted torrents
- Terminal-inspired monospace aesthetic
- No unnecessary features or bloat

---

**Note**: This is a personal tool designed for private tracker use. Requires your own TMDB API key.

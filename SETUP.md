# Setup Guide

Complete setup instructions for Torrent Creator.

## Prerequisites

**Python 3.8+**
```bash
python3 --version
```

**Node.js 16+**
```bash
node --version
npm --version
```

---

## Installation

### 1. Clone Repository

```bash
cd Torrent-Creator
```

### 2. Install Python Dependencies

```bash
# Optional: Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Key packages: fastapi, uvicorn, guessit, pymediainfo, httpx, torf, send2trash

### 3. Install Node Dependencies

```bash
npm install
```

---

## TMDB API Key

Required for metadata lookup.

### Getting Your API Key

1. Create account at https://www.themoviedb.org/signup
2. Verify email
3. Go to https://www.themoviedb.org/settings/api
4. Click "Request an API Key" → Choose "Developer"
5. Fill form:
   - Name: "Personal Torrent Creator"
   - URL: http://localhost
   - Summary: "Personal media organization tool"
6. Copy your API Key (v3 auth)

### Adding the Key

**Option 1: UI (Recommended)**
1. Launch app
2. Settings → TMDB API Key
3. Paste key → Save

**Option 2: Manual**
Edit `~/.torrent-creator/config.json`:
```json
{
  "api_keys": {
    "tmdb": "your_api_key_here"
  }
}
```

---

## Configuration

### Directory Structure

```
~/.torrent-creator/
├── config.json          # Settings
└── ascii_art.txt        # Custom ASCII art (optional)

~/Documents/torrents/    # Output directory (default)
```

### Required Settings

- TMDB API Key
- Output Directory
- Release Group

### Naming Templates

Templates use variables in `{curly braces}`:

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

### Adding Trackers

**Through UI:**
1. Settings → Trackers
2. Paste URL → Click +

**Example:**
```
udp://tracker.example.com:6969/announce
http://tracker.example.org:8080/announce
```

---

## First Run

### Start Application

```bash
npm start
```

Starts Python backend on port 8000 and launches Electron frontend.

### Setup Checklist

1. Add TMDB API Key (Settings)
2. Set Output Directory (Settings)
3. Set Release Group (Settings)
4. Add Trackers (Settings, optional)
5. Test metadata lookup:
   - Create New → Movie
   - Upload file
   - Click "Lookup Metadata"
   - Search and verify results

### Create First Torrent

**Movie:**
1. Main Menu → Create New → Movie
2. Upload video file
3. Click "Lookup Metadata" → Search → Apply
4. Review fields
5. Preview → Make Torrent

**Season Pack:**
1. Main Menu → Create New → Season Pack
2. Select folder with episode files
3. Click "Lookup Metadata" → Search → Select season
4. Preview shows renamed episode files
5. Make Torrent

---

## Troubleshooting

### Backend Connection Issues

**Problem:** "Backend not running" or "Not Connected"

**Solution:**
```bash
# Check if port 8000 is in use
lsof -i :8000  # Linux/macOS
netstat -ano | findstr :8000  # Windows

# Kill process if needed
kill -9 <PID>
```

### TMDB Search Not Working

**Problem:** "No results found" or "Failed to search"

**Check:**
- API key entered correctly in Settings
- Internet connection active
- TMDB API operational (check status.themoviedb.org)
- Browser console for errors

### Video Files Not Parsing

**Problem:** "No video file found" or incomplete metadata

**Check:**
- Supported extensions: .mp4, .mkv, .avi, .mov, .wmv, .flv, .webm, .m4v
- File not corrupted
- MediaInfo installed:
  ```bash
  # Ubuntu/Debian
  sudo apt install mediainfo libmediainfo-dev
  # macOS
  brew install mediainfo
  ```

### Permission Issues

**Problem:** "Permission denied" when creating torrents

**Check:**
- Output directory is writable
- Source files are readable
- File permissions: `ls -la ~/Documents/torrents`

### Season Pack Episode Renaming

**Problem:** Episode files keep original names

**Check:**
- Files have episode numbers (e.g., "E01", "S01E02")
- guessit can parse filenames
- No conflicting filenames exist

### Development Mode

Debug with DevTools:
```bash
npm start -- --dev
```

---

## Advanced Configuration

### Custom ASCII Art

1. Create text file with ASCII art
2. Save as `~/.torrent-creator/ascii_art.txt`
3. Enable in Settings → "Include ASCII Art in NFO"

### Import/Export Settings

**Export:** Settings → Export Settings → Save JSON  
**Import:** Settings → Import Settings → Choose JSON

### Custom Config Location

```bash
export TORRENT_CREATOR_CONFIG="/path/to/config.json"
npm start
```

---

## Dependencies

**Python packages:**
- fastapi - Web framework
- uvicorn - ASGI server
- guessit - Filename parsing
- pymediainfo - Video metadata
- httpx - HTTP client
- torf - Torrent creation
- send2trash - Safe deletion

**Node packages:**
- electron - Desktop framework

---

Built for personal use. Some edge cases may not be handled.

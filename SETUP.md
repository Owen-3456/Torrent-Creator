# Setup Guide

Complete setup instructions for Torrent Creator.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [TMDB API Key](#tmdb-api-key)
- [Configuration](#configuration)
- [First Run](#first-run)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

**Python 3.8 or higher**
```bash
# Check your Python version
python3 --version
```

**Node.js 16 or higher**
```bash
# Check your Node.js version
node --version
npm --version
```

### Operating System
- **Linux** - Fully supported
- **macOS** - Fully supported
- **Windows** - Should work, but not extensively tested

---

## Installation

### 1. Clone the Repository

```bash
# Clone your copy of the repository
cd Torrent-Creator
```

### 2. Install Python Dependencies

```bash
# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Key Python packages installed:**
- `fastapi` - Backend web framework
- `uvicorn` - ASGI server
- `guessit` - Filename parsing
- `pymediainfo` - Video metadata extraction
- `httpx` - HTTP client for TMDB API
- `torf` - Torrent file creation
- `send2trash` - Safe file deletion

### 3. Install Node.js Dependencies

```bash
npm install
```

**Key packages installed:**
- `electron` - Desktop application framework
- Development tools and build dependencies

---

## TMDB API Key

The application uses The Movie Database (TMDB) API for automatic metadata lookup. You'll need a free API key.

### Getting Your API Key

1. **Create a TMDB Account**
   - Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
   - Sign up for a free account
   - Verify your email address

2. **Request API Access**
   - Go to your account settings: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Click "Request an API Key"
   - Choose "Developer" (not Commercial)
   - Accept the terms of use

3. **Fill Out the Application**
   - **Application Name**: "Personal Torrent Creator" (or any name)
   - **Application URL**: Can use `http://localhost` or leave blank
   - **Application Summary**: "Personal tool for organizing media files"
   - Click "Submit"

4. **Copy Your API Key**
   - Once approved (usually instant), you'll see your API Key (v3 auth)
   - Copy the long alphanumeric string
   - **Keep this private!**

### Adding the API Key to the App

You can add your API key in two ways:

**Option 1: Through the UI (Recommended)**
1. Launch the application
2. Click "Settings" from the main menu
3. Find the "TMDB API Key" field
4. Paste your API key
5. Click "Save Settings"

**Option 2: Manual Configuration**
1. Create/edit the config file at `~/.torrent-creator/config.json`
2. Add your key:
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

On first run, the app creates:
```
~/.torrent-creator/
├── config.json          # Application settings
└── ascii_art.txt        # Custom ASCII art for NFOs (optional)
```

Default torrent output:
```
~/Documents/torrents/    # Configurable in settings
```

### Basic Configuration

**Required Settings:**
- **TMDB API Key** - For metadata lookup
- **Output Directory** - Where torrents will be saved
- **Release Group** - Your default group tag (e.g., "GROUP")

**Optional Settings:**
- **Trackers** - Announce URLs (can be added later)
- **Naming Templates** - Customize file naming patterns
- **NFO Settings** - Include notes, custom ASCII art

### Naming Templates

Templates use variables in curly braces:

**Movie Template:**
```
{title}.{year}.{quality}.{source}.{codec}-{group}
```
Example output: `Inception.2010.1080p.BluRay.x264-GROUP`

**Episode Template:**
```
{title}.S{season:02}E{episode:02}.{episode_title}.{quality}.{source}.{codec}-{group}
```
Example output: `Breaking.Bad.S01E01.Pilot.1080p.WEB-DL.x264-GROUP`

**Season Template:**
```
{title}.S{season:02}.{quality}.{source}.{codec}-{group}
```
Example output: `Breaking.Bad.S01.1080p.WEB-DL.x264-GROUP`

**Available Variables:**
- `{title}` - Movie/show name
- `{year}` - Release year
- `{season}` - Season number
- `{episode}` - Episode number
- `{episode_title}` - Episode name
- `{quality}` - Resolution (1080p, 720p, etc.)
- `{source}` - Source type (BluRay, WEB-DL, etc.)
- `{codec}` - Video codec (x264, x265, etc.)
- `{group}` - Release group tag

### Adding Trackers

Trackers are announce URLs for torrent distribution.

**Through the UI:**
1. Open Settings
2. Scroll to "Trackers" section
3. Paste tracker URL in the input field
4. Click "+" to add
5. Repeat for multiple trackers

**Example tracker URLs:**
```
udp://tracker.example.com:6969/announce
http://tracker.example.org:8080/announce
```

**Note:** Use trackers you're authorized to use. Public trackers may not be suitable for all content.

---

## First Run

### Starting the Application

```bash
# From the project directory
npm start
```

This will:
1. Start the Python backend (FastAPI server on port 8000)
2. Launch the Electron frontend
3. Open the main application window

### Initial Setup Checklist

On first launch:

1. ✅ **Add TMDB API Key**
   - Settings → TMDB API Key → Paste → Save

2. ✅ **Set Output Directory**
   - Settings → Output Directory → Choose location

3. ✅ **Set Release Group**
   - Settings → Release Group → Enter your tag

4. ✅ **Add Trackers** (if needed)
   - Settings → Trackers → Add URLs

5. ✅ **Test Metadata Lookup**
   - Create New → Movie
   - Upload any video file
   - Click "Lookup Metadata"
   - Search for a movie title
   - Verify results appear

### Creating Your First Torrent

**For a Movie:**
1. Main Menu → "Create New Torrent"
2. Select "Movie"
3. Click the upload box or drag a video file
4. Click "Lookup Metadata" and search for the movie
5. Select the correct result and click "Apply Metadata"
6. Review/edit any fields
7. Click "Preview" to see the final structure
8. Click "Make Torrent"

**For a Season Pack:**
1. Main Menu → "Create New Torrent"
2. Select "Season Pack"
3. Click the upload box and choose a folder with episode files
4. Wait for parsing to complete
5. Click "Lookup Metadata" and search for the show
6. Select the show and choose the season number
7. Review the preview showing renamed episode files
8. Click "Make Torrent"

---

## Troubleshooting

### Backend Connection Issues

**Symptom:** "Backend not running" or "Not Connected" in status bar

**Solutions:**
1. Check if port 8000 is already in use:
   ```bash
   lsof -i :8000  # Linux/macOS
   netstat -ano | findstr :8000  # Windows
   ```
2. Close any other applications using port 8000
3. Restart the application

### TMDB Search Not Working

**Symptom:** "No results found" or "Failed to search"

**Check:**
1. API key is correctly entered in Settings
2. Internet connection is active
3. TMDB API is operational (check [status.themoviedb.org](https://status.themoviedb.org))
4. Check browser console (DevTools) for error messages

### Video Files Not Parsing

**Symptom:** "No video file found" or metadata is incomplete

**Check:**
1. File extension is supported: `.mp4`, `.mkv`, `.avi`, `.mov`, `.wmv`, `.flv`, `.webm`, `.m4v`
2. File is not corrupted
3. MediaInfo is properly installed:
   ```bash
   # Install MediaInfo if missing
   # Ubuntu/Debian:
   sudo apt install mediainfo libmediainfo-dev
   # macOS:
   brew install mediainfo
   ```

### Permission Issues

**Symptom:** "Permission denied" when creating torrents

**Check:**
1. Output directory is writable
2. Source files are readable
3. On Linux/macOS, check file permissions:
   ```bash
   ls -la ~/Documents/torrents
   ```

### Season Pack Episode Renaming Issues

**Symptom:** Episode files keep original names

**Check:**
1. Files have episode numbers in filenames (e.g., "E01", "S01E02")
2. guessit can parse the filenames correctly
3. No conflicting filenames already exist in the folder

### Development Mode

To debug issues, start with DevTools enabled:

```bash
npm start -- --dev
```

This opens Chrome DevTools for viewing console logs and errors.

---

## Advanced Configuration

### Custom ASCII Art for NFOs

1. Create a text file with your ASCII art
2. Save it as `~/.torrent-creator/ascii_art.txt`
3. Enable in Settings → "Include ASCII Art in NFO"

### Importing/Exporting Settings

**Export:**
- Settings → "Export Settings"
- Saves all configuration to a JSON file

**Import:**
- Settings → "Import Settings"
- Choose a previously exported JSON file
- Overwrites current configuration

### Multiple Profiles

To use different configurations:

```bash
# Set custom config location
export TORRENT_CREATOR_CONFIG="/path/to/custom/config.json"
npm start
```

---

## Getting Help

If you encounter issues not covered here:

1. Review application logs (backend console output)
2. Run with DevTools enabled to see detailed errors
3. Make sure all dependencies are up to date

**Remember:** This is a personal tool built for specific needs. Some edge cases may not be handled.

---

## Next Steps

- Read the [README.md](README.md) for feature overview
- Customize naming templates in Settings
- Set up your preferred trackers
- Start creating torrents!

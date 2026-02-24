"""Configuration management for Torrent Creator backend."""

import os
import json
import shutil

# Config paths
CONFIG_DIR = os.path.expanduser("~/.torrent-creator")
CONFIG_PATH = os.path.join(CONFIG_DIR, "config.json")
ASCII_ART_PATH = os.path.join(CONFIG_DIR, "custom-ascii-art.txt")

# Get the project root directory (for example files)
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(BACKEND_DIR))
EXAMPLE_CONFIG_PATH = os.path.join(PROJECT_ROOT, "example-config.json")
EXAMPLE_ASCII_PATH = os.path.join(PROJECT_ROOT, "example-custom-ascii-art.txt")

# Default config structure
DEFAULT_CONFIG = {
    "api_keys": {
        "tmdb": "",
        "tvdb": ""
    },
    "naming_templates": {
        "movie": "{title}.{year}.{quality}.{source}.{codec}-{group}",
        "episode": "{title}.S{season:02}E{episode:02}.{episode_title}.{quality}.{source}.{codec}-{group}",
        "season": "{title}.S{season:02}.{quality}.{source}.{codec}-{group}"
    },
    "trackers": [],
    "output_directory": "~/Documents/torrents",
    "release_group": "GROUP",
    "nfo": {
        "include_notes": True,
        "notes_template": "Enjoy and seed!"
    }
}

DEFAULT_ASCII_ART = """═══════════════════════════════════════════════════
  TORRENT CREATOR
═══════════════════════════════════════════════════"""


def init_config():
    """Initialize config files if they don't exist."""
    # Create config directory
    os.makedirs(CONFIG_DIR, exist_ok=True)

    # Initialize config.json
    if not os.path.exists(CONFIG_PATH):
        # Try to copy from example file, otherwise use defaults
        if os.path.exists(EXAMPLE_CONFIG_PATH):
            shutil.copy(EXAMPLE_CONFIG_PATH, CONFIG_PATH)
            # Clear the API keys in the copied config
            config = load_config()
            config["api_keys"]["tmdb"] = ""
            config["api_keys"]["tvdb"] = ""
            save_config(config)
        else:
            save_config(DEFAULT_CONFIG)

    # Initialize ascii-art.txt
    if not os.path.exists(ASCII_ART_PATH):
        if os.path.exists(EXAMPLE_ASCII_PATH):
            shutil.copy(EXAMPLE_ASCII_PATH, ASCII_ART_PATH)
        else:
            with open(ASCII_ART_PATH, "w") as f:
                f.write(DEFAULT_ASCII_ART)


def load_config() -> dict:
    """Load configuration from file."""
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Warning: Failed to load config ({e}), using defaults")
            return DEFAULT_CONFIG.copy()
    return DEFAULT_CONFIG.copy()


def save_config(config: dict):
    """Save configuration to file."""
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=2)


def load_ascii_art() -> str:
    """Load ASCII art from file."""
    if os.path.exists(ASCII_ART_PATH):
        try:
            with open(ASCII_ART_PATH, "r", encoding="utf-8") as f:
                return f.read()
        except (IOError, UnicodeDecodeError) as e:
            print(f"Warning: Failed to load ASCII art ({e}), using defaults")
            return DEFAULT_ASCII_ART
    return DEFAULT_ASCII_ART


def save_ascii_art(art: str):
    """Save ASCII art to file."""
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(ASCII_ART_PATH, "w") as f:
        f.write(art)

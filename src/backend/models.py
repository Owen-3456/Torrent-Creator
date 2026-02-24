"""Pydantic request/response models for the API."""

from pydantic import BaseModel
from typing import Optional


class FileRequest(BaseModel):
    filepath: str


class FolderRequest(BaseModel):
    folder_path: str


class ConfigUpdate(BaseModel):
    config: dict


class AsciiArtUpdate(BaseModel):
    ascii_art: str


class TMDBSearchRequest(BaseModel):
    query: str
    year: Optional[int] = None


class TorrentRequest(BaseModel):
    folder_path: str
    name: str
    year: str
    runtime: str
    size: str
    language: str
    resolution: str
    source: str
    video_codec: str
    audio_codec: str
    container: str
    release_group: str
    tmdb_id: str
    imdb_id: str
    overview: str
    bit_depth: str
    hdr_format: str
    audio_channels: str


class EpisodeTorrentRequest(TorrentRequest):
    show_name: str
    season: int
    episode: int
    episode_title: str


class SeasonTorrentRequest(BaseModel):
    folder_path: str
    show_name: str
    season: int
    year: str
    language: str
    resolution: str
    source: str
    video_codec: str
    audio_codec: str
    container: str
    release_group: str
    tmdb_id: str
    imdb_id: str
    overview: str
    bit_depth: str
    hdr_format: str
    audio_channels: str
    total_size: str
    episode_count: int

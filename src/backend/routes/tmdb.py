"""TMDB API endpoints for movies and TV shows."""

import httpx
from fastapi import APIRouter, HTTPException

from ..config import load_config
from ..models import TMDBSearchRequest

TMDB_BASE_URL = "https://api.themoviedb.org/3"

router = APIRouter()


def _get_tmdb_api_key() -> str:
    """Get TMDB API key from config, raising if not configured."""
    config = load_config()
    api_key = config.get("api_keys", {}).get("tmdb", "")
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="TMDB API key not configured. Please add it in Settings."
        )
    return api_key


# ============================================
# Movie Endpoints
# ============================================
@router.post("/tmdb/search")
async def tmdb_search_movies(request: TMDBSearchRequest):
    """Search for movies on TMDB."""
    api_key = _get_tmdb_api_key()

    params = {
        "api_key": api_key,
        "query": request.query,
        "include_adult": False
    }

    if request.year:
        params["year"] = request.year

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/search/movie",
            params=params
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        data = response.json()
        results = []

        for movie in data.get("results", [])[:10]:
            results.append({
                "id": movie.get("id"),
                "title": movie.get("title"),
                "original_title": movie.get("original_title"),
                "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "",
                "overview": movie.get("overview", ""),
                "poster_path": movie.get("poster_path"),
                "vote_average": movie.get("vote_average")
            })

        return {"success": True, "results": results}


@router.get("/tmdb/movie/{movie_id}")
async def tmdb_get_movie(movie_id: int):
    """Get detailed movie information from TMDB."""
    api_key = _get_tmdb_api_key()

    async with httpx.AsyncClient() as client:
        # Get movie details
        response = await client.get(
            f"{TMDB_BASE_URL}/movie/{movie_id}",
            params={"api_key": api_key}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        movie = response.json()

        # Extract relevant details
        result = {
            "id": movie.get("id"),
            "tmdb_id": movie.get("id"),
            "imdb_id": movie.get("imdb_id", ""),
            "title": movie.get("title"),
            "original_title": movie.get("original_title"),
            "year": movie.get("release_date", "")[:4] if movie.get("release_date") else "",
            "overview": movie.get("overview", ""),
            "runtime": movie.get("runtime"),
            "poster_path": movie.get("poster_path"),
            "backdrop_path": movie.get("backdrop_path"),
            "vote_average": movie.get("vote_average"),
            "genres": [g.get("name") for g in movie.get("genres", [])],
            "spoken_languages": [l.get("english_name") for l in movie.get("spoken_languages", [])],
            "original_language": movie.get("original_language"),
        }

        return {"success": True, "movie": result}


# ============================================
# TV Show Endpoints
# ============================================
@router.post("/tmdb/search-tv")
async def tmdb_search_tv(request: TMDBSearchRequest):
    """Search for TV shows on TMDB."""
    api_key = _get_tmdb_api_key()

    params = {
        "api_key": api_key,
        "query": request.query,
        "include_adult": False
    }

    if request.year:
        params["first_air_date_year"] = request.year

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/search/tv",
            params=params
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        data = response.json()
        results = []

        for show in data.get("results", [])[:10]:
            results.append({
                "id": show.get("id"),
                "name": show.get("name"),
                "original_name": show.get("original_name"),
                "year": show.get("first_air_date", "")[:4] if show.get("first_air_date") else "",
                "overview": show.get("overview", ""),
                "poster_path": show.get("poster_path"),
                "vote_average": show.get("vote_average")
            })

        return {"success": True, "results": results}


@router.get("/tmdb/tv/{tv_id}")
async def tmdb_get_tv(tv_id: int):
    """Get detailed TV show information from TMDB."""
    api_key = _get_tmdb_api_key()

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/tv/{tv_id}",
            params={"api_key": api_key}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        show = response.json()

        # Get external IDs (for IMDB ID)
        ext_response = await client.get(
            f"{TMDB_BASE_URL}/tv/{tv_id}/external_ids",
            params={"api_key": api_key}
        )
        external_ids = ext_response.json() if ext_response.status_code == 200 else {}

        result = {
            "id": show.get("id"),
            "tmdb_id": show.get("id"),
            "imdb_id": external_ids.get("imdb_id", ""),
            "name": show.get("name"),
            "original_name": show.get("original_name"),
            "year": show.get("first_air_date", "")[:4] if show.get("first_air_date") else "",
            "overview": show.get("overview", ""),
            "poster_path": show.get("poster_path"),
            "vote_average": show.get("vote_average"),
            "genres": [g.get("name") for g in show.get("genres", [])],
            "spoken_languages": [l.get("english_name") for l in show.get("spoken_languages", [])],
            "original_language": show.get("original_language"),
            "number_of_seasons": show.get("number_of_seasons", 0),
            "seasons": [
                {
                    "season_number": s.get("season_number"),
                    "name": s.get("name"),
                    "episode_count": s.get("episode_count"),
                    "air_date": s.get("air_date", ""),
                }
                for s in show.get("seasons", [])
                if s.get("season_number", 0) > 0  # Skip specials (season 0)
            ],
        }

        return {"success": True, "show": result}


@router.get("/tmdb/tv/{tv_id}/season/{season_number}")
async def tmdb_get_season(tv_id: int, season_number: int):
    """Get season details including episode list from TMDB."""
    api_key = _get_tmdb_api_key()

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/tv/{tv_id}/season/{season_number}",
            params={"api_key": api_key}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        season = response.json()

        episodes = []
        for ep in season.get("episodes", []):
            episodes.append({
                "episode_number": ep.get("episode_number"),
                "name": ep.get("name", ""),
                "overview": ep.get("overview", ""),
                "air_date": ep.get("air_date", ""),
                "runtime": ep.get("runtime"),
                "still_path": ep.get("still_path"),
                "vote_average": ep.get("vote_average"),
            })

        return {
            "success": True,
            "season_number": season.get("season_number"),
            "name": season.get("name"),
            "episodes": episodes,
        }


@router.get("/tmdb/tv/{tv_id}/season/{season_number}/episode/{episode_number}")
async def tmdb_get_episode(tv_id: int, season_number: int, episode_number: int):
    """Get detailed episode information from TMDB."""
    api_key = _get_tmdb_api_key()

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}/tv/{tv_id}/season/{season_number}/episode/{episode_number}",
            params={"api_key": api_key}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"TMDB API error: {response.text}"
            )

        ep = response.json()

        result = {
            "episode_number": ep.get("episode_number"),
            "season_number": ep.get("season_number"),
            "name": ep.get("name", ""),
            "overview": ep.get("overview", ""),
            "air_date": ep.get("air_date", ""),
            "runtime": ep.get("runtime"),
            "still_path": ep.get("still_path"),
            "vote_average": ep.get("vote_average"),
        }

        return {"success": True, "episode": result}

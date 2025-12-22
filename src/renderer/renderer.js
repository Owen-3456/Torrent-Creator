// ============================================
// DOM Elements
// ============================================
const backendStatus = document.getElementById("backend-status");

// Screens
const mainMenu = document.getElementById("main-menu");
const selectType = document.getElementById("select-type");
const uploadMovie = document.getElementById("upload-movie");
const torrentList = document.getElementById("torrent-list");
const movieDetails = document.getElementById("movie-details");

// Main Menu buttons
const menuCreate = document.getElementById("menu-create");
const menuEdit = document.getElementById("menu-edit");
const menuExit = document.getElementById("menu-exit");

// Type selection buttons
const typeMovie = document.getElementById("type-movie");
const typeEpisode = document.getElementById("type-episode");
const typeSeason = document.getElementById("type-season");
const typeBack = document.getElementById("type-back");

// Upload screen
const uploadBox = document.getElementById("upload-box");
const movieUploadStatus = document.getElementById("movie-upload-status");
const uploadBack = document.getElementById("upload-back");

// Torrent list screen
const torrentListContainer = document.getElementById("torrent-list-container");
const listBack = document.getElementById("list-back");

// Corner icons
const settingsIcon = document.getElementById("settings-icon");
const githubIcon = document.getElementById("github-icon");

// Settings screen
const settingsScreen = document.getElementById("settings");
const settingsClose = document.getElementById("settings-close");
const settingsCancel = document.getElementById("settings-cancel");
const settingsSave = document.getElementById("settings-save");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Settings form elements
const settingTmdbKey = document.getElementById("setting-tmdb-key");
const settingTvdbKey = document.getElementById("setting-tvdb-key");
const settingReleaseGroup = document.getElementById("setting-release-group");
const settingOutputDir = document.getElementById("setting-output-dir");
const settingTemplateMovie = document.getElementById("setting-template-movie");
const settingTemplateEpisode = document.getElementById("setting-template-episode");
const settingTemplateSeason = document.getElementById("setting-template-season");
const settingNfoNotes = document.getElementById("setting-nfo-notes");
const settingNfoNotesText = document.getElementById("setting-nfo-notes-text");
const settingAsciiArt = document.getElementById("setting-ascii-art");
const tmdbLink = document.getElementById("tmdb-link");
const tvdbLink = document.getElementById("tvdb-link");

// Template previews
const previewMovie = document.getElementById("preview-movie");
const previewEpisode = document.getElementById("preview-episode");
const previewSeason = document.getElementById("preview-season");

// Movie details screen
const torrentTree = document.getElementById("torrent-tree");
const movieDetailsForm = document.getElementById("movie-details-form");
const movieName = document.getElementById("movie-name");
const movieYear = document.getElementById("movie-year");
const movieRuntime = document.getElementById("movie-runtime");
const movieSize = document.getElementById("movie-size");
const movieLanguage = document.getElementById("movie-language");
const movieResolution = document.getElementById("movie-resolution");
const movieSource = document.getElementById("movie-source");
const movieVideoCodec = document.getElementById("movie-video-codec");
const movieAudioCodec = document.getElementById("movie-audio-codec");
const movieContainer = document.getElementById("movie-container");
const movieReleaseGroup = document.getElementById("movie-release-group");
const movieTmdbId = document.getElementById("movie-tmdb-id");
const movieImdbId = document.getElementById("movie-imdb-id");
const movieOverview = document.getElementById("movie-overview");
const movieBitDepth = document.getElementById("movie-bit-depth");
const movieHdrFormat = document.getElementById("movie-hdr-format");
const movieAudioChannels = document.getElementById("movie-audio-channels");
const detailsBack = document.getElementById("details-back");

// TMDB Search elements
const tmdbSearchInput = document.getElementById("tmdb-search-input");
const tmdbSearchBtn = document.getElementById("tmdb-search-btn");
const tmdbSearchResults = document.getElementById("tmdb-search-results");

// Track current torrent being edited
let currentTorrentFolder = null;

// ============================================
// Screen Navigation
// ============================================
const screens = [mainMenu, selectType, uploadMovie, torrentList, movieDetails];

function showScreen(screen) {
  screens.forEach((s) => (s.style.display = "none"));

  if (screen === "menu") {
    mainMenu.style.display = "flex";
  } else if (screen === "select-type") {
    selectType.style.display = "flex";
  } else if (screen === "upload") {
    uploadMovie.style.display = "flex";
    resetUploadStatus();
  } else if (screen === "torrent-list") {
    torrentList.style.display = "flex";
    loadTorrentList();
  } else if (screen === "details") {
    movieDetails.style.display = "flex";
  }
}

function resetUploadStatus() {
  movieUploadStatus.textContent = "";
  movieUploadStatus.style.color = "";
}

// ============================================
// Main Menu Event Handlers
// ============================================
menuCreate.addEventListener("click", () => {
  showScreen("select-type");
});

menuEdit.addEventListener("click", () => {
  showScreen("torrent-list");
});

menuExit.addEventListener("click", () => {
  window.close();
});

// ============================================
// Type Selection Event Handlers
// ============================================
typeMovie.addEventListener("click", () => {
  showScreen("upload");
});

typeEpisode.addEventListener("click", () => {
  alert("Single episode torrent creation is not yet implemented.");
});

typeSeason.addEventListener("click", () => {
  alert("Season pack torrent creation is not yet implemented.");
});

typeBack.addEventListener("click", () => {
  showScreen("menu");
});

// ============================================
// Upload Screen Event Handlers
// ============================================
uploadBox.addEventListener("click", async () => {
  const filepath = await window.api.selectFile();
  if (filepath) {
    handleFileUpload(filepath);
  }
});

uploadBack.addEventListener("click", () => {
  showScreen("select-type");
});

async function handleFileUpload(filepath) {
  movieUploadStatus.textContent = "Processing file...";
  movieUploadStatus.style.color = "#4a9eff";

  try {
    const response = await window.api.fetch("/parse", {
      method: "POST",
      body: JSON.stringify({ filepath: filepath }),
    });

    if (response.success) {
      movieUploadStatus.textContent = "File processed successfully!";
      movieUploadStatus.style.color = "#4ade80";
      currentTorrentFolder = response.target_folder;
      showMovieDetails(response);
    } else {
      showError(response.error || "Failed to process file.");
    }
  } catch (error) {
    showError(error.message || "An error occurred while processing the file.");
  }
}

function showError(message) {
  movieUploadStatus.textContent = "Error: " + message;
  movieUploadStatus.style.color = "#f87171";
}

// ============================================
// Torrent List Screen
// ============================================
listBack.addEventListener("click", () => {
  showScreen("menu");
});

async function loadTorrentList() {
  torrentListContainer.innerHTML = '<p class="loading">Loading...</p>';

  try {
    const response = await window.api.fetch("/torrents");

    if (response.torrents && response.torrents.length > 0) {
      torrentListContainer.innerHTML = "";

      response.torrents.forEach((torrent) => {
        const item = document.createElement("div");
        item.className = "torrent-list-item";
        item.innerHTML = `
          <div class="torrent-info">
            <span class="torrent-name">${torrent.name}</span>
            <span class="torrent-files">${torrent.file_count} file(s)</span>
          </div>
          <button class="delete-btn" title="Delete torrent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        `;

        const torrentInfo = item.querySelector(".torrent-info");
        const deleteBtn = item.querySelector(".delete-btn");

        torrentInfo.addEventListener("click", () => {
          loadTorrentDetails(torrent.path);
        });

        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          confirmDeleteTorrent(torrent);
        });

        torrentListContainer.appendChild(item);
      });
    } else {
      torrentListContainer.innerHTML = '<p class="empty">No torrents found. Create one first!</p>';
    }
  } catch (error) {
    torrentListContainer.innerHTML = `<p class="error">Error loading torrents: ${error.message}</p>`;
  }
}

async function loadTorrentDetails(folderPath) {
  try {
    const response = await window.api.fetch("/torrent-details", {
      method: "POST",
      body: JSON.stringify({ folder_path: folderPath }),
    });

    if (response.success) {
      currentTorrentFolder = folderPath;
      showMovieDetails(response);
    } else {
      alert("Failed to load torrent details: " + (response.error || "Unknown error"));
    }
  } catch (error) {
    alert("Error loading torrent details: " + error.message);
  }
}

async function confirmDeleteTorrent(torrent) {
  try {
    // Get delete capability info from backend
    const capability = await window.api.fetch("/system/delete-capability");

    const confirmMessage = `Are you sure you want to delete "${torrent.name}"?\n\n${capability.message}`;

    if (confirm(confirmMessage)) {
      await deleteTorrent(torrent);
    }
  } catch (error) {
    console.error("Failed to get delete capability:", error);
    // Fallback confirmation
    if (confirm(`Are you sure you want to delete "${torrent.name}"?`)) {
      await deleteTorrent(torrent);
    }
  }
}

async function deleteTorrent(torrent) {
  try {
    const response = await window.api.fetch("/torrent", {
      method: "DELETE",
      body: JSON.stringify({ folder_path: torrent.path }),
    });

    if (response.success) {
      // Reload the torrent list
      loadTorrentList();
    }
  } catch (error) {
    alert("Failed to delete torrent: " + error.message);
  }
}

// ============================================
// Movie Details Screen
// ============================================
detailsBack.addEventListener("click", () => {
  showScreen("menu");
});

function showMovieDetails(data) {
  showScreen("details");

  // Build the torrent tree display
  const filename = data.filename;
  const baseName = filename.replace(/\.[^.]+$/, "");

  torrentTree.textContent = [
    "~/Documents/torrents/",
    `└── ${baseName}/`,
    `    ├── ${filename}`,
    `    └── ${baseName}.NFO`,
  ].join("\n");

  // Fill form fields with parsed data
  const parsed = data.parsed || {};
  const metadata = data.metadata || {};

  movieName.value = parsed.title || baseName;
  movieYear.value = parsed.year || "";
  movieRuntime.value = metadata.duration || "";
  movieSize.value = metadata.file_size || "";
  movieLanguage.value = parsed.language || "";
  movieResolution.value = metadata.resolution || parsed.resolution || "";
  movieSource.value = parsed.source || "";
  movieVideoCodec.value = metadata.video_codec || parsed.video_codec || "";
  movieAudioCodec.value = metadata.audio_codec || parsed.audio_codec || "";
  movieContainer.value = parsed.container || "";
  movieReleaseGroup.value = parsed.release_group || "";
  movieBitDepth.value = metadata.bit_depth || "";
  movieHdrFormat.value = metadata.hdr_format || "";
  movieAudioChannels.value = metadata.audio_channels || "";
  movieTmdbId.value = "";
  movieImdbId.value = "";
  movieOverview.value = "";

  // Pre-fill TMDB search with movie name and clear previous results
  tmdbSearchInput.value = parsed.title || "";
  tmdbSearchResults.innerHTML = "";

  // Auto-select first TMDB result if we have a title
  if (parsed.title) {
    autoSelectFirstTmdbResult(parsed.title);
  }
}

movieDetailsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    name: movieName.value,
    year: movieYear.value,
    runtime: movieRuntime.value,
    size: movieSize.value,
    language: movieLanguage.value,
    resolution: movieResolution.value,
    source: movieSource.value,
    video_codec: movieVideoCodec.value,
    audio_codec: movieAudioCodec.value,
    container: movieContainer.value,
    release_group: movieReleaseGroup.value,
    tmdb_id: movieTmdbId.value,
    imdb_id: movieImdbId.value,
    overview: movieOverview.value,
  };

  console.log("Form data:", formData);
  alert("Changes saved! (Backend update not yet implemented)");
});

// ============================================
// TMDB Search
// ============================================
async function autoSelectFirstTmdbResult(query) {
  try {
    const response = await window.api.fetch("/tmdb/search", {
      method: "POST",
      body: JSON.stringify({ query: query }),
    });

    if (response.success && response.results.length > 0) {
      // Get detailed movie info for the first result
      const firstMovie = response.results[0];
      const movieResponse = await window.api.fetch(`/tmdb/movie/${firstMovie.id}`);

      if (movieResponse.success && movieResponse.movie) {
        fillMovieDetails(movieResponse.movie);
      }
    }
  } catch (error) {
    console.error("Failed to auto-select TMDB result:", error);
  }
}

tmdbSearchBtn.addEventListener("click", () => {
  performTmdbSearch();
});

tmdbSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    performTmdbSearch();
  }
});

async function performTmdbSearch() {
  const query = tmdbSearchInput.value.trim();
  if (!query) return;

  tmdbSearchBtn.disabled = true;
  tmdbSearchResults.innerHTML = '<div class="search-loading">Searching...</div>';

  try {
    const response = await window.api.fetch("/tmdb/search", {
      method: "POST",
      body: JSON.stringify({ query: query }),
    });

    if (response.success && response.results.length > 0) {
      renderSearchResults(response.results);
    } else {
      tmdbSearchResults.innerHTML = '<div class="search-empty">No movies found</div>';
    }
  } catch (error) {
    tmdbSearchResults.innerHTML = `<div class="search-error">${error.message}</div>`;
  } finally {
    tmdbSearchBtn.disabled = false;
  }
}

function renderSearchResults(results) {
  tmdbSearchResults.innerHTML = "";

  results.forEach((movie) => {
    const item = document.createElement("div");
    item.className = "search-result-item";

    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : null;

    item.innerHTML = `
      ${
        posterUrl
          ? `<img class="search-result-poster" src="${posterUrl}" alt="${movie.title}" />`
          : `<div class="search-result-poster no-poster">No Image</div>`
      }
      <div class="search-result-info">
        <div class="search-result-title">${movie.title}</div>
        <div class="search-result-meta">${movie.year || "Unknown year"}${movie.vote_average ? ` • ${movie.vote_average.toFixed(1)}/10` : ""}</div>
        ${movie.overview ? `<div class="search-result-overview">${movie.overview}</div>` : ""}
      </div>
    `;

    item.addEventListener("click", (e) => {
      selectMovie(movie.id, e.currentTarget);
    });

    tmdbSearchResults.appendChild(item);
  });
}

async function selectMovie(movieId, clickedItem) {
  // Mark selected item
  const items = tmdbSearchResults.querySelectorAll(".search-result-item");
  items.forEach((item) => item.classList.remove("selected"));
  clickedItem.classList.add("selected");

  try {
    const response = await window.api.fetch(`/tmdb/movie/${movieId}`);

    if (response.success && response.movie) {
      fillMovieDetails(response.movie);
    }
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
  }
}

function fillMovieDetails(movie) {
  movieName.value = movie.title || "";
  movieYear.value = movie.year || "";

  // Convert runtime from minutes to HH:MM:SS format
  if (movie.runtime) {
    const totalMinutes = movie.runtime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    movieRuntime.value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  } else {
    movieRuntime.value = "";
  }

  movieTmdbId.value = movie.tmdb_id || "";
  movieImdbId.value = movie.imdb_id || "";
  movieOverview.value = movie.overview || "";

  // Set language from spoken languages or original language
  if (movie.spoken_languages && movie.spoken_languages.length > 0) {
    movieLanguage.value = movie.spoken_languages[0];
  } else if (movie.original_language) {
    // Convert language code to name
    const langNames = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      ru: "Russian",
      pt: "Portuguese",
    };
    movieLanguage.value = langNames[movie.original_language] || movie.original_language;
  }
}

// ============================================
// Backend Connection Check
// ============================================
async function checkBackendConnection() {
  try {
    const data = await window.api.fetch("/health");
    if (data.status === "ok") {
      backendStatus.textContent = "Connected";
      backendStatus.className = "connected";
    } else {
      backendStatus.textContent = "Error";
      backendStatus.className = "disconnected";
    }
  } catch (error) {
    backendStatus.textContent = "Not running";
    backendStatus.className = "disconnected";
  }
}

// ============================================
// Corner Icon Handlers
// ============================================
settingsIcon.addEventListener("click", () => {
  openSettings();
});

githubIcon.addEventListener("click", () => {
  window.api.openExternal("https://github.com/Owen-3456/Torrent-Creator");
});

// ============================================
// Settings Screen
// ============================================
let originalConfig = null;
let originalAsciiArt = null;

function openSettings() {
  settingsScreen.style.display = "flex";
  loadSettings();
}

function closeSettings() {
  settingsScreen.style.display = "none";
}

settingsClose.addEventListener("click", closeSettings);
settingsCancel.addEventListener("click", closeSettings);

// Tab switching
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.dataset.tab;

    // Update button states
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Update content visibility
    tabContents.forEach((content) => {
      content.classList.remove("active");
      if (content.id === `tab-${tabId}`) {
        content.classList.add("active");
      }
    });
  });
});

// External links
tmdbLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.api.openExternal("https://www.themoviedb.org/settings/api");
});

tvdbLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.api.openExternal("https://thetvdb.com/api-information");
});

async function loadSettings() {
  try {
    const response = await window.api.fetch("/config");

    if (response.success) {
      originalConfig = response.config;
      originalAsciiArt = response.ascii_art;

      // Populate API Keys tab
      settingTmdbKey.value = originalConfig.api_keys?.tmdb || "";
      settingTvdbKey.value = originalConfig.api_keys?.tvdb || "";
      settingReleaseGroup.value = originalConfig.release_group || "";
      settingOutputDir.value = originalConfig.output_directory || "";

      // Populate Naming Templates tab
      const templates = originalConfig.naming_templates || {};
      settingTemplateMovie.value = templates.movie || "";
      settingTemplateEpisode.value = templates.episode || "";
      settingTemplateSeason.value = templates.season || "";

      // Populate NFO tab
      const nfoConfig = originalConfig.nfo || {};
      settingNfoNotes.checked = nfoConfig.include_notes !== false;
      settingNfoNotesText.value = nfoConfig.notes_template || "";
      settingAsciiArt.value = originalAsciiArt || "";

      // Update template previews
      updateTemplatePreviews();
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
}

function updateTemplatePreviews() {
  // Sample data for preview
  const sampleData = {
    title: "Movie.Name",
    year: "2024",
    quality: "1080p",
    source: "BluRay",
    codec: "x264",
    group: settingReleaseGroup.value || "GROUP",
    season: "01",
    episode: "05",
    episode_title: "Episode.Title",
  };

  // Generate preview from template
  function applyTemplate(template) {
    if (!template) return "";
    let result = template;
    result = result.replace("{title}", sampleData.title);
    result = result.replace("{year}", sampleData.year);
    result = result.replace("{quality}", sampleData.quality);
    result = result.replace("{source}", sampleData.source);
    result = result.replace("{codec}", sampleData.codec);
    result = result.replace("{group}", sampleData.group);
    result = result.replace("{season:02}", sampleData.season);
    result = result.replace("{season}", sampleData.season);
    result = result.replace("{episode:02}", sampleData.episode);
    result = result.replace("{episode}", sampleData.episode);
    result = result.replace("{episode_title}", sampleData.episode_title);
    return result;
  }

  previewMovie.textContent = applyTemplate(settingTemplateMovie.value) || "No template set";
  previewEpisode.textContent = applyTemplate(settingTemplateEpisode.value) || "No template set";
  previewSeason.textContent = applyTemplate(settingTemplateSeason.value) || "No template set";
}

// Update previews when templates change
settingTemplateMovie.addEventListener("input", updateTemplatePreviews);
settingTemplateEpisode.addEventListener("input", updateTemplatePreviews);
settingTemplateSeason.addEventListener("input", updateTemplatePreviews);
settingReleaseGroup.addEventListener("input", updateTemplatePreviews);

// Save settings
settingsSave.addEventListener("click", async () => {
  const config = {
    api_keys: {
      tmdb: settingTmdbKey.value,
      tvdb: settingTvdbKey.value,
    },
    naming_templates: {
      movie: settingTemplateMovie.value,
      episode: settingTemplateEpisode.value,
      season: settingTemplateSeason.value,
    },
    trackers: originalConfig?.trackers || [],
    output_directory: settingOutputDir.value,
    release_group: settingReleaseGroup.value,
    nfo: {
      include_notes: settingNfoNotes.checked,
      notes_template: settingNfoNotesText.value,
    },
  };

  try {
    // Save config
    const configResponse = await window.api.fetch("/config", {
      method: "POST",
      body: JSON.stringify({ config: config }),
    });

    // Save ASCII art if changed
    const asciiArt = settingAsciiArt.value;
    if (asciiArt !== originalAsciiArt) {
      await window.api.fetch("/config/ascii-art", {
        method: "POST",
        body: JSON.stringify({ ascii_art: asciiArt }),
      });
    }

    if (configResponse.success) {
      closeSettings();
    }
  } catch (error) {
    console.error("Failed to save settings:", error);
    alert("Failed to save settings: " + error.message);
  }
});

// ============================================
// Initialize
// ============================================
showScreen("menu");
checkBackendConnection();
setInterval(checkBackendConnection, 5000);

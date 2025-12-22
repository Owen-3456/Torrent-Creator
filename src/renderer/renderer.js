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
const detailsBack = document.getElementById("details-back");

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
          <span class="torrent-name">${torrent.name}</span>
          <span class="torrent-files">${torrent.file_count} file(s)</span>
        `;
        item.addEventListener("click", () => {
          loadTorrentDetails(torrent.path);
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

  movieName.value = parsed.title || baseName;
  movieYear.value = parsed.year || "";
  movieRuntime.value = "";
  movieSize.value = "";
  movieLanguage.value = parsed.language || "";
  movieResolution.value = parsed.resolution || "";
  movieSource.value = parsed.source || "";
  movieVideoCodec.value = parsed.video_codec || "";
  movieAudioCodec.value = parsed.audio_codec || "";
  movieContainer.value = parsed.container || "";
  movieReleaseGroup.value = parsed.release_group || "";
  movieTmdbId.value = "";
  movieImdbId.value = "";
  movieOverview.value = "";
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
  alert("Settings page is not yet implemented.");
});

githubIcon.addEventListener("click", () => {
  window.api.openExternal("https://github.com/Owen-3456/Torrent-Creator");
});

// ============================================
// Initialize
// ============================================
showScreen("menu");
checkBackendConnection();
setInterval(checkBackendConnection, 5000);

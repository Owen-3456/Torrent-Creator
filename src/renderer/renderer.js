// ============================================
// DOM Elements
// ============================================
const backendStatus = document.getElementById("backend-status");
const mainMenu = document.getElementById("main-menu");
const menuMovie = document.getElementById("menu-movie");
const menuEpisode = document.getElementById("menu-episode");
const menuSeason = document.getElementById("menu-season");
const menuExit = document.getElementById("menu-exit");

const uploadMovie = document.getElementById("upload-movie");
const uploadBox = document.getElementById("upload-box");
const movieUploadStatus = document.getElementById("movie-upload-status");

const movieDetails = document.getElementById("movie-details");
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

// ============================================
// Screen Navigation
// ============================================
function showScreen(screen) {
  mainMenu.style.display = "none";
  uploadMovie.style.display = "none";
  movieDetails.style.display = "none";

  if (screen === "menu") {
    mainMenu.style.display = "flex";
  } else if (screen === "upload") {
    uploadMovie.style.display = "flex";
    resetUploadStatus();
  } else if (screen === "details") {
    movieDetails.style.display = "flex";
  }
}

function resetUploadStatus() {
  movieUploadStatus.textContent = "";
  movieUploadStatus.style.color = "";
}

// ============================================
// Menu Event Handlers
// ============================================
menuMovie.addEventListener("click", () => {
  showScreen("upload");
});

menuEpisode.addEventListener("click", () => {
  alert("Single episode torrent creation is not yet implemented.");
});

menuSeason.addEventListener("click", () => {
  alert("Season pack torrent creation is not yet implemented.");
});

menuExit.addEventListener("click", () => {
  window.close();
});

// ============================================
// File Upload Handling
// ============================================
uploadBox.addEventListener("click", async () => {
  // Use native Electron file dialog
  const filepath = await window.api.selectFile();

  if (filepath) {
    handleFileUpload(filepath);
  }
});

async function handleFileUpload(filepath) {
  // Show processing status
  movieUploadStatus.textContent = "Processing file...";
  movieUploadStatus.style.color = "#4a9eff";

  try {
    // Send to backend
    const response = await window.api.fetch("/parse", {
      method: "POST",
      body: JSON.stringify({ filepath: filepath }),
    });

    if (response.success) {
      movieUploadStatus.textContent = "File processed successfully!";
      movieUploadStatus.style.color = "#4ade80";

      // Show the details screen with the response data
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
// Movie Details Display
// ============================================
function showMovieDetails(data) {
  showScreen("details");

  // Build the torrent tree display from backend response
  const filename = data.filename;
  const baseName = filename.replace(/\.[^.]+$/, "");

  torrentTree.textContent = [
    ".",
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
// Initialize
// ============================================
showScreen("menu");
checkBackendConnection();
setInterval(checkBackendConnection, 5000);

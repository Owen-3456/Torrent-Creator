// DOM Elements for new UI
const backendStatus = document.getElementById("backend-status");
const mainMenu = document.getElementById("main-menu");
const menuMovie = document.getElementById("menu-movie");
const menuEpisode = document.getElementById("menu-episode");
const menuSeason = document.getElementById("menu-season");
const menuExit = document.getElementById("menu-exit");
const settingsIcon = document.getElementById("settings-icon");
const githubIcon = document.getElementById("github-icon");

const uploadMovie = document.getElementById("upload-movie");
const uploadBox = document.getElementById("upload-box");
const movieFileInput = document.getElementById("movie-file-input");
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

function showScreen(screen) {
  // Hide all screens
  mainMenu.style.display = "none";
  uploadMovie.style.display = "none";
  movieDetails.style.display = "none";
  if (screen === "menu") {
    mainMenu.style.display = "flex";
  } else if (screen === "upload") {
    uploadMovie.style.display = "flex";
  } else if (screen === "details") {
    movieDetails.style.display = "flex";
  }
}

// Menu navigation
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

uploadBox.addEventListener("click", () => {
  movieFileInput.click();
});

movieFileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  movieUploadStatus.textContent = "Processing file...";
  console.log("Selected file:", file.path);

  try {
    // Only send filepath as required by backend
    const resp = await window.api.fetch("/parse", {
      method: "POST",
      body: JSON.stringify({ filepath: file.path }),
    });

    console.log("Backend response:", resp);

    if (resp && resp.filename) {
      movieUploadStatus.textContent = "File processed successfully!";
      showMovieDetails(resp, file);
    } else {
      movieUploadStatus.textContent = "Failed to process file - no response data.";
      console.error("Invalid response:", resp);
    }
  } catch (err) {
    movieUploadStatus.textContent = "Error: " + err.message;
    console.error("Upload error:", err);
  }
});

function showMovieDetails(data, file) {
  showScreen("details");
  // Example tree, replace with real output if available
  const base = file.name.replace(/\.[^.]+$/, "");
  torrentTree.textContent = `.` + `\n└── ${base}/` + `\n    ├── ${file.name}` + `\n    └── ${base}.NFO`;
  // Fill form fields with backend or fallback values
  const p = data.parsed || {};
  movieName.value = p.title || guessTitleFromFilename(file.name);
  movieYear.value = p.year || "";
  movieRuntime.value = p.runtime || "";
  movieSize.value = formatSize(file.size);
  movieLanguage.value = p.language || "";
  movieResolution.value = p.resolution || "";
  movieSource.value = p.source || "";
  movieVideoCodec.value = p.video_codec || p.codec || "";
  movieAudioCodec.value = p.audio_codec || "";
  movieContainer.value = p.container || "";
  movieReleaseGroup.value = p.group || "";
  movieTmdbId.value = p.tmdb_id || "";
  movieImdbId.value = p.imdb_id || "";
  movieOverview.value = p.overview || "";
}

movieDetailsForm.onsubmit = (e) => {
  e.preventDefault();
  // Gather all form data
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
  alert("Apply Edits: " + JSON.stringify(formData, null, 2));
};

// Check backend connection
async function checkBackend() {
  try {
    const data = await window.api.fetch("/health");
    if (data.status === "ok") {
      backendStatus.textContent = "Connected";
      backendStatus.className = "connected";
    }
  } catch (error) {
    backendStatus.textContent = "Not running";
    backendStatus.className = "disconnected";
  }
}

function guessTitleFromFilename(filename) {
  // Remove extension and common separators, numbers
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[._-]/g, " ")
    .replace(/\d{4}/, "")
    .trim();
}

function formatSize(bytes) {
  if (!bytes) return "";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

// Initial backend check
checkBackend();
setInterval(checkBackend, 5000);
showScreen("menu");

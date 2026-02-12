// ============================================
// DOM Elements
// ============================================
const backendStatus = document.getElementById("backend-status");

// Screens
const mainMenu = document.getElementById("main-menu");
const selectType = document.getElementById("select-type");
const uploadMovie = document.getElementById("upload-movie");
const uploadEpisode = document.getElementById("upload-episode");
const torrentList = document.getElementById("torrent-list");
const movieDetails = document.getElementById("movie-details");
const episodeDetails = document.getElementById("episode-details");

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

// Episode upload screen
const episodeUploadBox = document.getElementById("episode-upload-box");
const episodeUploadStatus = document.getElementById("episode-upload-status");
const episodeUploadBack = document.getElementById("episode-upload-back");

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

// Tracker settings elements
const trackerList = document.getElementById("tracker-list");
const trackerNewInput = document.getElementById("tracker-new-input");
const trackerAddBtn = document.getElementById("tracker-add-btn");
let settingTrackers = [];

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

// Episode details screen
const episodeTorrentTree = document.getElementById("episode-torrent-tree");
const episodeDetailsForm = document.getElementById("episode-details-form");
const episodeShowName = document.getElementById("episode-show-name");
const episodeSeason = document.getElementById("episode-season");
const episodeEpisode = document.getElementById("episode-episode");
const episodeTitle = document.getElementById("episode-title");
const episodeYear = document.getElementById("episode-year");
const episodeRuntime = document.getElementById("episode-runtime");
const episodeSize = document.getElementById("episode-size");
const episodeLanguage = document.getElementById("episode-language");
const episodeResolution = document.getElementById("episode-resolution");
const episodeSource = document.getElementById("episode-source");
const episodeVideoCodec = document.getElementById("episode-video-codec");
const episodeAudioCodec = document.getElementById("episode-audio-codec");
const episodeContainer = document.getElementById("episode-container");
const episodeReleaseGroup = document.getElementById("episode-release-group");
const episodeTmdbId = document.getElementById("episode-tmdb-id");
const episodeImdbId = document.getElementById("episode-imdb-id");
const episodeOverview = document.getElementById("episode-overview");
const episodeBitDepth = document.getElementById("episode-bit-depth");
const episodeHdrFormat = document.getElementById("episode-hdr-format");
const episodeAudioChannels = document.getElementById("episode-audio-channels");
const episodeDetailsBack = document.getElementById("episode-details-back");

// TMDB TV Search elements
const tmdbTvSearchInput = document.getElementById("tmdb-tv-search-input");
const tmdbTvSearchBtn = document.getElementById("tmdb-tv-search-btn");
const tmdbTvSearchResults = document.getElementById("tmdb-tv-search-results");
const tmdbEpisodePicker = document.getElementById("tmdb-episode-picker");
const tmdbSeasonSelect = document.getElementById("tmdb-season-select");
const tmdbEpisodeSelect = document.getElementById("tmdb-episode-select");

// Track selected TV show for episode picker
let selectedTvShowId = null;
let selectedTvShowData = null;

// Torrent preview screen
const torrentPreview = document.getElementById("torrent-preview");
const previewClose = document.getElementById("preview-close");
const previewCancel = document.getElementById("preview-cancel");
const previewConfirm = document.getElementById("preview-confirm");
const previewFileTree = document.getElementById("preview-file-tree");
const previewNfoContent = document.getElementById("preview-nfo-content");

// Torrent success screen
const torrentSuccess = document.getElementById("torrent-success");
const successTorrentName = document.getElementById("success-torrent-name");
const successOpenFolder = document.getElementById("success-open-folder");
const successDone = document.getElementById("success-done");

// TMDB Search elements
const tmdbSearchInput = document.getElementById("tmdb-search-input");
const tmdbSearchBtn = document.getElementById("tmdb-search-btn");
const tmdbSearchResults = document.getElementById("tmdb-search-results");

// Track current torrent being edited
let currentTorrentFolder = null;
let cachedOutputDir = "~/Documents/torrents";
let cachedReleaseGroup = "GROUP";

// Default values for revert functionality
let fieldDefaults = {};

// List of tracked form field IDs
const revertableFieldIds = [
  "movie-name", "movie-year", "movie-runtime", "movie-size",
  "movie-language", "movie-resolution", "movie-source",
  "movie-video-codec", "movie-audio-codec", "movie-container",
  "movie-release-group", "movie-bit-depth", "movie-hdr-format",
  "movie-audio-channels", "movie-tmdb-id", "movie-imdb-id", "movie-overview",
  "episode-show-name", "episode-season", "episode-episode", "episode-title",
  "episode-year", "episode-runtime", "episode-size",
  "episode-language", "episode-resolution", "episode-source",
  "episode-video-codec", "episode-audio-codec", "episode-container",
  "episode-release-group", "episode-bit-depth", "episode-hdr-format",
  "episode-audio-channels", "episode-tmdb-id", "episode-imdb-id", "episode-overview",
];

// Guessit source -> dropdown value mapping
const sourceNormalization = {
  "blu-ray": "BluRay",
  "bluray": "BluRay",
  "bd": "BluRay",
  "remux": "Remux",
  "web-dl": "WEB-DL",
  "web dl": "WEB-DL",
  "webdl": "WEB-DL",
  "web": "WEB-DL",
  "webrip": "WEBRip",
  "web-rip": "WEBRip",
  "hdtv": "HDTV",
  "hdtvrip": "HDTVRip",
  "hdtv-rip": "HDTVRip",
  "bdrip": "BDRip",
  "bd-rip": "BDRip",
  "brrip": "BDRip",
  "dvdrip": "DVDRip",
  "dvd-rip": "DVDRip",
  "dvd": "DVD",
  "cam": "CAM",
  "hdcam": "CAM",
};

function normalizeSource(raw) {
  if (!raw) return "";
  const key = raw.toLowerCase().trim();
  return sourceNormalization[key] || raw;
}

// IDs of select elements that support a Custom option
const customDropdownIds = [
  "movie-language", "movie-resolution", "movie-source",
  "movie-video-codec", "movie-audio-codec", "movie-container",
  "movie-bit-depth", "movie-hdr-format", "movie-audio-channels",
  "episode-language", "episode-resolution", "episode-source",
  "episode-video-codec", "episode-audio-codec", "episode-container",
  "episode-bit-depth", "episode-hdr-format", "episode-audio-channels",
];

/**
 * Sets a <select> value, handling the __custom option.
 * If the value matches an existing option, select it.
 * If not (and not empty), select __custom and show the custom input pre-filled.
 */
function setSelectValue(selectEl, value) {
  if (!selectEl || !value) {
    if (selectEl) selectEl.value = "";
    hideCustomInput(selectEl);
    return;
  }
  // Check if value matches an existing option (excluding __custom)
  const options = Array.from(selectEl.options);
  const match = options.find((o) => o.value === value && o.value !== "__custom");
  if (match) {
    selectEl.value = value;
    hideCustomInput(selectEl);
  } else {
    // Value is not in the list — use custom
    selectEl.value = "__custom";
    showCustomInput(selectEl, value);
  }
}

/**
 * Gets the real value from a select, resolving __custom to the custom input value.
 */
function getSelectValue(selectEl) {
  if (!selectEl) return "";
  if (selectEl.value === "__custom") {
    const wrapper = selectEl.closest(".field-input-wrapper") || selectEl.parentNode;
    const customInput = wrapper?.querySelector(".custom-input");
    return customInput ? customInput.value.trim() : "";
  }
  return selectEl.value;
}

function showCustomInput(selectEl, value) {
  const wrapper = selectEl.closest(".field-input-wrapper") || selectEl.parentNode;
  if (!wrapper) return;
  let customInput = wrapper.querySelector(".custom-input");
  if (!customInput) {
    customInput = document.createElement("input");
    customInput.type = "text";
    customInput.className = "custom-input";
    customInput.placeholder = "Enter custom value...";
    // Insert after the select
    selectEl.after(customInput);

    // Propagate input events for revert button tracking
    customInput.addEventListener("input", () => {
      const id = selectEl.id;
      if (id) updateRevertButton(id);
    });
  }
  customInput.value = value || "";
  customInput.style.display = "";
}

function hideCustomInput(selectEl) {
  const wrapper = selectEl.closest(".field-input-wrapper") || selectEl.parentNode;
  if (!wrapper) return;
  const customInput = wrapper.querySelector(".custom-input");
  if (customInput) {
    customInput.style.display = "none";
    customInput.value = "";
  }
}

// ============================================
// Input Validation (Year, Runtime, TMDB ID)
// ============================================

// Year: only digits
function enforceNumericInput(inputEl) {
  inputEl.addEventListener("input", () => {
    inputEl.value = inputEl.value.replace(/[^0-9]/g, "");
  });
  inputEl.addEventListener("keydown", (e) => {
    // Allow control keys
    if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  });
}

// Runtime: enforce HH:MM:SS format with auto-formatting
function enforceTimeInput(inputEl) {
  inputEl.addEventListener("input", () => {
    // Strip non-digits and non-colons
    let raw = inputEl.value.replace(/[^0-9:]/g, "");
    // Auto-insert colons: user types digits, we format as HH:MM:SS
    const digits = raw.replace(/:/g, "");
    if (digits.length <= 2) {
      inputEl.value = digits;
    } else if (digits.length <= 4) {
      inputEl.value = digits.slice(0, 2) + ":" + digits.slice(2);
    } else {
      inputEl.value = digits.slice(0, 2) + ":" + digits.slice(2, 4) + ":" + digits.slice(4, 6);
    }
  });
  inputEl.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
    if (!/[0-9:]/.test(e.key)) e.preventDefault();
    // Prevent input beyond HH:MM:SS (8 chars)
    if (inputEl.value.length >= 8 && inputEl.selectionStart === inputEl.selectionEnd && /[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });
}

// ============================================
// Screen Navigation
// ============================================
const screens = [mainMenu, selectType, uploadMovie, uploadEpisode, torrentList, movieDetails, episodeDetails, torrentSuccess];

function showScreen(screen) {
  screens.forEach((s) => (s.style.display = "none"));

  if (screen === "menu") {
    mainMenu.style.display = "flex";
  } else if (screen === "select-type") {
    selectType.style.display = "flex";
  } else if (screen === "upload") {
    uploadMovie.style.display = "flex";
    resetUploadStatus();
  } else if (screen === "upload-episode") {
    uploadEpisode.style.display = "flex";
    resetEpisodeUploadStatus();
  } else if (screen === "torrent-list") {
    torrentList.style.display = "flex";
    loadTorrentList();
  } else if (screen === "details") {
    movieDetails.style.display = "flex";
  } else if (screen === "episode-details") {
    episodeDetails.style.display = "flex";
  } else if (screen === "success") {
    torrentSuccess.style.display = "flex";
  }
}

function resetUploadStatus() {
  movieUploadStatus.textContent = "";
  movieUploadStatus.style.color = "";
}

function resetEpisodeUploadStatus() {
  episodeUploadStatus.textContent = "";
  episodeUploadStatus.style.color = "";
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

// Episode and Season buttons are disabled in HTML with "Coming Soon" badges
typeEpisode.addEventListener("click", () => {
  showScreen("upload-episode");
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

// ============================================
// Episode Upload Screen Event Handlers
// ============================================
episodeUploadBox.addEventListener("click", async () => {
  const filepath = await window.api.selectFile();
  if (filepath) {
    handleEpisodeFileUpload(filepath);
  }
});

episodeUploadBack.addEventListener("click", () => {
  showScreen("select-type");
});

async function handleEpisodeFileUpload(filepath) {
  episodeUploadStatus.textContent = "Processing file...";
  episodeUploadStatus.style.color = "var(--accent-primary)";

  try {
    const response = await window.api.fetch("/parse", {
      method: "POST",
      body: JSON.stringify({ filepath: filepath }),
    });

    if (response.success) {
      episodeUploadStatus.textContent = "File processed successfully!";
      episodeUploadStatus.style.color = "var(--success)";
      currentTorrentFolder = response.target_folder;
      showEpisodeDetails(response);
    } else {
      episodeUploadStatus.textContent = "Error: " + (response.error || "Failed to process file.");
      episodeUploadStatus.style.color = "var(--error)";
    }
  } catch (error) {
    episodeUploadStatus.textContent = "Error: " + (error.message || "An error occurred while processing the file.");
    episodeUploadStatus.style.color = "var(--error)";
  }
}

async function handleFileUpload(filepath) {
  movieUploadStatus.textContent = "Processing file...";
  movieUploadStatus.style.color = "var(--accent-primary)";

  try {
    const response = await window.api.fetch("/parse", {
      method: "POST",
      body: JSON.stringify({ filepath: filepath }),
    });

    if (response.success) {
      movieUploadStatus.textContent = "File processed successfully!";
      movieUploadStatus.style.color = "var(--success)";
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
  movieUploadStatus.style.color = "var(--error)";
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
      if (response.media_type === "episode") {
        showEpisodeDetails(response);
      } else {
        showMovieDetails(response);
      }
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

function snapshotFieldDefaults() {
  fieldDefaults = {};
  revertableFieldIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    // For custom dropdowns, store the resolved value (not "__custom")
    if (customDropdownIds.includes(id)) {
      fieldDefaults[id] = getSelectValue(el);
    } else {
      fieldDefaults[id] = el.value;
    }
  });
  // After snapshotting, update all revert button visibility
  updateAllRevertButtons();
}

function showMovieDetails(data) {
  currentMediaType = "movie";
  showScreen("details");

  // Build the torrent tree display
  const filename = data.filename;
  const baseName = filename.replace(/\.[^.]+$/, "");

  torrentTree.textContent = [
    `${cachedOutputDir}/`,
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
  setSelectValue(movieLanguage, parsed.language || "");
  setSelectValue(movieResolution, metadata.resolution || parsed.resolution || "");
  setSelectValue(movieSource, normalizeSource(parsed.source));
  setSelectValue(movieVideoCodec, metadata.video_codec || parsed.video_codec || "");
  setSelectValue(movieAudioCodec, metadata.audio_codec || parsed.audio_codec || "");
  setSelectValue(movieContainer, (parsed.container || "").toUpperCase());
  movieReleaseGroup.value = parsed.release_group || cachedReleaseGroup;
  setSelectValue(movieBitDepth, metadata.bit_depth || "");
  setSelectValue(movieHdrFormat, metadata.hdr_format || "");
  setSelectValue(movieAudioChannels, metadata.audio_channels || "");
  movieTmdbId.value = "";
  movieImdbId.value = "";
  movieOverview.value = "";

  // Inject revert buttons into form fields
  injectRevertButtons();

  // Snapshot defaults before TMDB overwrites (will be re-snapshotted after TMDB)
  snapshotFieldDefaults();

  // Pre-fill TMDB search with movie name and clear previous results
  tmdbSearchInput.value = parsed.title || "";
  tmdbSearchResults.innerHTML = "";

  // Auto-select first TMDB result if we have a title
  if (parsed.title) {
    autoSelectFirstTmdbResult(parsed.title);
  }
}

// Collect form data into an object (used by preview and create)
function collectFormData() {
  return {
    folder_path: currentTorrentFolder,
    name: movieName.value,
    year: movieYear.value,
    runtime: movieRuntime.value,
    size: movieSize.value,
    language: getSelectValue(movieLanguage),
    resolution: getSelectValue(movieResolution),
    source: getSelectValue(movieSource),
    video_codec: getSelectValue(movieVideoCodec),
    audio_codec: getSelectValue(movieAudioCodec),
    container: getSelectValue(movieContainer),
    release_group: movieReleaseGroup.value,
    tmdb_id: movieTmdbId.value,
    imdb_id: movieImdbId.value,
    overview: movieOverview.value,
    bit_depth: getSelectValue(movieBitDepth),
    hdr_format: getSelectValue(movieHdrFormat),
    audio_channels: getSelectValue(movieAudioChannels),
  };
}

// Store form data for the confirm step
let pendingTorrentData = null;

movieDetailsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = collectFormData();
  const submitBtn = movieDetailsForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Loading preview...";

  try {
    const response = await window.api.fetch("/preview-torrent", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (response.success) {
      pendingTorrentData = formData;
      currentMediaType = "movie";
      showTorrentPreview(response);
    } else {
      alert("Failed to generate preview: " + (response.detail || "Unknown error"));
    }
  } catch (error) {
    alert("Error generating preview: " + error.message);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// ============================================
// Episode Details Screen
// ============================================
episodeDetailsBack.addEventListener("click", () => {
  showScreen("menu");
});

// Track the current media type for preview/create routing
let currentMediaType = "movie";

function showEpisodeDetails(data) {
  currentMediaType = "episode";
  showScreen("episode-details");

  const filename = data.filename;
  const baseName = filename.replace(/\.[^.]+$/, "");

  episodeTorrentTree.textContent = [
    `${cachedOutputDir}/`,
    `└── ${baseName}/`,
    `    ├── ${filename}`,
    `    └── ${baseName}.NFO`,
  ].join("\n");

  const parsed = data.parsed || {};
  const metadata = data.metadata || {};

  episodeShowName.value = parsed.title || baseName;
  episodeSeason.value = parsed.season || "";
  episodeEpisode.value = parsed.episode || "";
  episodeTitle.value = parsed.episode_title || "";
  episodeYear.value = parsed.year || "";
  episodeRuntime.value = metadata.duration || "";
  episodeSize.value = metadata.file_size || "";
  setSelectValue(episodeLanguage, parsed.language || "");
  setSelectValue(episodeResolution, metadata.resolution || parsed.resolution || "");
  setSelectValue(episodeSource, normalizeSource(parsed.source));
  setSelectValue(episodeVideoCodec, metadata.video_codec || parsed.video_codec || "");
  setSelectValue(episodeAudioCodec, metadata.audio_codec || parsed.audio_codec || "");
  setSelectValue(episodeContainer, (parsed.container || "").toUpperCase());
  episodeReleaseGroup.value = parsed.release_group || cachedReleaseGroup;
  setSelectValue(episodeBitDepth, metadata.bit_depth || "");
  setSelectValue(episodeHdrFormat, metadata.hdr_format || "");
  setSelectValue(episodeAudioChannels, metadata.audio_channels || "");
  episodeTmdbId.value = "";
  episodeImdbId.value = "";
  episodeOverview.value = "";

  // Inject revert buttons
  injectRevertButtons();
  snapshotFieldDefaults();

  // Reset TMDB TV search state
  tmdbTvSearchInput.value = parsed.title || "";
  tmdbTvSearchResults.innerHTML = "";
  tmdbEpisodePicker.style.display = "none";
  selectedTvShowId = null;
  selectedTvShowData = null;

  // Auto-search if we have a title
  if (parsed.title) {
    autoSelectFirstTvResult(parsed.title);
  }
}

function collectEpisodeFormData() {
  return {
    folder_path: currentTorrentFolder,
    name: episodeShowName.value,
    show_name: episodeShowName.value,
    season: parseInt(episodeSeason.value) || 0,
    episode: parseInt(episodeEpisode.value) || 0,
    episode_title: episodeTitle.value,
    year: episodeYear.value,
    runtime: episodeRuntime.value,
    size: episodeSize.value,
    language: getSelectValue(episodeLanguage),
    resolution: getSelectValue(episodeResolution),
    source: getSelectValue(episodeSource),
    video_codec: getSelectValue(episodeVideoCodec),
    audio_codec: getSelectValue(episodeAudioCodec),
    container: getSelectValue(episodeContainer),
    release_group: episodeReleaseGroup.value,
    tmdb_id: episodeTmdbId.value,
    imdb_id: episodeImdbId.value,
    overview: episodeOverview.value,
    bit_depth: getSelectValue(episodeBitDepth),
    hdr_format: getSelectValue(episodeHdrFormat),
    audio_channels: getSelectValue(episodeAudioChannels),
  };
}

episodeDetailsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = collectEpisodeFormData();
  const submitBtn = episodeDetailsForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Loading preview...";

  try {
    const response = await window.api.fetch("/preview-episode-torrent", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (response.success) {
      pendingTorrentData = formData;
      currentMediaType = "episode";
      showTorrentPreview(response);
    } else {
      alert("Failed to generate preview: " + (response.detail || "Unknown error"));
    }
  } catch (error) {
    alert("Error generating preview: " + error.message);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// ============================================
// TMDB TV Search
// ============================================
tmdbTvSearchBtn.addEventListener("click", () => {
  performTmdbTvSearch();
});

tmdbTvSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    performTmdbTvSearch();
  }
});

async function performTmdbTvSearch() {
  const query = tmdbTvSearchInput.value.trim();
  if (!query) return;

  tmdbTvSearchBtn.disabled = true;
  tmdbTvSearchResults.innerHTML = '<div class="search-loading">Searching...</div>';
  tmdbEpisodePicker.style.display = "none";

  try {
    const response = await window.api.fetch("/tmdb/search-tv", {
      method: "POST",
      body: JSON.stringify({ query: query }),
    });

    if (response.success && response.results.length > 0) {
      renderTvSearchResults(response.results);
    } else {
      tmdbTvSearchResults.innerHTML = '<div class="search-empty">No TV shows found</div>';
    }
  } catch (error) {
    tmdbTvSearchResults.innerHTML = `<div class="search-error">${error.message}</div>`;
  } finally {
    tmdbTvSearchBtn.disabled = false;
  }
}

function renderTvSearchResults(results) {
  tmdbTvSearchResults.innerHTML = "";

  results.forEach((show) => {
    const item = document.createElement("div");
    item.className = "search-result-item";

    const posterUrl = show.poster_path
      ? `https://image.tmdb.org/t/p/w92${show.poster_path}`
      : null;

    item.innerHTML = `
      ${
        posterUrl
          ? `<img class="search-result-poster" src="${posterUrl}" alt="${show.name}" />`
          : `<div class="search-result-poster no-poster">No Image</div>`
      }
      <div class="search-result-info">
        <div class="search-result-title">${show.name}</div>
        <div class="search-result-meta">${show.year || "Unknown year"}${show.vote_average ? ` • ${show.vote_average.toFixed(1)}/10` : ""}</div>
        ${show.overview ? `<div class="search-result-overview">${show.overview}</div>` : ""}
      </div>
    `;

    item.addEventListener("click", (e) => {
      selectTvShow(show.id, e.currentTarget);
    });

    tmdbTvSearchResults.appendChild(item);
  });
}

async function selectTvShow(tvId, clickedItem) {
  // Mark selected item
  const items = tmdbTvSearchResults.querySelectorAll(".search-result-item");
  items.forEach((item) => item.classList.remove("selected"));
  clickedItem.classList.add("selected");

  try {
    const response = await window.api.fetch(`/tmdb/tv/${tvId}`);

    if (response.success && response.show) {
      selectedTvShowId = tvId;
      selectedTvShowData = response.show;
      fillTvShowDetails(response.show);
      showEpisodePicker(response.show);
    }
  } catch (error) {
    console.error("Failed to fetch TV show details:", error);
  }
}

function fillTvShowDetails(show) {
  episodeShowName.value = show.name || "";
  episodeYear.value = show.year || "";
  episodeTmdbId.value = show.tmdb_id || "";
  episodeImdbId.value = show.imdb_id || "";

  // Set language from spoken languages or original language
  if (show.spoken_languages && show.spoken_languages.length > 0) {
    setSelectValue(episodeLanguage, show.spoken_languages[0]);
  } else if (show.original_language) {
    const langNames = {
      en: "English", es: "Spanish", fr: "French", de: "German",
      it: "Italian", ja: "Japanese", ko: "Korean", zh: "Chinese",
      ru: "Russian", pt: "Portuguese",
    };
    setSelectValue(episodeLanguage, langNames[show.original_language] || show.original_language);
  }

  snapshotFieldDefaults();
}

function showEpisodePicker(show) {
  tmdbEpisodePicker.style.display = "";

  // Populate season dropdown
  tmdbSeasonSelect.innerHTML = '<option value="">-- Select Season --</option>';
  tmdbEpisodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';

  if (show.seasons && show.seasons.length > 0) {
    show.seasons.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.season_number;
      opt.textContent = `Season ${s.season_number} (${s.episode_count} episodes)`;
      tmdbSeasonSelect.appendChild(opt);
    });

    // Auto-select season if parsed
    const currentSeason = episodeSeason.value;
    if (currentSeason) {
      tmdbSeasonSelect.value = currentSeason;
      loadSeasonEpisodes(show.id || selectedTvShowId, parseInt(currentSeason));
    }
  }
}

tmdbSeasonSelect.addEventListener("change", () => {
  const seasonNum = tmdbSeasonSelect.value;
  if (seasonNum && selectedTvShowId) {
    episodeSeason.value = seasonNum;
    loadSeasonEpisodes(selectedTvShowId, parseInt(seasonNum));
  }
});

async function loadSeasonEpisodes(tvId, seasonNumber) {
  tmdbEpisodeSelect.innerHTML = '<option value="">Loading...</option>';

  try {
    const response = await window.api.fetch(`/tmdb/tv/${tvId}/season/${seasonNumber}`);

    if (response.success && response.episodes) {
      tmdbEpisodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';
      response.episodes.forEach((ep) => {
        const opt = document.createElement("option");
        opt.value = ep.episode_number;
        opt.textContent = `E${String(ep.episode_number).padStart(2, "0")} - ${ep.name || "Untitled"}`;
        tmdbEpisodeSelect.appendChild(opt);
      });

      // Auto-select episode if parsed
      const currentEpisode = episodeEpisode.value;
      if (currentEpisode) {
        tmdbEpisodeSelect.value = currentEpisode;
        if (tmdbEpisodeSelect.value === currentEpisode) {
          loadEpisodeDetails(tvId, seasonNumber, parseInt(currentEpisode));
        }
      }
    }
  } catch (error) {
    console.error("Failed to load season episodes:", error);
    tmdbEpisodeSelect.innerHTML = '<option value="">Failed to load</option>';
  }
}

tmdbEpisodeSelect.addEventListener("change", () => {
  const episodeNum = tmdbEpisodeSelect.value;
  const seasonNum = tmdbSeasonSelect.value;
  if (episodeNum && seasonNum && selectedTvShowId) {
    episodeEpisode.value = episodeNum;
    loadEpisodeDetails(selectedTvShowId, parseInt(seasonNum), parseInt(episodeNum));
  }
});

async function loadEpisodeDetails(tvId, seasonNumber, episodeNumber) {
  try {
    const response = await window.api.fetch(`/tmdb/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);

    if (response.success && response.episode) {
      const ep = response.episode;
      episodeTitle.value = ep.name || "";
      episodeOverview.value = ep.overview || "";

      // Only overwrite runtime if we don't already have a precise ffprobe value
      const currentRuntime = episodeRuntime.value.trim();
      if (!currentRuntime && ep.runtime) {
        const totalMinutes = ep.runtime;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        episodeRuntime.value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
      }

      snapshotFieldDefaults();
    }
  } catch (error) {
    console.error("Failed to load episode details:", error);
  }
}

async function autoSelectFirstTvResult(query) {
  try {
    const response = await window.api.fetch("/tmdb/search-tv", {
      method: "POST",
      body: JSON.stringify({ query: query }),
    });

    if (response.success && response.results.length > 0) {
      const firstShow = response.results[0];
      const showResponse = await window.api.fetch(`/tmdb/tv/${firstShow.id}`);

      if (showResponse.success && showResponse.show) {
        selectedTvShowId = firstShow.id;
        selectedTvShowData = showResponse.show;
        fillTvShowDetails(showResponse.show);
        showEpisodePicker(showResponse.show);
      }
    }
  } catch (error) {
    console.error("Failed to auto-select TV result:", error);
  }
}

// ============================================
// Torrent Preview Screen
// ============================================
function showTorrentPreview(preview) {
  torrentPreview.style.display = "flex";

  // Build the file tree
  const baseName = preview.base_name;
  const outputDir = preview.output_dir || cachedOutputDir;
  const lines = [
    `${outputDir}/`,
    `└── ${baseName}/`,
  ];
  preview.files.forEach((file, i) => {
    const connector = i < preview.files.length - 1 ? "├──" : "└──";
    lines.push(`    ${connector} ${file.name}`);
  });
  lines.push("");
  lines.push(`${outputDir}/`);
  lines.push(`└── ${preview.torrent_name}`);

  previewFileTree.textContent = lines.join("\n");

  // Show the NFO content
  previewNfoContent.textContent = preview.nfo_content;

  // Show warnings if any
  const existingWarnings = document.getElementById("preview-warnings");
  if (existingWarnings) existingWarnings.remove();

  if (preview.warnings && preview.warnings.length > 0) {
    const warningDiv = document.createElement("div");
    warningDiv.id = "preview-warnings";
    warningDiv.className = "preview-warnings";
    warningDiv.innerHTML = preview.warnings
      .map((w) => `<div class="preview-warning-item">${w}</div>`)
      .join("");
    // Insert before the NFO section
    const previewContent = document.querySelector(".preview-content");
    if (previewContent) {
      previewContent.insertBefore(warningDiv, previewContent.firstChild);
    }
  }
}

function closeTorrentPreview() {
  torrentPreview.style.display = "none";
  pendingTorrentData = null;
}

previewClose.addEventListener("click", closeTorrentPreview);
previewCancel.addEventListener("click", closeTorrentPreview);

// Track the torrent file path for the success screen
let lastTorrentFilePath = null;

previewConfirm.addEventListener("click", async () => {
  if (!pendingTorrentData) return;

  previewConfirm.disabled = true;
  previewConfirm.textContent = "Creating torrent...";

  try {
    const createEndpoint = currentMediaType === "episode" ? "/create-episode-torrent" : "/create-torrent";
    const response = await window.api.fetch(createEndpoint, {
      method: "POST",
      body: JSON.stringify(pendingTorrentData),
    });

    if (response.success) {
      // Store info for the success screen
      lastTorrentFilePath = response.torrent_file;
      const displayName = response.new_base_name.replace(/\./g, " ");

      // Reset preview button state
      previewConfirm.textContent = "Create Torrent";
      previewConfirm.style.background = "";
      previewConfirm.disabled = false;

      // Close the preview overlay and navigate to the success screen
      torrentPreview.style.display = "none";
      pendingTorrentData = null;
      showTorrentSuccess(displayName);
    } else {
      alert("Failed to create torrent: " + (response.detail || "Unknown error"));
      previewConfirm.textContent = "Create Torrent";
      previewConfirm.disabled = false;
    }
  } catch (error) {
    alert("Error creating torrent: " + error.message);
    previewConfirm.textContent = "Create Torrent";
    previewConfirm.disabled = false;
  }
});

// ============================================
// Torrent Success Screen
// ============================================
function showTorrentSuccess(displayName) {
  successTorrentName.textContent = displayName;
  showScreen("success");
}

successOpenFolder.addEventListener("click", () => {
  if (lastTorrentFilePath) {
    window.api.showItemInFolder(lastTorrentFilePath);
  }
});

successDone.addEventListener("click", () => {
  lastTorrentFilePath = null;
  showScreen("menu");
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

  // Only overwrite runtime if we don't already have a precise ffprobe value
  const currentRuntime = movieRuntime.value.trim();
  if (!currentRuntime) {
    if (movie.runtime) {
      const totalMinutes = movie.runtime;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      movieRuntime.value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
    }
  }

  movieTmdbId.value = movie.tmdb_id || "";
  movieImdbId.value = movie.imdb_id || "";
  movieOverview.value = movie.overview || "";

  // Set language from spoken languages or original language
  if (movie.spoken_languages && movie.spoken_languages.length > 0) {
    setSelectValue(movieLanguage, movie.spoken_languages[0]);
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
    setSelectValue(movieLanguage, langNames[movie.original_language] || movie.original_language);
  }

  // Re-snapshot defaults after TMDB data merges in
  snapshotFieldDefaults();
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
      cachedOutputDir = originalConfig.output_directory || "~/Documents/torrents";
      cachedReleaseGroup = originalConfig.release_group || "GROUP";

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

      // Populate Trackers tab
      settingTrackers = [...(originalConfig.trackers || [])];
      renderTrackerList();

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
    result = result.replaceAll("{title}", sampleData.title);
    result = result.replaceAll("{year}", sampleData.year);
    result = result.replaceAll("{quality}", sampleData.quality);
    result = result.replaceAll("{source}", sampleData.source);
    result = result.replaceAll("{codec}", sampleData.codec);
    result = result.replaceAll("{group}", sampleData.group);
    result = result.replaceAll("{season:02}", sampleData.season);
    result = result.replaceAll("{season}", sampleData.season);
    result = result.replaceAll("{episode:02}", sampleData.episode);
    result = result.replaceAll("{episode}", sampleData.episode);
    result = result.replaceAll("{episode_title}", sampleData.episode_title);
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

// ============================================
// Tracker List Management
// ============================================
function renderTrackerList() {
  trackerList.innerHTML = "";

  if (settingTrackers.length === 0) {
    trackerList.innerHTML = '<div class="tracker-empty">No trackers added yet.</div>';
    return;
  }

  settingTrackers.forEach((url, index) => {
    const item = document.createElement("div");
    item.className = "tracker-item";
    item.innerHTML = `
      <span class="tracker-url">${url}</span>
      <button type="button" class="tracker-remove-btn" title="Remove tracker">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    item.querySelector(".tracker-remove-btn").addEventListener("click", () => {
      settingTrackers.splice(index, 1);
      renderTrackerList();
    });

    trackerList.appendChild(item);
  });
}

function addTracker() {
  const url = trackerNewInput.value.trim();
  if (!url) return;

  // Avoid duplicates
  if (settingTrackers.includes(url)) {
    trackerNewInput.value = "";
    return;
  }

  settingTrackers.push(url);
  trackerNewInput.value = "";
  renderTrackerList();
}

trackerAddBtn.addEventListener("click", addTracker);
trackerNewInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTracker();
  }
});

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
    trackers: [...settingTrackers],
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

// Wire up input validation
enforceNumericInput(movieYear);
enforceTimeInput(movieRuntime);
enforceNumericInput(movieTmdbId);
enforceNumericInput(episodeYear);
enforceNumericInput(episodeSeason);
enforceNumericInput(episodeEpisode);
enforceTimeInput(episodeRuntime);
enforceNumericInput(episodeTmdbId);

// ============================================
// Revert Button System
// ============================================
const revertSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`;

function injectRevertButtons() {
  revertableFieldIds.forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    const label = field.closest("label");
    if (!label || label.querySelector(".revert-btn")) return;

    // Wrap the input/select/textarea in a container for positioning
    const wrapper = document.createElement("div");
    wrapper.className = "field-input-wrapper";
    field.parentNode.insertBefore(wrapper, field);
    wrapper.appendChild(field);

    // Create the revert button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "revert-btn";
    btn.title = "Revert to default";
    btn.innerHTML = revertSvg;
    btn.style.display = "none";
    wrapper.appendChild(btn);

    // Click handler: restore default
    btn.addEventListener("click", () => {
      if (fieldDefaults[id] !== undefined) {
        if (customDropdownIds.includes(id)) {
          setSelectValue(field, fieldDefaults[id]);
        } else {
          field.value = fieldDefaults[id];
        }
        btn.style.display = "none";
      }
    });

    // Listen for user changes on this field
    const eventType = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventType, () => {
      // For selects with custom, show/hide the custom input
      if (field.tagName === "SELECT" && customDropdownIds.includes(id)) {
        if (field.value === "__custom") {
          showCustomInput(field, "");
        } else {
          hideCustomInput(field);
        }
      }
      updateRevertButton(id);
    });
  });
}

function updateRevertButton(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const wrapper = field.closest(".field-input-wrapper");
  if (!wrapper) return;
  const btn = wrapper.querySelector(".revert-btn");
  if (!btn) return;

  const defaultVal = fieldDefaults[fieldId];
  // Get the current effective value
  let currentVal;
  if (customDropdownIds.includes(fieldId)) {
    currentVal = getSelectValue(field);
  } else {
    currentVal = field.value;
  }

  if (defaultVal !== undefined && currentVal !== defaultVal) {
    btn.style.display = "flex";
  } else {
    btn.style.display = "none";
  }
}

function updateAllRevertButtons() {
  revertableFieldIds.forEach((id) => updateRevertButton(id));
}

// Load config values on startup
(async () => {
  try {
    const response = await window.api.fetch("/config");
    if (response.success) {
      if (response.config.output_directory) {
        cachedOutputDir = response.config.output_directory;
      }
      if (response.config.release_group) {
        cachedReleaseGroup = response.config.release_group;
      }
    }
  } catch {
    // Backend may not be ready yet; will be loaded when settings are opened
  }
})();

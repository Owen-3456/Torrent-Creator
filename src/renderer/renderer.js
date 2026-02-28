// ============================================
// DOM Elements
// ============================================
const backendStatus = document.getElementById("backend-status");

// Screens
const mainMenu = document.getElementById("main-menu");
const selectType = document.getElementById("select-type");
const uploadMovie = document.getElementById("upload-movie");
const uploadEpisode = document.getElementById("upload-episode");
const uploadSeason = document.getElementById("upload-season");
const torrentList = document.getElementById("torrent-list");
const movieDetails = document.getElementById("movie-details");
const episodeDetails = document.getElementById("episode-details");
const seasonDetails = document.getElementById("season-details");

// Main Menu buttons
const menuCreate = document.getElementById("menu-create");
const menuEdit = document.getElementById("menu-edit");
const menuSettings = document.getElementById("menu-settings");
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
const episodeBatchList = document.getElementById("episode-batch-list");

// Season upload screen
const seasonUploadBox = document.getElementById("season-upload-box");
const seasonUploadStatus = document.getElementById("season-upload-status");
const seasonUploadBack = document.getElementById("season-upload-back");

// Torrent list screen
const torrentListContainer = document.getElementById("torrent-list-container");
const listBack = document.getElementById("list-back");

// Corner icons
const githubIcon = document.getElementById("github-icon");

// Metadata modal
const metadataModal = document.getElementById("metadata-modal");
const metadataSearchInput = document.getElementById("metadata-search-input");
const metadataSearchBtn = document.getElementById("metadata-search-btn");
const metadataSearchResults = document.getElementById("metadata-search-results");
const metadataEpisodePicker = document.getElementById("metadata-episode-picker");
const metadataSeasonSelect = document.getElementById("metadata-season-select");
const metadataEpisodeSelect = document.getElementById("metadata-episode-select");
const metadataClose = document.getElementById("metadata-close");
const metadataCancel = document.getElementById("metadata-cancel");
const metadataApply = document.getElementById("metadata-apply");
const movieMetadataBtn = document.getElementById("movie-metadata-btn");
const episodeMetadataBtn = document.getElementById("episode-metadata-btn");
const seasonMetadataBtn = document.getElementById("season-metadata-btn");

// Conflict modal
const conflictModal = document.getElementById("conflict-modal");
const conflictExistingName = document.getElementById("conflict-existing-name");
const conflictExistingSize = document.getElementById("conflict-existing-size");
const conflictExistingFiles = document.getElementById("conflict-existing-files");
const conflictExistingCreated = document.getElementById("conflict-existing-created");
const conflictNewName = document.getElementById("conflict-new-name");
const conflictNewSize = document.getElementById("conflict-new-size");
const conflictNewFiles = document.getElementById("conflict-new-files");
const conflictOverwrite = document.getElementById("conflict-overwrite");
const conflictOpen = document.getElementById("conflict-open");
const conflictCancel = document.getElementById("conflict-cancel");

// Settings screen
const settingsScreen = document.getElementById("settings");
const settingsClose = document.getElementById("settings-close");
const settingsBack = document.getElementById("settings-back");
const settingsSave = document.getElementById("settings-save");
const settingsExport = document.getElementById("settings-export");
const settingsImport = document.getElementById("settings-import");
const settingsUnsavedIndicator = document.getElementById("settings-unsaved-indicator");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Track if settings have been modified
let settingsModified = false;

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

// Old TMDB inline search elements (now replaced with metadata modal) - COMMENTED OUT
/*
const tmdbSearchInput = document.getElementById("tmdb-search-input");
const tmdbSearchBtn = document.getElementById("tmdb-search-btn");
const tmdbSearchResults = document.getElementById("tmdb-search-results");
const tmdbTvSearchInput = document.getElementById("tmdb-tv-search-input");
const tmdbTvSearchBtn = document.getElementById("tmdb-tv-search-btn");
const tmdbTvSearchResults = document.getElementById("tmdb-tv-search-results");
const tmdbEpisodePicker = document.getElementById("tmdb-episode-picker");
const tmdbSeasonSelect = document.getElementById("tmdb-season-select");
const tmdbEpisodeSelect = document.getElementById("tmdb-episode-select");
const tmdbSeasonSearchInput = document.getElementById("tmdb-season-search-input");
const tmdbSeasonSearchBtn = document.getElementById("tmdb-season-search-btn");
const tmdbSeasonSearchResults = document.getElementById("tmdb-season-search-results");
const tmdbSeasonPicker = document.getElementById("tmdb-season-picker");
const tmdbSeasonPackSelect = document.getElementById("tmdb-season-pack-select");
*/

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

// Season details screen
const seasonTorrentTree = document.getElementById("season-torrent-tree");
const seasonDetailsForm = document.getElementById("season-details-form");
const seasonShowName = document.getElementById("season-show-name");
const seasonNumber = document.getElementById("season-number");
const seasonYear = document.getElementById("season-year");
const seasonTotalSize = document.getElementById("season-total-size");
const seasonEpisodeCount = document.getElementById("season-episode-count");
const seasonLanguage = document.getElementById("season-language");
const seasonResolution = document.getElementById("season-resolution");
const seasonSource = document.getElementById("season-source");
const seasonVideoCodec = document.getElementById("season-video-codec");
const seasonAudioCodec = document.getElementById("season-audio-codec");
const seasonContainer = document.getElementById("season-container");
const seasonReleaseGroup = document.getElementById("season-release-group");
const seasonTmdbId = document.getElementById("season-tmdb-id");
const seasonImdbId = document.getElementById("season-imdb-id");
const seasonOverview = document.getElementById("season-overview");
const seasonBitDepth = document.getElementById("season-bit-depth");
const seasonHdrFormat = document.getElementById("season-hdr-format");
const seasonAudioChannels = document.getElementById("season-audio-channels");
const seasonDetailsBack = document.getElementById("season-details-back");

// Track selected TV show for episode picker
let selectedTvShowId = null;
let selectedTvShowData = null;

// Track selected TV show for season picker
let selectedSeasonShowId = null;
let selectedSeasonShowData = null;

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
  "season-show-name", "season-number", "season-year",
  "season-total-size", "season-episode-count",
  "season-language", "season-resolution", "season-source",
  "season-video-codec", "season-audio-codec", "season-container",
  "season-release-group", "season-bit-depth", "season-hdr-format",
  "season-audio-channels", "season-tmdb-id", "season-imdb-id", "season-overview",
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
  "season-language", "season-resolution", "season-source",
  "season-video-codec", "season-audio-codec", "season-container",
  "season-bit-depth", "season-hdr-format", "season-audio-channels",
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
// Custom Dialog (replaces native alert/confirm)
// ============================================
const customDialog = document.getElementById("custom-dialog");
const customDialogTitle = document.getElementById("custom-dialog-title");
const customDialogMessage = document.getElementById("custom-dialog-message");
const customDialogOk = document.getElementById("custom-dialog-ok");
const customDialogCancel = document.getElementById("custom-dialog-cancel");

/**
 * Show a themed alert dialog (replaces native alert()).
 * @param {string} message - The message to display
 * @param {object} [options] - Optional settings
 * @param {string} [options.title] - Dialog title (default: based on type)
 * @param {string} [options.type] - "error", "success", "warning", or "" (default: "")
 * @returns {Promise<void>} Resolves when the user clicks OK
 */
function showAlert(message, options = {}) {
  return new Promise((resolve) => {
    const type = options.type || "";
    const title = options.title || (type === "error" ? "Error" : type === "success" ? "Success" : type === "warning" ? "Warning" : "Alert");

    customDialogTitle.textContent = title;
    customDialogMessage.textContent = message;
    customDialogCancel.style.display = "none";
    customDialogOk.textContent = "OK";

    // Apply type class
    customDialog.className = "custom-dialog" + (type ? ` dialog-${type}` : "");
    customDialog.style.display = "flex";

    function cleanup() {
      customDialog.style.display = "none";
      customDialogOk.removeEventListener("click", onOk);
      customDialog.removeEventListener("keydown", onKey);
    }

    function onOk() {
      cleanup();
      resolve();
    }

    function onKey(e) {
      if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        cleanup();
        resolve();
      }
    }

    customDialogOk.addEventListener("click", onOk);
    customDialog.addEventListener("keydown", onKey);
    customDialogOk.focus();
  });
}

/**
 * Show a themed confirm dialog (replaces native confirm()).
 * @param {string} message - The message to display
 * @param {object} [options] - Optional settings
 * @param {string} [options.title] - Dialog title (default: "Confirm")
 * @param {string} [options.type] - "error", "success", "warning", or "" (default: "warning")
 * @param {string} [options.confirmText] - Text for the confirm button (default: "Confirm")
 * @param {string} [options.cancelText] - Text for the cancel button (default: "Cancel")
 * @returns {Promise<boolean>} Resolves true if confirmed, false if cancelled
 */
function showConfirm(message, options = {}) {
  return new Promise((resolve) => {
    const type = options.type || "warning";
    const title = options.title || "Confirm";
    const confirmText = options.confirmText || "Confirm";
    const cancelText = options.cancelText || "Cancel";

    customDialogTitle.textContent = title;
    customDialogMessage.textContent = message;
    customDialogCancel.style.display = "inline-block";
    customDialogCancel.textContent = cancelText;
    customDialogOk.textContent = confirmText;

    // Apply type class
    customDialog.className = "custom-dialog" + (type ? ` dialog-${type}` : "");
    customDialog.style.display = "flex";

    function cleanup() {
      customDialog.style.display = "none";
      customDialogOk.removeEventListener("click", onConfirm);
      customDialogCancel.removeEventListener("click", onCancel);
      customDialog.removeEventListener("keydown", onKey);
    }

    function onConfirm() {
      cleanup();
      resolve(true);
    }

    function onCancel() {
      cleanup();
      resolve(false);
    }

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    }

    customDialogOk.addEventListener("click", onConfirm);
    customDialogCancel.addEventListener("click", onCancel);
    customDialog.addEventListener("keydown", onKey);
    customDialogCancel.focus();
  });
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
const screens = [mainMenu, selectType, uploadMovie, uploadEpisode, uploadSeason, torrentList, movieDetails, episodeDetails, seasonDetails, torrentSuccess];

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
  } else if (screen === "upload-season") {
    uploadSeason.style.display = "flex";
    resetSeasonUploadStatus();
  } else if (screen === "torrent-list") {
    torrentList.style.display = "flex";
    loadTorrentList();
  } else if (screen === "details") {
    movieDetails.style.display = "flex";
  } else if (screen === "episode-details") {
    episodeDetails.style.display = "flex";
  } else if (screen === "season-details") {
    seasonDetails.style.display = "flex";
  } else if (screen === "success") {
    torrentSuccess.style.display = "flex";
  }
}

function resetUploadStatus() {
  movieUploadStatus.textContent = "";
  movieUploadStatus.style.color = "";
  uploadBox.style.display = "flex";
}

function resetEpisodeUploadStatus() {
  episodeUploadStatus.textContent = "";
  episodeUploadStatus.style.color = "";
  episodeUploadBox.style.display = "flex";
  episodeBatchList.style.display = "none";
  episodeBatchList.innerHTML = "";
  batchEpisodes = [];
  batchCurrentIndex = 0;
}

function resetSeasonUploadStatus() {
  seasonUploadStatus.textContent = "";
  seasonUploadStatus.style.color = "";
  seasonUploadBox.style.display = "flex";
  seasonUploadInProgress = false;
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

menuSettings.addEventListener("click", () => {
  openSettings();
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
  showScreen("upload-episode");
});

typeSeason.addEventListener("click", () => {
  showScreen("upload-season");
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
  const filepaths = await window.api.selectMultipleFiles();
  if (filepaths && filepaths.length > 0) {
    // If only one file selected, use single episode flow
    if (filepaths.length === 1) {
      handleEpisodeFileUpload(filepaths[0]);
    } else {
      // Multiple files, use batch flow
      handleBatchEpisodeUpload(filepaths);
    }
  }
});

episodeUploadBack.addEventListener("click", () => {
  showScreen("select-type");
});

// ============================================
// Season Upload Screen Event Handlers
// ============================================
let seasonUploadInProgress = false;

seasonUploadBox.addEventListener("click", async () => {
  if (seasonUploadInProgress) {
    return; // Prevent multiple uploads at once
  }
  const folderPath = await window.api.selectFolder();
  if (folderPath) {
    handleSeasonFolderUpload(folderPath);
  }
});

seasonUploadBack.addEventListener("click", async () => {
  if (seasonUploadInProgress) {
    if (!await showConfirm("Season pack is still being processed. Go back anyway?")) {
      return;
    }
  }
  seasonUploadInProgress = false;
  showScreen("select-type");
});

async function handleSeasonFolderUpload(folderPath) {
  seasonUploadInProgress = true;
  seasonUploadBox.style.display = "none";
  seasonUploadStatus.textContent = "Checking for conflicts...";
  seasonUploadStatus.style.color = "var(--text-secondary)";

  try {
    // Check for conflicts first
    const conflictCheck = await window.api.fetch("/check-season-conflict", {
      method: "POST",
      body: JSON.stringify({ folder_path: folderPath }),
    });

    if (conflictCheck.conflict) {
      seasonUploadInProgress = false;
      seasonUploadBox.style.display = "flex";
      // Show conflict modal
      showConflictModal(conflictCheck, folderPath, "season");
      return;
    }

    // No conflict, proceed with upload
    await processSeasonUpload(folderPath);
  } catch (error) {
    console.error("Season folder upload error:", error);
    seasonUploadBox.style.display = "flex";
    seasonUploadStatus.textContent = "Error: " + (error.message || "An error occurred while processing the folder.");
    seasonUploadStatus.style.color = "var(--error)";
    seasonUploadInProgress = false;
  }
}

async function processSeasonUpload(folderPath) {
  seasonUploadInProgress = true;
  seasonUploadBox.style.display = "none";
  seasonUploadStatus.textContent = "Processing folder (this may take a moment for large files)...";
  seasonUploadStatus.style.color = "var(--text-secondary)";

  try {
    const response = await window.api.fetch("/parse-season", {
      method: "POST",
      body: JSON.stringify({ folder_path: folderPath }),
    });

    if (response.success) {
      seasonUploadStatus.textContent = `Found ${response.episode_count} episode(s)!`;
      seasonUploadStatus.style.color = "var(--success)";
      currentTorrentFolder = response.target_folder;
      seasonUploadInProgress = false;
      showSeasonDetails(response);
    } else {
      seasonUploadBox.style.display = "flex";
      seasonUploadStatus.textContent = "Error: " + (response.error || "Failed to process folder.");
      seasonUploadStatus.style.color = "var(--error)";
      seasonUploadInProgress = false;
    }
  } catch (error) {
    console.error("Season folder upload error:", error);
    seasonUploadBox.style.display = "flex";
    seasonUploadStatus.textContent = "Error: " + (error.message || "An error occurred while processing the folder.");
    seasonUploadStatus.style.color = "var(--error)";
    seasonUploadInProgress = false;
  }
}

async function handleEpisodeFileUpload(filepath) {
  episodeUploadBox.style.display = "none";
  episodeUploadStatus.textContent = "Checking for conflicts...";
  episodeUploadStatus.style.color = "var(--text-secondary)";

  try {
    // Check for conflicts first
    const conflictCheck = await window.api.fetch("/check-conflict", {
      method: "POST",
      body: JSON.stringify({ filepath: filepath }),
    });

    if (conflictCheck.conflict) {
      // Show conflict modal
      episodeUploadBox.style.display = "flex";
      showConflictModal(conflictCheck, filepath, "episode");
      return;
    }

    // No conflict, proceed with upload
    await processEpisodeUpload(filepath);
  } catch (error) {
    episodeUploadBox.style.display = "flex";
    episodeUploadStatus.textContent = "Error: " + (error.message || "An error occurred while processing the file.");
    episodeUploadStatus.style.color = "var(--error)";
  }
}

async function processEpisodeUpload(filepath) {
  episodeUploadBox.style.display = "none";
  episodeUploadStatus.textContent = "Processing file...";
  episodeUploadStatus.style.color = "var(--text-secondary)";

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
      episodeUploadBox.style.display = "flex";
      episodeUploadStatus.textContent = "Error: " + (response.error || "Failed to process file.");
      episodeUploadStatus.style.color = "var(--error)";
    }
  } catch (error) {
    episodeUploadBox.style.display = "flex";
    episodeUploadStatus.textContent = "Error: " + (error.message || "An error occurred while processing the file.");
    episodeUploadStatus.style.color = "var(--error)";
  }
}

// ============================================
// Batch Episode Upload
// ============================================
let batchEpisodes = [];
let batchCurrentIndex = 0;
let spinnerInterval = null;
let spinnerFrame = 0;
const spinnerFrames = ['|', '/', '-', '\\'];

async function handleBatchEpisodeUpload(filepaths) {
  if (!filepaths || filepaths.length === 0) return;

  // Hide upload box
  episodeUploadBox.style.display = "none";
  
  // Initialize batch state
  batchEpisodes = filepaths.map((filepath, index) => ({
    filepath,
    filename: filepath.split(/[\\/]/).pop(),
    status: "pending",
    index
  }));
  batchCurrentIndex = 0;

  // Show batch list
  episodeBatchList.style.display = "block";
  updateBatchList();

  // Start processing
  episodeUploadStatus.textContent = `Processing ${batchEpisodes.length} episode(s)...`;
  episodeUploadStatus.style.color = "var(--text-secondary)";

  // Start spinner animation
  spinnerFrame = 0;
  spinnerInterval = setInterval(() => {
    spinnerFrame = (spinnerFrame + 1) % spinnerFrames.length;
    updateBatchList();
  }, 150);

  await processBatchEpisodes();
}

function updateBatchList() {
  const listHtml = batchEpisodes.map((ep, index) => {
    let statusIcon = "";
    let statusColor = "var(--text-secondary)";
    let statusText = "Pending";

    if (ep.status === "processing") {
      statusIcon = spinnerFrames[spinnerFrame];
      statusColor = "var(--text-primary)";
      statusText = "Processing...";
    } else if (ep.status === "success") {
      statusIcon = "✓";
      statusColor = "var(--success)";
      statusText = "Complete";
    } else if (ep.status === "error") {
      statusIcon = "✗";
      statusColor = "var(--error)";
      statusText = ep.error || "Failed";
    }

    return `
      <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--bg-secondary); margin-bottom: 0.35rem; border-radius: var(--radius); border: 1px solid var(--border-default);">
        <span style="color: var(--text-secondary); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ep.filename}</span>
        <span style="color: ${statusColor}; margin-left: 1rem; white-space: nowrap;">${statusIcon} ${statusText}</span>
      </div>
    `;
  }).join("");

  episodeBatchList.innerHTML = listHtml;
}

async function processBatchEpisodes() {
  for (let i = 0; i < batchEpisodes.length; i++) {
    const ep = batchEpisodes[i];
    batchCurrentIndex = i;
    
    ep.status = "processing";
    updateBatchList();

    try {
      // Check for conflicts
      const conflictCheck = await window.api.fetch("/check-conflict", {
        method: "POST",
        body: JSON.stringify({ filepath: ep.filepath }),
      });

      if (conflictCheck.conflict) {
        // Skip if conflict exists
        ep.status = "error";
        ep.error = "Already exists";
        updateBatchList();
        continue;
      }

      // Process the file
      const response = await window.api.fetch("/parse", {
        method: "POST",
        body: JSON.stringify({ filepath: ep.filepath }),
      });

      if (response.success) {
        ep.status = "success";
        ep.targetFolder = response.target_folder;
        updateBatchList();
      } else {
        ep.status = "error";
        ep.error = response.error || "Failed";
        updateBatchList();
      }
    } catch (error) {
      ep.status = "error";
      ep.error = error.message || "Error";
      updateBatchList();
    }
  }

  // All done - stop spinner
  if (spinnerInterval) {
    clearInterval(spinnerInterval);
    spinnerInterval = null;
  }

  const successCount = batchEpisodes.filter(ep => ep.status === "success").length;
  const errorCount = batchEpisodes.filter(ep => ep.status === "error").length;

  episodeUploadStatus.textContent = `Batch complete: ${successCount} successful, ${errorCount} failed`;
  episodeUploadStatus.style.color = errorCount > 0 ? "var(--warning)" : "var(--success)";

  // Show completion options
  const completionDiv = document.createElement("div");
  completionDiv.style.cssText = "margin-top: 1rem; display: flex; gap: 0.75rem; justify-content: center;";
  completionDiv.innerHTML = `
    <button class="menu-btn" id="batch-create-all-btn">Create All Torrents (${successCount})</button>
    <button class="menu-btn" id="batch-done-btn">Done</button>
  `;
  episodeBatchList.appendChild(completionDiv);

  document.getElementById("batch-create-all-btn").addEventListener("click", () => {
    createAllBatchTorrents();
  });

  document.getElementById("batch-done-btn").addEventListener("click", () => {
    resetBatchState();
    showScreen("menu");
  });
}

async function createAllBatchTorrents() {
  const successfulEpisodes = batchEpisodes.filter(ep => ep.status === "success");
  
  if (successfulEpisodes.length === 0) {
    await showAlert("No episodes were successfully processed.", { type: "warning" });
    return;
  }

  // Navigate to the first episode to let user set metadata
  // For now, we'll show them in the torrent list
  episodeUploadStatus.textContent = `${successfulEpisodes.length} episode(s) ready in My Torrents`;
  episodeUploadStatus.style.color = "var(--success)";
  
  await showAlert(`${successfulEpisodes.length} episode(s) have been processed and are ready in "My Torrents". You can now edit each one individually to add metadata and create torrents.`, { type: "success" });
  
  resetBatchState();
  showScreen("menu");
}

function resetBatchState() {
  // Stop spinner if running
  if (spinnerInterval) {
    clearInterval(spinnerInterval);
    spinnerInterval = null;
  }
  
  batchEpisodes = [];
  batchCurrentIndex = 0;
  episodeBatchList.style.display = "none";
  episodeBatchList.innerHTML = "";
  episodeUploadBox.style.display = "flex";
  episodeUploadStatus.textContent = "";
}

// ============================================
// Movie Upload Screen Event Handlers
// ============================================
async function handleFileUpload(filepath) {
  uploadBox.style.display = "none";
  movieUploadStatus.textContent = "Checking for conflicts...";
  movieUploadStatus.style.color = "var(--text-secondary)";

  try {
    // Check for conflicts first
    const conflictCheck = await window.api.fetch("/check-conflict", {
      method: "POST",
      body: JSON.stringify({ filepath: filepath }),
    });

    if (conflictCheck.conflict) {
      // Show conflict modal
      uploadBox.style.display = "flex";
      showConflictModal(conflictCheck, filepath, "movie");
      return;
    }

    // No conflict, proceed with upload
    await processFileUpload(filepath);
  } catch (error) {
    uploadBox.style.display = "flex";
    showError(error.message || "An error occurred while processing the file.");
  }
}

async function processFileUpload(filepath) {
  uploadBox.style.display = "none";
  movieUploadStatus.textContent = "Processing file...";
  movieUploadStatus.style.color = "var(--text-secondary)";

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
      uploadBox.style.display = "flex";
      showError(response.error || "Failed to process file.");
    }
  } catch (error) {
    uploadBox.style.display = "flex";
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
      if (response.media_type === "season") {
        // For existing season pack torrents, build minimal data for showSeasonDetails
        const videoFiles = (response.files || [])
          .filter(f => {
            const ext = f.split(".").pop().toLowerCase();
            return ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v"].includes(ext);
          })
          .map(f => ({ name: f, size: "" }));
        response.folder_name = response.filename?.replace(/\.[^.]+$/, "") || folderPath.split("/").pop();
        response.video_files = videoFiles;
        response.episode_count = videoFiles.length;
        response.total_size = response.metadata?.file_size || "";
        showSeasonDetails(response);
      } else if (response.media_type === "episode") {
        showEpisodeDetails(response);
      } else {
        showMovieDetails(response);
      }
    } else {
      await showAlert("Failed to load torrent details: " + (response.error || "Unknown error"), { type: "error" });
    }
  } catch (error) {
    await showAlert("Error loading torrent details: " + error.message, { type: "error" });
  }
}

async function confirmDeleteTorrent(torrent) {
  try {
    // Get delete capability info from backend
    const capability = await window.api.fetch("/system/delete-capability");

    const confirmMessage = `Are you sure you want to delete "${torrent.name}"?\n\n${capability.message}`;

    if (await showConfirm(confirmMessage, { title: "Delete Torrent", confirmText: "Delete" })) {
      await deleteTorrent(torrent);
    }
  } catch (error) {
    console.error("Failed to get delete capability:", error);
    // Fallback confirmation
    if (await showConfirm(`Are you sure you want to delete "${torrent.name}"?`, { title: "Delete Torrent", confirmText: "Delete" })) {
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
    await showAlert("Failed to delete torrent: " + error.message, { type: "error" });
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

  // Snapshot defaults
  snapshotFieldDefaults();

  // Note: Metadata lookup now uses the modal popup (metadata-modal)
  // Old inline TMDB search has been removed
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
      await showAlert("Failed to generate preview: " + (response.detail || "Unknown error"), { type: "error" });
    }
  } catch (error) {
    await showAlert("Error generating preview: " + error.message, { type: "error" });
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

  // Note: Metadata lookup now uses the modal popup (metadata-modal)
  // Old inline TMDB search has been removed
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
      await showAlert("Failed to generate preview: " + (response.detail || "Unknown error"), { type: "error" });
    }
  } catch (error) {
    await showAlert("Error generating preview: " + error.message, { type: "error" });
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// ============================================
// Season Pack Details
// ============================================
function showSeasonDetails(data) {
  currentMediaType = "season";
  showScreen("season-details");

  const folderName = data.folder_name;
  const videoFiles = data.video_files || [];

  // Build torrent tree
  const treeLines = [
    `${cachedOutputDir}/`,
    `└── ${folderName}/`,
  ];
  videoFiles.forEach((vf, i) => {
    const connector = i < videoFiles.length - 1 ? "├──" : "└──";
    const name = typeof vf === "object" ? vf.name : vf;
    treeLines.push(`    ${connector} ${name}`);
  });
  seasonTorrentTree.textContent = treeLines.join("\n");

  const parsed = data.parsed || {};
  const metadata = data.metadata || {};

  seasonShowName.value = parsed.title || folderName;
  seasonNumber.value = parsed.season || "";
  seasonYear.value = parsed.year || "";
  seasonTotalSize.value = data.total_size || "";
  seasonEpisodeCount.value = data.episode_count || videoFiles.length || "";
  setSelectValue(seasonLanguage, parsed.language || "");
  setSelectValue(seasonResolution, metadata.resolution || parsed.resolution || "");
  setSelectValue(seasonSource, normalizeSource(parsed.source));
  setSelectValue(seasonVideoCodec, metadata.video_codec || parsed.video_codec || "");
  setSelectValue(seasonAudioCodec, metadata.audio_codec || parsed.audio_codec || "");
  setSelectValue(seasonContainer, (parsed.container || "").toUpperCase());
  seasonReleaseGroup.value = parsed.release_group || cachedReleaseGroup;
  setSelectValue(seasonBitDepth, metadata.bit_depth || "");
  setSelectValue(seasonHdrFormat, metadata.hdr_format || "");
  setSelectValue(seasonAudioChannels, metadata.audio_channels || "");
  seasonTmdbId.value = "";
  seasonImdbId.value = "";
  seasonOverview.value = "";

  injectRevertButtons();
  snapshotFieldDefaults();

  // Note: Metadata lookup now uses the modal popup (metadata-modal)
  // Old inline TMDB search has been removed
}

seasonDetailsBack.addEventListener("click", () => {
  showScreen("select-type");
});

function collectSeasonFormData() {
  return {
    folder_path: currentTorrentFolder,
    show_name: seasonShowName.value,
    season: parseInt(seasonNumber.value) || 0,
    year: seasonYear.value,
    total_size: seasonTotalSize.value,
    episode_count: parseInt(seasonEpisodeCount.value) || 0,
    language: getSelectValue(seasonLanguage),
    resolution: getSelectValue(seasonResolution),
    source: getSelectValue(seasonSource),
    video_codec: getSelectValue(seasonVideoCodec),
    audio_codec: getSelectValue(seasonAudioCodec),
    container: getSelectValue(seasonContainer),
    release_group: seasonReleaseGroup.value,
    tmdb_id: seasonTmdbId.value,
    imdb_id: seasonImdbId.value,
    overview: seasonOverview.value,
    bit_depth: getSelectValue(seasonBitDepth),
    hdr_format: getSelectValue(seasonHdrFormat),
    audio_channels: getSelectValue(seasonAudioChannels),
  };
}

seasonDetailsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = collectSeasonFormData();
  const submitBtn = seasonDetailsForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Loading preview...";

  try {
    const response = await window.api.fetch("/preview-season-torrent", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (response.success) {
      pendingTorrentData = formData;
      currentMediaType = "season";
      showTorrentPreview(response);
    } else {
      await showAlert("Failed to generate preview: " + (response.detail || "Unknown error"), { type: "error" });
    }
  } catch (error) {
    await showAlert("Error generating preview: " + error.message, { type: "error" });
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

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
    let createEndpoint;
    if (currentMediaType === "episode") {
      createEndpoint = "/create-episode-torrent";
    } else if (currentMediaType === "season") {
      createEndpoint = "/create-season-torrent";
    } else {
      createEndpoint = "/create-torrent";
    }
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
      await showAlert("Failed to create torrent: " + (response.detail || "Unknown error"), { type: "error" });
      previewConfirm.textContent = "Create Torrent";
      previewConfirm.disabled = false;
    }
  } catch (error) {
    await showAlert("Error creating torrent: " + error.message, { type: "error" });
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

// Wait for the backend to be ready before making any API calls
async function waitForBackend(maxRetries = 20, intervalMs = 500) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const data = await window.api.fetch("/health");
      if (data.status === "ok") {
        backendStatus.textContent = "Connected";
        backendStatus.className = "connected";
        return true;
      }
    } catch {
      // Backend not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  backendStatus.textContent = "Not running";
  backendStatus.className = "disconnected";
  return false;
}

// ============================================
// Corner Icon Handlers
// ============================================
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
  settingsModified = false;
  settingsUnsavedIndicator.style.display = "none";
  loadSettings();
}

async function closeSettings(force = false) {
  if (!force && settingsModified) {
    if (!await showConfirm("You have unsaved changes. Are you sure you want to close without saving?", { title: "Unsaved Changes" })) {
      return;
    }
  }
  settingsScreen.style.display = "none";
  settingsModified = false;
  settingsUnsavedIndicator.style.display = "none";
}

// Mark settings as modified when any field changes
function markSettingsModified() {
  settingsModified = true;
  settingsUnsavedIndicator.style.display = "inline-block";
}

settingsClose.addEventListener("click", () => closeSettings(false));
settingsBack.addEventListener("click", () => closeSettings(false));

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
settingTemplateMovie.addEventListener("input", () => {
  updateTemplatePreviews();
  markSettingsModified();
});
settingTemplateEpisode.addEventListener("input", () => {
  updateTemplatePreviews();
  markSettingsModified();
});
settingTemplateSeason.addEventListener("input", () => {
  updateTemplatePreviews();
  markSettingsModified();
});
settingReleaseGroup.addEventListener("input", () => {
  updateTemplatePreviews();
  markSettingsModified();
});

// Mark settings as modified on any field change
settingTmdbKey.addEventListener("input", markSettingsModified);
settingTvdbKey.addEventListener("input", markSettingsModified);
settingOutputDir.addEventListener("input", markSettingsModified);
settingNfoNotes.addEventListener("change", markSettingsModified);
settingNfoNotesText.addEventListener("input", markSettingsModified);
settingAsciiArt.addEventListener("input", markSettingsModified);

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
      markSettingsModified();
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
  markSettingsModified();
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
      originalAsciiArt = asciiArt;
    }

    if (configResponse.success) {
      settingsModified = false;
      settingsUnsavedIndicator.style.display = "none";
      originalConfig = config;
      await showAlert("Settings saved successfully!", { type: "success" });
    }
  } catch (error) {
    console.error("Failed to save settings:", error);
    await showAlert("Failed to save settings: " + error.message, { type: "error" });
  }
});

// Export settings
settingsExport.addEventListener("click", async () => {
  // Warn user about sensitive data
  const confirmed = await showConfirm(
    "WARNING: The exported settings file contains your API keys and should be kept secure.\n\nDo not share this file publicly or commit it to version control.\n\nContinue with export?",
    { title: "Export Settings", type: "warning", confirmText: "Export" }
  );
  
  if (!confirmed) return;

  try {
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
      ascii_art: settingAsciiArt.value,
    };

    // Create a JSON blob and download it
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `torrent-creator-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export settings:", error);
    await showAlert("Failed to export settings: " + error.message, { type: "error" });
  }
});

// Import settings
settingsImport.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const config = JSON.parse(text);

      // Populate form fields with imported config
      if (config.api_keys) {
        settingTmdbKey.value = config.api_keys.tmdb || "";
        settingTvdbKey.value = config.api_keys.tvdb || "";
      }
      if (config.naming_templates) {
        settingTemplateMovie.value = config.naming_templates.movie || "";
        settingTemplateEpisode.value = config.naming_templates.episode || "";
        settingTemplateSeason.value = config.naming_templates.season || "";
      }
      if (config.trackers) {
        settingTrackers = [...config.trackers];
        renderTrackerList();
      }
      if (config.output_directory) {
        settingOutputDir.value = config.output_directory;
      }
      if (config.release_group) {
        settingReleaseGroup.value = config.release_group;
      }
      if (config.nfo) {
        settingNfoNotes.checked = config.nfo.include_notes !== false;
        settingNfoNotesText.value = config.nfo.notes_template || "";
      }
      if (config.ascii_art) {
        settingAsciiArt.value = config.ascii_art;
      }

      markSettingsModified();
      showAlert("Settings imported successfully! Don't forget to save.", { type: "success" });
    } catch (error) {
      console.error("Failed to import settings:", error);
      showAlert("Failed to import settings: " + error.message, { type: "error" });
    }
  };
  input.click();
});

// ============================================
// Initialize
// ============================================
showScreen("menu");

// Wait for the backend to be ready, then load initial config
(async () => {
  await waitForBackend();
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
    // Will be loaded when settings are opened
  }
})();

// Periodically re-check backend connection
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
enforceNumericInput(seasonNumber);
enforceNumericInput(seasonYear);
enforceNumericInput(seasonTmdbId);

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

// ============================================
// Conflict Resolution Modal
// ============================================
let currentConflictData = null;
let currentConflictPath = null;
let currentConflictType = null;

function showConflictModal(conflictData, path, type) {
  currentConflictData = conflictData;
  currentConflictPath = path;
  currentConflictType = type;

  // Populate existing torrent info
  conflictExistingName.textContent = conflictData.existing.name;
  conflictExistingSize.textContent = conflictData.existing.size;
  conflictExistingFiles.textContent = `${conflictData.existing.file_count} file(s)`;
  conflictExistingCreated.textContent = conflictData.existing.created;

  // Populate new torrent info
  conflictNewName.textContent = conflictData.new.name;
  conflictNewSize.textContent = conflictData.new.size;
  conflictNewFiles.textContent = `${conflictData.new.file_count} file(s)`;

  // Show modal
  conflictModal.style.display = "flex";
}

function hideConflictModal() {
  conflictModal.style.display = "none";
  currentConflictData = null;
  currentConflictPath = null;
  currentConflictType = null;
}

// Delete & Overwrite button
conflictOverwrite.addEventListener("click", async () => {
  if (!currentConflictData || !currentConflictPath) return;

  // Save the data before hiding modal (which clears the variables)
  const conflictData = currentConflictData;
  const conflictPath = currentConflictPath;
  const conflictType = currentConflictType;

  hideConflictModal();

  // Show deleting status
  if (conflictType === "movie") {
    movieUploadStatus.textContent = "Deleting existing torrent...";
    movieUploadStatus.style.color = "var(--text-secondary)";
  } else if (conflictType === "episode") {
    episodeUploadStatus.textContent = "Deleting existing torrent...";
    episodeUploadStatus.style.color = "var(--text-secondary)";
  } else if (conflictType === "season") {
    seasonUploadStatus.textContent = "Deleting existing torrent...";
    seasonUploadStatus.style.color = "var(--text-secondary)";
  }

  // Delete the existing torrent first
  try {
    await window.api.fetch("/torrent", {
      method: "DELETE",
      body: JSON.stringify({ folder_path: conflictData.existing.path }),
    });

    // Wait a moment for filesystem to sync
    await new Promise(resolve => setTimeout(resolve, 500));

    // Now proceed with the upload
    if (conflictType === "movie") {
      await processFileUpload(conflictPath);
    } else if (conflictType === "episode") {
      await processEpisodeUpload(conflictPath);
    } else if (conflictType === "season") {
      await processSeasonUpload(conflictPath);
    }
  } catch (error) {
    const errorMsg = "Failed to delete existing torrent: " + error.message;
    await showAlert(errorMsg, { type: "error" });
    
    // Update status with error
    if (conflictType === "movie") {
      movieUploadStatus.textContent = "Error: " + errorMsg;
      movieUploadStatus.style.color = "var(--error)";
    } else if (conflictType === "episode") {
      episodeUploadStatus.textContent = "Error: " + errorMsg;
      episodeUploadStatus.style.color = "var(--error)";
    } else if (conflictType === "season") {
      seasonUploadStatus.textContent = "Error: " + errorMsg;
      seasonUploadStatus.style.color = "var(--error)";
    }
  }
});

// Open Existing button
conflictOpen.addEventListener("click", async () => {
  if (!currentConflictData) return;

  hideConflictModal();

  // Load the existing torrent
  await loadTorrentDetails(currentConflictData.existing.path);
});

// Cancel button
conflictCancel.addEventListener("click", () => {
  hideConflictModal();
  
  // Reset status messages
  if (currentConflictType === "movie") {
    movieUploadStatus.textContent = "";
  } else if (currentConflictType === "episode") {
    episodeUploadStatus.textContent = "";
  } else if (currentConflictType === "season") {
    seasonUploadStatus.textContent = "";
  }
});

// ============================================
// Metadata Lookup Modal
// ============================================
let currentMetadataType = null; // "movie", "episode", or "season"
let selectedMetadataItem = null;
let selectedShowId = null;
let selectedShowData = null;

function openMetadataModal(type) {
  currentMetadataType = type;
  selectedMetadataItem = null;
  selectedShowId = null;
  selectedShowData = null;
  
  metadataSearchInput.value = "";
  metadataSearchResults.innerHTML = "";
  metadataEpisodePicker.style.display = "none";
  metadataApply.disabled = true;
  
  // Set placeholder based on type
  if (type === "movie") {
    metadataSearchInput.placeholder = "Search for a movie...";
  } else {
    metadataSearchInput.placeholder = "Search for a TV show...";
  }
  
  metadataModal.style.display = "flex";
}

function closeMetadataModal() {
  metadataModal.style.display = "none";
  currentMetadataType = null;
  selectedMetadataItem = null;
  selectedShowId = null;
  selectedShowData = null;
}

// Button click handlers
movieMetadataBtn.addEventListener("click", () => openMetadataModal("movie"));
episodeMetadataBtn.addEventListener("click", () => openMetadataModal("episode"));
seasonMetadataBtn.addEventListener("click", () => openMetadataModal("season"));

metadataClose.addEventListener("click", closeMetadataModal);
metadataCancel.addEventListener("click", closeMetadataModal);

// Search functionality
async function searchMetadata() {
  const query = metadataSearchInput.value.trim();
  if (!query) return;
  
  metadataSearchResults.innerHTML = '<p class="search-loading">Searching...</p>';
  metadataApply.disabled = true;
  
  try {
    let endpoint = currentMetadataType === "movie" ? "/tmdb/search" : "/tmdb/search-tv";
    const response = await window.api.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ query: query })
    });
    
    if (response.success && response.results && response.results.length > 0) {
      displayMetadataResults(response.results);
    } else {
      metadataSearchResults.innerHTML = '<p class="search-empty">No results found</p>';
    }
  } catch (error) {
    metadataSearchResults.innerHTML = '<p class="search-error">Search failed: ' + error.message + '</p>';
  }
}

function displayMetadataResults(results) {
  metadataSearchResults.innerHTML = "";
  
  results.forEach(result => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    
    const title = result.title || result.name;
    const year = result.release_date || result.first_air_date;
    const yearStr = year ? ` (${year.split("-")[0]})` : "";
    const overview = result.overview || "No description available";
    
    const posterUrl = result.poster_path 
      ? `https://image.tmdb.org/t/p/w92${result.poster_path}`
      : null;
    
    item.innerHTML = `
      ${posterUrl 
        ? `<img src="${posterUrl}" class="search-result-poster" alt="${title}" />`
        : '<div class="search-result-poster no-poster">No Image</div>'
      }
      <div class="search-result-info">
        <div class="search-result-title">${title}${yearStr}</div>
        <div class="search-result-overview">${overview}</div>
      </div>
    `;
    
    item.addEventListener("click", () => selectMetadataResult(result, item));
    metadataSearchResults.appendChild(item);
  });
}

async function selectMetadataResult(result, element) {
  // Remove previous selection
  document.querySelectorAll(".search-result-item").forEach(el => {
    el.classList.remove("selected");
  });
  element.classList.add("selected");
  
  selectedMetadataItem = result;
  
  if (currentMetadataType === "movie") {
    // For movies, we can apply immediately
    metadataApply.disabled = false;
  } else {
    // For TV shows, need to select season/episode
    selectedShowId = result.id;
    await loadShowSeasons(result.id);
  }
}

async function loadShowSeasons(showId) {
  try {
    const response = await window.api.fetch(`/tmdb/tv/${showId}`);
    
    if (!response.success || !response.show) {
      throw new Error("Failed to load show details");
    }
    
    selectedShowData = response.show;
    
    // Populate season dropdown
    metadataSeasonSelect.innerHTML = '<option value="">-- Select Season --</option>';
    
    if (response.show.seasons) {
      response.show.seasons.forEach(season => {
        if (season.season_number !== null) {
          const option = document.createElement("option");
          option.value = season.season_number;
          option.textContent = `Season ${season.season_number}`;
          metadataSeasonSelect.appendChild(option);
        }
      });
    }
    
    metadataEpisodePicker.style.display = "block";
    
    // For season packs, hide the episode dropdown (only need season)
    if (currentMetadataType === "season") {
      metadataEpisodeSelect.parentElement.style.display = "none";
    } else {
      metadataEpisodeSelect.parentElement.style.display = "";
      metadataEpisodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';
    }
    
    metadataApply.disabled = true;
  } catch (error) {
    console.error("Failed to load show seasons:", error);
    await showAlert("Failed to load show details: " + error.message, { type: "error" });
  }
}

async function loadEpisodes(showId, seasonNumber) {
  try {
    const response = await window.api.fetch(`/tmdb/tv/${showId}/season/${seasonNumber}`);
    
    metadataEpisodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';
    
    if (response.success && response.episodes) {
      response.episodes.forEach(episode => {
        const option = document.createElement("option");
        option.value = episode.episode_number;
        option.textContent = `Episode ${episode.episode_number}: ${episode.name || "Untitled"}`;
        option.dataset.episodeData = JSON.stringify(episode);
        metadataEpisodeSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Failed to load episodes:", error);
    await showAlert("Failed to load episodes: " + error.message, { type: "error" });
  }
}

// Season selection handler
metadataSeasonSelect.addEventListener("change", async () => {
  const seasonNumber = metadataSeasonSelect.value;
  
  if (seasonNumber && selectedShowId) {
    // For season packs, just selecting a season is enough - don't load episodes
    if (currentMetadataType === "season") {
      metadataApply.disabled = false;
    } else {
      // For episodes, load the episode list
      await loadEpisodes(selectedShowId, seasonNumber);
    }
  } else {
    if (currentMetadataType === "episode") {
      metadataEpisodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';
    }
    metadataApply.disabled = true;
  }
});

// Episode selection handler
metadataEpisodeSelect.addEventListener("change", () => {
  const episodeNumber = metadataEpisodeSelect.value;
  
  if (episodeNumber && currentMetadataType === "episode") {
    metadataApply.disabled = false;
  } else {
    metadataApply.disabled = true;
  }
});

// Search button and enter key
metadataSearchBtn.addEventListener("click", searchMetadata);
metadataSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchMetadata();
  }
});

// Apply metadata button
metadataApply.addEventListener("click", async () => {
  if (!selectedMetadataItem) return;
  
  try {
    if (currentMetadataType === "movie") {
      await applyMovieMetadata(selectedMetadataItem);
    } else if (currentMetadataType === "episode") {
      const seasonNum = metadataSeasonSelect.value;
      const episodeNum = metadataEpisodeSelect.value;
      const selectedOption = metadataEpisodeSelect.options[metadataEpisodeSelect.selectedIndex];
      const episodeData = JSON.parse(selectedOption.dataset.episodeData);
      await applyEpisodeMetadata(selectedShowData, seasonNum, episodeNum, episodeData);
    } else if (currentMetadataType === "season") {
      const seasonNum = metadataSeasonSelect.value;
      await applySeasonMetadata(selectedShowData, seasonNum);
    }
    
    closeMetadataModal();
  } catch (error) {
    await showAlert("Failed to apply metadata: " + error.message, { type: "error" });
  }
});

async function applyMovieMetadata(movie) {
  // Fetch full movie details
  const response = await window.api.fetch(`/tmdb/movie/${movie.id}`);
  
  if (!response.success || !response.movie) {
    throw new Error("Failed to fetch movie details");
  }
  
  const details = response.movie;
  
  movieName.value = details.title || movie.title || "";
  movieYear.value = details.year || "";
  movieTmdbId.value = details.tmdb_id || movie.id || "";
  
  // Convert runtime (in minutes) to HH:MM:SS
  if (details.runtime) {
    const hours = Math.floor(details.runtime / 60);
    const minutes = details.runtime % 60;
    movieRuntime.value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  }
  
  // Get IMDB ID if available
  if (details.imdb_id) {
    movieImdbId.value = details.imdb_id;
  }
  
  // Set overview
  if (details.overview) {
    movieOverview.value = details.overview;
  }
  
  // Set language (if original_language matches our options)
  if (details.original_language) {
    const langMap = {
      "en": "English",
      "es": "Spanish",
      "fr": "French",
      "de": "German",
      "it": "Italian",
      "pt": "Portuguese",
      "ja": "Japanese",
      "ko": "Korean",
      "zh": "Chinese",
      "ru": "Russian",
      "hi": "Hindi",
      "ar": "Arabic",
      "nl": "Dutch",
      "sv": "Swedish",
      "no": "Norwegian",
      "da": "Danish",
      "fi": "Finnish",
      "pl": "Polish",
      "tr": "Turkish",
      "th": "Thai"
    };
    const lang = langMap[details.original_language];
    if (lang) {
      setSelectValue(movieLanguage, lang);
    }
  }
  
  snapshotFieldDefaults();
}

async function applyEpisodeMetadata(show, seasonNum, episodeNum, episodeData) {
  episodeShowName.value = show.name || "";
  episodeSeason.value = seasonNum;
  episodeEpisode.value = episodeNum;
  episodeTitle.value = episodeData.name || "";
  episodeTmdbId.value = show.tmdb_id || show.id || "";
  
  // Year from show
  if (show.year) {
    episodeYear.value = show.year;
  }
  
  // Runtime from episode
  if (episodeData.runtime) {
    const hours = Math.floor(episodeData.runtime / 60);
    const minutes = episodeData.runtime % 60;
    episodeRuntime.value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  }
  
  // Overview
  if (episodeData.overview) {
    episodeOverview.value = episodeData.overview;
  }
  
  // IMDB ID from show
  if (show.imdb_id) {
    episodeImdbId.value = show.imdb_id;
  }
  
  // Language - try spoken_languages first, then original_language
  if (show.spoken_languages && show.spoken_languages.length > 0) {
    setSelectValue(episodeLanguage, show.spoken_languages[0]);
  } else if (show.original_language) {
    const langMap = {
      "en": "English",
      "es": "Spanish",
      "fr": "French",
      "de": "German",
      "it": "Italian",
      "pt": "Portuguese",
      "ja": "Japanese",
      "ko": "Korean",
      "zh": "Chinese",
      "ru": "Russian",
      "hi": "Hindi",
      "ar": "Arabic",
      "nl": "Dutch",
      "sv": "Swedish",
      "no": "Norwegian",
      "da": "Danish",
      "fi": "Finnish",
      "pl": "Polish",
      "tr": "Turkish",
      "th": "Thai"
    };
    const lang = langMap[show.original_language];
    if (lang) {
      setSelectValue(episodeLanguage, lang);
    }
  }
  
  snapshotFieldDefaults();
}

async function applySeasonMetadata(show, seasonNum) {
  seasonShowName.value = show.name || "";
  seasonNumber.value = seasonNum;
  seasonTmdbId.value = show.tmdb_id || show.id || "";
  
  // Year from show
  if (show.year) {
    seasonYear.value = show.year;
  }
  
  // Overview
  if (show.overview) {
    seasonOverview.value = show.overview;
  }
  
  // IMDB ID
  if (show.imdb_id) {
    seasonImdbId.value = show.imdb_id;
  }
  
  // Language - try spoken_languages first, then original_language
  if (show.spoken_languages && show.spoken_languages.length > 0) {
    setSelectValue(seasonLanguage, show.spoken_languages[0]);
  } else if (show.original_language) {
    const langMap = {
      "en": "English",
      "es": "Spanish",
      "fr": "French",
      "de": "German",
      "it": "Italian",
      "pt": "Portuguese",
      "ja": "Japanese",
      "ko": "Korean",
      "zh": "Chinese",
      "ru": "Russian",
      "hi": "Hindi",
      "ar": "Arabic",
      "nl": "Dutch",
      "sv": "Swedish",
      "no": "Norwegian",
      "da": "Danish",
      "fi": "Finnish",
      "pl": "Polish",
      "tr": "Turkish",
      "th": "Thai"
    };
    const lang = langMap[show.original_language];
    if (lang) {
      setSelectValue(seasonLanguage, lang);
    }
  }
  
  snapshotFieldDefaults();
}



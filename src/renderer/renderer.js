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

// Navigation logic
function showScreen(screen) {
  mainMenu.style.display = screen === "menu" ? "flex" : "none";
  uploadMovie.style.display = screen === "upload" ? "flex" : "none";
  movieDetails.style.display = screen === "details" ? "flex" : "none";
}

menuMovie.onclick = () => showScreen("upload");
menuEpisode.onclick = () => alert("Single Episode: WIP");
menuSeason.onclick = () => alert("Season Pack: WIP");
menuExit.onclick = () => window.close();
settingsIcon.onclick = () => alert("Settings: WIP");
githubIcon.onclick = () => window.open("https://github.com/", "_blank");

// Upload logic
uploadBox.addEventListener("click", () => movieFileInput.click());
uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.classList.add("drag-over");
});
uploadBox.addEventListener("dragleave", () => uploadBox.classList.remove("drag-over"));
uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBox.classList.remove("drag-over");
  const files = Array.from(e.dataTransfer.files);
  if (files.length) handleMovieFile(files[0]);
});
movieFileInput.addEventListener("change", (e) => {
  if (e.target.files.length) handleMovieFile(e.target.files[0]);
});

async function handleMovieFile(file) {
  movieUploadStatus.textContent = "Uploading...";
  try {
    const resp = await window.api.fetch("/parse", {
      method: "POST",
      body: JSON.stringify({ filepath: file.path, type: "movie" }),
    });
    if (resp && resp.success !== false) {
      movieUploadStatus.textContent = "File uploaded. Fetching details...";
      showMovieDetails(resp, file);
    } else {
      movieUploadStatus.textContent = "Failed to process file.";
    }
  } catch (err) {
    movieUploadStatus.textContent = "Error: " + err.message;
  }
}

function showMovieDetails(data, file) {
  showScreen("details");
  // Example tree, replace with real output if available
  const base = file.name.replace(/\.[^.]+$/, "");
  torrentTree.textContent = `.` + `\n└── ${base}/` + `\n    ├── ${file.name}` + `\n    └── ${base}.NFO`;
  // Fill form fields
  movieName.value = data.parsed && data.parsed.title ? data.parsed.title : guessTitleFromFilename(file.name);
  movieYear.value = data.parsed && data.parsed.year ? data.parsed.year : "";
  movieRuntime.value = data.parsed && data.parsed.runtime ? data.parsed.runtime : "";
  movieSize.value = formatSize(file.size);
  movieLanguage.value = data.parsed && data.parsed.language ? data.parsed.language : "";
}

movieDetailsForm.onsubmit = (e) => {
  e.preventDefault();
  alert("Apply Edits: WIP");
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

// Menu navigation
createTorrentBtn.addEventListener("click", () => {
  menu.style.display = "none";
  typeSelect.style.display = "block";
});

typeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-type");
    if (type === "movie") {
      typeSelect.style.display = "none";
      movieUpload.style.display = "block";
    } else {
      alert("This feature is a work in progress.");
    }
  });
});

movieFileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  movieUploadStatus.textContent = "Uploading...";
  try {
    // Send file path to backend to copy to torrents dir and parse
    const resp = await window.api.fetch("/parse", {
      method: "POST",
      body: JSON.stringify({ filepath: file.path, type: "movie" }),
    });
    if (resp && resp.success !== false) {
      movieUploadStatus.textContent = "File uploaded. Fetching details...";
      showTorrentDetails(resp, file);
    } else {
      movieUploadStatus.textContent = "Failed to process file.";
    }
  } catch (err) {
    movieUploadStatus.textContent = "Error: " + err.message;
  }
});

function showTorrentDetails(data, file) {
  movieUpload.style.display = "none";
  torrentDetails.style.display = "block";
  // Try to get details from backend response, fallback to file object
  const details = data.details || {};
  const name = details.title || guessTitleFromFilename(file.name) || "";
  const size = details.size || file.size;
  const runtime = details.runtime || "";
  const codec = details.codec || "";
  const type = details.type || "Movie";

  torrentDetails.innerHTML = `
    <h2>Torrent Details</h2>
    <form id="torrent-form">
      <label>
        Torrent Name:
        <input type="text" name="name" value="${name}" required />
      </label><br />
      <label>
        File Size:
        <input type="text" name="size" value="${formatSize(size)}" required />
      </label><br />
      <label>
        Runtime:
        <input type="text" name="runtime" value="${runtime}" />
      </label><br />
      <label>
        Codec:
        <input type="text" name="codec" value="${codec}" />
      </label><br />
      <label>
        Type:
        <input type="text" name="type" value="${type}" readonly />
      </label><br />
      <button type="submit">Create Torrent</button>
    </form>
  `;
  document.getElementById("torrent-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // TODO: send details to backend to create torrent
    alert("Torrent creation not yet implemented.");
  });
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

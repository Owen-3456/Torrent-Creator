// DOM Elements
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const backendStatus = document.getElementById("backend-status");

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

// File drop handling
dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");

  const files = Array.from(e.dataTransfer.files);
  handleFiles(files);
});

fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  handleFiles(files);
});

async function handleFiles(files) {
  console.log("Files received:", files);

  for (const file of files) {
    console.log(`File: ${file.name}, Path: ${file.path}`);

    // Send to backend for parsing
    try {
      const data = await window.api.fetch("/parse", {
        method: "POST",
        body: JSON.stringify({ filepath: file.path }),
      });
      console.log("Parse result:", data);
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  }
}

// Initial backend check
checkBackend();
// Recheck every 5 seconds
setInterval(checkBackend, 5000);

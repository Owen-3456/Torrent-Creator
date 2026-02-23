const { contextBridge, ipcRenderer } = require("electron");

const BACKEND_URL = "http://127.0.0.1:8000";

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld("api", {
  backendUrl: BACKEND_URL,

  // Open native file dialog and return the selected file path
  selectFile: () => ipcRenderer.invoke("select-file"),

  // Open native folder dialog and return the selected folder path
  selectFolder: () => ipcRenderer.invoke("select-folder"),

  // Open external URL in default browser
  openExternal: (url) => ipcRenderer.invoke("open-external", url),

  // Show a file/folder in the system file manager
  showItemInFolder: (fullPath) => ipcRenderer.invoke("show-item-in-folder", fullPath),

  // Make API calls to the Python backend
  fetch: async (endpoint, options = {}) => {
    const url = `${BACKEND_URL}${endpoint}`;

    const fetchOptions = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (options.body) {
      fetchOptions.body = options.body;
    }

    const response = await fetch(url, fetchOptions);

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Backend returned non-JSON response (status ${response.status}). The backend may have crashed or is unavailable.`);
    }

    if (!response.ok) {
      const errorMessage = data.detail || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  },
});

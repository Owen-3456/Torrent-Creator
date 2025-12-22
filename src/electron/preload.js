const { contextBridge } = require("electron");

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld("api", {
  // Backend URL
  backendUrl: "http://127.0.0.1:8000",

  // Helper to make API calls
  fetch: async (endpoint, options = {}) => {
    const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },
});

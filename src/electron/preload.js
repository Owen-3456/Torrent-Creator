const { contextBridge } = require("electron");

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld("api", {
  // Backend URL
  backendUrl: "http://localhost:8000",

  // Helper to make API calls
  fetch: async (endpoint, options = {}) => {
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    return response.json();
  },
});

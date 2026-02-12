const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

// Use python3 on non-Windows platforms, python on Windows
const pythonCommand = process.platform === "win32" ? "python" : "python3";

function startBackend() {
  // Start the backend server as a child process
  backendProcess = spawn(pythonCommand, [path.join(__dirname, "../backend/main.py")], {
    stdio: "inherit",
    shell: false,
  });

  backendProcess.on("error", (err) => {
    console.error(`Failed to start backend: ${err.message}`);
  });

  backendProcess.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`Backend process exited with code ${code}`);
    }
    backendProcess = null;
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  // Open DevTools in development (remove for production)
  mainWindow.webContents.openDevTools();
}

// Handle file selection dialog
ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      { name: "Video Files", extensions: ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

// Handle opening external URLs
ipcMain.handle("open-external", async (_event, url) => {
  await shell.openExternal(url);
});

// Handle showing a file/folder in the system file manager
ipcMain.handle("show-item-in-folder", async (_event, fullPath) => {
  shell.showItemInFolder(fullPath);
});

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  stopBackend();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

// Use the venv Python so packages are available without manual activation
function getVenvPython() {
  const venvDir = path.join(__dirname, "../../venv");
  if (process.platform === "win32") {
    return path.join(venvDir, "Scripts", "python.exe");
  }
  return path.join(venvDir, "bin", "python3");
}

const pythonCommand = getVenvPython();

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
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Remove the default menu bar for a cleaner look
  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  // Open DevTools only in development
  if (process.argv.includes("--dev")) {
    mainWindow.webContents.openDevTools();
  }
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
  if (process.platform !== "darwin") {
    stopBackend();
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // On macOS, restart the backend if it was stopped
    if (!backendProcess) {
      startBackend();
    }
    createWindow();
  }
});

// Ensure backend is stopped when the app is actually quitting
app.on("before-quit", () => {
  stopBackend();
});

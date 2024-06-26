import { app, BrowserWindow, ipcMain } from 'electron';

import { WindowHandler } from "./window_handler";
import "./login_process";
import "./sql_insert_process";
import "./sql_select_process";
import "./fetch_json_process";
import "./sql_update_process";
import "./dialog_process";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", WindowHandler.createLoginWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    WindowHandler.createLoginWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle("serverInfo:serverHost", (): string => {
  // @ts-ignore
  const serverHost: string = import.meta.env.VITE_EC2_SERVER_HOST;
  return serverHost;
});

ipcMain.handle("serverInfo:port", (): string => {
  // @ts-ignore
  const port: string = import.meta.env.VITE_EC2_SERVER_PORT;
  return port;
});

ipcMain.handle("serverInfo:imageDirectory", (): string => {
  // @ts-ignore
  const imageDirectory: string = import.meta.env.VITE_IMAGE_DIRECTORY;
  return imageDirectory;
});
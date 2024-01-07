import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  BrowserWindowConstructorOptions
} from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

import {
  ExtractedData,
  _handleDownloadPreview,
  handleUrlsDownload
} from './api'
import { setStore, getStore, removeStore } from './utils/store'
import { _getDefaultDownloadDir, _handleDownloadDirChange } from './utils/dir'
import { handleWillDownload } from './utils/download'
import { handleOpenGithub } from './utils/url'

let mainWindow: BrowserWindow | null

const options: BrowserWindowConstructorOptions = {
  width: 1024,
  height: 768,
  show: false,
  resizable: false,
  autoHideMenuBar: true,
  titleBarStyle: 'hidden',
  titleBarOverlay: true,
  ...(process.platform === 'linux' ? { icon } : {}),
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
    webSecurity: false,
    contextIsolation: true
  }
}

const createWindow = () => {
  const mainWindow = new BrowserWindow(options)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.session.on('will-download', handleWillDownload)

  ipcMain.on('urlsDownload', handleUrlsDownload)

  ipcMain.handle('getPreview', (event, data: ExtractedData[]) =>
    _handleDownloadPreview(event, data)
  )

  ipcMain.on('openGithub', handleOpenGithub)

  // Store management
  ipcMain.on('setStore', setStore)
  ipcMain.on('getStore', getStore)
  ipcMain.on('removeStore', removeStore)

  // Dir management
  ipcMain.handle('selectDownloadDir', (_, oldPath?: string) =>
    _handleDownloadDirChange(oldPath)
  )
  ipcMain.handle('getDefaultDownloadDir', () => _getDefaultDownloadDir())
}

const initApp = () => {
  const lock = app.requestSingleInstanceLock()

  if (!lock) {
    app.quit()
  } else {
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('douyin-downloader')

    app.on('browser-window-created', (_, win) => {
      optimizer.watchWindowShortcuts(win)
    })

    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils#optimizer
    // optimizer.registerFramelessWindowIpc()

    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}

initApp()

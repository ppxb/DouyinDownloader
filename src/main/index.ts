import {
  app,
  shell,
  BrowserWindow,
  BrowserWindowConstructorOptions
} from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

import { registerIpc } from './ipc'

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

    registerIpc(mainWindow!)
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

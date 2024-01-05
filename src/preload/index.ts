import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { IApi } from './index.d'

const api: IApi = {
  setStoreValue: (name: string, value: string) => {
    ipcRenderer.send('setStore', name, value)
  },
  getStoreValue: (name: string) => {
    return ipcRenderer.sendSync('getStore', name)
  },
  removeStoreValue: (name: string) => {
    ipcRenderer.send('removeStore', name)
  },
  selectDownloadDir: () => {
    return ipcRenderer.sendSync('selectDownloadDir')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

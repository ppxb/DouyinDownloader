import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { IApi } from './index.d'
import { ExtractedData } from '../main/api'

const api: IApi = {
  setStoreValue: (name: string, value: string) =>
    ipcRenderer.send('setStore', name, value),
  getStoreValue: (name: string) => {
    return ipcRenderer.sendSync('getStore', name)
  },
  removeStoreValue: (name: string) => ipcRenderer.send('removeStore', name),
  selectDownloadDir: async (oldPath?: string) => {
    return await ipcRenderer.invoke('selectDownloadDir', oldPath)
  },
  getDefaultDownloadDir: async () => {
    return await ipcRenderer.invoke('getDefaultDownloadDir')
  },
  openGithub: () => ipcRenderer.send('openGithub'),
  getPreview: async (data: ExtractedData[]) => {
    return await ipcRenderer.invoke('getPreview', data)
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

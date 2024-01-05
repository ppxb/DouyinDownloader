import { ElectronAPI } from '@electron-toolkit/preload'

export interface IApi {
  setStoreValue: (name: string, value: string) => void
  getStoreValue: (name: string) => string
  removeStoreValue: (name: string) => void
  selectDownloadDir: () => string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}

import { ElectronAPI } from '@electron-toolkit/preload'
import { ExtractedData } from '@renderer/utils/reg'

import { ParsedVideoItem } from '../main/common/types'

export interface IApi {
  setStoreValue: (name: string, value: string) => void
  getStoreValue: (name: string) => string
  removeStoreValue: (name: string) => void
  selectDownloadDir: (oldPath?: string) => Promise<string>
  getDefaultDownloadDir: () => Promise<string>
  openGithub: () => void
  getPreview: (data: ExtractedData[]) => Promise<ParsedVideoItem[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}

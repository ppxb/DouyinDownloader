import { ElectronAPI } from '@electron-toolkit/preload'
import { ExtractedData } from '@renderer/utils/reg'

import { ParsedVideoItem } from '../main/common/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}

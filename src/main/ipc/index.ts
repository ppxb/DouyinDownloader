import { BrowserWindow } from 'electron'

import { registerStoreIpc } from './store'
import { registerSystemIpc } from './system'
import { registerDownloadIpc } from './download'

export const registerIpc = (win: BrowserWindow) => {
  registerStoreIpc()
  registerSystemIpc()
  registerDownloadIpc(win)
}

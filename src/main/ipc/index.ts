import { registerStoreIpc } from './store'
import { registerSystemIpc } from './system'
import { registerDownloadIpc } from './download'
import { BrowserWindow } from 'electron'

export const registerIpc = (win: BrowserWindow) => {
  registerStoreIpc()
  registerSystemIpc()
  registerDownloadIpc(win)
}

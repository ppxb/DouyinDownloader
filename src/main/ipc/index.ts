import { registerStoreIpc } from './store'
import { registerSystemIpc } from './system'
import { registerDownloadIpc } from './download'

export const registerIpc = () => {
  registerStoreIpc()
  registerSystemIpc()
  registerDownloadIpc()
}

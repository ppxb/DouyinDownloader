import { registerStoreIpc } from './store'
import { registerSystemIpc } from './system'

export const registerIpc = () => {
  registerStoreIpc()
  registerSystemIpc()
}

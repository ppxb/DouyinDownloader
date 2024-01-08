import { IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron'
import Store from 'electron-store'

import { IpcEvents } from '../../common/ipcEvents'

export const store = new Store()

export const registerStoreIpc = () => {
  ipcMain.on(
    IpcEvents.APP_SET_STORE,
    (_: IpcMainEvent, name: string, value: string) => store.set(name, value)
  )

  ipcMain.handle(
    IpcEvents.APP_GET_STORE,
    (_: IpcMainInvokeEvent, name: string) => store.get(name)
  )

  ipcMain.on(IpcEvents.APP_DELETE_STORE, (_: IpcMainEvent, name: string) =>
    store.delete(name)
  )
}

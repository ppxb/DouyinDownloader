import { IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron'

import { IpcEvents } from '../../common/ipcEvents'
import { EntityName, store } from '../store'

export const registerStoreIpc = () => {
  ipcMain.on(
    IpcEvents.APP_SET_STORE,
    (_: IpcMainEvent, name: string, value: string) => store.set(name, value)
  )

  ipcMain.handle(
    IpcEvents.APP_GET_STORE,
    (_: IpcMainInvokeEvent, name: string) => store.get(name)
  )

  ipcMain.on(IpcEvents.APP_DELETE_STORE, (_: IpcMainEvent, name: EntityName) =>
    store.delete(name)
  )
}

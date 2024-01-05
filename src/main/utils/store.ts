import { IpcMainEvent } from 'electron'
import Store from 'electron-store'

const store = new Store()

export const setStore = (_: IpcMainEvent, name: string, value: string) => {
  store.set(name, value)
}

export const getStore = (_: IpcMainEvent, name: string) => {
  const value = store.get(name)
  _.returnValue = value || ''
}

export const removeStore = (_: IpcMainEvent, name: string) => {
  store.delete(name)
}

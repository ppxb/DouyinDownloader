import fs from 'fs'
import path from 'path'
import { IpcMainEvent, dialog } from 'electron'
import Store from 'electron-store'

const store = new Store()

export const handleSelectDownloadDir = async (_: IpcMainEvent) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (canceled) return
  _.returnValue = filePaths[0]
}

export const generateDatePath = () => {
  return new Date().toISOString().slice(0, 10)
}

export const createDir = (folder: string) => {
  const settings = JSON.parse(store.get('settings') as string)
  const dir = path.join(settings.state.dir, folder)

  try {
    fs.mkdirSync(dir, { recursive: true })
    return true
  } catch (error) {
    return false
  }
}

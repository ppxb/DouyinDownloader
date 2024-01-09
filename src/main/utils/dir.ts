import fs from 'fs'
import path from 'path'
import { app, dialog } from 'electron'
import Store from 'electron-store'

const store = new Store()

export const _handleDownloadDirChange = async (
  oldPath: string = app.getPath('downloads')
) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: '选择默认存储位置',
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: oldPath
  })
  return !canceled ? filePaths[0] : oldPath
}

export const _getDefaultDownloadDir = async () => {
  return app.getPath('downloads')
}

export const generateDatePath = () => {
  return new Date().toISOString().slice(0, 10)
}

export const createDir = (folder: string) => {
  const {} = JSON.parse(store.get('app') as string)
  const app = JSON.parse(store.get('app') as string)
  const dir = path.join(app.state.dir, folder)

  try {
    fs.mkdirSync(dir, { recursive: true })
    return true
  } catch (error) {
    return false
  }
}

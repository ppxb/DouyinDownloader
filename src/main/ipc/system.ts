import { app, dialog, ipcMain, shell } from 'electron'

import { IpcEvents } from '../../common/ipcEvents'

export const registerSystemIpc = () => {
  ipcMain.on(IpcEvents.APP_OPEN_GITHUB, () =>
    shell.openExternal('https://github.com/ppxb/DouyinDownloader')
  )

  ipcMain.handle(IpcEvents.APP_DEFAULT_DOWNLOAD_DIRECTORY, () => {
    return app.getPath('downloads')
  })

  ipcMain.handle(IpcEvents.APP_SET_DOWNLOAD_DIRECTORY, (_, oldPath?: string) =>
    _handleSetDownloadDirectory(oldPath)
  )
}

export const _handleSetDownloadDirectory = async (
  oldPath: string = app.getPath('downloads')
) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: '请选择存储位置',
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: oldPath
  })
  return !canceled ? filePaths[0] : oldPath
}

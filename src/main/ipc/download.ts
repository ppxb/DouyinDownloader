import { ipcMain, session, IpcMainInvokeEvent } from 'electron'

import { IpcEvents } from '../../common/ipcEvents'
import { AppOriginalUrl } from '../../common/types'
import { _download, _handleAssetsPreview, _handleNewDownload } from './helper'

export const registerDownloadIpc = () => {
  ipcMain.handle(
    IpcEvents.APP_ASSET_PREVIEW,
    (event: IpcMainInvokeEvent, urls: AppOriginalUrl[]) =>
      _handleAssetsPreview(event, urls)
  )

  ipcMain.on(IpcEvents.APP_NEW_DOWNLOAD, _handleNewDownload)

  session.defaultSession.on('will-download', _download)
}

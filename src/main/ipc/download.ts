import { ipcMain, IpcMainInvokeEvent, IpcMainEvent } from 'electron'

import { store } from './store'
import { _handleGetVideoDownloadData } from './helper'
import { IpcEvents } from '../../common/ipcEvents'
import {
  App,
  IDownloadVideoFile,
  IVideoDownloadFilePreview,
  IVideoPatternItem
} from '../../common/types'
import {
  _createFolder,
  _formatFileName,
  _generateDownloadFolder
} from '../utils'
import DownloadManager from '../manager'

const downloadManager = new DownloadManager(5)

export const registerDownloadIpc = () => {
  ipcMain.handle(
    IpcEvents.APP_GET_VIDEO_DOWNLOAD_DATA,
    (event: IpcMainInvokeEvent, items: IVideoPatternItem[]) =>
      _handleGetVideoDownloadData(event, items)
  )

  ipcMain.on(IpcEvents.APP_NEW_DOWNLOAD, _handleNewDownload)
}

export const _handleNewDownload = (
  _: IpcMainEvent,
  data: IVideoDownloadFilePreview[]
) => {
  const { state } = JSON.parse(store.get('app') as string) as App
  data.forEach(item => {
    const newFileName = _formatFileName(state.fileNameFormat, item)
    const folder = _createFolder(_generateDownloadFolder())
    const newDownloadItem = {
      ...item,
      name: newFileName,
      folder
    } as IDownloadVideoFile
    downloadManager.download(newDownloadItem)
  })
}

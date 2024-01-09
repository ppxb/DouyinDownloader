import {
  ipcMain,
  session,
  IpcMainInvokeEvent,
  Event,
  DownloadItem,
  WebContents,
  IpcMainEvent
} from 'electron'

import { IpcEvents } from '../../common/ipcEvents'
import {
  IVideoPatternItem,
  IVideoDownloadFilePreview,
  App,
  IDownloadVideoFile
} from '../../common/types'
import {
  _addDownloadItem,
  _download,
  _getDownloadBytes,
  _handleGetVideoDownloadData,
  _setDownloadStore,
  _updateDownloadItem
} from './helper'
import { store } from './store'
import {
  _createFolder,
  _formatFileName,
  _generateDownloadFolder,
  _pathJoin
} from '../utils'
import DownloadManager from './download-manager'
import { BrowserWindow } from 'electron'

const willDownloadQueue: IDownloadVideoFile[] = []
let downloadItemData: IDownloadVideoFile[] = []
let downloadCompletedIds: string[] = []
const tempDownloadItemIds: string[] = []
let downloadManager: DownloadManager

export const registerDownloadIpc = () => {
  ipcMain.handle(
    IpcEvents.APP_GET_VIDEO_DOWNLOAD_DATA,
    (event: IpcMainInvokeEvent, items: IVideoPatternItem[]) =>
      _handleGetVideoDownloadData(event, items)
  )

  ipcMain.on(IpcEvents.APP_NEW_DOWNLOAD, _handleNewDownload)
}

export const _handleNewDownload = (
  event: IpcMainEvent,
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
    willDownloadQueue.push(newDownloadItem)

    downloadManager.download(newDownloadItem.url, newDownloadItem)

    // const willDownload = createDownloadWrapper(newDownloadItem)
    // _download(event, newDownloadItem.url)
    // session.defaultSession.once('will-download', willDownload)
  })
}

const createDownloadWrapper = (willDownloadItem: IDownloadVideoFile) => {
  return async (e: Event, item: DownloadItem, webContents: WebContents) => {
    e.preventDefault()
    let prevReceivedBytes = 0

    const downloadItem: IDownloadVideoFile = await _addDownloadItem({
      newDownloadItem: willDownloadItem,
      item,
      downloadIds: tempDownloadItemIds,
      data: willDownloadQueue
    })

    webContents.send('newDownloadItem', { ...downloadItem })

    item.on('updated', (_, state) => {
      const receivedBytes = _updateDownloadItem({
        item,
        downloadItem,
        data: downloadItemData,
        prevReceivedBytes,
        state
      })
      prevReceivedBytes = receivedBytes

      // const bytes = _getDownloadBytes(downloadItemData)
      webContents.send('downloadItemUpdate', { ...downloadItem })
    })

    item.on('done', (_, state) => {
      downloadItem.state = state
      downloadItem.receivedBytes = item.getReceivedBytes()

      if (state !== 'cancelled') {
        downloadCompletedIds.push(downloadItem.id)
      }

      _setDownloadStore(downloadItemData)
      webContents.send('downloadItemDone', { ...downloadItem })
    })
  }
}

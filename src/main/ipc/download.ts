import {
  ipcMain,
  session,
  IpcMainInvokeEvent,
  Event,
  DownloadItem,
  WebContents
} from 'electron'

import { IpcEvents } from '../../common/ipcEvents'
import {
  IVideoPatternItem,
  IDownloadFile,
  INewDownloadFile
} from '../../common/types'
import {
  _addDownloadItem,
  _downloadListener,
  _getDownloadBytes,
  _handleGetVideoDownloadData,
  _handleNewDownload,
  _setDownloadStore,
  _updateDownloadItem
} from './helper'

let newDownloadItem: INewDownloadFile | null
let downloadItemData: IDownloadFile[] = []
let downloadCompletedIds: string[] = []
const tempDownloadItemIds: string[] = []

export const registerDownloadIpc = () => {
  ipcMain.handle(
    IpcEvents.APP_GET_VIDEO_DOWNLOAD_DATA,
    (event: IpcMainInvokeEvent, items: IVideoPatternItem[]) =>
      _handleGetVideoDownloadData(event, items)
  )

  ipcMain.on(IpcEvents.APP_NEW_DOWNLOAD, _handleNewDownload)

  session.defaultSession.on('will-download', downloadListener)
}

const downloadListener = async (
  _: Event,
  item: DownloadItem,
  webContents: WebContents
) => {
  if (!newDownloadItem) return

  let prevReceivedBytes = 0

  const downloadItem: IDownloadFile = await _addDownloadItem({
    item,
    downloadIds: tempDownloadItemIds,
    data: downloadItemData,
    newDownloadItem
  })

  console.log(downloadItem)

  webContents.send('newDownloadItem', { ...downloadItem, _sourceItem: null })

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
    webContents.send('downloadItemUpdate', {
      ...downloadItem,
      _sourceItem: null
    })

    item.on('done', (_, state) => {
      downloadItem.state = state
      downloadItem.receivedBytes = item.getReceivedBytes()

      if (state !== 'cancelled') {
        downloadCompletedIds.push(downloadItem.id)
      }

      _setDownloadStore(downloadItemData)
      webContents.send('downloadItemDone', {
        ...downloadItem,
        _sourceItem: null
      })
    })
  })
}

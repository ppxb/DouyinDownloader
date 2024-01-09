import { Session } from 'electron'

import { IDownloadVideoFile } from '../../common/types'
import { _getFileExt } from '../utils'
import { _updateDownloadItem } from './helper'

class DownloadManager {
  private session: Session
  private downloadItems: Map<string, IDownloadVideoFile>

  constructor(session: Session) {
    this.session = session
    this.downloadItems = new Map()

    this.session.on('will-download', (_, downloadItem, webContents) => {
      let prevReceivedBytes = 0

      const item = this.downloadItems.get(downloadItem.getURLChain()[0])
      if (!item) {
        console.error('Download item not found')
        return
      }

      const ext = _getFileExt(downloadItem.getFilename())
      const savePath = `${item.folder}\\${item.name}${ext}`

      downloadItem.setSavePath(savePath)

      downloadItem.on('updated', (_, state) => {
        const receivedBytes = _updateDownloadItem({
          item: downloadItem,
          downloadItem: item,
          data: [],
          prevReceivedBytes,
          state
        })
        prevReceivedBytes = receivedBytes

        // const bytes = _getDownloadBytes(downloadItemData)
        webContents.send('downloadItemUpdate', { ...downloadItem })
      })

      downloadItem.on('done', (_, state) => {
        item.state = state
        item.receivedBytes = downloadItem.getReceivedBytes()

        // if (state !== 'cancelled') {
        //   downloadCompletedIds.push(downloadItem.id)
        // }

        // _setDownloadStore(downloadItemData)
        webContents.send('downloadItemDone', { ...downloadItem })
      })
    })
  }

  download(url: string, item: IDownloadVideoFile) {
    this.downloadItems.set(url, item)
    this.session.downloadURL(item.url)
  }
}

export default DownloadManager

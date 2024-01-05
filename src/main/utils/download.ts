import { DownloadItem, IpcMainEvent, WebContents } from 'electron'
import Store from 'electron-store'

import { createDir, generateDatePath } from './dir'
import { ParsedItem } from '../common/types'

const store = new Store()

export const createTask = async (event: IpcMainEvent, list: ParsedItem[]) => {
  list.forEach(i => event.sender.downloadURL(i.playUrl))
}

export const handleWillDownload = (
  event: IpcMainEvent,
  item: DownloadItem,
  webContents: WebContents
) => {
  const basePath = JSON.parse(store.get('settings') as string).state.dir
  const folder = generateDatePath()
  if (createDir(folder)) {
    item.setSavePath(
      `${basePath}\\${folder}\\${Date.now()}.${
        item.getFilename().split('.')[1]
      }`
    )

    item.on('updated', (e, s) => {
      if (s === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (s === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  } else {
    event.sender.send('downloadError', '创建下载任务失败,下载文件夹创建失败')
  }
}

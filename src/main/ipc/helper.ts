import {
  DownloadItem,
  IpcMainEvent,
  IpcMainInvokeEvent,
  WebContents,
  Event,
  app
} from 'electron'

import { store } from '../ipc/store'
import request, { RequestEnum } from '../utils/request'
import {
  AppParsedVideo,
  IVideoDownloadFilePreview,
  IVideoPatternItem,
  IAddDownloadItem,
  IDownloadBytes,
  IDownloadFile,
  IUpdateDownloadItem
} from '../../common/types'
import { DOUYIN_DETAIL_ENTRY } from '../../common/consts'
import { createDir, generateDatePath } from '../utils/dir'
import { _getBase64Bytes, _getFileName, uuidV4 } from '../utils'

export const _handleGetVideoDownloadData = async (
  event: IpcMainInvokeEvent,
  items: IVideoPatternItem[]
) => {
  try {
    const details = await fetchVideoData(items)
    if (details.length === 0) {
      event.sender.send('downloadError', 'Cookie 异常,Cookie 格式错误或已失效')
      return []
    }
    const data = getVideoData(details as PromiseFulfilledResult<any>[])
    return data
  } catch (error) {
    event.sender.send('downloadError', (error as Error).message)
    return []
  }
}

const fetchVideoData = (data: IVideoPatternItem[]) => {
  const params = {
    device_platform: 'webapp',
    aid: '6383',
    channel: 'channel_pc_web',
    pc_client_type: '1',
    version_code: '190500',
    version_name: '19.5.0',
    cookie_enabled: 'true',
    platform: 'PC',
    downlink: '10'
  }
  return Promise.all(
    data.map(
      async url =>
        await request({
          baseURL: DOUYIN_DETAIL_ENTRY,
          method: RequestEnum.GET,
          params: { ...params, aweme_id: url.id }
        })
    )
  )
}

const getVideoData = (details: PromiseFulfilledResult<any>[]) => {
  return details
    .filter(d => d['aweme_detail'] !== null)
    .map(i => {
      let nickname = i['aweme_detail']['author']['nickname'] as string

      return {
        id: i['aweme_detail']['aweme_id'],
        title: i['aweme_detail']['desc'],
        userNickName: nickname.startsWith('@') ? nickname.slice(1) : nickname,
        userSecUid: i['aweme_detail']['author']['sec_uid'],
        userAvatar: i['aweme_detail']['author']['avatar_thumb']['url_list'][0],
        url: i['aweme_detail']['video']['play_addr']['url_list'].slice(-1)[0],
        duration: i['aweme_detail']['duration'],
        size: i['aweme_detail']['video']['play_addr']['data_size'],
        cover: i['aweme_detail']['video']['cover']['url_list'][0],
        width: i['aweme_detail']['video']['play_addr']['width'],
        height: i['aweme_detail']['video']['play_addr']['height']
      } as IVideoDownloadFilePreview
    })
}

export const _handleNewDownload = (
  event: IpcMainEvent,
  data: AppParsedVideo[]
) => data.forEach(item => event.sender.downloadURL(item.video.url))

export const _downloadListener = (
  _: Event,
  item: DownloadItem,
  webContents: WebContents
) => {
  const storageBasePath = JSON.parse(store.get('app') as string).state.dir
  const folder = generateDatePath()
  if (createDir(folder)) {
    item.setSavePath(
      `${storageBasePath}\\${folder}\\${Date.now()}.${
        item.getFilename().split('.')[1]
      }`
    )

    item.on('updated', (_, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })

    item.once('done', (_, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  } else {
    webContents.send('downloadError', '创建下载任务失败,下载文件夹创建失败')
  }
}

export const _addDownloadItem = async ({
  item,
  downloadIds,
  data,
  newDownloadItem
}: IAddDownloadItem): Promise<IDownloadFile> => {
  const id = downloadIds.shift() || ''
  const itemIndex = _getDownloadIndex(data, id)

  const fileUrl = item.getURL()
  const fileName = _getFileName(
    newDownloadItem?.fileName || '',
    item.getFilename()
  )
  const startTime = item.getStartTime()
  const totalBytes = _getBase64Bytes(fileUrl) || item.getTotalBytes()

  let fileId = uuidV4()
  const savePath = newDownloadItem?.path || app.getPath('downloads')

  if (itemIndex > -1) {
    const newItems = data.splice(itemIndex, 1)
    const newItem = newItems[0]

    fileId = newItem.id
    if (newItem.paused) {
      item.pause()
    }
  }

  item.setSavePath(savePath)

  const downloadItem: IDownloadFile = {
    id: fileId,
    url: fileUrl,
    fileName,
    path: savePath,
    state: item.getState(),
    startTime,
    speed: 0,
    progress: 0,
    totalBytes,
    receivedBytes: item.getReceivedBytes(),
    paused: item.isPaused(),
    _sourceItem: item
  }

  data.unshift(downloadItem)
  newDownloadItem = null
  _setDownloadStore(data)

  return downloadItem
}

export const _updateDownloadItem = ({
  item,
  downloadItem,
  data,
  prevReceivedBytes,
  state
}: IUpdateDownloadItem): number => {
  const receivedBytes = item.getReceivedBytes()

  downloadItem.receivedBytes = receivedBytes
  downloadItem.speed = receivedBytes - prevReceivedBytes
  downloadItem.progress = receivedBytes / downloadItem.totalBytes
  downloadItem.state = state
  downloadItem.paused = item.isPaused()

  _setDownloadStore(data)
  return receivedBytes
}

export const _getDownloadBytes = (data: IDownloadFile[]): IDownloadBytes => {
  const allBytes = data.reduce<IDownloadBytes>(
    (prev, current) => {
      if (current.state === 'progressing') {
        prev.receivedBytes += current.receivedBytes
        prev.totalBytes += current.totalBytes
      }

      return prev
    },
    { receivedBytes: 0, totalBytes: 0 }
  )

  return allBytes
}

export const _getDownloadIndex = (data: IDownloadFile[], id: string): number =>
  data.findIndex(item => item.id === id)

export const _setDownloadStore = (data: IDownloadFile[]): void =>
  store.set('downloadManager', data)

export const _getDownloadStore = (): IDownloadFile[] =>
  store.get('downloadManager', []) as IDownloadFile[]

import {
  DownloadItem,
  IpcMainEvent,
  IpcMainInvokeEvent,
  WebContents,
  Event
} from 'electron'

import { store } from '../ipc/store'
import request, { RequestEnum } from '../utils/request'
import { AppOriginalUrl, AppParsedVideo } from '../../common/types'
import { DOUYIN_DETAIL_ENTRY } from '../../common/consts'
import { createDir, generateDatePath } from '../utils/dir'

export const _handleAssetsPreview = async (
  event: IpcMainInvokeEvent,
  urls: AppOriginalUrl[]
) => {
  try {
    const details = await getUrlsDetails(urls)
    if (details[0] === '') {
      event.sender.send('downloadError', 'Cookie 异常,Cookie 格式错误或已失效')
      return []
    }
    const videos = parseVideoDetails(details as PromiseFulfilledResult<any>[])
    return videos
  } catch (error) {
    event.sender.send('downloadError', (error as Error).message)
    return []
  }
}

const getUrlsDetails = (urls: AppOriginalUrl[]) => {
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
    urls.map(
      async url =>
        await request({
          baseURL: DOUYIN_DETAIL_ENTRY,
          method: RequestEnum.GET,
          params: { ...params, aweme_id: url.id }
        })
    )
  )
}

const parseVideoDetails = (
  details: PromiseFulfilledResult<AppParsedVideo>[]
) => {
  return details
    .filter(d => d['aweme_detail'] !== null)
    .map(i => {
      let nickname = i['aweme_detail']['author']['nickname'] as string
      nickname = nickname.startsWith('@') ? nickname.slice(1) : nickname

      return {
        title: i['aweme_detail']['desc'],
        author: {
          nickname,
          secUid: i['aweme_detail']['author']['sec_uid'],
          avatar: i['aweme_detail']['author']['avatar_thumb']['url_list'][0]
        },
        id: i['aweme_detail']['aweme_id'],
        video: {
          url: i['aweme_detail']['video']['play_addr']['url_list'].slice(-1)[0],
          duration: i['aweme_detail']['duration'],
          size: i['aweme_detail']['video']['play_addr']['data_size'],
          cover: i['aweme_detail']['video']['cover']['url_list'][0],
          width: i['aweme_detail']['video']['play_addr']['width'],
          height: i['aweme_detail']['video']['play_addr']['height']
        }
      } as AppParsedVideo
    })
}

export const _handleNewDownload = (
  event: IpcMainEvent,
  data: AppParsedVideo[]
) => data.forEach(item => event.sender.downloadURL(item.video.url))

export const _download = (
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

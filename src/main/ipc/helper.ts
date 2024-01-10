import { IpcMainInvokeEvent } from 'electron'

import { store } from '../ipc/store'
import request, { RequestEnum } from '../utils/request'
import {
  IVideoDownloadFilePreview,
  IVideoPatternItem,
  IDownloadVideoFile
} from '../../common/types'
import { DOUYIN_DETAIL_ENTRY } from '../../common/consts'

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

const fetchVideoData = (items: IVideoPatternItem[]) => {
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
    items.map(
      async i =>
        await request({
          baseURL: DOUYIN_DETAIL_ENTRY,
          method: RequestEnum.GET,
          params: { ...params, aweme_id: i.id }
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

export const _getDownloadIndex = (
  data: IDownloadVideoFile[],
  id: string
): number => data.findIndex(item => item.id === id)

export const _setDownloadStore = (data: IDownloadVideoFile[]): void =>
  store.set('downloadManager', data)

export const _getDownloadStore = (): IDownloadVideoFile[] =>
  store.get('downloadManager', []) as IDownloadVideoFile[]

import { IpcMainEvent, IpcMainInvokeEvent } from 'electron'

import request, { RequestEnum } from './request'
import { parseVideoList } from '../utils/data'
import { createTask } from '../utils/download'
import { ParsedVideoItem } from '../common/types'

const BASE_DETAIL_URL = 'https://www.douyin.com/aweme/v1/web/aweme/detail'

export interface ExtractedData {
  name: string
  id: string
}

export const _handleDownloadPreview = async (
  event: IpcMainInvokeEvent,
  data: ExtractedData[]
) => {
  try {
    const details = await getDetails(data)
    const list = parseVideoList(
      details as PromiseFulfilledResult<ParsedVideoItem>[]
    )
    return list
  } catch (error) {
    event.sender.send('downloadError', (error as Error).message)
    return []
  }
}

export const handleUrlsDownload = async (
  event: IpcMainEvent,
  data: ExtractedData[]
) => {
  if (data.length === 0) return
  try {
    const list = parseVideoList(
      (await getDetails(data)) as PromiseFulfilledResult<any>[]
    )
    createTask(event, list)
  } catch (error) {
    event.sender.send('downloadError', (error as Error).message)
  }
}

const getDetails = (data: ExtractedData[]) => {
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
  return Promise.allSettled(
    data.map(async item => {
      return await request({
        baseURL: BASE_DETAIL_URL,
        method: RequestEnum.GET,
        params: { ...params, aweme_id: item.id }
      })
    })
  )
}

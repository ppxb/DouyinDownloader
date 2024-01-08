import { DownloadItem } from 'electron'

export interface AppParsedVideo {
  title: string
  author: AppParsedVideoAuthor
  video: AppParsedVideoDetail
  id: string
}

export interface AppParsedVideoAuthor {
  nickname: string
  secUid: string
  avatar: string
}

export interface AppParsedVideoDetail {
  url: string
  duration: number
  size: number
  cover: string
  height: number
  width: number
}

export type DownloadItemState =
  | 'progressing'
  | 'interrupted'
  | 'completed'
  | 'cancelled'

export interface IVideoPatternItem {
  type: string
  id: string
}

export interface IVideoDownloadFilePreview {
  id: string
  title: string
  userNickName: string
  userSecUid: string
  userAvatar: string
  url: string
  duration: number
  size: number
  cover: string
  width: number
  height: number
}

export interface INewDownloadFile {
  url: string
  fileName?: string
  path: string
}

export interface IDownloadFile {
  id: string
  url: string
  fileName: string
  path: string
  state: DownloadItemState
  startTime: number
  speed: number
  progress: number
  totalBytes: number
  receivedBytes: number
  paused: boolean
  _sourceItem: DownloadItem | undefined
}

export interface IAddDownloadItem {
  item: DownloadItem
  downloadIds: string[]
  data: IDownloadFile[]
  newDownloadItem: INewDownloadFile | null
}

export interface IUpdateDownloadItem {
  item: DownloadItem
  data: IDownloadFile[]
  downloadItem: IDownloadFile
  prevReceivedBytes: number
  state: DownloadItemState
}

export interface IDownloadBytes {
  receivedBytes: number
  totalBytes: number
}

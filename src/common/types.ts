import { DownloadItem } from 'electron'

export interface App {
  state: AppState
  version: number
}

export interface AppState {
  cookie: string
  dir: string
  folderNameFormat: string
  fileNameFormat: string
}

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

export interface IDownloadFileBase {
  state: DownloadItemState
  startTime: number
  speed: number
  progress: number
  totalBytes: number
  receivedBytes: number
  paused: boolean
}

export interface IDownloadVideoFile extends IVideoDownloadFilePreview {
  name: string
  path: string
  folder: string
  state: DownloadItemState
  startTime: number
  speed: number
  progress: number
  totalBytes: number
  lastTime: number
  receivedBytes: number
  paused: boolean
}

export interface IDownloadFile {
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
  newDownloadItem: IDownloadVideoFile
  item: DownloadItem
  downloadIds: string[]
  data: IDownloadVideoFile[]
}

export interface IUpdateDownloadItem {
  item: DownloadItem
  data: IDownloadVideoFile[]
  downloadItem: IDownloadVideoFile
  prevReceivedBytes: number
  state: DownloadItemState
}

export interface IDownloadBytes {
  receivedBytes: number
  totalBytes: number
}

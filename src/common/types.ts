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

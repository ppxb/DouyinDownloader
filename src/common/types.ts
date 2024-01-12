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
  | 'finish'
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
  ratio: string
}

export interface IDownloadVideoFile extends IVideoDownloadFilePreview {
  name: string
  path: string
  folder: string
  state: DownloadItemState
  startTime: number
  speed: number
  percentage: number
  length: number
  eta: number
  transferred: number
  paused: boolean
  finishTime: string
}

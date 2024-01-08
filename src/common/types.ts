export interface AppState {
  cookie: string
  dir: string
}

export interface AppOriginalUrl {
  type: string
  id: string
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

export interface ParsedVideoItem {
  title: string
  author: ParsedVideoItemAuthor
  video: ParsedVideoItemVideo
  id: string
}

export interface ParsedVideoItemAuthor {
  nickname: string
  secUid: string
  avatar: string
}

export interface ParsedVideoItemVideo {
  url: string
  duration: number
  size: number
  cover: string
  height: number
  width: number
}

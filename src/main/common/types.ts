export interface ParsedItem {
  itemTitle: string
  author: ParsedItemAuthor
  playUrl: string
}

export interface ParsedItemAuthor {
  nickname: string
  secUid: string
  avatar: string
}

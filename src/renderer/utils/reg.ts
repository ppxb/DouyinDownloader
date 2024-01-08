import { AppVideoPatternItem } from '@common/types'

export type PatternMap = {
  [key: string]: RegExp
}

export type ExtractedData = {
  type: string
  id: string
}

export const extractDataFromUrls = (
  urls: string[],
  patterns: PatternMap
): AppVideoPatternItem[] => {
  return urls.map(url => {
    for (const [name, pattern] of Object.entries(patterns)) {
      const match = pattern.exec(url)
      if (match && match.at(-1)) {
        return { type: name, id: match.at(-1)! }
      }
    }
    return { type: 'unknown', id: '' }
  })
}

export const urlPatterns = {
  accountLink: new RegExp(
    'https://www\\.douyin\\.com/user/([A-Za-z0-9_-]+)(?:.*?modal_id=(\\d{19}))?'
  ),
  discoverLink: new RegExp(
    'https://www\\.douyin\\.com/discover(?:.*?modal_id=(\\d{19}))?'
  ),
  collectionLink: new RegExp(
    'https://www\\.douyin\\.com/collection/(\\d+)',
    'g'
  )
}

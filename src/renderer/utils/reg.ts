export type PatternMap = {
  [key: string]: RegExp
}

export type ExtractedData = {
  name: string
  id: string
}

export const extractDataFromUrls = (
  urls: string[],
  patterns: PatternMap
): ExtractedData[] => {
  return urls.map(url => {
    for (const [name, pattern] of Object.entries(patterns)) {
      const match = pattern.exec(url)
      if (match && match.at(-1)) {
        return { name, id: match.at(-1)! }
      }
    }
    return { name: 'unknown', id: '' }
  })
}

export const urlPatterns = {
  account: new RegExp(
    '\\S*?https://www\\.douyin\\.com/user/([A-Za-z0-9_-]+)(?:\\S*?\\bmodal_id=(\\d{19}))?'
  ),
  discover: new RegExp(
    '\\S*?https://www\\.douyin\\.com/discover(?:\\S*?\\bmodal_id=(\\d{19}))?'
  )
}

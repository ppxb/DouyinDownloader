import { ParsedItem } from '../common/types'

export const parseList = (list: PromiseFulfilledResult<any>[]) => {
  return list
    .filter(r => r.status === 'fulfilled' && r.value['aweme_detail'] !== null)
    .map(
      i =>
        ({
          itemTitle: i.value['aweme_detail']['item_title'],
          author: {
            nickname: i.value['aweme_detail']['author']['nickname'],
            secUid: i.value['aweme_detail']['author']['sec_uid'],
            avatar:
              i.value['aweme_detail']['author']['avatar_thumb']['url_list'][0]
          },
          playUrl:
            i.value['aweme_detail']['video']['play_addr']['url_list'].slice(
              -1
            )[0]
        }) as ParsedItem
    )
}

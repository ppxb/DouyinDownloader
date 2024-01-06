import { ParsedVideoItem } from '../common/types'

export const parseVideoList = (
  list: PromiseFulfilledResult<ParsedVideoItem>[]
) => {
  return list
    .filter(r => r.status === 'fulfilled' && r.value['aweme_detail'] !== null)
    .map(
      i =>
        ({
          title: i.value['aweme_detail']['desc'],
          author: {
            nickname: i.value['aweme_detail']['author']['nickname'],
            secUid: i.value['aweme_detail']['author']['sec_uid'],
            avatar:
              i.value['aweme_detail']['author']['avatar_thumb']['url_list'][0]
          },
          id: i.value['aweme_detail']['aweme_id'],
          video: {
            url: i.value['aweme_detail']['video']['play_addr'][
              'url_list'
            ].slice(-1)[0],
            duration: i.value['aweme_detail']['duration'],
            size: i.value['aweme_detail']['video']['play_addr']['data_size'],
            cover: i.value['aweme_detail']['video']['cover']['url_list'][0],
            width: i.value['aweme_detail']['video']['play_addr']['width'],
            height: i.value['aweme_detail']['video']['play_addr']['height']
          }
        }) as ParsedVideoItem
    )
}

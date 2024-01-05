import { ExtractedData } from './reg'

export const fetchWithParams = async (
  url: string,
  params: Record<string, string>
): Promise<Response> => {
  const queryParams = new URLSearchParams(params)
  const response = await fetch(`${url}/?${queryParams}`, {
    method: 'GET',
    credentials: 'include'
  })
  return response
}

export const fetchBatchUrlsWithParams = async (
  items: ExtractedData[]
): Promise<Response[]> => {
  try {
    const params = {
      device_platform: 'webapp',
      aid: '6383',
      channel: 'channel_pc_web',
      pc_client_type: '1',
      version_code: '190500',
      version_name: '19.5.0',
      cookie_enabled: 'true',
      platform: 'PC',
      downlink: '10'
    }
    const fetchPromises = items.map(item =>
      fetchWithParams(BASE_DETAIL_URL, {
        ...params,
        aweme_id: item.id
      })
    )
    const responses = await Promise.all(fetchPromises)
    return responses
  } catch (error) {
    throw error
  }
}

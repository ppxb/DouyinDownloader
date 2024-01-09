import { Card, CardBody, Tooltip } from '@nextui-org/react'

import { IDownloadVideoFile } from '@common/types'
import { formatSize, formatTime } from '@renderer/utils'

interface DownloadingItemProps {
  item: IDownloadVideoFile
  index?: number
  onPauseOrResume?: (item: IDownloadVideoFile) => void
  onCancel?: (item: IDownloadVideoFile) => void
}

const DownloadingItem = ({ item }: DownloadingItemProps) => {
  return (
    <div className="flex flex-col">
      <Card key={item.id} className="mb-2">
        <CardBody className="flex-row justify-between items-center px-4">
          <div className="flex flex-col">
            <p className="text-tiny text-default-500">{item.id}</p>
            <Tooltip content={item.title} delay={0} closeDelay={0}>
              <div className="w-52 text-sm font-bold overflow-hidden text-ellipsis whitespace-nowrap mb-1">
                {item.title}
              </div>
            </Tooltip>
          </div>
          <div className="text-tiny">
            {formatSize(item.receivedBytes)}/{formatSize(item.size)}M
          </div>
          <div className="text-tiny">{formatSize(item.speed)} MB/s</div>
          <div className="text-tiny">{formatTime(item.lastTime)}</div>
        </CardBody>
      </Card>
    </div>
  )
}

export default DownloadingItem

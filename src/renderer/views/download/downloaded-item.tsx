import { Card, CardBody, Tooltip } from '@nextui-org/react'

import { IDownloadVideoFile } from '@common/types'
import { formatSize } from '@renderer/utils'
import { OpenFolderIcon } from '@renderer/components/icon'

interface DownloadedItemProps {
  item: IDownloadVideoFile
  index?: number
  onOpenFolder?: (item: IDownloadVideoFile) => void
}

const DownloadedItem = ({ item }: DownloadedItemProps) => {
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
          <div className="text-tiny">{formatSize(item.length)}M</div>
          <div className="text-tiny">{item.finishTime}</div>
          <div className="flex gap-2">
            <OpenFolderIcon className="hover:cursor-pointer" />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default DownloadedItem

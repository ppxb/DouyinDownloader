import { Card, CardBody, Divider, Tooltip, Progress } from '@nextui-org/react'

import { IDownloadVideoFile } from '@common/types'
import { formatEta, formatSize, formatSpeed } from '@renderer/utils'
// import { PauseIcon, DeleteIcon, PlayIcon } from '@renderer/components/icon'

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
            <p className="text-tiny text-default-500">ID #{item.id}</p>
            <Tooltip content={item.title} delay={0} closeDelay={0}>
              <div className="w-52 text-sm font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                {item.title}
              </div>
            </Tooltip>
            <div className="flex items-center gap-2">
              <div className="text-tiny text-default-500">{item.ratio}</div>
              <Divider orientation="vertical" className="h-3" />
              <div className="text-tiny text-default-500">
                {formatSize(item.size)} MB
              </div>
            </div>
          </div>
          <Progress
            size="sm"
            classNames={{
              base: 'max-w-md !gap-1',
              label: 'text-tiny',
              value: 'text-tiny'
            }}
            color="success"
            label={`${formatSpeed(item.speed)}/s(${formatEta(item.eta)}) `}
            value={item.percentage}
            showValueLabel={true}
          />
          {/* <div className="flex gap-2">
            {item.state === 'progressing' ? (
              <PauseIcon className="hover:cursor-pointer" />
            ) : (
              <PlayIcon className="hover:cursor-pointer" />
            )}

            <DeleteIcon className="text-red-500 hover:cursor-pointer" />
          </div> */}
        </CardBody>
      </Card>
    </div>
  )
}

export default DownloadingItem

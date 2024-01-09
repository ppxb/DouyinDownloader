import { IDownloadVideoFile } from '@common/types'

import { EmptyBoxIcon } from '@renderer/components/icon'
import DownloadingItem from './downloading-item'

interface DownloadingContentProps {
  items: IDownloadVideoFile[]
}

const DownloadingContent = ({ items }: DownloadingContentProps) => {
  if (!items.length) {
    return (
      <div className="h-[calc(100vh-300px)] flex flex-col items-center justify-center">
        <EmptyBoxIcon className="mb-2" />
        <span className="text-tiny text-foreground/50">暂无下载任务</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map(item => (
        <DownloadingItem key={item.id} item={item} />
      ))}
    </div>
  )
}

export default DownloadingContent

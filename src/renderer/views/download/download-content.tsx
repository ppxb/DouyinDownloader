import { IDownloadVideoFile } from '@common/types'

import { EmptyBoxIcon, EmptyFolderIcon } from '@renderer/components/icon'
import DownloadingItem from './downloading-item'
import DownloadedItem from './downloaded-item'

interface DownloadingContentProps {
  items: IDownloadVideoFile[]
  type: 'downloading' | 'downloaded'
}

const DownloadingContent = ({ items, type }: DownloadingContentProps) => {
  if (!items.length) {
    return (
      <div className="h-[calc(100vh-300px)] flex flex-col items-center justify-center">
        {type === 'downloading' ? (
          <>
            <EmptyBoxIcon className="mb-2" />
            <span className="text-tiny text-foreground/50">暂无下载任务</span>
          </>
        ) : (
          <>
            <EmptyFolderIcon className="mb-2" />
            <span className="text-tiny text-foreground/50">暂无已完成任务</span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-4 gap-2">
      {items.map(item => {
        if (type === 'downloading')
          return <DownloadingItem key={item.id} item={item} />
        return <DownloadedItem key={item.id} item={item} />
      })}
    </div>
  )
}

export default DownloadingContent

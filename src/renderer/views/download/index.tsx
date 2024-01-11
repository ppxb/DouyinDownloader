import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  useDisclosure,
  Tabs,
  Tab
} from '@nextui-org/react'
import hotKeys from 'hotkeys-js'
import { toast } from 'sonner'

import {
  listenerDownloadItemFinish,
  listenerDownloadItemUpdate,
  listenerNewDownloadItem
} from '@renderer/ipc'
import { IDownloadVideoFile } from '@common/types'

import LinkModal from './link-modal'
import DownloadMenu from './download-menu'
import DownloadContent from './download-content'

const DownloadPage = () => {
  const linkModalRef = useDisclosure()
  const [downloadItem, setDownloadItem] = useState<IDownloadVideoFile[]>([])

  const downloadItemRef = useRef<IDownloadVideoFile[]>([])

  const handleUpdateData = useCallback((item: IDownloadVideoFile) => {
    const index = downloadItemRef.current.findIndex(d => d.id === item.id)

    if (index < 0) {
      downloadItemRef.current.unshift(item)
    } else {
      downloadItemRef.current[index] = item
    }

    setDownloadItem([...downloadItemRef.current])
  }, [])

  useEffect(() => {
    listenerNewDownloadItem((_, item) => {
      if (!downloadItemRef.current.map(i => i.id === item.id).length) {
        downloadItemRef.current.push(item)
      }
      handleUpdateData(item)
    })

    listenerDownloadItemUpdate((_, item) => {
      handleUpdateData(item)
    })

    listenerDownloadItemFinish((_, item) => {
      handleUpdateData(item)
    })
  }, [handleUpdateData])

  useEffect(() => {
    hotKeys('ctrl+n', (_, handler) => {
      switch (handler.key) {
        case 'ctrl+n':
          linkModalRef.onOpen()
          break
      }
    })
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.on('downloadError', (_, args: string) => {
      const err = args.split(',')
      toast(err[0], {
        position: 'top-center',
        description: err[1],
        duration: 2000,
        classNames: {
          title: '!text-sm !font-bold',
          description: '!text-xs'
        }
      })
    })
    return () => window.electron.ipcRenderer.removeAllListeners('downloadError')
  }, [])

  return (
    <>
      <Card radius="none" className="relative min-h-screen overflow-visible">
        <CardHeader className="flex pt-10 px-8 sticky z-40 top-0 mb-2 backdrop-blur-lg">
          <div className="felx flex-col">
            <div className="text-2xl font-bold mb-1">下载</div>
            <div className="text-tiny text-foreground/50">
              开始新的下载任务以及查看下载任务
            </div>
          </div>
        </CardHeader>
        <CardBody className="py-4">
          <Tabs
            size="sm"
            classNames={{
              base: 'px-4'
            }}
          >
            <Tab key="downloading" title="下载中">
              <DownloadContent
                type="downloading"
                items={downloadItem.filter(i => i.state === 'progressing')}
              />
            </Tab>
            <Tab key="downloaded" title="已完成">
              <DownloadContent
                type="downloaded"
                items={downloadItem.filter(i => i.state === 'finish')}
              />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
      <DownloadMenu openLinkModal={linkModalRef.onOpen} />
      <LinkModal isOpen={linkModalRef.isOpen} onClose={linkModalRef.onClose} />
    </>
  )
}

export default DownloadPage

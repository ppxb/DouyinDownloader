import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea
} from '@nextui-org/react'
import hotKeys from 'hotkeys-js'
import { toast } from 'sonner'

import {
  DownloadIcon,
  AccountIcon,
  UrlsIcon,
  HotIcon,
  FavIcon,
  AlbumIcon
} from '@renderer/components/icon'
import { extractDataFromUrls, urlPatterns } from '@renderer/utils/reg'

const DownloadPage = () => {
  const [urls, setUrls] = useState('')
  const urlsDownloadModal = useDisclosure()

  const handleCancel = useCallback(() => {
    setUrls('')
    urlsDownloadModal.onClose()
  }, [])

  const handleStart = () => {
    if (urls.length === 0) return
    urlsDownloadModal.onClose()
    const ids = extractDataFromUrls([...new Set(urls.split('\n'))], urlPatterns)
    window.electron.ipcRenderer.send('urlsDownload', ids)
  }

  const filterdUrls = useMemo(
    () => urls.split('\n').filter(i => i !== ''),
    [urls]
  )

  useEffect(() => {
    hotKeys('ctrl+n', (_, handler) => {
      switch (handler.key) {
        case 'ctrl+n':
          urlsDownloadModal.onOpen()
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
    <Card radius="none" className="relative min-h-screen overflow-visible">
      <CardHeader className="flex pt-10 px-8 sticky z-40 top-0 mb-2 backdrop-blur-lg">
        <div className="felx flex-col">
          <div className="text-2xl font-bold mb-1">下载</div>
          <div className="text-tiny text-foreground/50">
            在此处开始新的下载任务以及查看下载任务
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-5 py-4">
        <div className="absolute right-14 bottom-14">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly radius="lg" variant="flat">
                <DownloadIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="faded"
              aria-label="Create a new download task"
            >
              <DropdownSection title="新建下载任务">
                <DropdownItem
                  key="Urls download"
                  startContent={<UrlsIcon className="icon-default" />}
                  shortcut="Ctrl + N"
                  onPress={urlsDownloadModal.onOpen}
                >
                  链接下载
                </DropdownItem>
                <DropdownItem
                  key="Download account works"
                  startContent={<AccountIcon className="icon-default" />}
                  shortcut="Ctrl + A"
                >
                  账号作品下载
                </DropdownItem>
                <DropdownItem
                  key="Download album works"
                  startContent={<AlbumIcon className="icon-default" />}
                  shortcut="Ctrl + B"
                >
                  图集下载
                </DropdownItem>
                <DropdownItem
                  key="Favorite works batch download"
                  startContent={<FavIcon className="icon-default" />}
                  shortcut="Ctrl + F"
                >
                  收藏下载
                </DropdownItem>
                <DropdownItem
                  key="Hot works batch download"
                  startContent={<HotIcon className="icon-default" />}
                  shortcut="Ctrl + H"
                >
                  热榜下载
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>

      <Modal
        backdrop="blur"
        size="2xl"
        radius="lg"
        isOpen={urlsDownloadModal.isOpen}
        onClose={urlsDownloadModal.onClose}
      >
        <ModalContent>
          <ModalHeader>开始新的链接下载任务</ModalHeader>
          <ModalBody>
            <Textarea
              label="请输入单个或多个下载链接，换行以进行分隔"
              description={`共 ${filterdUrls.length} 个链接，其中共 ${
                [...new Set(filterdUrls)].length
              } 个非重复项`}
              spellCheck="false"
              minRows={5}
              maxRows={15}
              value={urls}
              onValueChange={setUrls}
              classNames={{
                input: 'break-all',
                description: 'mt-2'
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              radius="lg"
              color="danger"
              variant="light"
              onPress={handleCancel}
            >
              取消
            </Button>
            <Button radius="lg" color="primary" onPress={handleStart}>
              开始
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  )
}

export default DownloadPage

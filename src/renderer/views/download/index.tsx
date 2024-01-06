import { useEffect } from 'react'
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
  Tabs,
  Tab
} from '@nextui-org/react'
import hotKeys from 'hotkeys-js'
import { toast } from 'sonner'

import {
  AccountIcon,
  UrlsIcon,
  HotIcon,
  FavIcon,
  AlbumIcon,
  NewIcon
} from '@renderer/components/icon'
import UrlsModal from './urlsModal'

const DownloadPage = () => {
  const urlsModal = useDisclosure()

  useEffect(() => {
    hotKeys('ctrl+n', (_, handler) => {
      switch (handler.key) {
        case 'ctrl+n':
          urlsModal.onOpen()
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
            开始新的下载任务以及查看下载任务
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-5 py-4">
        <Tabs size="sm">
          <Tab>下载中</Tab>
          <Tab>已完成</Tab>
        </Tabs>
        <div className="absolute right-14 bottom-14">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly radius="lg" variant="flat">
                <NewIcon />
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
                  onPress={urlsModal.onOpen}
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

      <UrlsModal isOpen={urlsModal.isOpen} onClose={urlsModal.onClose} />
    </Card>
  )
}

export default DownloadPage

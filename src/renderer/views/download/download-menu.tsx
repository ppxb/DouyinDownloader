import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  Button
} from '@nextui-org/react'

import {
  NewIcon,
  UrlsIcon,
  AccountIcon,
  AlbumIcon,
  FavIcon,
  HotIcon
} from '@renderer/components/icon'

interface DownloadMenuProps {
  openLinkModal: () => void
  openAccountModal: () => void
}

const DownloadMenu = ({
  openLinkModal,
  openAccountModal
}: DownloadMenuProps) => {
  const menus = [
    {
      name: '链接下载',
      startContent: <UrlsIcon className="icon-default" />,
      shortcut: 'Ctrl + N',
      onPress: openLinkModal
    },
    {
      name: '账号作品下载',
      startContent: <AccountIcon className="icon-default" />,
      shortcut: 'Ctrl + A',
      onPress: openAccountModal
    },
    {
      name: '图集下载',
      startContent: <AlbumIcon className="icon-default" />,
      shortcut: 'Ctrl + B',
      onPress: () => {}
    },
    {
      name: '收藏下载',
      startContent: <FavIcon className="icon-default" />,
      shortcut: 'Ctrl + F',
      onPress: () => {}
    },
    {
      name: '热榜下载',
      startContent: <HotIcon className="icon-default" />,
      shortcut: 'Ctrl + H',
      onPress: () => {}
    }
  ]

  return (
    <div className="absolute right-24 bottom-24">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly radius="lg" variant="flat">
            <NewIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Download menu">
          <DropdownSection title="新建下载任务">
            {menus.map(m => (
              <DropdownItem
                key={m.name}
                startContent={m.startContent}
                shortcut={m.shortcut}
                onPress={m.onPress}
              >
                {m.name}
              </DropdownItem>
            ))}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default DownloadMenu

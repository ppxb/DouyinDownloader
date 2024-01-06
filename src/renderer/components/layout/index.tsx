import { Outlet } from 'react-router-dom'
import { Button, Link, Tooltip } from '@nextui-org/react'
import { Toaster } from 'sonner'

import { DownloadIcon, InfoIcon, SettingsIcon } from '@renderer/components/icon'

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Toaster
        toastOptions={{
          className: 'font-sans'
        }}
      />
      <div className="flex flex-col items-center justify-center w-20 gap-2 bg-default-100">
        <Tooltip content="下载" placement="right">
          <Button isIconOnly as={Link} href="/" variant="light">
            <DownloadIcon />
          </Button>
        </Tooltip>
        <Tooltip content="设置" placement="right">
          <Button isIconOnly as={Link} href="/settings" variant="light">
            <SettingsIcon />
          </Button>
        </Tooltip>
        <Tooltip content="关于" placement="right">
          <Button
            isIconOnly
            variant="light"
            onPress={() => window.api.openGithub()}
          >
            <InfoIcon />
          </Button>
        </Tooltip>
      </div>
      <div className="w-full overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout

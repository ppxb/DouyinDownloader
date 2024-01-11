import { Outlet, useNavigate } from 'react-router-dom'
import { Button, Tooltip } from '@nextui-org/react'
import { Toaster } from 'sonner'

import { DownloadIcon, InfoIcon, SettingsIcon } from '@renderer/components/icon'

const Layout = () => {
  const navigate = useNavigate()

  const goToHome = () => navigate('/')
  const goToSettings = () => navigate('/settings')

  return (
    <div className="flex h-screen">
      <Toaster
        toastOptions={{
          className: 'font-sans'
        }}
      />
      <div className="flex flex-col items-center justify-center w-16 gap-2 bg-default-100">
        <Tooltip content="下载" placement="right">
          <Button isIconOnly variant="light" onPress={goToHome}>
            <DownloadIcon />
          </Button>
        </Tooltip>
        <Tooltip content="设置" placement="right">
          <Button isIconOnly variant="light" onPress={goToSettings}>
            <SettingsIcon />
          </Button>
        </Tooltip>
        <Tooltip content="关于" placement="right">
          <Button
            isIconOnly
            variant="light"
            onPress={() => window.electron.ipcRenderer.send('app:open-github')}
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

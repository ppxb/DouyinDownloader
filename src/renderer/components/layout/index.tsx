import { Outlet } from 'react-router-dom'
import { Button, Link } from '@nextui-org/react'
import { Toaster } from 'sonner'

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Toaster
        toastOptions={{
          className: 'font-sans'
        }}
      />
      <div className="flex flex-col items-center gap-4 py-4 bg-default-100 w-40">
        <Button as={Link} href="/">
          下载
        </Button>
        <Button as={Link} href="/settings">
          设置
        </Button>
      </div>
      <div className="w-full overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout

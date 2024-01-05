import { Routes, Route, useNavigate } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'

import Layout from '@renderer/components/layout'
import Download from '@renderer/views/download'
import Settings from '@renderer/views/settings'

const App = () => {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Download />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Download />} />
        </Route>
      </Routes>
    </NextUIProvider>
  )
}

export default App

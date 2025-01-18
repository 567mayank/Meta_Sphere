import React from 'react'
import { Outlet } from 'react-router-dom'
import { SocketProvider } from './SocketContext'

function Layout() {
  return (
    <SocketProvider>
      {/* navbar */}
      <Outlet/>
      {/* footer */}
    </SocketProvider>
  )
}

export default Layout
import React from 'react'
import { useSocket } from './SocketContext'

const Experiement = () => {

  const socket = useSocket();
  socket.on('connection')
  
  return (
    <div>

    </div>
  )
}

export default Experiement

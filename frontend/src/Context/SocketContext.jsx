import React, { createContext, useEffect } from 'react'
import {io} from 'socket.io-client'

export const SocketContextData = createContext()

const apiBaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api/v1';
const socketServerUrl = import.meta.env.VITE_SOCKET_URL || apiBaseUrl.replace(/\/api\/v1\/?$/, '');

// Use the backend origin for Socket.IO instead of a hardcoded port.
const socket = io(socketServerUrl, {
  transports: ['websocket', 'polling'],
});

const SocketContext = ({children}) => {

    useEffect(()=>{
    const handleConnect = ()=>{
            console.log(`connected to socket server ${socket.id}`);
    };
    const handleDisconnect = ()=>{
            console.log(`disconnected from socket server ${socket.id}`);
    };

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
    },[])
 
    
  return (
    <div>
      <SocketContextData.Provider value={{ socket}}>
        {children}
      </SocketContextData.Provider>
    </div>
  )
}

export default SocketContext

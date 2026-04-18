import React, { createContext, useEffect } from 'react'
import {io} from 'socket.io-client'
import { SOCKET_SERVER_URL } from '../utils/apiConfig'

export const SocketContextData = createContext()

const socket = io(SOCKET_SERVER_URL, {
  withCredentials: true,
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

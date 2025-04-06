import React, { createContext, useEffect } from 'react'
import {io} from 'socket.io-client'

export const SocketContextData = createContext()

const socket = io(import.meta.env.VITE_BASE_URL, {
    transports: ['websocket', 'polling'], // Ensure compatibility
  });

const SocketContext = ({children}) => {

    useEffect(()=>{
        socket.on('connect',()=>{
            console.log(`connected to socket server ${socket.id}`);
            
        })
        socket.on('disconnect',()=>{
            console.log(`disconnected from socket server ${socket.id}`);
            
        })
    },[])

  return (
    <div>
      <SocketContextData.Provider value={{socket}}>
        {children}
      </SocketContextData.Provider>
    </div>
  )
}

export default SocketContext

import { createContext, ReactNode, useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";

interface SocketProps {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketProps>({ socket: null});

export const SocketProvider = ({children}: { children: ReactNode}) => {
  const [clientSocket, setClientSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = socketIOClient(
      "http://localhost:5001"
    );

    setClientSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, [])

  return (
    <SocketContext.Provider value={{socket: clientSocket}}>
      {children}
    </SocketContext.Provider>
  )
}
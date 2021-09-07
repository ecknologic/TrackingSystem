import { createContext } from 'react';
import socketIOClient from "socket.io-client";
import { SOCKET_URL } from '../config';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socket = socketIOClient(SOCKET_URL);

  return (
    <SocketContext.Provider value={socket} >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
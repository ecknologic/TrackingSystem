import { createContext, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import useUser from '../utils/hooks/useUser';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { USERID } = useUser()
  const socket = socketIOClient(process.env.REACT_APP_SOCKET_HOST);

  useEffect(() => {
    if (USERID) {
      socket.on('connect', () => { })
    }

    return () => {
      socket.disconnect();
    }
  }, [USERID])

  return (
    <SocketContext.Provider value={socket} >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
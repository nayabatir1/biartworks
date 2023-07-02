import { createContext, useContext } from 'react';
import type { Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);

  return context;
};

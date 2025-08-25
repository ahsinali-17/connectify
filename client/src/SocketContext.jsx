

import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_BASE_URL}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`Connected to socket server ${newSocket.id}`);
    });
    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join socket room for user when logged in
  useEffect(() => {
    if (socket && user && user._id) {
      socket.emit('join', { userId: user._id });
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
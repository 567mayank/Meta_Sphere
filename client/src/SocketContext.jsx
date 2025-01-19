import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        reconnection: false,
        transports: ["websocket"],
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("User Joined !!!!");
      socket.emit('newDeviceAdded', {socketId : socket.id})
    });

    socket.on("connect_error", (error) => {
      console.error("Connection Error: ", error);
    });


    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

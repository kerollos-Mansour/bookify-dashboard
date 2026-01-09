"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>({
  socket:null,
  isConnected:false  
});

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  // const socket = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No auth token found for socket connection");
      return;
    }

    console.log("Initializing dashboard socket connection");

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Dashboard socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Dashboard socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Dashboard socket connection error:", err);
      setIsConnected(false);
    });

    const timeoutId = setTimeout(() => {
      setSocket(newSocket)
    }, 0);

    return () => {
      console.log("Cleaning up dashboard socket connection");
      newSocket.close();
      // setIsConnected(false);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket,isConnected}}> 
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

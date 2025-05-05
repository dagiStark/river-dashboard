import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Replace with your backend server URL
const SOCKET_SERVER_URL = "http://localhost:3000"; // or deployed URL

export const useRealTimeData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to real-time server");
    });

    socket.on("update", (incomingData) => {
      console.log("Received update:", incomingData);
      setData(incomingData);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from real-time server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return data;
};

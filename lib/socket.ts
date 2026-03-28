import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const initSocket = (authToken?: string) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: authToken ? { token: authToken } : undefined,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Hook for React useEffect
export const useSocket = () => {
  const socket = getSocket();
  return socket;
};

// Event listeners helper
export const setupSocketListeners = (
  onConnect: () => void,
  onDisconnect: () => void,
  onNewMessage: (message: unknown) => void,
  onError: (error: unknown) => void,
) => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("newMessage", onNewMessage);
  socket.on("error", onError);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("newMessage", onNewMessage);
    socket.off("error", onError);
  };
};
